import { createOgImageResponse, ogContentType, ogSize } from "@/app/og-card";
import { brandPagesContent } from "@/brand-pages-content";

export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  const contactContent = brandPagesContent.contact;

  return createOgImageResponse({
    eyebrow: contactContent.eyebrow,
    title: contactContent.title,
    description: contactContent.description,
    accent: "Talk to us",
    chips: ["WhatsApp", "Trip form", "Clear first reply"],
  });
}
