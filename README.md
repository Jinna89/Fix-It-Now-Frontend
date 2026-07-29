# FixItNow — Frontend

A Next.js 14 (App Router) + TypeScript frontend for the FixItNow home-services marketplace, built against the `fixitnow-backend` Express/Prisma API.

## Stack

- Next.js 14 App Router, TypeScript
- Tailwind CSS (custom design tokens — see `tailwind.config.ts`)
- React Hook Form + Zod for all form validation
- TanStack Query for server state, caching, and optimistic updates
- Cookie-based JWT session (`js-cookie`) + Next.js Middleware for role-protected routes
- `react-hot-toast` for structured error/success feedback

## Getting started

```bash
npm install
cp .env.local.example .env.local
# edit .env.local if your backend isn't on http://localhost:5050

npm run dev
```

The app expects the FixItNow backend to be running (see `fixitnow-backend/`) with `CLIENT_URL=http://localhost:3000` in its `.env` so SSLCommerz redirects land back on this app's `/payment/success` and `/payment/cancel` pages.

## Demo credentials (from the backend seed script)

| Role | Email | Password |
|---|---|---|
| Admin | `admin@fixitnow.com` | `Admin@12345` |
| Technician | `karim@example.com` | `Passw0rd!` |
| Customer | `farhan@example.com` | `Passw0rd!` |

## Project structure

```
src/
  app/                 # routes (App Router)
  components/
    ui/                # Button, Input, Select, Modal, StatusBadge, Stars, ...
    layout/             # Navbar, Footer
    providers/          # Auth, React Query, Toast
    services/ technicians/ bookings/ reviews/ technician/  # feature components
  lib/
    api/                # typed fetch wrappers per resource, silent-refresh client
    auth/               # cookie session helpers
    validators/          # Zod schemas mirroring the backend
    types.ts             # shared types mirroring the Prisma schema
middleware.ts          # role-based route protection for /dashboard/*
```

See `API_INTEGRATION.md` for the full frontend-to-backend endpoint mapping, including two small additions made to the backend (`GET /technician/profile`, `GET /technician/availability`) and a fix to the SSLCommerz redirect flow so it lands on this app's payment pages instead of returning raw JSON.

## Features:

```
- Full Stack Project (Next.js frontend + Express/Prisma backend)
- Role-based system — Customer, Technician, Admin
- Dynamic Service & Technician Browsing with Search/Filters
- Technician Profile Pages with Ratings & Reviews
- Interactive Time-Slot Booking System
- Booking Status Tracking (Requested → Accepted → Paid → In Progress → Completed)
- Cancel Booking & Leave Review
- SSLCommerz Payment Integration with Success/Cancel Pages
- Technician Availability Scheduler
- Technician Booking Management (Accept/Decline/Complete)
- Admin Dashboard — User Ban/Unban, Category Management, Platform Stats
- Login & Registration with JWT Authentication
- Role-Protected Routes via Next.js Middleware
- Form Validation with Zod + React Hook Form
- Toast Notifications & Error Boundaries

```

## Notes

- This project was built without network access to run `npm install`, so dependencies have not been installed or build-verified in that environment. Please run `npm install && npm run build` as a first check.
- Booking status colors/badges follow the spec: `REQUESTED` (amber), `ACCEPTED` (blue), `DECLINED` (red), `PAID` (purple), `IN_PROGRESS` (green), `COMPLETED` (gray), `CANCELLED` (dark red).
