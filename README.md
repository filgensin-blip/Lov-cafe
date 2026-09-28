# LØV — Maastricht

Website for LØV, a small matcha and plant-forward cafe in Maastricht.
Next.js (App Router) · TypeScript · Tailwind CSS v4 · Resend for booking email.

## Pages

| Route        | What                                                        |
| ------------ | ----------------------------------------------------------- |
| `/`          | Hero, intro, featured menu items, hours & location, booking CTA |
| `/menu`      | Full menu by category, rendered from `data/menu.ts`         |
| `/book`      | Reservation form → `POST /api/booking`                      |
| `/about`     | Story, day-by-day hours, contact, Google Maps embed         |

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

### Environment variables

| Variable                  | Purpose                                                                 |
| ------------------------- | ----------------------------------------------------------------------- |
| `RESEND_API_KEY`          | API key from resend.com                                                 |
| `BOOKING_FROM_EMAIL`      | Sender, e.g. `LØV Maastricht <bookings@yourdomain.nl>` — the domain must be verified in Resend |
| `CAFE_NOTIFICATION_EMAIL` | Inbox that receives new-booking notifications                           |

Without these, bookings are still accepted and logged to the server console, and the
guest is told to call to confirm (see "Booking flow" below).

## Editing content

All content lives in typed data files — no layout code needs touching:

- `data/menu.ts` — categories, items, descriptions, prices (numbers; shown as `€4.50`), and which items are featured on the home page.
- `data/hours.ts` — opening hours per weekday. **Booking time slots are generated from this file**, so changing hours updates the form automatically. Slot interval and last-seating rules are at the top.
- `data/site-info.ts` — name, address, phone, email, socials, map coordinates.

### ⚠️ Before launch

- Replace every value marked `PLACEHOLDER` in `data/site-info.ts`, `data/hours.ts` and prices in `data/menu.ts`.
- Replace `<PhotoPlaceholder>` blocks with real photos (`next/image`). Each placeholder's label describes the shot it's standing in for.
- Verify the sending domain in Resend and set the environment variables in your host (e.g. Vercel → Settings → Environment Variables).

## Booking flow

1. Client-side validation for instant feedback (`lib/booking.ts`, shared with the server).
2. `POST /api/booking` re-validates everything server-side — the route can be called directly, so the client is never trusted.
3. The booking is logged to server logs, then two emails go out via Resend (`lib/email.ts`):
   - **Guest confirmation** — warm, on-brand, with date, time, party size, address and how to change/cancel. Replies go to the cafe.
   - **Cafe notification** — plain and scannable. Reply-to is the guest.
4. If email fails, the booking is still "received" (it's in the logs, flagged `ACTION NEEDED` if the cafe wasn't notified) and the guest is asked to call to confirm. Guests never see raw errors.

Validation rules: date not in the past, not a closed day, at most 90 days ahead; time must be a real slot for that day (same-day slots need 30 minutes' notice); party size 1–10.

### Deliberate v1 limitations

- **No availability checks or double-booking prevention.** A booking is a request the cafe manages from its inbox, not a live table calendar.
- **No database.** Server logs are the fallback record.
- **Spam protection** is a honeypot field only; add rate limiting if needed.
- Out of scope: payments/deposits, admin dashboard/CMS, blog, translations (Dutch/French is a natural v2).

To use SMTP instead of Resend, reimplement `sendEmail()` in `lib/email.ts` with Nodemailer; templates are provider-agnostic.

## Creative direction (v2)

See `docs/creative-direction.md`. Built so far, all without new photography:

- Variable Fraunces (`opsz`, `SOFT`, `WONK` axes), 17px body, static paper grain
- **Living palette** — `components/DaypartSync.tsx` + `lib/daypart.ts` warm the cream before 10:00, cool it in the afternoon, and dim the hero after hours ("We're asleep. Back tomorrow at 08:00." / "Book for tomorrow morning")
- **First light** — veil lift and word-by-word headline set-in on the home hero
- Home page as five chapters of a morning, with a running clock (`components/TimeRail.tsx`, xl screens)
- **The ritual** as a still triptych (2g. / 80°C. / Thirty seconds.) — the reduced-motion version of the whisk sequence
- **The tea field** — dark full-bleed chapter with a CSS scroll-driven drift
- **Paper menu** with desktop hover previews (`components/MenuPreview.tsx`; add `image` to items in `data/menu.ts`)
- **Booking ledger** — ruled-line form and a "LØV · reserved" stamp on a paper ticket

Still needs the morning shoot: the hero film loop and the 48-frame scroll-scrubbed whisk sequence.

## Deploying (Netlify)

`netlify.toml` is included; Netlify's Next.js runtime handles the pages and `/api/booking`.
Set `RESEND_API_KEY`, `BOOKING_FROM_EMAIL` and `CAFE_NOTIFICATION_EMAIL` under
Site configuration → Environment variables.

## Accessibility

- WCAG AA contrast is verified by `npm run check:contrast`. The brief's muted grey `#6B6E60` came out at 4.4:1 on the secondary cream, just under AA, so muted text uses `#5E6155`.
- Visible focus rings on every interactive element, skip link, labelled form fields with linked error messages, focus moved to the first error / result message.
- Scroll fade-ins respect `prefers-reduced-motion`, and content is never hidden if JavaScript doesn't run.
- Layout tested down to 375px wide; form inputs use native date/select pickers on mobile and 16px text to avoid iOS zoom.
