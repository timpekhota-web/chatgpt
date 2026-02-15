'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
};

type ProductForm = {
  name: string;
  slug: string;
  description: string;
  pricePln: number;
  stock: number;
  imageUrl: string;
};

const initialForm: ProductForm = {
  name: '',
  slug: '',
  description: '',
  pricePln: 99,
  stock: 10,
  imageUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg'
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
}

const quickTemplates: ProductForm[] = [
  {
    name: 'Czapka Team Ops',
    slug: 'czapka-team-ops',
    description: 'Lekka czapka z daszkiem dla zespołów operacyjnych i supportu na codzienną pracę.',
    pricePln: 69,
    stock: 60,
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg'
  },
  {
    name: 'Notatnik Founder Notes',
    slug: 'notatnik-founder-notes',
    description: 'Notatnik A5 do roadmap, OKR i sprint planningu dla founderów i product managerów.',
    pricePln: 39,
    stock: 100,
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg'
  }
];

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductForm>(initialForm);
  const [status, setStatus] = useState<string>('');
  const [busy, setBusy] = useState(false);

  const canSubmit = useMemo(
    () =>
      form.name.trim().length >= 2 &&
      form.slug.trim().length >= 2 &&
      form.description.trim().length >= 10 &&
      Number.isFinite(form.pricePln) &&
      form.pricePln > 0 &&
      Number.isFinite(form.stock) &&
      form.stock >= 0 &&
      /^https?:\/\//.test(form.imageUrl),
    [form]
  );

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data.products ?? []);
  };

  useEffect(() => {
    fetch('/api/auth/me').then((res) => setLoggedIn(res.ok));
    fetchProducts();
  }, []);

  const login = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('Logowanie...');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    if (res.ok) {
      setLoggedIn(true);
      setStatus('Zalogowano poprawnie.');
      return;
    }

    setStatus('Błędny login lub hasło.');
  };

  const createProduct = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      setStatus('Uzupełnij poprawnie pola: opis min. 10 znaków, poprawny URL, cena > 0.');
      return;
    }

    setBusy(true);
    setStatus('Zapisywanie produktu...');

    const payload = {
      name: form.name.trim(),
      slug: slugify(form.slug),
      description: form.description.trim(),
      price: Math.round(form.pricePln * 100),
      stock: Math.round(form.stock),
      imageUrl: form.imageUrl.trim()
    };

    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));
    setBusy(false);

    if (res.ok) {
      setForm(initialForm);
      setStatus('Produkt został dodany.');
      fetchProducts();
      return;
    }

    const fieldErrors = data?.error?.fieldErrors
      ? Object.entries(data.error.fieldErrors)
          .filter(([, value]) => Array.isArray(value) && value.length)
          .map(([field, value]) => `${field}: ${(value as string[]).join(', ')}`)
          .join(' | ')
      : '';

    setStatus(fieldErrors || data?.error || 'Nie udało się dodać produktu. Sprawdź dane formularza.');
  };

  const deleteProduct = async (id: string) => {
    setBusy(true);
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    setBusy(false);

    if (res.ok) {
      setStatus('Produkt usunięty.');
      fetchProducts();
      return;
    }

    setStatus('Błąd podczas usuwania produktu.');
  };

  const seedProducts = async () => {
    setBusy(true);
    setStatus('Dodawanie przykładowych produktów...');
    const res = await fetch('/api/products/seed', { method: 'POST' });
    setBusy(false);

    if (res.ok) {
      setStatus('Przykładowe produkty dodane/zaktualizowane.');
      fetchProducts();
      return;
    }

    setStatus('Nie udało się dodać przykładowych produktów.');
  };

  if (!loggedIn) {
    return (
      <form onSubmit={login} className="mx-auto max-w-sm space-y-3 rounded-2xl border border-fuchsia-500/40 bg-slate-950/90 p-6 text-fuchsia-100 shadow-[0_0_20px_rgba(217,70,239,0.25)]">
        <h1 className="text-2xl font-semibold tracking-wide text-cyan-300">Panel admina // ACCESS</h1>
        <input
          className="w-full rounded border border-fuchsia-500/40 bg-slate-900 p-2"
          placeholder="login"
          value={credentials.username}
          onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
        />
        <input
          className="w-full rounded border border-fuchsia-500/40 bg-slate-900 p-2"
          type="password"
          placeholder="hasło"
          value={credentials.password}
          onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
        />
        <button className="w-full rounded bg-fuchsia-600 py-2 font-semibold text-white">Zaloguj</button>
        {status ? <p className="text-sm text-fuchsia-200">{status}</p> : null}
      </form>
    );
  }

  return (
    <div className="space-y-8 text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-cyan-400/40 bg-slate-950/80 p-4">
        <h1 className="text-3xl font-bold text-cyan-300">Dashboard admina // DARK-WEB 2000</h1>
        <button
          onClick={seedProducts}
          disabled={busy}
          className="rounded bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          Dodaj przykładowe produkty
        </button>
      </div>

      <form onSubmit={createProduct} className="space-y-4 rounded-xl border border-fuchsia-500/40 bg-slate-950/90 p-4 shadow-[0_0_20px_rgba(217,70,239,0.2)]">
        <h2 className="text-lg font-semibold text-fuchsia-300">Dodaj nowy produkt</h2>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-sm text-slate-300">Nazwa</span>
            <input
              className="w-full rounded border border-fuchsia-500/40 bg-slate-900 p-2"
              placeholder="np. Koszulka Premium"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm text-slate-300">Slug</span>
            <div className="flex gap-2">
              <input
                className="w-full rounded border border-fuchsia-500/40 bg-slate-900 p-2"
                placeholder="np. koszulka-premium"
                value={form.slug}
                onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
              />
              <button
                type="button"
                className="rounded border border-cyan-400/50 px-3 text-sm text-cyan-200"
                onClick={() => setForm((prev) => ({ ...prev, slug: slugify(prev.name) }))}
              >
                Auto
              </button>
            </div>
          </label>

          <label className="space-y-1 md:col-span-2">
            <span className="text-sm text-slate-300">Opis (min. 10 znaków)</span>
            <textarea
              className="w-full rounded border border-fuchsia-500/40 bg-slate-900 p-2"
              rows={3}
              placeholder="Krótki opis produktu"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm text-slate-300">Cena (PLN)</span>
            <input
              className="w-full rounded border border-fuchsia-500/40 bg-slate-900 p-2"
              type="number"
              min={1}
              value={form.pricePln}
              onChange={(e) => setForm((prev) => ({ ...prev, pricePln: Number(e.target.value) }))}
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm text-slate-300">Stan magazynu</span>
            <input
              className="w-full rounded border border-fuchsia-500/40 bg-slate-900 p-2"
              type="number"
              min={0}
              value={form.stock}
              onChange={(e) => setForm((prev) => ({ ...prev, stock: Number(e.target.value) }))}
            />
          </label>

          <label className="space-y-1 md:col-span-2">
            <span className="text-sm text-slate-300">URL zdjęcia</span>
            <input
              className="w-full rounded border border-fuchsia-500/40 bg-slate-900 p-2"
              placeholder="https://..."
              value={form.imageUrl}
              onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          {quickTemplates.map((template) => (
            <button
              key={template.slug}
              type="button"
              className="rounded border border-cyan-500/50 px-3 py-1 text-sm text-cyan-200"
              onClick={() => setForm(template)}
            >
              Użyj szablonu: {template.name}
            </button>
          ))}
        </div>

        <button
          disabled={!canSubmit || busy}
          className="rounded bg-fuchsia-600 px-4 py-2 text-white disabled:opacity-60"
        >
          Dodaj produkt
        </button>
      </form>

      {status ? <p className="rounded border border-cyan-500/40 bg-slate-900 p-3 text-sm text-cyan-200">{status}</p> : null}

      <div className="space-y-3">
        {products.map((product) => (
          <div key={product.id} className="flex items-center justify-between rounded-xl border border-fuchsia-500/30 bg-slate-950/90 p-3">
            <div>
              <p className="font-medium text-cyan-200">{product.name}</p>
              <p className="text-sm text-slate-400">/{product.slug}</p>
              <p className="text-sm text-slate-300">
                {(product.price / 100).toFixed(2)} PLN • stock: {product.stock}
              </p>
            </div>
            <button
              onClick={() => deleteProduct(product.id)}
              disabled={busy}
              className="rounded border border-red-400 px-3 py-1 text-sm text-red-300 disabled:opacity-60"
            >
              Usuń
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
