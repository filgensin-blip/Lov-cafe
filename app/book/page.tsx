import type { Metadata } from "next";
import { BookingForm } from "@/components/BookingForm";
import { FadeIn } from "@/components/FadeIn";
import { Photo } from "@/components/Photo";
import { photos } from "@/data/photos";
import { groupedHours } from "@/data/hours";
import { formatAddress, siteInfo } from "@/data/site-info";

export const metadata: Metadata = {
  title: "Book a table",
  description: "Reserve a table at LØV, a matcha and plant-forward cafe in Maastricht.",
};

export default function BookPage() {
  return (
    <div className="pb-24 pt-32 md:pb-32 md:pt-44">
      <div className="container-page grid gap-16 lg:grid-cols-12">
        <FadeIn className="lg:col-span-5">
          <p className="eyebrow">Reservations</p>
          <h1 className="mt-4 text-5xl md:text-6xl">
            Book a <em className="italic text-matcha">table</em>
          </h1>
          <p className="mt-6 max-w-md text-lg text-muted">
            Choose a day and time and we&rsquo;ll save you a seat. Walk-ins are always welcome too,
            whenever there&rsquo;s space.
          </p>

          <div className="mt-12 hidden space-y-8 lg:block">
            <Photo slot={photos.interior} sizes="35vw" className="aspect-[4/3] w-full max-w-md rounded-lg" />
            <div>
              <h2 className="eyebrow">Hours</h2>
              <dl className="mt-3 space-y-1">
                {groupedHours().map((g) => (
                  <div key={g.days} className="flex gap-4">
                    <dt className="w-28">{g.days}</dt>
                    <dd className="tabular-nums text-muted">{g.time}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <h2 className="eyebrow">Larger groups &amp; questions</h2>
              <p className="mt-3 text-muted">
                Call{" "}
                <a className="link-underline text-ink" href={`tel:${siteInfo.phoneHref}`}>
                  {siteInfo.phone}
                </a>{" "}
                or email{" "}
                <a className="link-underline text-ink" href={`mailto:${siteInfo.email}`}>
                  {siteInfo.email}
                </a>
                .
              </p>
              <p className="mt-2 text-muted">{formatAddress()}</p>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={120} className="lg:col-span-6 lg:col-start-7">
          <BookingForm />
        </FadeIn>
      </div>
    </div>
  );
}
