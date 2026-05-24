import travelGuidesData from "@/content/travel-guides.json";

export type GuideIconKey = "compass" | "mountain" | "waves" | "heart" | "users";

export type GuideSection = {
  title: string;
  body: string;
};

export type GuideFaq = {
  question: string;
  answer: string;
};

export type TravelGuide = {
  slug: string;
  category: string;
  title: string;
  description: string;
  image: string;
  accent: string;
  iconKey: GuideIconKey;
  summary: string;
  bestTime: string;
  idealLength: string;
  goodFor: string;
  highlights: string[];
  sections: GuideSection[];
  tips: string[];
  faqs: GuideFaq[];
  relatedJourneySlug: string;
  ctaTitle: string;
  ctaText: string;
};

export const travelGuides: TravelGuide[] = travelGuidesData as TravelGuide[];

export function getGuideBySlug(slug: string) {
  return travelGuides.find((guide) => guide.slug === slug);
}

export function getGuideSlugs() {
  return travelGuides.map((guide) => guide.slug);
}
