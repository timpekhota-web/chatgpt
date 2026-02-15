import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkoutSchema } from '@/lib/validation';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const productIds = parsed.data.items.map((item) => item.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  const productMap = new Map(products.map((p) => [p.id, p]));

  const lineItems = parsed.data.items.map((item) => {
    const product = productMap.get(item.productId);
    if (!product) throw new Error(`Product ${item.productId} not found`);
    if (product.stock < item.quantity) throw new Error(`Not enough stock for ${product.name}`);

    return {
      quantity: item.quantity,
      price_data: {
        currency: 'pln',
        unit_amount: product.price,
        product_data: {
          name: product.name,
          images: [product.imageUrl]
        }
      }
    };
  });

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: lineItems,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?cancel=1`,
    metadata: {
      items: JSON.stringify(parsed.data.items)
    }
  });

  return NextResponse.json({ url: session.url });
}
