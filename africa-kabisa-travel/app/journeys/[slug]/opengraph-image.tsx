import { createOgImageResponse, ogContentType, ogSize } from "@/app/og-card";
import { getJourneyBySlug } from "@/journeys-data";

export const size = ogSize;
export const contentType = ogContentType;

type JourneyOgImageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Image({ params }: JourneyOgImageProps) {
  const { slug } = await params;
  const journey = getJourneyBySlug(slug);

  if (!journey) {
    return createOgImageResponse({
      eyebrow: "Journey",
      title: "Sample Tanzania journey",
      description:
        "Explore a Tanzania journey idea and shape the route around your dates, pace, and travel style.",
      accent: "Journey page",
      chips: ["Safari", "Kilimanjaro", "Zanzibar"],
    });
  }

  return createOgImageResponse({
    eyebrow: journey.subtitle,
    title: journey.title,
    description: journey.description,
    accent: journey.accent,
    chips: [journey.duration, journey.price, journey.pace],
  });
}
