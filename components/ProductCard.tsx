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
    <article className="rounded-xl border border-fuchsia-500/30 bg-slate-950/90 p-4 shadow-[0_0_20px_rgba(34,211,238,0.08)]">
      <img src={imageUrl} alt={name} className="h-48 w-full rounded-md object-cover" />
      <h3 className="mt-3 text-lg font-semibold text-cyan-200">{name}</h3>
      <p className="mt-2 text-sm text-slate-300">{description}</p>
      <p className="mt-2 font-semibold text-fuchsia-300">{(price / 100).toFixed(2)} PLN</p>
      <Link href={`/products/${slug}`} className="mt-3 inline-block text-sm text-cyan-300 hover:underline">
        Zobacz produkt
      </Link>
    </article>
  );
}
