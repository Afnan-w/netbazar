# Netbazar

A sourcing and matching platform for products from China to Bangladesh. Customers show Netbazar what they want — a photo, a link from Alibaba/AliExpress/1688/Taobao, or a description — and the admin checks a trusted supplier, sends a quote (unit price, shipping, total and delivery time), then connects the customer with the supplier. Payment happens only after the quote is accepted; the supplier ships directly to Bangladesh. This is not a marketplace: there are no seller accounts, product cart, checkout or payment gateway.

The build is delivered in four phases:

1. Project setup and database
2. Customer storefront
3. Admin dashboard
4. Quality and deployment

## Stack

- Next.js App Router, TypeScript (strict), Tailwind CSS
- Supabase Postgres, Auth (admin only) and Storage
- `@supabase/ssr` for browser/server sessions
- BDT prices only, formatted as `৳1,450` with en-US grouping

## Local setup

1. Install Node.js 20.9+ and run `npm install`.
2. Copy `.env.example` to `.env.local` and fill in the values from Supabase.
3. Run `npm run dev` and open `http://localhost:3000`.

## Create the Supabase project

1. Create a project at <https://supabase.com/dashboard>. Choose a region close to your users and set a database password.
2. Open **Project Settings → API** and copy the Project URL, anon key and service role key into `.env.local`.
3. Open **SQL Editor → New query**, paste the contents of `supabase/migrations/0001_initial.sql` and run it. Then run `supabase/migrations/0002_sample_data.sql` for eight clearly labelled sample products. Delete or replace the sample rows before launch. If you already ran these migrations, also run `supabase/migrations/0003_whatsapp_number.sql` to set the live WhatsApp number.
4. Open **Authentication → Providers** and enable Email. Add your own domain to **Authentication → URL Configuration → Site URL / Redirect URLs** before deploying.
5. In **Authentication → Users → Add user**, create the first admin with an email and password. Then run this in the SQL Editor, replacing the email with that user's address:

   ```sql
   insert into public.admins (user_id, email)
   select id, lower(email) from auth.users where email = 'owner@example.com'
   on conflict (user_id) do nothing;
   ```

Admin access is controlled by the `public.admins` table rather than a JWT claim: membership is checked by the `public.is_admin()` helper in every RLS policy and on every admin request. Revoking access is a one-row delete and takes effect on the next request. Only the service role or an existing admin SQL session can add rows to `admins`.

## Customer storefront

- `/` — sourcing-first hero, product-request CTA, what we can source, four-step process and trust information. No product grid.
- `/products` — example items our suppliers can source, with URL-driven search, category, availability and sort filters, 12 examples per page and a mobile filter drawer. Request CTA throughout.
- `/products/[slug]` — example gallery, specifications and a "Request a quote" link that prefills `/request`; WhatsApp ask link uses a sourcing message.
- `/request` — the primary flow: zod-validated product request with photo/link guidance, honeypot, basic rate limiting and a WhatsApp continuation link.
- `/faq`, `/about`, `/contact` — general information.
- `/policies/shipping`, `/policies/payment`, `/policies/refund` — editable placeholder text in `app/(store)/policies/[slug]/page.tsx`.

Every page states that the supplier is checked first, that one quote covers unit price, shipping, total and delivery time, and that payment happens only after the quote is accepted.

The storefront is mobile-first: a single compact header with search/menu toggles, category links in the menu and footer instead of a busy top bar, 44px+ touch targets, iOS-safe input sizing and safe-area padding, plus a web manifest and home-screen icons for Android/iOS. `scripts/generate-icons.mjs` rebuilds the icons in `public/icons` from `app/icon.svg`.

## Admin dashboard

- `/admin/login` — Supabase email/password sign-in, restricted to users in `admins`.
- `/admin` — request pipeline and source-example counts, with new requests first.
- `/admin/products` — searchable list of example items with edit, duplicate and delete.
- `/admin/products/new`, `/admin/products/[id]/edit` — example details, dynamic specifications and image management (upload, reorder, alt text, delete).
- `/admin/categories` — category create, edit, reorder and guarded delete.
- `/admin/requests`, `/admin/requests/[id]` — filter by quote stage, inspect a request, update status and internal notes, quote/message the customer on WhatsApp.
- `/admin/settings` — WhatsApp number, announcement text, email and social links. General enquiries currently go to `ox17afnan@gmail.com` (Netbazar has no dedicated mailbox yet); the public site falls back to that address until a real one is saved here.

All writes go through server actions with zod validation. The service role key is only read in server code.

## Security notes

- Public visitors can read categories, non-draft products, their images and site settings.
- Public visitors can insert product requests but cannot read any request.
- Only users listed in `admins` can write catalogue data, read requests and write to the `product-images` storage bucket.
- `SUPABASE_SERVICE_ROLE_KEY` is used only in server code (`lib/supabase/admin.ts`). Never prefix it with `NEXT_PUBLIC_` or expose it in a Client Component.
- The `product-images` bucket is public for reading; its files must be jpg, png or webp and at most 5 MB.
- Request rate limiting is in-memory, so it is per server instance. It stops casual spam; a shared store is needed for strict cross-instance limits.

## Project structure

- `app/(store)` — customer-facing pages
- `app/admin` — admin dashboard
- `components` — shared store and admin UI
- `lib/data` — server-side data access
- `lib/supabase` — browser, server and service-role clients
- `lib/utils`, `lib/validators` — formatting and validation helpers
- `types` — generated-style database types
- `supabase/migrations` — SQL migrations and sample data

## Quality checks

Run both commands before finishing any change:

```bash
npm run lint
npm run build
```

The build also works without Supabase environment variables: the storefront shows an empty catalogue shell and admin routes require configuration at runtime.

## Deploy to Vercel

1. Push the repository to your Git provider and import it in Vercel. Vercel detects Next.js automatically; no `vercel.json` is required.
2. Connect Supabase using either option:
   - **Vercel Marketplace:** open the project → **Integrations** → **Browse Marketplace** → **Supabase** → **Add Integration**. Choose **Connect Account** and select your existing Supabase project (the plain **Install** button creates a new one). Vercel injects `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_URL` and `SUPABASE_SECRET_KEY`; this app accepts all of those names automatically.
   - **Manual variables:** add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` and server-only `SUPABASE_SERVICE_ROLE_KEY`.
3. Always add `NEXT_PUBLIC_SITE_URL` — your public origin, e.g. `https://netbazar.example.com` (no trailing slash). The integration does not set this.
4. In Supabase, set **Authentication → URL Configuration → Site URL** to the same origin and add it to **Redirect URLs**.
5. Redeploy after adding or connecting variables — existing deployments do not receive new variables. Then sign in at `/admin/login`.
6. After the first deploy, delete the `SAMPLE-` products and replace the policy placeholder text.

## Production checklist

- Replace sample example items and add real photos with meaningful alt text.
- Confirm the WhatsApp number (+880 1627 293330), announcement and contact details in `/admin/settings`.
- Replace all three policy pages with final wording.
- Confirm every category and indicative price.
- Verify `/sitemap.xml` and `/robots.txt` use the final domain.
- Test one product request end to end: submit → supplier check → quote → accept → delivery tracking.

## Assumptions

The `reference/netbazar.html` file was not present in the workspace, so the visual design follows the written design description and colour tokens in `app/globals.css`.
