// Booking rules shared by the client form (instant feedback) and the
// /api/booking route (authoritative re-validation). Keep this file free of
// server-only or browser-only APIs so it can run in both places.
//
// v1 SCOPE NOTE: there is deliberately no availability check or
// double-booking prevention. A booking is a request that the cafe confirms
// by reading the notification email — like a structured contact form, not a
// live table calendar. Capacity management is a v2 feature.

import {
  hours,
  LAST_SEATING_BEFORE_CLOSE_MINUTES,
  SLOT_INTERVAL_MINUTES,
  type Weekday,
} from "@/data/hours";

export const CAFE_TIME_ZONE = "Europe/Amsterdam";
export const MIN_PARTY_SIZE = 1;
export const MAX_PARTY_SIZE = 10;
/** How far ahead a table can be booked. */
export const MAX_DAYS_AHEAD = 90;
/** Same-day bookings must be at least this many minutes from now. */
export const SAME_DAY_LEAD_MINUTES = 30;

export const LIMITS = {
  name: 100,
  email: 254,
  phone: 30,
  notes: 1000,
} as const;

export type BookingInput = {
  name: string;
  email: string;
  phone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  partySize: number;
  notes: string;
};

export type BookingField = keyof BookingInput;
export type BookingErrors = Partial<Record<BookingField, string>>;

/** JSON shape returned by POST /api/booking. */
export type BookingResponse =
  | { ok: true; emailSent: boolean }
  | { ok: false; errors?: BookingErrors; message?: string };

export type ValidationResult =
  | { ok: true; data: BookingInput }
  | { ok: false; errors: BookingErrors };

const WEEKDAYS: Weekday[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Deliberately simple: one "@", no spaces, a dot in the domain. Stricter
// regexes reject real addresses; the confirmation email is the real test.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;
const PHONE_RE = /^[+()\d\s.-]{6,}$/;

/** Current date ("YYYY-MM-DD") and minutes past midnight in the cafe's time zone. */
export function cafeNow(now: Date = new Date()): { date: string; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: CAFE_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

/** Parses "YYYY-MM-DD" as a calendar date (UTC midnight) or returns null if invalid. */
function parseDate(value: string): Date | null {
  if (!DATE_RE.test(value)) return null;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  // Reject rollovers like 2026-02-31.
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) {
    return null;
  }
  return date;
}

export function addDays(dateStr: string, days: number): string {
  const date = parseDate(dateStr);
  if (!date) return dateStr;
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function weekdayOf(dateStr: string): Weekday | null {
  const date = parseDate(dateStr);
  return date ? WEEKDAYS[date.getUTCDay()] : null;
}

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

const toHHMM = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

/**
 * Bookable time slots for a date, derived from data/hours.ts.
 * Returns [] for closed days, invalid dates, or a day whose slots have all passed.
 */
export function timeSlotsFor(dateStr: string, now: Date = new Date()): string[] {
  const weekday = weekdayOf(dateStr);
  if (!weekday) return [];
  const day = hours.find((h) => h.day === weekday);
  if (!day || "closed" in day) return [];

  const first = toMinutes(day.open);
  const last = toMinutes(day.close) - LAST_SEATING_BEFORE_CLOSE_MINUTES;
  const today = cafeNow(now);
  const earliest = dateStr === today.date ? today.minutes + SAME_DAY_LEAD_MINUTES : -1;

  const slots: string[] = [];
  for (let t = first; t <= last; t += SLOT_INTERVAL_MINUTES) {
    if (t >= earliest) slots.push(toHHMM(t));
  }
  return slots;
}

export function isClosedDay(dateStr: string): boolean {
  const weekday = weekdayOf(dateStr);
  const day = hours.find((h) => h.day === weekday);
  return Boolean(day && "closed" in day);
}

/** Human-friendly date, e.g. "Saturday 4 October 2026". */
export function formatBookingDate(dateStr: string): string {
  const date = parseDate(dateStr);
  if (!date) return dateStr;
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/**
 * Validates untrusted input (form state or a JSON request body).
 * The server calls this on every request — never rely on the client having done so.
 */
export function validateBooking(raw: unknown, now: Date = new Date()): ValidationResult {
  const input = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const errors: BookingErrors = {};

  const name = str(input.name);
  if (!name) errors.name = "Please tell us your name.";
  else if (name.length > LIMITS.name) errors.name = "That name is a little long for our book.";

  const email = str(input.email);
  if (!email) errors.email = "We need an email to send your confirmation.";
  else if (email.length > LIMITS.email || !EMAIL_RE.test(email))
    errors.email = "That email address doesn't look quite right.";

  const phone = str(input.phone);
  if (phone && (phone.length > LIMITS.phone || !PHONE_RE.test(phone)))
    errors.phone = "Please use digits, spaces and an optional + only.";

  const today = cafeNow(now).date;
  const date = str(input.date);
  if (!date) errors.date = "Please choose a date.";
  else if (!parseDate(date)) errors.date = "Please choose a valid date.";
  else if (date < today) errors.date = "That date has already passed.";
  else if (date > addDays(today, MAX_DAYS_AHEAD))
    errors.date = `We take bookings up to ${MAX_DAYS_AHEAD} days ahead.`;
  else if (isClosedDay(date)) errors.date = `We're closed on ${weekdayOf(date)}s.`;

  const time = str(input.time);
  if (!time) errors.time = "Please choose a time.";
  else if (!TIME_RE.test(time)) errors.time = "Please choose a time from the list.";
  else if (!errors.date && !timeSlotsFor(date, now).includes(time))
    errors.time = "That time isn't available — please pick another.";

  const partySize =
    typeof input.partySize === "number" ? input.partySize : Number(str(input.partySize));
  if (!Number.isInteger(partySize) || partySize < MIN_PARTY_SIZE)
    errors.partySize = "Please choose how many people are coming.";
  else if (partySize > MAX_PARTY_SIZE)
    errors.partySize = `For more than ${MAX_PARTY_SIZE} guests, please contact us directly.`;

  const notes = str(input.notes);
  if (notes.length > LIMITS.notes)
    errors.notes = `Please keep notes under ${LIMITS.notes} characters.`;

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, data: { name, email, phone, date, time, partySize, notes } };
}
