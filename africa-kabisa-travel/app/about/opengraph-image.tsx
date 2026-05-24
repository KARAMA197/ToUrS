import { createOgImageResponse, ogContentType, ogSize } from "@/app/og-card";
import { brandPagesContent } from "@/brand-pages-content";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  const aboutContent = brandPagesContent.about;

  return createOgImageResponse({
    eyebrow: aboutContent.eyebrow,
    title: aboutContent.title,
    description: aboutContent.description,
    accent: "How we plan trips",
    chips: ["Route-first advice", "Budget clarity", "Practical support"],
  });
}
