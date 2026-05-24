import { createOgImageResponse, ogContentType, ogSize } from "@/app/og-card";
import { getGuideBySlug } from "@/guides-data";

export const size = ogSize;
export const contentType = ogContentType;

type GuideOgImageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Image({ params }: GuideOgImageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return createOgImageResponse({
      eyebrow: "Travel guide",
      title: "Tanzania planning guide",
      description:
        "Read a practical Tanzania guide and use it to shape a clearer safari, Kilimanjaro, Zanzibar, or combined trip.",
      accent: "Guide page",
      chips: ["Planning help", "Route ideas", "Trip guidance"],
    });
  }

  return createOgImageResponse({
    eyebrow: guide.category,
    title: guide.title,
    description: guide.description,
    accent: guide.accent,
    chips: [guide.bestTime, guide.idealLength, guide.highlights[0] ?? guide.category],
  });
}
