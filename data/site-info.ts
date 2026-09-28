// ⚠️ PLACEHOLDER BUSINESS DETAILS — replace every value marked PLACEHOLDER
// with the real address, phone, email and socials before launch.

export type SocialLink = {
  label: string;
  href: string;
};

export type SiteInfo = {
  name: string;
  tagline: string;
  city: string;
  address: {
    street: string;
    postalCode: string;
    city: string;
    country: string;
  };
  phone: string;
  /** Phone formatted for tel: links (no spaces). */
  phoneHref: string;
  email: string;
  socials: SocialLink[];
  coordinates: { lat: number; lng: number };
};

export const siteInfo: SiteInfo = {
  name: "LØV",
  tagline: "Matcha, slow mornings, Maastricht.",
  city: "Maastricht",
  address: {
    street: "Wolfstraat 12", // PLACEHOLDER
    postalCode: "6211 GN", // PLACEHOLDER
    city: "Maastricht",
    country: "Netherlands",
  },
  phone: "+31 43 123 4567", // PLACEHOLDER
  phoneHref: "+31431234567", // PLACEHOLDER
  email: "hello@lovcafe.nl", // PLACEHOLDER
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/lovcafe.maastricht" }, // PLACEHOLDER
  ],
  coordinates: { lat: 50.8484, lng: 5.6947 }, // PLACEHOLDER — central Maastricht
};

export function formatAddress(info: SiteInfo = siteInfo): string {
  const { street, postalCode, city } = info.address;
  return `${street}, ${postalCode} ${city}`;
}

/** Google Maps embed URL (no API key needed) for the v1 iframe map. */
export function mapEmbedUrl(info: SiteInfo = siteInfo): string {
  const query = encodeURIComponent(`${info.name} ${formatAddress(info)}, ${info.address.country}`);
  return `https://www.google.com/maps?q=${query}&output=embed`;
}

export function mapLinkUrl(info: SiteInfo = siteInfo): string {
  const query = encodeURIComponent(`${formatAddress(info)}, ${info.address.country}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
