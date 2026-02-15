import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Startup Shop',
  description: 'Skalowalny sklep e-commerce na Next.js',
  openGraph: {
    title: 'Startup Shop',
    description: 'Nowoczesny sklep internetowy z panelem admina.'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body>
        <header className="border-b bg-white">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-xl font-semibold">
              Startup Shop
            </Link>
            <div className="flex gap-4 text-sm">
              <Link href="/products">Produkty</Link>
              <Link href="/checkout">Koszyk</Link>
              <Link href="/admin">Admin</Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
