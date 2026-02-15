import Link from 'next/link';

export type ProductCardProps = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
};

export function ProductCard({ name, slug, description, price, imageUrl }: ProductCardProps) {
  return (
    <article className="rounded-xl border bg-white p-4 shadow-sm">
      <img src={imageUrl} alt={name} className="h-48 w-full rounded-md object-cover" />
      <h3 className="mt-3 text-lg font-semibold">{name}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      <p className="mt-2 font-semibold">{(price / 100).toFixed(2)} PLN</p>
      <Link href={`/products/${slug}`} className="mt-3 inline-block text-sm text-blue-600 hover:underline">
        Zobacz produkt
      </Link>
    </article>
  );
}
