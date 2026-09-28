import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { HeroBookButton, HeroStatus } from "@/components/HeroStatus";
import { Photo } from "@/components/Photo";
import { menuPhoto, photos } from "@/data/photos";
import { TimeRail } from "@/components/TimeRail";
import { formatPrice, getFeaturedItems } from "@/data/menu";
import { groupedHours } from "@/data/hours";
import { siteInfo } from "@/data/site-info";

// The home page is one slow morning in five chapters (see docs/creative-direction.md).
// Each chapter's data-chapter-time drives the running clock in <TimeRail>.

const ritual = [
  { figure: "2g.", caption: "Ceremonial matcha, sifted so there isn't a single lump.", photo: photos.ritualSift },
  { figure: "80°C.", caption: "Never boiling. Hot enough to open it up, cool enough to keep it sweet.", photo: photos.ritualPour },
  { figure: "Thirty seconds.", caption: "A quick zig-zag with a bamboo whisk until the foam turns fine and glossy.", photo: photos.ritualWhisk },
];

const headline = ["Matcha,", "slow", "mornings,"];

export default function HomePage() {
  const featured = getFeaturedItems();

  return (
    <>
      <TimeRail />

      {/* ① 08:00 — First light */}
      <section
        data-chapter-time="08:00"
        data-chapter-label="First light"
        className="on-dark relative flex min-h-[92svh] items-end overflow-hidden bg-matcha text-cream"
      >
        <Photo
          slot={photos.hero}
          tone="matcha"
          labelPosition="top"
          priority
          sizes="100vw"
          className="absolute inset-0 pt-20 md:pt-24"
          imgClassName="hero-push"
          hover={false}
        />
        {/* Keeps overlaid text legible once real footage replaces the placeholder. */}
        <div aria-hidden className="absolute inset-0 bg-linear-to-t from-[#1e2119]/70 via-[#1e2119]/25 to-transparent" />
        {/* Side shade under the headline, for bright daytime photos. */}
        <div aria-hidden className="absolute inset-0 bg-linear-to-r from-[#1e2119]/55 via-[#1e2119]/20 to-transparent" />
        {/* Top shade keeps the transparent nav legible over a bright photo. */}
        <div aria-hidden className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-[#1e2119]/50 to-transparent" />
        <div aria-hidden className="after-hours-dim" />
        <div aria-hidden className="hero-veil" />

        <div className="container-page relative pb-16 pt-40 md:pb-24">
          <div className="hero-rise" style={{ ["--d" as string]: "600ms" }}>
            <HeroStatus />
          </div>
          <h1 className="mt-5 max-w-4xl text-[3rem] leading-[1.02] sm:text-7xl md:text-[6.5rem] lg:text-[8rem]">
            {headline.map((word, i) => (
              <span key={word}>
                <span className="set-word" style={{ ["--i" as string]: i }}>
                  {word}
                </span>{" "}
              </span>
            ))}
            <em className="set-word italic" style={{ ["--i" as string]: headline.length }}>
              Maastricht.
            </em>
          </h1>
          <p className="hero-rise mt-7 max-w-xl text-lg text-cream/90 md:text-xl" style={{ ["--d" as string]: "1500ms" }}>
            A quiet cafe for good coffee, good matcha, and food that actually makes you feel good.
          </p>
          <div className="hero-rise mt-10 flex flex-col gap-3 sm:flex-row" style={{ ["--d" as string]: "1700ms" }}>
            <HeroBookButton />
            <Link href="/menu" className="btn btn-ghost-light">
              See the menu
            </Link>
          </div>
        </div>
      </section>

      {/* ② 08:20 — The ritual */}
      <section data-chapter-time="08:20" data-chapter-label="The ritual" className="py-24 md:py-40">
        <div className="container-page">
          <FadeIn className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="eyebrow">The ritual</p>
              <h2 className="mt-4 text-4xl md:text-[3.25rem]">
                A small room for <em className="italic text-matcha">unhurried</em> mornings.
              </h2>
            </div>
            <p className="text-lg text-muted md:col-span-5 md:col-start-8 md:pt-10">
              LØV is a little plant-forward cafe on a quiet Maastricht street. We whisk every matcha to
              order, bake in small batches every morning, and cook simple food from good ingredients.
              Pale wood, soft light, no rush.
            </p>
          </FadeIn>

          <ol className="mt-20 grid gap-14 md:mt-28 md:grid-cols-3 md:gap-8">
            {ritual.map((step, i) => (
              <FadeIn as="li" key={step.figure} delay={i * 160} className={`hover-card ${i === 1 ? "md:mt-16" : i === 2 ? "md:mt-32" : ""}`}>
                <Photo slot={step.photo} sizes="(min-width: 768px) 33vw, 100vw" className="aspect-[4/5] w-full rounded-lg" />
                <p className="mt-6 font-display text-4xl text-matcha md:text-5xl">
                  <span className="ritual-figure">{step.figure}</span>
                </p>
                <p className="mt-3 max-w-xs text-muted">{step.caption}</p>
              </FadeIn>
            ))}
          </ol>
        </div>
      </section>

      {/* ③ 09:00 — The table */}
      <section data-chapter-time="09:00" data-chapter-label="The table" className="bg-cream-2 py-24 md:py-36">
        <div className="container-page">
          <FadeIn className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">From the counter</p>
              <h2 className="mt-4 text-4xl md:text-[3.25rem]">
                A few <em className="italic text-matcha">favourites</em>
              </h2>
            </div>
            <Link href="/menu" className="link-underline text-matcha">
              The full menu
            </Link>
          </FadeIn>

          <ul className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((item, i) => (
              <FadeIn as="li" key={item.id} delay={i * 110} className={`hover-card ${i % 2 === 1 ? "lg:mt-12" : ""}`}>
                <Photo slot={menuPhoto(item)} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="aspect-[3/4] w-full rounded-lg" />
                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <h3 className="text-xl">
                    <span className="draw-title [box-decoration-break:clone]">{item.name}</span>
                  </h3>
                  <p className="card-meta shrink-0 tabular-nums text-matcha">{formatPrice(item.price)}</p>
                </div>
                <p className="mt-2 text-[0.95rem] text-muted">{item.description}</p>
              </FadeIn>
            ))}
          </ul>
        </div>
      </section>

      {/* ④ 10:30 — The tea field: the one dark room */}
      <section
        data-chapter-time="10:30"
        data-chapter-label="The tea field"
        className="on-dark relative isolate overflow-hidden bg-uji py-40 text-cream md:py-56"
      >
        <div aria-hidden className="tea-field-drift absolute -inset-y-12 inset-x-0 -z-10">
          <Photo slot={photos.teaField} fallback="none" hover={false} sizes="100vw" className="h-full w-full opacity-40" />
        </div>
        <div aria-hidden className="absolute inset-0 -z-10 bg-uji/55" />
        <FadeIn className="container-page">
          <p className="eyebrow text-cream/75">Where it begins</p>
          <p className="mt-6 max-w-4xl font-display text-4xl leading-[1.15] md:text-6xl">
            Grown in shade, picked by hand, stone-ground slowly —{" "}
            <em className="italic" style={{ fontVariationSettings: '"SOFT" 100, "WONK" 1' }}>
              the way good things are made.
            </em>
          </p>
        </FadeIn>
      </section>

      {/* ⑤ 12:30 — Your seat */}
      <section data-chapter-time="12:30" data-chapter-label="Your seat" className="py-24 md:py-36">
        <div className="container-page grid gap-14 md:grid-cols-2">
          <FadeIn>
            <p className="eyebrow">Opening hours</p>
            <dl className="mt-6 divide-y divide-line border-y border-line">
              {groupedHours().map((g) => (
                <div key={g.days} className="hours-row flex justify-between gap-6 py-4 text-lg">
                  <dt>{g.days}</dt>
                  <dd className={`tabular-nums ${g.time === "Closed" ? "text-muted" : ""}`}>{g.time}</dd>
                </div>
              ))}
            </dl>
          </FadeIn>
          <FadeIn delay={120}>
            <p className="eyebrow">Find us</p>
            <address className="mt-6 font-display text-3xl not-italic leading-snug md:text-4xl">
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

        <div className="container-page mt-24 md:mt-32">
          <FadeIn className="cta-panel on-dark relative overflow-hidden rounded-lg bg-matcha px-6 py-20 text-center text-cream md:px-16 md:py-28">
            <svg
              aria-hidden
              className="cta-leaf pointer-events-none absolute -bottom-16 -left-10 h-72 w-72 text-cream opacity-[0.07]"
              viewBox="0 0 200 200"
            >
              <path d="M100 10c50 30 70 90 0 180C30 100 50 40 100 10Z" fill="currentColor" />
            </svg>
            <h2 className="relative mx-auto max-w-2xl text-4xl md:text-6xl">
              Reserve your <em className="italic">table</em>
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
