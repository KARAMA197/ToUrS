import type { MetadataRoute } from "next";
import { getAccommodationSlugs } from "@/accommodations-data";
import { getDestinationSlugs } from "@/destinations-data";
import { getGuideSlugs } from "@/guides-data";
import { getJourneySlugs } from "@/journeys-data";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    "",
    "/accommodation",
    "/about",
    "/before-you-book",
    "/contact",
    "/how-we-plan",
    "/know-before-you-go",
    "/destinations",
    "/responsible-travel",
    "/traveler-proof",
    "/journeys",
    "/travel-guides",
    "/custom-itinerary",
  ].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: now,
  }));

  const journeyRoutes = getJourneySlugs().map((slug) => ({
    url: `${siteConfig.url}/journeys/${slug}`,
    lastModified: now,
  }));

  const accommodationRoutes = getAccommodationSlugs().map((slug) => ({
    url: `${siteConfig.url}/accommodation/${slug}`,
    lastModified: now,
  }));

  const destinationRoutes = getDestinationSlugs().map((slug) => ({
    url: `${siteConfig.url}/destinations/${slug}`,
    lastModified: now,
  }));

  const guideRoutes = getGuideSlugs().map((slug) => ({
    url: `${siteConfig.url}/travel-guides/${slug}`,
    lastModified: now,
  }));

  return [
    ...staticRoutes,
    ...journeyRoutes,
    ...accommodationRoutes,
    ...destinationRoutes,
    ...guideRoutes,
  ];
}
