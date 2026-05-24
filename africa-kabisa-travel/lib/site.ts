export const siteConfig = {
  name: "Brilliant Explore Safaris",
  shortName: "Brilliant Explore",
  description:
    "Exciting Tanzania safaris, Kilimanjaro trips, and Zanzibar holidays planned with local care and clear support.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ogImage: "/images/serengeti.png",
};

export function getSiteUrl() {
  return new URL(siteConfig.url);
}
