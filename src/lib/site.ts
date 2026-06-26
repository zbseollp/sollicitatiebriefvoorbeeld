export const SITE = {
  name: "Sollicitatiebriefvoorbeeld.nl",
  domain: "sollicitatiebriefvoorbeeld.nl",
  url: "https://www.sollicitatiebriefvoorbeeld.nl",
  defaultLocale: "nl-NL",
  tagline: "Voorbeelden, opbouw en tips voor je sollicitatiebrief en CV.",
  description:
    "Sollicitatiebriefvoorbeeld.nl verzamelt voorbeeldbrieven per beroep, CV-templates en praktische tips voor het sollicitatiegesprek. Klaar om aan te passen naar jouw situatie.",
  author: "Sollicitatiebriefvoorbeeld Redactie",
  contactEmail: "info@sollicitatiebriefvoorbeeld.nl",
  social: {},
  navigation: [
    { label: "Home", href: "/" },
    { label: "Brieven", href: "/blog/" },
    { label: "Over", href: "/over-ons/" },
    { label: "Contact", href: "/contact/" },
  ],
  categories: [
    { slug: "brief-per-beroep", name: "Brief per beroep" },
    { slug: "sollicitatiebrief", name: "Sollicitatiebrief" },
    { slug: "cv-voorbeelden", name: "CV-voorbeelden" },
    { slug: "sollicitatiegesprek", name: "Sollicitatiegesprek" },
    { slug: "sollicitatietips", name: "Sollicitatietips" },
  ],
};

export type CategorySlug = (typeof SITE.categories)[number]["slug"];

export function categoryNameToSlug(name: string): string | null {
  const match = SITE.categories.find((c) => c.name === name);
  return match?.slug ?? null;
}

export function categorySlugToName(slug: string): string | null {
  return SITE.categories.find((c) => c.slug === slug)?.name ?? null;
}
