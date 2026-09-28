"use client";

import { useEffect, useState } from "react";

/**
 * The running timestamp at the edge of the home page. Each chapter section
 * carries data-chapter-time / data-chapter-label; as it becomes the main thing
 * on screen, the clock advances. Purely decorative (aria-hidden) — the
 * chapters make sense without it.
 */
export function TimeRail() {
  const [chapter, setChapter] = useState({ time: "08:00", label: "First light" });

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter-time]"));
    if (!sections.length || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          setChapter({ time: el.dataset.chapterTime!, label: el.dataset.chapterLabel ?? "" });
        }
      },
      // A section "is on screen" when it crosses the middle band of the viewport.
      { rootMargin: "-45% 0px -45% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed bottom-10 left-5 z-40 hidden mix-blend-difference text-[#e9e6dc] xl:block"
    >
      <div className="flex items-center gap-3 [writing-mode:vertical-rl] rotate-180">
        <span key={chapter.time} className="font-display text-lg tabular-nums tracking-wide animate-[hero-rise_700ms_ease_forwards]">
          {chapter.time}
        </span>
        <span className="h-10 w-px bg-current opacity-50" />
        <span className="text-[0.7rem] uppercase tracking-[0.2em] opacity-80">{chapter.label}</span>
      </div>
    </div>
  );
}
