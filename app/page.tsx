import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { prisma } from '@/lib/prisma';

export const revalidate = 60;

export default async function HomePage() {
  const products = await prisma.product.findMany({ take: 4, orderBy: { createdAt: 'desc' } });

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
        <h1 className="text-3xl font-bold">Sklep gotowy do skalowania</h1>
        <p className="mt-3 max-w-2xl">Next.js + Stripe + Prisma + panel admina z pełnym CRUD.</p>
        <Link href="/products" className="mt-4 inline-block rounded-md bg-white px-4 py-2 text-blue-700">
          Przeglądaj produkty
        </Link>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Polecane produkty</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>
    </div>
  );
}
