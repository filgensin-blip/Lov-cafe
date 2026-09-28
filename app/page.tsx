import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { formatPrice, getFeaturedItems } from "@/data/menu";
import { groupedHours } from "@/data/hours";
import { siteInfo } from "@/data/site-info";

export default function HomePage() {
  const featured = getFeaturedItems();

  return (
    <>
      {/* Hero */}
      <section className="on-dark relative flex min-h-[88svh] items-end overflow-hidden bg-matcha text-cream">
        <PhotoPlaceholder
          label="Hero — morning light through the front window, matcha on the bar"
          tone="matcha"
          labelPosition="top"
          className="absolute inset-0 pt-20 md:pt-24"
        />
        {/* Keeps overlaid text legible once a real photo replaces the placeholder. */}
        <div aria-hidden className="absolute inset-0 bg-linear-to-t from-[#1e2119]/70 via-[#1e2119]/25 to-transparent" />

        <div className="container-page relative pb-16 pt-40 md:pb-24">
          <FadeIn>
            <h1 className="max-w-3xl text-[2.75rem] leading-[1.05] sm:text-6xl md:text-7xl">
              Matcha, slow mornings, <em className="italic">Maastricht.</em>
            </h1>
          </FadeIn>
          <FadeIn delay={120}>
            <p className="mt-6 max-w-xl text-lg text-cream/90 md:text-xl">
              A quiet cafe for good coffee, good matcha, and food that actually makes you feel good.
            </p>
          </FadeIn>
          <FadeIn delay={240} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/book" className="btn btn-light">
              Book a table
            </Link>
            <Link href="/menu" className="btn btn-ghost-light">
              See the menu
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Intro */}
      <section className="py-24 md:py-36">
        <div className="container-page grid items-center gap-12 md:grid-cols-12">
          <FadeIn className="md:col-span-6 lg:col-span-5">
            <p className="eyebrow">Welcome to LØV</p>
            <h2 className="mt-4 text-3xl md:text-[2.75rem]">
              A small room for <em className="italic text-matcha">unhurried</em> mornings.
            </h2>
            <p className="mt-6 text-lg text-muted">
              LØV is a little plant-forward cafe on a quiet Maastricht street. We whisk ceremonial
              matcha to order, bake in small batches every morning, and cook simple food from good
              ingredients. Pale wood, soft light, no rush.
            </p>
            <Link href="/about" className="link-underline mt-8 inline-block text-matcha">
              Our story
            </Link>
          </FadeIn>
          <FadeIn delay={120} className="md:col-span-6 md:col-start-7 lg:col-start-8 lg:col-span-5">
            <PhotoPlaceholder
              label="Interior — window seat, oak tables"
              className="aspect-[4/5] w-full rounded-lg"
            />
          </FadeIn>
        </div>
      </section>

      {/* Featured */}
      <section className="bg-cream-2 py-24 md:py-32">
        <div className="container-page">
          <FadeIn className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">From the counter</p>
              <h2 className="mt-4 text-3xl md:text-[2.75rem]">A few favourites</h2>
            </div>
            <Link href="/menu" className="link-underline text-matcha">
              Full menu
            </Link>
          </FadeIn>

          <ul className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((item, i) => (
              <FadeIn as="li" key={item.id} delay={i * 90}>
                <PhotoPlaceholder label={item.name} className="aspect-square w-full rounded-lg" />
                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <h3 className="text-xl">{item.name}</h3>
                  <p className="shrink-0 tabular-nums text-matcha">{formatPrice(item.price)}</p>
                </div>
                <p className="mt-2 text-[0.95rem] text-muted">{item.description}</p>
              </FadeIn>
            ))}
          </ul>
        </div>
      </section>

      {/* Hours & location */}
      <section className="py-24 md:py-32">
        <div className="container-page grid gap-12 md:grid-cols-2">
          <FadeIn>
            <p className="eyebrow">Opening hours</p>
            <dl className="mt-6 divide-y divide-line border-y border-line">
              {groupedHours().map((g) => (
                <div key={g.days} className="flex justify-between gap-6 py-4 text-lg">
                  <dt>{g.days}</dt>
                  <dd className={`tabular-nums ${g.time === "Closed" ? "text-muted" : ""}`}>{g.time}</dd>
                </div>
              ))}
            </dl>
          </FadeIn>
          <FadeIn delay={120}>
            <p className="eyebrow">Find us</p>
            <address className="mt-6 font-display text-3xl not-italic leading-snug">
              {siteInfo.address.street}
              <br />
              {siteInfo.address.postalCode} {siteInfo.address.city}
            </address>
            <p className="mt-4 text-muted">
              In the heart of Maastricht&rsquo;s old town. Walk-ins are always welcome when
              there&rsquo;s space.
            </p>
            <Link href="/about#visit" className="link-underline mt-6 inline-block text-matcha">
              Map, directions &amp; contact
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="pb-24 md:pb-32">
        <div className="container-page">
          <FadeIn className="on-dark relative overflow-hidden rounded-lg bg-matcha px-6 py-20 text-center text-cream md:px-16 md:py-28">
            <svg
              aria-hidden
              className="pointer-events-none absolute -bottom-16 -left-10 h-72 w-72 text-cream opacity-[0.07]"
              viewBox="0 0 200 200"
            >
              <path d="M100 10c50 30 70 90 0 180C30 100 50 40 100 10Z" fill="currentColor" />
            </svg>
            <h2 className="relative mx-auto max-w-2xl text-4xl md:text-6xl">
              Reserve your table
            </h2>
            <p className="relative mx-auto mt-5 max-w-md text-lg text-cream/90">
              Save a seat by the window for a slow breakfast, a long lunch or a quiet matcha.
            </p>
            <Link href="/book" className="btn btn-light relative mt-10">
              Book a table
            </Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
