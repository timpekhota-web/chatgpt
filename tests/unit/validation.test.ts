import { productSchema } from '@/lib/validation';

describe('productSchema', () => {
  it('accepts valid payload', () => {
    const parsed = productSchema.safeParse({
      name: 'Produkt',
      slug: 'produkt',
      description: 'To jest poprawny opis produktu.',
      price: 1299,
      stock: 10,
      imageUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg'
    });

    expect(parsed.success).toBe(true);
  });

  it('rejects invalid payload', () => {
    const parsed = productSchema.safeParse({
      name: 'x',
      slug: 'a',
      description: 'krótki',
      price: -10,
      stock: -1,
      imageUrl: 'not-url'
    });

    expect(parsed.success).toBe(false);
  });
});
