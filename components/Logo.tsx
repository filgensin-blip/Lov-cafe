/** Wordmark: Fraunces, generous tracking. Inherits colour from its parent. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display text-[1.65rem] font-medium leading-none tracking-[0.12em] ${className}`}>
      LØV
    </span>
  );
}
