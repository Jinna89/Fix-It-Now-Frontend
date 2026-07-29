# API Integration — FixItNow Frontend

This document maps every frontend route/component to the backend endpoints it consumes.
Base URL is configured via `NEXT_PUBLIC_API_URL` (see `.env.local.example`).

All requests go through `src/lib/api/client.ts`, which:
- attaches `Authorization: Bearer <accessToken>` from cookies when `auth: true` (default)
- on a `401`, silently calls `POST /auth/refresh` once and retries the original request
- throws `ApiClientError` (message + per-field errors parsed from the backend's `errorDetails`) on any non-2xx / `success: false` response, which callers turn into toasts and inline form errors

## Public

| Route | Component | Backend endpoint(s) |
|---|---|---|
| `/` | `src/app/page.tsx` | `GET /services?limit=6`, `GET /technicians?limit=3` |
| `/services` | `src/app/services/page.tsx` + `ServiceFilters` | `GET /services`, `GET /technicians`, `GET /categories` |
| `/technicians/[id]` | `src/app/technicians/[id]/page.tsx` + `BookingForm`, `ReviewList` | `GET /technicians/:id` (includes services, reviews, and upcoming open availability slots) |

## Auth

| Route | Component | Backend endpoint(s) |
|---|---|---|
| `/auth/register` | `src/app/auth/register/page.tsx` | `POST /auth/register` |
| `/auth/login` | `src/app/auth/login/page.tsx` | `POST /auth/login` |
| (all protected routes) | `AuthProvider`, `apiFetch` | `POST /auth/refresh` (silent), `POST /auth/logout`, `GET /auth/me` |

## Customer

| Route | Component | Backend endpoint(s) |
|---|---|---|
| `/dashboard/customer` | booking history, payment history, cancel & review modals | `GET /bookings`, `GET /payments`, `PATCH /bookings/:id/cancel`, `POST /reviews` |
| `/dashboard/customer/bookings/[id]/pay` | payment initiation | `GET /bookings/:id`, `POST /payments/create` |
| `/payment/success`, `/payment/cancel` | outcome pages | reads `bookingId`/`tran_id`/`status` query params set by the backend redirect; `GET /bookings/:id` to display the final booking |
| Booking creation (from technician profile) | `BookingForm` | `POST /bookings` |

## Technician

| Route | Component | Backend endpoint(s) |
|---|---|---|
| `/dashboard/technician` | overview stats | `GET /technician/profile`, `GET /technician/bookings` |
| `/dashboard/technician/bookings` | `BookingTicket` + accept/decline/progress actions (optimistic) | `GET /technician/bookings`, `PATCH /technician/bookings/:id` |
| `/dashboard/technician/availability` | `AvailabilityScheduler` | `GET /technician/availability`, `PUT /technician/availability` |
| `/dashboard/technician/profile` | `ProfileForm`, `ServicesManager` | `GET /technician/profile`, `PUT /technician/profile`, `POST /technician/services`, `PUT /technician/services/:id` |

> **Backend additions made for this frontend:** `GET /technician/profile` and `GET /technician/availability` did not exist in the original backend and were added (see `fixitnow-backend/src/controllers/technicianController.ts` and `technicianRoutes.ts`). The public `GET /technicians/:id` response was also extended to include each technician's upcoming, unbooked `availability` slots so the booking time-slot picker has real data.

## Admin

| Route | Component | Backend endpoint(s) |
|---|---|---|
| `/dashboard/admin` | platform stats, recent bookings table | `GET /admin/users`, `GET /admin/bookings` |
| `/dashboard/admin/users` | user table, search, pagination, ban/unban | `GET /admin/users`, `PATCH /admin/users/:id` |
| `/dashboard/admin/categories` | category list + create form | `GET /admin/categories`, `POST /admin/categories` |

## Payments (SSLCommerz)

1. Customer clicks **Pay now** on an `ACCEPTED` booking → `POST /payments/create` returns a `gatewayPageURL`.
2. The browser is redirected to SSLCommerz's hosted checkout (`window.location.href = gatewayPageURL`).
3. SSLCommerz redirects the **browser** back to `GET/POST /api/payments/confirm?status=success|fail|cancel&redirect=1` (configured via `SSLCOMMERZ_SUCCESS_URL` / `_FAIL_URL` / `_CANCEL_URL` in the backend `.env`).
4. Because these URLs carry `redirect=1`, the backend controller now issues an HTTP redirect to the frontend's `/payment/success` or `/payment/cancel` page (with `bookingId`, `tran_id`, and `status` as query params) instead of returning raw JSON — this was a gap in the original backend, since it only returned JSON, and has been patched.
5. SSLCommerz's **server-to-server IPN** call hits the same `/api/payments/confirm` endpoint *without* `redirect=1` (via `SSLCOMMERZ_IPN_URL`) and still receives the original JSON response, so validation/booking-status updates remain authoritative on the server side regardless of what the browser does.

## Error handling conventions

- **Form validation**: React Hook Form + Zod schemas in `src/lib/validators/*` mirror the backend's Zod validators. On submit, any `errorDetails` returned by the backend are mapped back onto the corresponding form fields via `ApiClientError.fieldErrors`.
- **Toasts**: all mutations (`useMutation`) show a `react-hot-toast` success/error toast.
- **Loading states**: every data-fetching route has a `loading.tsx` skeleton (services, technician profile) or inline `Skeleton` components (dashboards).
- **Error boundaries**: a global `src/app/error.tsx` catches render/render-time errors; `not-found.tsx` handles unknown routes and missing technicians (`notFound()`).
- **Route protection**: `middleware.ts` reads the `fn_token` / `fn_role` cookies (set by `AuthProvider` on login/register) and redirects unauthenticated or wrong-role users away from `/dashboard/customer`, `/dashboard/technician`, and `/dashboard/admin`.
