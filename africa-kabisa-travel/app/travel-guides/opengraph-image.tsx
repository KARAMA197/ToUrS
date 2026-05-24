import { createOgImageResponse, ogContentType, ogSize } from "@/app/og-card";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return createOgImageResponse({
    eyebrow: "Travel guides",
    title: "Practical Tanzania guides for travelers who want clear direction.",
    description:
      "Read helpful guides for safari planning, Kilimanjaro climbs, Zanzibar add-ons, honeymoon trips, and family travel.",
    accent: "Guide library",
    chips: ["Safari planning", "Kilimanjaro", "Zanzibar add-ons"],
  });
}
