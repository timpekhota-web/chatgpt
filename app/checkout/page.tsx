'use client';

import { useState } from 'react';

type CartItem = { productId: string; quantity: number };

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([{ productId: '', quantity: 1 }]);
  const [loading, setLoading] = useState(false);

  const checkout = async () => {
    setLoading(true);
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items })
    });
    const data = await res.json();
    setLoading(false);
    if (data.url) window.location.href = data.url;
  };

  return (
    <section className="max-w-2xl space-y-4">
      <h1 className="text-3xl font-bold">Checkout</h1>
      {items.map((item, idx) => (
        <div key={idx} className="grid grid-cols-2 gap-3">
          <input
            className="rounded border p-2"
            placeholder="ID produktu"
            value={item.productId}
            onChange={(e) => {
              const copy = [...items];
              copy[idx].productId = e.target.value;
              setItems(copy);
            }}
          />
          <input
            className="rounded border p-2"
            type="number"
            min={1}
            value={item.quantity}
            onChange={(e) => {
              const copy = [...items];
              copy[idx].quantity = Number(e.target.value);
              setItems(copy);
            }}
          />
        </div>
      ))}
      <button className="rounded bg-slate-900 px-4 py-2 text-white" onClick={checkout} disabled={loading}>
        {loading ? 'Przekierowanie...' : 'Przejdź do Stripe'}
      </button>
    </section>
  );
}
