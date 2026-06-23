# The Luxe Edit

AI-curated capsule wardrobes for the luxury consumer — a private fashion concierge by Alba Sanchez Martinez.

## Features

- Style profile quiz with AI-generated capsule wardrobe
- Product catalog from Supabase (with local fallback)
- AI stylist chat and personalized stylist note
- Human stylist review queue (`/admin`)
- Client approve/swap flow (`/reveal/approve`)
- Stripe membership checkout (Essential / Premium / Concierge)
- Account portal: capsules, membership, fitting, returns, trade-in, alterations
- Resend email for edit delivery and consult confirmations
- EN/ES language toggle
- Plausible analytics (optional)

## Setup

```bash
npm install
cp .env.example .env
# Minimum: ANTHROPIC_API_KEY
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:3001

### Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run migrations in SQL editor (or `supabase db push`):
   - `supabase/migrations/001_initial.sql`
   - `supabase/migrations/002_rls.sql`
3. Copy URL + anon key → `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
4. Copy service role key → `SUPABASE_SERVICE_ROLE_KEY`
5. Enable Email auth (magic link) in Authentication settings
6. Seed products: `npm run seed`

### Stripe

1. Create products/prices for Essential (€500/yr), Premium (€1200/yr), Concierge (€2500/yr)
2. Set `STRIPE_SECRET_KEY`, `STRIPE_PRICE_*`, `STRIPE_WEBHOOK_SECRET`
3. Webhook endpoint: `POST /api/stripe/webhook` on your API host

### Resend

Set `RESEND_API_KEY` and `RESEND_FROM` for transactional email.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite + Express API |
| `npm run build` | Production frontend build |
| `npm start` | Run API server (production) |
| `npm run seed` | Seed product catalog to Supabase |
| `npm run test:e2e` | Playwright E2E tests |
| `npm run lint` | Run Oxlint |

## Deployment

**Frontend (Vercel):** Connect repo, set build command `npm run build`, output `dist/`. Add env vars prefixed with `VITE_`.

**API (Railway/Render):** Deploy with start command `npm start`. Set all server env vars. Point frontend proxy or `VITE_API_URL` to API host.

**Stripe webhook:** Must hit the API server directly (not Vercel static).

## Project structure

```
src/components/   UI screens, account, admin
src/context/      App + auth state
src/lib/          Capsule logic, Supabase, i18n, analytics
server/routes/    AI, catalog, orders, stripe, email, fulfillment
supabase/         Postgres migrations + RLS
e2e/              Playwright tests
```

## Routes

| Path | Description |
|------|-------------|
| `/` | Landing |
| `/quiz` | Style assessment |
| `/reveal` | AI capsule reveal |
| `/reveal/approve` | Client item approval |
| `/stylist` | AI stylist chat |
| `/membership` | Tier comparison |
| `/login` | Magic link sign-in |
| `/account/*` | Member portal |
| `/admin/*` | Stylist ops (requires `is_stylist`) |

## Environment variables

See [.env.example](.env.example) for the full list.

Without Supabase/Stripe/Resend configured, the app runs in demo mode with localStorage fallbacks.
