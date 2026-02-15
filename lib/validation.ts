import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  price: z.number().int().nonnegative(),
  stock: z.number().int().nonnegative(),
  imageUrl: z.string().url()
});

export const checkoutSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().positive()
    })
  )
});
