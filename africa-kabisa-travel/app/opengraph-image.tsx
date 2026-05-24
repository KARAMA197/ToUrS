import { createOgImageResponse, ogContentType, ogSize } from "@/app/og-card";
import { siteConfig } from "@/lib/site";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return createOgImageResponse({
    eyebrow: siteConfig.name,
    title: "Tanzania safaris, Kilimanjaro trips, and Zanzibar holidays.",
    description:
      "Private Tanzania trip planning shaped around your dates, pace, budget, and the kind of journey you actually want.",
    accent: "Private trip planning",
    chips: ["Safari", "Kilimanjaro", "Zanzibar"],
  });
}
