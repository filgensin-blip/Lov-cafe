import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/FadeIn";
import { Photo } from "@/components/Photo";
import { photos } from "@/data/photos";
import { hours } from "@/data/hours";
import { mapEmbedUrl, mapLinkUrl, siteInfo } from "@/data/site-info";

export const metadata: Metadata = {
  title: "About & Contact",
  description: "The story behind LØV, plus our address, opening hours and how to reach us in Maastricht.",
};

const values = [
  {
    title: "Slow mornings",
    body: "No laptops-and-lanyards rush. Stay for one cup or three — the window seat is yours for as long as you like.",
  },
  {
    title: "Good ingredients",
    body: "Ceremonial-grade matcha from Japan, coffee from small roasters, and vegetables from growers around Limburg whenever we can.",
  },
  {
    title: "Little waste",
    body: "We bake in small batches, cook to the season, and turn yesterday's bread into tomorrow's crumbs and croutons.",
  },
];

export default function AboutPage() {
  return (
    <div className="pt-32 md:pt-44">
      {/* Story */}
      <section className="container-page grid gap-12 pb-24 md:grid-cols-12 md:pb-32">
        <FadeIn className="md:col-span-6">
          <p className="eyebrow">About</p>
          <h1 className="mt-4 text-5xl md:text-6xl">
            Løv means <em className="italic text-matcha">leaf</em>.
          </h1>
          <div className="mt-8 max-w-lg space-y-5 text-lg text-muted">
            <p>
              We opened LØV because we wanted a place that felt like the best part of a Sunday
              morning — every day of the week. A bowl of matcha whisked properly. Bread that took two
              days to make. Food that leaves you feeling better than when you walked in.
            </p>
            <p>
              The room is small and bright, the menu is short, and most of it grows in the ground.
              Pull up a chair.
            </p>
          </div>
        </FadeIn>
        <FadeIn delay={120} className="md:col-span-5 md:col-start-8">
          <Photo slot={photos.aboutPortrait} sizes="(min-width: 768px) 40vw, 100vw" className="aspect-[4/5] w-full rounded-lg" />
        </FadeIn>
      </section>

      {/* Values */}
      <section className="bg-cream-2 py-24 md:py-32">
        <ul className="container-page grid gap-12 md:grid-cols-3 md:gap-10">
          {values.map((v, i) => (
            <FadeIn as="li" key={v.title} delay={i * 100} className="value-item">
              <span aria-hidden className="value-line block h-px w-10 bg-sage" />
              <h2 className="mt-6 text-2xl">{v.title}</h2>
              <p className="mt-3 text-muted">{v.body}</p>
            </FadeIn>
          ))}
        </ul>
      </section>

      {/* Visit / contact */}
      <section id="visit" className="scroll-mt-24 py-24 md:py-32">
        <div className="container-page grid gap-14 lg:grid-cols-12">
          <FadeIn className="space-y-12 lg:col-span-5">
            <div>
              <p className="eyebrow">Visit</p>
              <h2 className="mt-4 text-4xl">Come and find us</h2>
              <address className="mt-6 text-lg not-italic leading-relaxed">
                {siteInfo.name}
                <br />
                {siteInfo.address.street}
                <br />
                {siteInfo.address.postalCode} {siteInfo.address.city}
                <br />
                {siteInfo.address.country}
              </address>
              <a
                href={mapLinkUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline mt-3 inline-block text-matcha"
              >
                Open in Google Maps
              </a>
            </div>

            <div>
              <h3 className="eyebrow">Opening hours</h3>
              <dl className="mt-4 divide-y divide-line border-y border-line">
                {hours.map((h) => (
                  <div key={h.day} className="hours-row flex justify-between py-2.5">
                    <dt>{h.day}</dt>
                    <dd className={`tabular-nums ${"closed" in h ? "text-muted" : ""}`}>
                      {"closed" in h ? "Closed" : `${h.open} – ${h.close}`}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <h3 className="eyebrow">Contact</h3>
              <ul className="mt-4 space-y-2 text-lg">
                <li>
                  <a className="link-underline" href={`tel:${siteInfo.phoneHref}`}>
                    {siteInfo.phone}
                  </a>
                </li>
                <li>
                  <a className="link-underline" href={`mailto:${siteInfo.email}`}>
                    {siteInfo.email}
                  </a>
                </li>
                {siteInfo.socials.map((s) => (
                  <li key={s.href}>
                    <a className="link-underline" href={s.href} target="_blank" rel="noopener noreferrer">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <Link href="/book" className="btn btn-primary">
              Book a table
            </Link>
          </FadeIn>

          <FadeIn delay={120} className="lg:col-span-7">
            <div className="overflow-hidden rounded-lg border border-line bg-cream-2">
              <iframe
                title={`Map showing ${siteInfo.name} at ${siteInfo.address.street}, ${siteInfo.address.city}`}
                src={mapEmbedUrl()}
                className="block aspect-[4/5] w-full sm:aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[36rem]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
