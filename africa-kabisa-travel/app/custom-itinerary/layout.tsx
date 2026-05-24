import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Custom Tanzania Itinerary",
  description:
    "Send your dates, budget, and travel style to get a custom Tanzania itinerary for safari, Kilimanjaro, Zanzibar, or a combined trip.",
  alternates: {
    canonical: "/custom-itinerary",
  },
  openGraph: {
    title: "Custom Tanzania Itinerary",
    description:
      "Get a custom Tanzania itinerary for safari, Kilimanjaro, Zanzibar, or a combined trip.",
    url: "/custom-itinerary",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `Custom Tanzania itinerary planning with ${siteConfig.name}`,
      },
    ],
  },
};

export default function CustomItineraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
