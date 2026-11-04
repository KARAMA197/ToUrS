import { WHATSAPP_NUMBER } from "@/lib/contact";
import { siteConfig } from "@/lib/site";

const publicProfileLinks = [
  {
    label: "Google Business Profile",
    href: process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_URL ?? "",
  },
  {
    label: "Tripadvisor",
    href: process.env.NEXT_PUBLIC_TRIPADVISOR_URL ?? "",
  },
  {
    label: "Instagram",
    href:
      process.env.NEXT_PUBLIC_INSTAGRAM_URL ??
      "https://www.instagram.com/brilliantexploresafaris/",
  },
  {
    label: "Facebook",
    href: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "",
  },
  {
    label: "TikTok",
    href:
      process.env.NEXT_PUBLIC_TIKTOK_URL ??
      "https://www.tiktok.com/@brilliantexploresafari",
  },
].filter((link) => Boolean(link.href));

export const businessConfig = {
  name: siteConfig.name,
  phoneE164: `+${WHATSAPP_NUMBER}`,
  phoneDisplay: "+255 676 882 297",
  publicEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  country: "Tanzania",
  baseLabel: "Tanzania-based planning team",
  responseTime: "Within 24 hours",
  serviceAreas: [
    "Serengeti safari",
    "Ngorongoro",
    "Tarangire",
    "Kilimanjaro",
    "Zanzibar",
  ],
  publicProfileLinks,
};

export function buildMailtoUrl(subject?: string, body?: string) {
  if (!businessConfig.publicEmail) {
    return "";
  }

  const params = new URLSearchParams();

  if (subject) {
    params.set("subject", subject);
  }

  if (body) {
    params.set("body", body);
  }

  const queryString = params.toString();

  return queryString
    ? `mailto:${businessConfig.publicEmail}?${queryString}`
    : `mailto:${businessConfig.publicEmail}`;
}

export function getPublicProfileLinks() {
  return businessConfig.publicProfileLinks;
}

export function getBusinessSchema() {
  const sameAs = getPublicProfileLinks().map((link) => link.href);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TravelAgency",
        "@id": `${siteConfig.url}#business`,
        name: businessConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        image: new URL(siteConfig.ogImage, siteConfig.url).toString(),
        telephone: businessConfig.phoneE164,
        email: businessConfig.publicEmail || undefined,
        areaServed: businessConfig.serviceAreas.map((area) => ({
          "@type": "Place",
          name: area,
        })),
        address: {
          "@type": "PostalAddress",
          addressCountry: "TZ",
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer support",
            telephone: businessConfig.phoneE164,
            email: businessConfig.publicEmail || undefined,
            areaServed: "TZ",
            availableLanguage: ["English"],
            url: `${siteConfig.url}/contact`,
          },
        ],
        knowsAbout: [
          "Tanzania safari planning",
          "Kilimanjaro trip planning",
          "Zanzibar holiday planning",
          "Private Tanzania itineraries",
        ],
        priceRange: "$$ - $$$$",
        sameAs: sameAs.length ? sameAs : undefined,
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        publisher: {
          "@id": `${siteConfig.url}#business`,
        },
      },
    ],
  };
}
