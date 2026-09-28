"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { currentDaypart, nextOpening } from "@/lib/daypart";

type State = { closed: boolean; when: string; time: string };

function read(): State {
  const next = nextOpening();
  return {
    closed: currentDaypart() === "closed",
    when: next?.when ?? "soon",
    time: next?.time ?? "",
  };
}

/** Before/after-hours line shown above the hero headline. */
export function HeroStatus() {
  const [state, setState] = useState<State | null>(null);

  useEffect(() => {
    const update = () => setState(read());
    update();
    window.addEventListener("daypartchange", update);
    return () => window.removeEventListener("daypartchange", update);
  }, []);

  if (!state) return <p className="eyebrow text-cream/80">Maastricht · matcha &amp; slow food</p>;
  return (
    <p className="eyebrow text-cream/85" aria-live="polite">
      {state.closed
        ? `We're asleep. Back ${state.when} at ${state.time}.`
        : "Open now · walk-ins welcome"}
    </p>
  );
}

/** Primary hero CTA — after hours it invites booking the next morning. */
export function HeroBookButton() {
  const [label, setLabel] = useState("Book a table");

  useEffect(() => {
    const update = () => {
      const s = read();
      setLabel(s.closed ? (s.when === "tomorrow" ? "Book for tomorrow morning" : `Book for ${s.when}`) : "Book a table");
    };
    update();
    window.addEventListener("daypartchange", update);
    return () => window.removeEventListener("daypartchange", update);
  }, []);

  return (
    <Link href="/book" className="btn btn-light">
      {label}
    </Link>
  );
}
