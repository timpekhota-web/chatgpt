export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { ProductCard } from '@/components/ProductCard';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Produkty | Startup Shop',
  description: 'Lista wszystkich produktów'
};

export default async function ProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } }).catch(() => []);

  return (
    <section>
      <h1 className="mb-6 text-3xl font-bold">Produkty</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}
