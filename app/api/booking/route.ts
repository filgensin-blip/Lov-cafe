// POST /api/booking
//
// Flow: parse → validate server-side (never trust the client; this route can
// be called directly) → log the booking → send customer + cafe emails.
//
// v1 SCOPE DECISIONS (deliberate, not oversights):
// - No double-booking prevention or availability check. Every valid request
//   is accepted; the cafe manages capacity by reading notification emails.
// - No database. The server log line below is the booking record of last
//   resort if email delivery fails. A persistent booking store is a v2 item.
// - No rate limiting beyond a honeypot field. Add one (e.g. at the edge or
//   via Upstash) if spam becomes a problem.

import { NextResponse } from "next/server";
import { validateBooking, type BookingResponse } from "@/lib/booking";
import { sendBookingEmails } from "@/lib/email";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 10_000;

export async function POST(request: Request) {
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return json({ ok: false, message: "Request too large." }, 413);
    }

    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      return json({ ok: false, message: "Invalid request." }, 400);
    }

    // Honeypot: real visitors never see or fill this field. Pretend success
    // so bots don't learn to avoid it.
    if (body && typeof body === "object" && (body as Record<string, unknown>).company) {
      return json({ ok: true, emailSent: true });
    }

    const result = validateBooking(body);
    if (!result.ok) {
      return json({ ok: false, errors: result.errors }, 422);
    }

    const booking = result.data;
    // Always log first, so the booking exists somewhere even if email fails.
    console.info("[booking] received", JSON.stringify({ ...booking, receivedAt: new Date().toISOString() }));

    const sent = await sendBookingEmails(booking);
    if (!sent.cafe) {
      // The cafe didn't get notified — this needs a human to check the logs.
      console.error("[booking] ACTION NEEDED: cafe was not notified of booking", JSON.stringify(booking));
    }

    // The booking is received either way; the client uses emailSent to tell
    // the guest whether to expect a confirmation or to call us instead.
    return json({ ok: true, emailSent: sent.customer && sent.cafe });
  } catch (error) {
    console.error("[booking] unexpected error:", error);
    return json({ ok: false, message: "Something went wrong." }, 500);
  }
}

function json(body: BookingResponse, status = 200) {
  return NextResponse.json(body, { status });
}
