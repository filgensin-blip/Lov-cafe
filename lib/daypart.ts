// "Living palette": what part of the cafe's day it is right now in
// Maastricht, derived from data/hours.ts. Drives subtle colour warmth and the
// after-hours state of the home page.

import { hours } from "@/data/hours";
import { addDays, cafeNow, weekdayOf } from "@/lib/booking";

export type Daypart = "morning" | "afternoon" | "closed";

/** Mornings end at 10:00; after that the palette cools slightly. */
const MORNING_ENDS_MINUTES = 10 * 60;

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

function hoursFor(date: string) {
  const day = hours.find((h) => h.day === weekdayOf(date));
  return day && !("closed" in day) ? day : null;
}

export function currentDaypart(now: Date = new Date()): Daypart {
  const { date, minutes } = cafeNow(now);
  const today = hoursFor(date);
  if (!today || minutes < toMinutes(today.open) || minutes >= toMinutes(today.close)) return "closed";
  return minutes < MORNING_ENDS_MINUTES ? "morning" : "afternoon";
}

/**
 * When the cafe next opens, relative to now: e.g. { when: "tomorrow", time: "08:00" }
 * or { when: "Tuesday", time: "08:00" }. Returns null if no open day is configured.
 */
export function nextOpening(now: Date = new Date()): { when: string; time: string; date: string } | null {
  const { date, minutes } = cafeNow(now);
  for (let i = 0; i < 8; i++) {
    const d = addDays(date, i);
    const h = hoursFor(d);
    if (!h) continue;
    if (i === 0 && minutes >= toMinutes(h.open)) continue;
    const when = i === 0 ? "today" : i === 1 ? "tomorrow" : (weekdayOf(d) ?? d);
    return { when, time: h.open, date: d };
  }
  return null;
}
