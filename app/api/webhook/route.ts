import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { sendOrderConfirmationEmail } from '@/lib/mailer';

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET || '');
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const rawItems = session.metadata?.items;
    const email = session.customer_details?.email;
    if (!rawItems || !email) return NextResponse.json({ ok: true });

    const items = JSON.parse(rawItems) as Array<{ productId: string; quantity: number }>;
    const products = await prisma.product.findMany({ where: { id: { in: items.map((i) => i.productId) } } });
    const productMap = new Map(products.map((p) => [p.id, p]));

    const total = items.reduce((sum, item) => {
      const product = productMap.get(item.productId);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);

    const order = await prisma.order.create({
      data: {
        email,
        total,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: productMap.get(item.productId)?.price || 0
          }))
        }
      }
    });

    await Promise.all(
      items.map((item) =>
        prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        })
      )
    );

    await sendOrderConfirmationEmail(email, order.id);
  }

  return NextResponse.json({ received: true });
}
