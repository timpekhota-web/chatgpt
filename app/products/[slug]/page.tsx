import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });
  if (!product) return {};

  return {
    title: `${product.name} | Startup Shop`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.imageUrl]
    }
  };
}

export default async function ProductDetailsPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });

  if (!product) notFound();

  return (
    <article className="grid gap-8 md:grid-cols-2">
      <img src={product.imageUrl} alt={product.name} className="w-full rounded-xl object-cover" />
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="mt-4 text-slate-700">{product.description}</p>
        <p className="mt-4 text-2xl font-semibold">{(product.price / 100).toFixed(2)} PLN</p>
        <p className="mt-1 text-sm text-slate-500">Dostępne: {product.stock} szt.</p>
      </div>
    </article>
  );
}
