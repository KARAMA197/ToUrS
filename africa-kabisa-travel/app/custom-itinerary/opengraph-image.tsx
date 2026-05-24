import { createOgImageResponse, ogContentType, ogSize } from "@/app/og-card";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return createOgImageResponse({
    eyebrow: "Custom itinerary",
    title: "Share your dates, budget, and trip ideas to start your Tanzania plan.",
    description:
      "Tell us what kind of safari, Kilimanjaro, Zanzibar, or combined trip you want, and we will help shape the route clearly.",
    accent: "Start your plan",
    chips: ["Dates", "Budget", "Trip style"],
  });
}
