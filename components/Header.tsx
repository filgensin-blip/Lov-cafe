"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";

const links = [
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
];

/**
 * Sticky header. Transparent (cream text) over the home-page hero, solid
 * cream once scrolled — and always solid on inner pages, which have no hero.
 */
export function Header() {
  const pathname = usePathname();
  const hasHero = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const transparent = hasHero && !scrolled && !menuOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        transparent
          ? "on-dark bg-transparent text-cream"
          : "bg-cream/95 text-ink shadow-[0_1px_0_var(--color-line)] backdrop-blur-sm"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between md:h-20">
        <Link href="/" aria-label="LØV — home" className="-m-1 p-1">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <NavLink key={link.href} {...link} active={pathname === link.href} />
          ))}
          <Link
            href="/book"
            className={`btn min-h-10 px-5 py-2${transparent ? "btn-light" : "btn-primary"}`}
            aria-current={pathname === "/book" ? "page" : undefined}
          >
            Book a table
          </Link>
        </nav>

        <button
          type="button"
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-md md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
          <span aria-hidden className="relative block h-3 w-6">
            <span
              className={`absolute left-0 h-px w-6 bg-current transition-transform duration-300 ${
                menuOpen ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 h-px w-6 bg-current transition-transform duration-300 ${
                menuOpen ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
          </span>
        </button>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Main"
        hidden={!menuOpen}
        className="border-t border-line bg-cream md:hidden"
      >
        <ul className="container-page flex flex-col py-4">
          {[{ href: "/", label: "Home" }, ...links].map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className="block py-3 font-display text-2xl"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="pt-3 pb-2">
            <Link href="/book" className="btn btn-primary w-full">
              Book a table
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`text-[0.975rem] underline-offset-[0.4em] decoration-1 hover:underline ${
        active ? "underline decoration-current" : "decoration-sage"
      }`}
    >
      {label}
    </Link>
  );
}
