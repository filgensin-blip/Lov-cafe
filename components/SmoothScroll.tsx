"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Smooth, weighted wheel scrolling (Lenis). It eases the page toward the
 * native scroll position rather than faking it, so sticky elements,
 * IntersectionObserver fade-ins and CSS scroll-driven animations keep working.
 *
 * - Touch devices keep their own native momentum scrolling.
 * - Off entirely under prefers-reduced-motion.
 * - In-page anchor links (#visit, menu categories) glide instead of jumping.
 */
export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    const lenis = new Lenis({
      lerp: 0.085, // lower = floatier; 0.08–0.1 feels calm without lag
      wheelMultiplier: 0.9,
      anchors: { offset: -120 }, // clear the fixed header with some air
      autoRaf: true,
    });
    lenisRef.current = lenis;

    const onChange = () => reduce.matches && lenis.destroy();
    reduce.addEventListener("change", onChange);
    return () => {
      reduce.removeEventListener("change", onChange);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // New page: start at the top immediately, without easing from the old position.
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return null;
}
