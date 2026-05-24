import accommodationsData from "@/content/accommodations.json";
import type { Journey } from "@/journeys-data";

export type AccommodationCategoryKey = "safari" | "mountain" | "beach";
export type JourneyStayProfileKey = "safari" | "climb" | "beach";

export type Accommodation = {
  slug: string;
  categoryKey: AccommodationCategoryKey;
  categoryLabel: string;
  title: string;
  location: string;
  description: string;
  overview: string;
  image: string;
  accent: string;
  priceTier: string;
  priceGuide: string;
  luxuryLevel: string;
  stayStyle: string;
  boardBasis: string;
  idealFor: string;
  highlights: string[];
  services: string[];
  locationHighlights: string[];
  goodFor: string[];
  planningAdvice: string[];
  planningNote: string;
};

export const accommodations: Accommodation[] = accommodationsData as Accommodation[];

const journeyStayProfileByIcon: Record<Journey["iconKey"], JourneyStayProfileKey> = {
  compass: "safari",
  mountain: "climb",
  waves: "beach",
};

const accommodationJourneyProfiles: Record<string, JourneyStayProfileKey[]> = {
  "central-serengeti-safari-lodge": ["safari"],
  "ngorongoro-rim-retreat": ["safari"],
  "arusha-garden-hotel": ["safari", "climb"],
  "moshi-climb-base-lodge": ["climb"],
  "stone-town-boutique-stay": ["beach"],
  "zanzibar-beach-resort": ["beach"],
};

export function getAccommodationJourneyProfiles(accommodation: Accommodation) {
  return accommodationJourneyProfiles[accommodation.slug] ?? [];
}

export function getAccommodationBySlug(slug: string) {
  return accommodations.find((accommodation) => accommodation.slug === slug);
}

export function getAccommodationsByCategory(categoryKey: AccommodationCategoryKey) {
  return accommodations.filter((accommodation) => accommodation.categoryKey === categoryKey);
}

export function getJourneyStayProfile(
  journey?: Pick<Journey, "iconKey"> | null
) {
  if (!journey) {
    return null;
  }

  return journeyStayProfileByIcon[journey.iconKey];
}

export function isAccommodationRecommendedForJourney(
  accommodation: Accommodation,
  journey?: Pick<Journey, "iconKey"> | null
) {
  const profile = getJourneyStayProfile(journey);

  if (!profile) {
    return true;
  }

  return getAccommodationJourneyProfiles(accommodation).includes(profile);
}

export function isJourneyRecommendedForStay(
  accommodation: Accommodation,
  journey?: Pick<Journey, "iconKey"> | null
) {
  return isAccommodationRecommendedForJourney(accommodation, journey);
}

export function getRecommendedAccommodationsForJourney(
  journey?: Pick<Journey, "iconKey"> | null
) {
  return accommodations.filter((accommodation) =>
    isAccommodationRecommendedForJourney(accommodation, journey)
  );
}

export function getRecommendedAccommodationsByCategory(
  categoryKey: AccommodationCategoryKey,
  journey?: Pick<Journey, "iconKey"> | null
) {
  return getAccommodationsByCategory(categoryKey).filter((accommodation) =>
    isAccommodationRecommendedForJourney(accommodation, journey)
  );
}

export function getAccommodationSlugs() {
  return accommodations.map((accommodation) => accommodation.slug);
}
