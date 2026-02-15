import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { assertAdmin } from '@/lib/auth';
import { sampleProducts } from '@/lib/sample-products';

export async function POST(req: NextRequest) {
  const admin = assertAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const results = await Promise.all(
    sampleProducts.map((product) =>
      prisma.product.upsert({
        where: { slug: product.slug },
        update: product,
        create: product
      })
    )
  );

  return NextResponse.json({ products: results, count: results.length });
}
