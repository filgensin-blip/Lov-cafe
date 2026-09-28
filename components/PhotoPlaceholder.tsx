/**
 * Clearly-marked stand-in for photography that hasn't been shot yet.
 * Replace each usage with next/image once real photos are available, e.g.
 *   <Image src="/photos/interior.jpg" alt="..." fill className="object-cover" />
 */
export function PhotoPlaceholder({
  label,
  tone = "sage",
  labelPosition = "bottom",
  className = "",
}: {
  /** What the real photo should show — doubles as a shot list. */
  label: string;
  tone?: "sage" | "cream" | "matcha";
  labelPosition?: "top" | "bottom";
  className?: string;
}) {
  const tones = {
    sage: "bg-[#d9dfcc] text-matcha-deep",
    cream: "bg-cream-2 text-muted",
    matcha: "bg-matcha text-cream/80",
  } as const;

  return (
    <div
      role="img"
      aria-label={`Photo placeholder: ${label}`}
      className={`relative flex overflow-hidden ${labelPosition === "top" ? "items-start" : "items-end"} ${tones[tone]} ${className}`}
    >
      {/* Soft leaf-like shapes so placeholders feel intentional, not broken. */}
      <svg
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 opacity-[0.14]"
        viewBox="0 0 200 200"
      >
        <path d="M100 10c50 30 70 90 0 180C30 100 50 40 100 10Z" fill="currentColor" />
      </svg>
      <span className="relative m-3 rounded-sm border border-current/30 px-2 py-1 text-[0.7rem] font-medium uppercase tracking-[0.14em]">
        Photo · {label}
      </span>
    </div>
  );
}
