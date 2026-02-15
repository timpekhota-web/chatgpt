# Startup Shop – produkcyjny e-commerce (Next.js + Prisma + Stripe)

Kompletny projekt sklepu internetowego i panelu admina oparty o **Next.js App Router**.

## Stack
- Frontend + backend: Next.js 14 + API Route Handlers
- DB: PostgreSQL + Prisma
- Płatności: Stripe Checkout + webhook
- Upload: Cloudinary
- Auth admina: JWT (httpOnly cookie)
- UI: Tailwind CSS
- Testy: Jest (unit/integration) + Cypress (e2e)

## Uruchomienie lokalne
1. Skopiuj env:
   ```bash
   cp .env.example .env
   ```
2. Zainstaluj zależności i wygeneruj Prisma Client:
   ```bash
   npm install
   npm run prisma:migrate
   ```
3. Start dev:
   ```bash
   npm run dev
   ```

## API
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` (admin)
- `POST /api/products/seed` (admin, dodaje przykładowe produkty)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)
- `POST /api/checkout`
- `POST /api/webhook`
- `POST /api/upload` (admin)
- `POST /api/auth/login`
- `GET /api/auth/me`


## Wygodny panel admina
- styl dark web 2000 (ciemny neonowy interfejs),
- cena wpisywana w PLN (automatycznie konwertowana do groszy dla API),
- czytelne błędy walidacji z API (co dokładnie jest niepoprawne),
- przycisk **Dodaj przykładowe produkty** (seed),
- automatyczne generowanie sluga z nazwy,
- szybkie szablony produktu do formularza,
- statusy operacji i szybkie usuwanie produktu z listy.

## Stripe workflow
1. Frontend wysyła `items` do `/api/checkout`.
2. Backend pobiera ceny z DB i tworzy sesję Stripe Checkout.
3. Stripe webhook (`/api/webhook`) po `checkout.session.completed`:
   - zapisuje zamówienie,
   - tworzy `OrderItem`,
   - zmniejsza stock,
   - wysyła e-mail potwierdzający (stub w `lib/mailer.ts`).

## SEO i performance
- Dynamic SSR (force-dynamic) dla stron, które czytają dane z DB, aby build nie failował przed migracją.
- Metadata + OG tags + dynamiczny `sitemap.ts`.

## Deploy na Render.com
1. **Create Web Service** i podłącz repo.
2. Build command:
   ```bash
   npm install && npm run build
   ```
3. Start command:
   ```bash
   npm start
   ```
   `npm start` automatycznie wykona `prisma migrate deploy` przed uruchomieniem aplikacji.
4. Dodaj PostgreSQL na Render i ustaw `DATABASE_URL`.
5. Ustaw env:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `NEXT_PUBLIC_APP_URL`
6. W Stripe ustaw webhook endpoint na:
   - `https://twoja-apka.onrender.com/api/webhook`

## Struktura
```txt
app/
  admin/
  checkout/
  products/
  api/
prisma/schema.prisma
.env.example
next.config.js
```

## Future-proof roadmap
- konta użytkowników,
- wishlist,
- abandoned cart recovery,
- newsletter,
- blog SEO,
- rekomendacje produktów.
