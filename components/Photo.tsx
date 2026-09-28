import "server-only";
import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import type { PhotoSlot } from "@/data/photos";

/** True when the slot's file exists in /public (checked at build/render time). */
export function hasPhoto(slot: PhotoSlot): boolean {
  return fs.existsSync(path.join(process.cwd(), "public", slot.src));
}

/**
 * A photo slot from data/photos.ts. Renders the real image (optimised by
 * next/image, with the house colour grade) when the file exists, otherwise a
 * clearly-labelled placeholder with the shot brief.
 *
 * The wrapper sizes the slot — pass aspect/size classes via className.
 */
export function Photo({
  slot,
  className = "",
  sizes = "(min-width: 1024px) 33vw, 100vw",
  priority = false,
  tone,
  labelPosition,
  imgClassName = "",
  fallback = "placeholder",
}: {
  slot: PhotoSlot;
  className?: string;
  sizes?: string;
  priority?: boolean;
  tone?: "sage" | "cream" | "matcha";
  labelPosition?: "top" | "bottom";
  imgClassName?: string;
  /** "none" renders nothing when the file is missing (for decorative backdrops). */
  fallback?: "placeholder" | "none";
}) {
  if (!hasPhoto(slot)) {
    if (fallback === "none") return null;
    return <PhotoPlaceholder label={slot.brief} tone={tone} labelPosition={labelPosition} className={className} />;
  }
  // next/image `fill` needs a positioned parent; keep a caller's absolute/fixed.
  const position = /\b(absolute|fixed)\b/.test(className) ? "" : "relative";
  return (
    <div className={`${position} overflow-hidden bg-cream-2 ${className}`}>
      <Image
        src={slot.src}
        alt={slot.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`graded object-cover ${imgClassName}`}
      />
    </div>
  );
}
