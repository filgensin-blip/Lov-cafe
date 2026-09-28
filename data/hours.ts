// ⚠️ PLACEHOLDER OPENING HOURS — replace with the real schedule before launch.
// Times are 24h "HH:MM" in Europe/Amsterdam local time.
// The booking form derives its time slots from this file, so changing hours
// here automatically updates what customers can book.

export type Weekday =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type OpeningHours =
  | { day: Weekday; open: string; close: string }
  | { day: Weekday; closed: true };

export const hours: OpeningHours[] = [
  { day: "Monday", closed: true },
  { day: "Tuesday", open: "08:00", close: "17:00" },
  { day: "Wednesday", open: "08:00", close: "17:00" },
  { day: "Thursday", open: "08:00", close: "17:00" },
  { day: "Friday", open: "08:00", close: "17:00" },
  { day: "Saturday", open: "09:00", close: "17:00" },
  { day: "Sunday", open: "09:00", close: "17:00" },
];

/** Minutes before closing that the last table can be booked. */
export const LAST_SEATING_BEFORE_CLOSE_MINUTES = 60;

/** Interval between bookable time slots. */
export const SLOT_INTERVAL_MINUTES = 30;

/**
 * Compact summary for small blocks (home page, footer), e.g.
 * "Tue – Fri 08:00 – 17:00". Consecutive days with identical hours are grouped.
 */
export function groupedHours(list: OpeningHours[] = hours): { days: string; time: string }[] {
  const short = (d: Weekday) => d.slice(0, 3);
  const label = (h: OpeningHours) => ("closed" in h ? "Closed" : `${h.open} – ${h.close}`);

  const groups: { from: Weekday; to: Weekday; time: string }[] = [];
  for (const h of list) {
    const time = label(h);
    const last = groups[groups.length - 1];
    if (last && last.time === time) last.to = h.day;
    else groups.push({ from: h.day, to: h.day, time });
  }
  return groups.map((g) => ({
    days: g.from === g.to ? short(g.from) : `${short(g.from)} – ${short(g.to)}`,
    time: g.time,
  }));
}
