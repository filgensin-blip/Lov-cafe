"use client";

import { useEffect, useRef, useState } from "react";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";

const DWELL_MS = 400;

/**
 * Signature moment ③ — "glancing at the next table's plate".
 * On desktop, resting on a menu item ([data-preview-name]) for 400ms shows a
 * small photo beside the cursor. Skipped entirely on touch devices. Under
 * reduced motion it appears in place without following the cursor.
 * Items with data-preview-image show that photo; others show a placeholder.
 */
export function MenuPreview() {
  const [item, setItem] = useState<{ name: string; image?: string } | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let timer: number | undefined;
    let current: HTMLElement | null = null;
    let raf = 0;
    const pos = { x: 0, y: 0 };

    const place = () => {
      raf = 0;
      const box = boxRef.current;
      if (!box) return;
      const w = box.offsetWidth || 180;
      const h = box.offsetHeight || 220;
      // Sit to the right of the cursor; flip left near the viewport edge.
      const x = pos.x + 28 + w > window.innerWidth ? pos.x - 28 - w : pos.x + 28;
      const y = Math.min(Math.max(pos.y - h / 2, 12), window.innerHeight - h - 12);
      box.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const onMove = (e: PointerEvent) => {
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-preview-name]") ?? null;
      if (!still || target !== current) {
        pos.x = e.clientX;
        pos.y = e.clientY;
        if (!raf) raf = requestAnimationFrame(place);
      }
      if (target === current) return;
      current = target;
      window.clearTimeout(timer);
      setItem(null);
      if (target) {
        timer = window.setTimeout(
          () => setItem({ name: target.dataset.previewName!, image: target.dataset.previewImage }),
          DWELL_MS,
        );
      }
    };
    const onLeave = () => {
      current = null;
      window.clearTimeout(timer);
      setItem(null);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onLeave, { passive: true });
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onLeave);
    };
  }, []);

  return (
    <div
      ref={boxRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-40 w-44 transition-[transform] duration-300 ease-out"
    >
      <div className={`transition-opacity duration-500 ${item ? "opacity-100" : "opacity-0"}`}>
        {item &&
          (item.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.image} alt="" className="graded aspect-[4/5] w-full rounded-md object-cover" />
          ) : (
            <PhotoPlaceholder label={item.name} className="aspect-[4/5] w-full rounded-md" />
          ))}
      </div>
    </div>
  );
}
