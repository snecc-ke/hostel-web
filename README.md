# Hostel Platform — Local Development

Simple Next.js (App Router) project for managing hostel listings with admin and landlord flows.

## Prerequisites

- Node.js (18+)
- npm
- SQLite (bundled via Prisma)

## Setup

1. Install dependencies

```bash
npm install
```

2. Generate Prisma client

```bash
npx prisma generate
```

3. Add environment variables in a `.env` file (copy from `.env.example` if present). Important vars:

```
DATABASE_URL="file:./dev.db"
JWT_SECRET=your_jwt_secret
# Optional SMTP settings (leave unset to log emails to console)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
FROM_EMAIL=no-reply@hostel.local
```

## Run (dev)

```bash
npm run dev
```

The app will be available at `http://localhost:3000` (or another port if 3000 is in use).

## Create an admin user

Use the included script to create or update an admin account:

```bash
node scripts/create-admin.js admin@local.test YourStrongPassword "Admin Name"
```

This will upsert a user with role `ADMIN`.

## Seed a pending listing (optional)

```bash
node scripts/seed-pending-listing.js [email]
```

Default landlord email is `landlord1@local.test` if you omit `[email]`.

## Useful scripts

- Create admin: `node scripts/create-admin.js`
- Seed listing: `node scripts/seed-pending-listing.js`
- Check listings: `node scripts/check-listings.js`

## Admin UI

Visit `/admin` and sign in with the admin credentials you created. Admins can approve/reject listings.

## Landlord flow

Landlords sign up and register hostels from `/landlord`. Note: the registration form sends the `title` field (labelled "Title") — this aligns with server validation.

## Email

Emails are sent via `lib/email.js`. If SMTP env vars are not configured, emails are logged to the server console for development.

## Key files

- `app/landlord/page.js` — landlord dashboard & registration form
- `app/admin/page.js` — admin dashboard
- `app/api/admin/listings/[id]/route.js` — approve/reject listing API
- `lib/email.js` — email helper (nodemailer + console fallback)
- `scripts/create-admin.js` — admin creation script
- `scripts/seed-pending-listing.js` — seed sample listing

---

If you want, I can create the admin now and log you in to the admin UI.
