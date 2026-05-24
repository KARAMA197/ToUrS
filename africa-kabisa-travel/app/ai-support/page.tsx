import type { Metadata } from "next";
import AISupportExperience from "@/components/AISupportExperience";
import {
  getAISupportQuickPrompts,
  getGuideSupportContext,
  getInitialAISupportMessage,
} from "@/lib/ai-support";
import { siteConfig } from "@/lib/site";

type AISupportPageProps = {
  searchParams: Promise<{
    guide?: string | string[];
  }>;
};

export const metadata: Metadata = {
  title: "AI Trip Planning Support",
  description:
    "Get instant AI help with Tanzania travel guides, route ideas, trip timing, and planning direction.",
  alternates: {
    canonical: "/ai-support",
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: `AI Trip Planning Support | ${siteConfig.name}`,
    description:
      "Get instant AI help with Tanzania travel guides, route ideas, trip timing, and planning direction.",
    url: "/ai-support",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `AI trip planning support from ${siteConfig.name}`,
      },
    ],
  },
};

export default async function AISupportPage({
  searchParams,
}: AISupportPageProps) {
  const resolvedSearchParams = await searchParams;
  const guideParam = Array.isArray(resolvedSearchParams.guide)
    ? resolvedSearchParams.guide[0]
    : resolvedSearchParams.guide;

  const { guide, relatedJourney } = getGuideSupportContext(guideParam);
  const activeGuide = guide ?? null;

  return (
    <main className="bg-[linear-gradient(180deg,rgba(250,246,238,0.92),rgba(244,237,224,0.82))] pb-24 pt-4">
      <AISupportExperience
        guide={
          activeGuide
            ? {
                slug: activeGuide.slug,
                category: activeGuide.category,
                title: activeGuide.title,
                summary: activeGuide.summary,
                bestTime: activeGuide.bestTime,
                idealLength: activeGuide.idealLength,
                goodFor: activeGuide.goodFor,
                highlights: activeGuide.highlights,
              }
            : null
        }
        initialMessage={getInitialAISupportMessage(activeGuide)}
        quickPrompts={getAISupportQuickPrompts(activeGuide, relatedJourney?.title)}
        relatedJourneyTitle={relatedJourney?.title}
        isConfigured={Boolean(process.env.OPENAI_API_KEY)}
      />
    </main>
  );
}
