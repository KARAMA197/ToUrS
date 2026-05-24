import { createOgImageResponse, ogContentType, ogSize } from "@/app/og-card";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return createOgImageResponse({
    eyebrow: "Journeys",
    title: "Sample Tanzania journeys you can make your own.",
    description:
      "Explore route ideas for safari, Kilimanjaro, and Zanzibar trips, then shape the journey around your dates, pace, and budget.",
    accent: "Journey ideas",
    chips: ["Safari routes", "Kilimanjaro climbs", "Zanzibar escapes"],
  });
}
