// Transactional email for bookings, sent through Resend.
// Server-only: this reads secrets from the environment and must never be
// imported into a client component.
//
// Swapping providers (e.g. Nodemailer + SMTP) only means reimplementing
// sendEmail() below — the templates are provider-agnostic.

import "server-only";
import { Resend } from "resend";
import { siteInfo, formatAddress } from "@/data/site-info";
import { formatBookingDate, type BookingInput } from "@/lib/booking";

type Email = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

export class EmailConfigError extends Error {}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new EmailConfigError(`Missing environment variable ${name}`);
  return value;
}

async function sendEmail(email: Email): Promise<void> {
  const resend = new Resend(requireEnv("RESEND_API_KEY"));
  const from = requireEnv("BOOKING_FROM_EMAIL");
  const { error } = await resend.emails.send({ from, ...email });
  if (error) throw new Error(`Resend error (${error.name}): ${error.message}`);
}

/** Escapes user-supplied text before it goes into an HTML email. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const guests = (n: number) => `${n} ${n === 1 ? "guest" : "guests"}`;

// ---------------------------------------------------------------------------
// Customer confirmation — warm and on-brand.
// Inline styles only: most email clients ignore <style> blocks and web fonts,
// so Georgia stands in for Fraunces.
// ---------------------------------------------------------------------------

export function customerConfirmationEmail(booking: BookingInput): Email {
  const firstName = booking.name.split(/\s+/)[0];
  const when = formatBookingDate(booking.date);
  const address = formatAddress();

  const text = [
    `Hi ${firstName},`,
    ``,
    `Thank you for booking a table at ${siteInfo.name}. Here are your details:`,
    ``,
    `Date: ${when}`,
    `Time: ${booking.time}`,
    `Party: ${guests(booking.partySize)}`,
    booking.notes ? `Notes: ${booking.notes}` : null,
    ``,
    `We look forward to seeing you.`,
    ``,
    `${siteInfo.name}`,
    address,
    ``,
    `Need to change or cancel? Just reply to this email or call us on ${siteInfo.phone}.`,
  ]
    .filter((line) => line !== null)
    .join("\n");

  const row = (label: string, value: string) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #E4DFD2;color:#5E6155;font-size:14px;width:96px;vertical-align:top;">${label}</td>
          <td style="padding:10px 0;border-bottom:1px solid #E4DFD2;color:#1E2119;font-size:15px;">${value}</td>
        </tr>`;

  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#F7F5EF;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F5EF;">
      <tr>
        <td align="center" style="padding:40px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;font-family:'Helvetica Neue',Arial,sans-serif;">
            <tr>
              <td style="font-family:Georgia,'Times New Roman',serif;font-size:28px;letter-spacing:0.04em;color:#4A5D3A;padding-bottom:32px;">${esc(siteInfo.name)}</td>
            </tr>
            <tr>
              <td style="font-family:Georgia,'Times New Roman',serif;font-size:24px;line-height:1.3;color:#1E2119;padding-bottom:16px;">
                Your table is booked, ${esc(firstName)}.
              </td>
            </tr>
            <tr>
              <td style="font-size:16px;line-height:1.6;color:#1E2119;padding-bottom:24px;">
                Thank you for choosing a slow morning with us. Here are the details of your reservation:
              </td>
            </tr>
            <tr>
              <td>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${row("Date", esc(when))}
                  ${row("Time", esc(booking.time))}
                  ${row("Party", esc(guests(booking.partySize)))}
                  ${booking.notes ? row("Notes", esc(booking.notes).replace(/\n/g, "<br>")) : ""}
                </table>
              </td>
            </tr>
            <tr>
              <td style="font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:18px;color:#4A5D3A;padding:32px 0 8px;">
                We look forward to seeing you.
              </td>
            </tr>
            <tr>
              <td style="font-size:14px;line-height:1.6;color:#5E6155;padding-bottom:24px;">
                ${esc(siteInfo.name)} · ${esc(address)}
              </td>
            </tr>
            <tr>
              <td style="font-size:14px;line-height:1.6;color:#5E6155;border-top:1px solid #E4DFD2;padding-top:20px;">
                Need to change or cancel? Simply reply to this email or call us on
                <a href="tel:${esc(siteInfo.phoneHref)}" style="color:#4A5D3A;">${esc(siteInfo.phone)}</a>.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return {
    to: booking.email,
    subject: `Your table at ${siteInfo.name} — ${when}, ${booking.time}`,
    html,
    text,
    // Customer replies land in the cafe's inbox, not the no-reply sender.
    replyTo: process.env.CAFE_NOTIFICATION_EMAIL || siteInfo.email,
  };
}

// ---------------------------------------------------------------------------
// Cafe notification — plain and scannable, not a marketing email.
// ---------------------------------------------------------------------------

export function cafeNotificationEmail(booking: BookingInput): Email {
  const when = formatBookingDate(booking.date);
  const fields: [string, string][] = [
    ["Date", when],
    ["Time", booking.time],
    ["Party size", String(booking.partySize)],
    ["Name", booking.name],
    ["Email", booking.email],
    ["Phone", booking.phone || "—"],
    ["Notes / allergies", booking.notes || "—"],
  ];

  const text = [
    `New booking request`,
    ``,
    ...fields.map(([k, v]) => `${k}: ${v}`),
    ``,
    `Reply to this email to contact the guest directly.`,
  ].join("\n");

  const html = `<!doctype html>
<html lang="en">
  <body style="font-family:Arial,sans-serif;font-size:15px;color:#111;">
    <p style="font-size:18px;margin:0 0 12px;"><strong>New booking: ${esc(when)}, ${esc(booking.time)} — ${esc(guests(booking.partySize))}</strong></p>
    <table cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
      ${fields
        .map(
          ([k, v]) =>
            `<tr><td style="border-bottom:1px solid #ddd;color:#555;vertical-align:top;">${esc(k)}</td><td style="border-bottom:1px solid #ddd;">${esc(v).replace(/\n/g, "<br>")}</td></tr>`,
        )
        .join("\n      ")}
    </table>
    <p style="color:#555;margin-top:16px;">Reply to this email to contact the guest directly.</p>
  </body>
</html>`;

  return {
    to: requireEnv("CAFE_NOTIFICATION_EMAIL"),
    subject: `New booking: ${booking.name}, ${guests(booking.partySize)}, ${when} ${booking.time}`,
    html,
    text,
    replyTo: booking.email,
  };
}

/**
 * Sends both booking emails. Each is attempted independently so a failure in
 * one doesn't stop the other; the result reports what went out.
 */
export async function sendBookingEmails(
  booking: BookingInput,
): Promise<{ customer: boolean; cafe: boolean }> {
  const [customer, cafe] = await Promise.allSettled([
    sendEmail(customerConfirmationEmail(booking)),
    // Build inside the promise so a missing CAFE_NOTIFICATION_EMAIL is caught here.
    Promise.resolve().then(() => sendEmail(cafeNotificationEmail(booking))),
  ]);

  if (customer.status === "rejected") console.error("[booking] customer email failed:", customer.reason);
  if (cafe.status === "rejected") console.error("[booking] cafe notification failed:", cafe.reason);

  return { customer: customer.status === "fulfilled", cafe: cafe.status === "fulfilled" };
}
