import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { MenuPreview } from "@/components/MenuPreview";
import { hasPhoto } from "@/components/Photo";
import { menuPhoto } from "@/data/photos";
import { formatPrice, menu, slugify, tagLabels } from "@/data/menu";

export const metadata: Metadata = {
  title: "Menu",
  description: "Ceremonial matcha, coffee, breakfast, bowls and fresh pastries at LØV Maastricht.",
};

export default function MenuPage() {
  return (
    <div className="pb-24 pt-32 md:pb-32 md:pt-44">
      <MenuPreview />
      <div className="container-page">
        <FadeIn className="max-w-2xl">
          <p className="eyebrow">Menu</p>
          <h1 className="mt-4 text-5xl md:text-7xl">
            What we&rsquo;re <em className="italic text-matcha">making</em>
          </h1>
          <p className="mt-6 text-lg text-muted">
            Simple, seasonal and mostly plants. Tell us about any allergies when you order — we&rsquo;re
            happy to adapt where we can.
          </p>
        </FadeIn>

        {/* Category jump links */}
        <nav aria-label="Menu categories" className="mt-12 border-y border-line py-4">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {menu.map((c) => (
              <li key={c.category}>
                <a href={`#${slugify(c.category)}`} className="link-underline text-[0.95rem]">
                  {c.category}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* The menu as a printed card: foam paper, ruled sections, dotted leaders. */}
        <div className="paper mt-10 px-5 sm:px-8 md:px-14">
          {menu.map((category) => (
            <FadeIn
              as="section"
              key={category.category}
              className="grid scroll-mt-28 gap-6 border-b border-line py-14 last:border-b-0 md:grid-cols-12 md:gap-10 md:py-20"
            >
              <header className="md:col-span-4" id={slugify(category.category)}>
                <p aria-hidden className="font-display text-sm tabular-nums text-muted">
                  {String(menu.indexOf(category) + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-2 text-3xl md:text-4xl">{category.category}</h2>
                {category.note && <p className="mt-3 text-muted">{category.note}</p>}
              </header>

              <ul className="space-y-8 md:col-span-8">
                {category.items.map((item) => (
                  <li key={item.id} data-preview-name={hasPhoto(menuPhoto(item)) ? item.name : undefined} data-preview-image={hasPhoto(menuPhoto(item)) ? menuPhoto(item).src : undefined}>
                    <div className="flex items-baseline gap-3">
                      <h3 className="font-sans text-lg font-medium">{item.name}</h3>
                      <span aria-hidden className="mb-1 flex-1 border-b border-dotted border-line-strong" />
                      <p className="shrink-0 tabular-nums text-matcha">
                        <span className="sr-only">Price: </span>
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <p className="mt-1.5 max-w-xl text-muted">
                      {item.description}
                      {item.tags && item.tags.length > 0 && (
                        <span className="ml-2 whitespace-nowrap text-sm">
                          {item.tags.map((t) => (
                            <abbr
                              key={t}
                              title={tagLabels[t]}
                              className="ml-1 rounded-sm border border-line-strong px-1.5 py-px text-xs uppercase no-underline"
                            >
                              {t}
                            </abbr>
                          ))}
                        </span>
                      )}
                    </p>
                  </li>
                ))}
              </ul>
            </FadeIn>
          ))}
        </div>

        <FadeIn className="mt-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <p className="text-sm text-muted">
            {Object.entries(tagLabels)
              .map(([k, v]) => `${k.toUpperCase()} ${v.toLowerCase()}`)
              .join(" · ")}
            . Prices include VAT.
          </p>
          <Link href="/book" className="btn btn-primary">
            Book a table
          </Link>
        </FadeIn>
      </div>
    </div>
  );
}
