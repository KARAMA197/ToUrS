import { createOgImageResponse, ogContentType, ogSize } from "@/app/og-card";
import { brandPagesContent } from "@/brand-pages-content";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  const beforeYouBookContent = brandPagesContent.beforeYouBook;

  return createOgImageResponse({
    eyebrow: beforeYouBookContent.eyebrow,
    title: beforeYouBookContent.title,
    description: beforeYouBookContent.description,
    accent: "Book with clarity",
    chips: ["Route guidance", "Price factors", "Clear next step"],
  });
}
