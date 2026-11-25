# Netbazar

A small catalogue site for sourcing products from China to Bangladesh. Customers browse products, then order or request items on WhatsApp. Payment is upfront to Netbazar; the supplier ships directly to Bangladesh. There is no cart, checkout, marketplace or payment gateway.

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
3. Open **SQL Editor → New query**, paste the contents of `supabase/migrations/0001_initial.sql` and run it. Then run `supabase/migrations/0002_sample_data.sql` for eight clearly labelled sample products. Delete or replace the sample rows before launch.
4. Open **Authentication → Providers** and enable Email. Add your own domain to **Authentication → URL Configuration → Site URL / Redirect URLs** before deploying.
5. In **Authentication → Users → Add user**, create the first admin with an email and password. Then run this in the SQL Editor, replacing the email with that user's address:

   ```sql
   insert into public.admins (user_id, email)
   select id, lower(email) from auth.users where email = 'owner@example.com'
   on conflict (user_id) do nothing;
   ```

Admin access is controlled by the `public.admins` table rather than a JWT claim: membership is checked by the `public.is_admin()` helper in every RLS policy and on every admin request. Revoking access is a one-row delete and takes effect on the next request. Only the service role or an existing admin SQL session can add rows to `admins`.

## Customer storefront

- `/` — hero, categories, featured/new/popular products, how it works, FAQs.
- `/products` — URL-driven search, category, availability and sort filters, 12 products per page with pagination and a mobile filter drawer.
- `/products/[slug]` — image gallery, specifications, availability and a prefilled WhatsApp order link.
- `/request` — zod-validated sourcing request with honeypot, basic rate limiting and a WhatsApp continuation link.
- `/faq`, `/about`, `/contact` — general information.
- `/policies/shipping`, `/policies/payment`, `/policies/refund` — editable placeholder text in `app/(store)/policies/[slug]/page.tsx`.

Every ordering page states that payment is upfront to Netbazar and that final price, shipping and delivery time are confirmed before payment.

## Admin dashboard

- `/admin/login` — Supabase email/password sign-in, restricted to users in `admins`.
- `/admin` — catalogue and request counts, recent requests and request pipeline.
- `/admin/products` — searchable list with edit, duplicate and delete.
- `/admin/products/new`, `/admin/products/[id]/edit` — product details, dynamic specifications and image management (upload, reorder, alt text, delete).
- `/admin/categories` — category create, edit, reorder and guarded delete.
- `/admin/requests`, `/admin/requests/[id]` — filter by status, inspect a request, update status and internal notes, message the customer on WhatsApp.
- `/admin/settings` — WhatsApp number, announcement text, email and social links.

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
2. Add these environment variables for Production:
   - `NEXT_PUBLIC_SUPABASE_URL` — project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — publishable/anon key
   - `NEXT_PUBLIC_SITE_URL` — your public origin, e.g. `https://netbazar.example.com` (no trailing slash)
   - `SUPABASE_SERVICE_ROLE_KEY` — service role key, server-only
3. In Supabase, set **Authentication → URL Configuration → Site URL** to the same origin and add it to **Redirect URLs**.
4. Deploy, then sign in at `/admin/login` with the admin user created earlier.
5. After the first deploy, delete the `SAMPLE-` products and replace the policy placeholder text.

## Production checklist

- Replace sample products and add real photos with meaningful alt text.
- Set the real WhatsApp number, announcement and contact details in `/admin/settings`.
- Replace all three policy pages with final wording.
- Confirm every category, price and availability status.
- Verify `/sitemap.xml` and `/robots.txt` use the final domain.
- Test one product order and one product request end to end on WhatsApp.

## Assumptions

The `reference/netbazar.html` file was not present in the workspace, so the visual design follows the written design description and colour tokens in `app/globals.css`.
