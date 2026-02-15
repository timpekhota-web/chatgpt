'use client';

import { FormEvent, useEffect, useState } from 'react';

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
};

const initialForm = {
  name: '',
  slug: '',
  description: '',
  price: 0,
  stock: 0,
  imageUrl: ''
};

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(initialForm);

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
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (res.ok) setLoggedIn(true);
  };

  const createProduct = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      setForm(initialForm);
      fetchProducts();
    }
  };

  if (!loggedIn) {
    return (
      <form onSubmit={login} className="mx-auto max-w-sm space-y-3 rounded border bg-white p-6">
        <h1 className="text-2xl font-semibold">Panel admina - logowanie</h1>
        <input
          className="w-full rounded border p-2"
          placeholder="login"
          value={credentials.username}
          onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
        />
        <input
          className="w-full rounded border p-2"
          type="password"
          placeholder="hasło"
          value={credentials.password}
          onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
        />
        <button className="w-full rounded bg-slate-900 py-2 text-white">Zaloguj</button>
      </form>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard admina</h1>

      <form onSubmit={createProduct} className="grid gap-3 rounded border bg-white p-4 md:grid-cols-2">
        {Object.keys(form).map((key) => (
          <input
            key={key}
            className="rounded border p-2"
            placeholder={key}
            type={key === 'price' || key === 'stock' ? 'number' : 'text'}
            value={(form as any)[key]}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                [key]: key === 'price' || key === 'stock' ? Number(e.target.value) : e.target.value
              }))
            }
          />
        ))}
        <button className="rounded bg-blue-600 px-4 py-2 text-white md:col-span-2">Dodaj produkt</button>
      </form>

      <div className="space-y-3">
        {products.map((product) => (
          <div key={product.id} className="rounded border bg-white p-3">
            <p className="font-medium">{product.name}</p>
            <p className="text-sm text-slate-600">{product.slug}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
