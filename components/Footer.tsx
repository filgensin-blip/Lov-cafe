import Link from "next/link";
import { Logo } from "@/components/Logo";
import { groupedHours } from "@/data/hours";
import { formatAddress, siteInfo } from "@/data/site-info";

export function Footer() {
  return (
    <footer className="border-t border-line bg-cream-2">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo className="text-matcha" />
          <p className="mt-4 max-w-[16rem] text-muted">
            Matcha, slow mornings and good food in {siteInfo.city}.
          </p>
        </div>

        <div>
          <h2 className="eyebrow">Visit</h2>
          <address className="mt-3 not-italic leading-relaxed">
            {siteInfo.address.street}
            <br />
            {siteInfo.address.postalCode} {siteInfo.address.city}
          </address>
          <Link href="/about#visit" className="link-underline mt-2 inline-block text-sm text-matcha">
            Map &amp; directions
          </Link>
        </div>

        <div>
          <h2 className="eyebrow">Hours</h2>
          <dl className="mt-3 space-y-1">
            {groupedHours().map((g) => (
              <div key={g.days} className="flex gap-3">
                <dt className="w-24 shrink-0">{g.days}</dt>
                <dd className="text-muted">{g.time}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h2 className="eyebrow">Contact</h2>
          <ul className="mt-3 space-y-1">
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
      </div>
      <div className="container-page flex flex-col gap-2 border-t border-line py-6 text-sm text-muted sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} {siteInfo.name} · {formatAddress()}
        </p>
        <p>Made slowly in Maastricht.</p>
      </div>
    </footer>
  );
}
