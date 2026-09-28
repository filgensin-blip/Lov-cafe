"use client";

import { useEffect } from "react";
import { currentDaypart } from "@/lib/daypart";

/**
 * Keeps <html data-daypart="morning|afternoon|closed"> in step with
 * Maastricht time. CSS reads it to warm or cool the palette and to dim the
 * home-page hero after hours. Colour changes transition slowly, so a change
 * after hydration reads as the light shifting rather than a flash.
 */
export function DaypartSync() {
  useEffect(() => {
    const update = () => {
      document.documentElement.dataset.daypart = currentDaypart();
      window.dispatchEvent(new Event("daypartchange"));
    };
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);
  return null;
}
