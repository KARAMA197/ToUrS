import {
  destinations,
  type Destination,
} from "@/destinations-data";
import journeysData from "@/content/journeys.json";

export type JourneyIconKey = "compass" | "mountain" | "waves";

export type JourneyDay = {
  day: string;
  title: string;
  description: string;
};

export type Journey = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  price: string;
  image: string;
  accent: string;
  iconKey: JourneyIconKey;
  highlights: string[];
  overview: string;
  route: string[];
  goodFor: string[];
  sampleFeatures: string[];
  planningNotes: string[];
  season: string;
  pace: string;
  stayStyle: string;
  bestTripLength: string;
  bestTime: string;
  transportStyle: string;
  transferPlan: string;
  supportLevel: string;
  accommodationLogic: string;
  inclusions: string[];
  exclusions: string[];
  sampleDays: JourneyDay[];
};

export type JourneyDestinationSuggestion = {
  destination: Destination;
  reason: string;
};

export const journeys: Journey[] = journeysData as Journey[];

const complementaryJourneySlugs: Record<string, string[]> = {
  "classic-northern-circuit": [
    "zanzibar-recovery-escape",
    "machame-kilimanjaro-ascent",
  ],
  "machame-kilimanjaro-ascent": [
    "zanzibar-recovery-escape",
    "classic-northern-circuit",
  ],
  "zanzibar-recovery-escape": [
    "classic-northern-circuit",
    "machame-kilimanjaro-ascent",
  ],
};

const journeyAddOnDestinationMap: Record<
  string,
  Array<{ slug: string; reason: string }>
> = {
  "classic-northern-circuit": [
    {
      slug: "zanzibar",
      reason: "A beach finish is one of the easiest ways to slow the trip down after safari days.",
    },
    {
      slug: "stone-town",
      reason: "Works well if you want a short cultural layer before or after the coast.",
    },
    {
      slug: "materuni",
      reason: "A softer local add-on if you want scenery and a lighter foothill stop around the wider trip.",
    },
  ],
  "machame-kilimanjaro-ascent": [
    {
      slug: "materuni",
      reason: "A gentle local day near the mountain can help the climb feel more rounded before or after the ascent.",
    },
    {
      slug: "zanzibar",
      reason: "One of the strongest recovery add-ons after the mountain because it slows the whole trip down.",
    },
    {
      slug: "arusha-national-park",
      reason: "A lighter wildlife stop near the start or end if you want a soft safari layer without a full longer route.",
    },
  ],
  "zanzibar-recovery-escape": [
    {
      slug: "stone-town",
      reason: "Adds history and atmosphere if you want more than beach time alone.",
    },
    {
      slug: "serengeti",
      reason: "A safari first and coast finish is one of the strongest Tanzania combinations.",
    },
    {
      slug: "kilimanjaro",
      reason: "Works as a calmer recovery finish if the mountain is the active first part of the trip.",
    },
  ],
};

export function getJourneyBySlug(slug: string) {
  return journeys.find((journey) => journey.slug === slug);
}

export function getJourneySlugs() {
  return journeys.map((journey) => journey.slug);
}

export function getRelatedJourneys(slug: string, limit = 2) {
  const preferredSlugs = complementaryJourneySlugs[slug] ?? [];
  const preferred = preferredSlugs
    .map((journeySlug) => getJourneyBySlug(journeySlug))
    .filter((journey): journey is Journey => Boolean(journey));

  if (preferred.length >= limit) {
    return preferred.slice(0, limit);
  }

  const remaining = journeys.filter(
    (journey) =>
      journey.slug !== slug && !preferred.some((item) => item.slug === journey.slug)
  );

  return [...preferred, ...remaining].slice(0, limit);
}

export function getJourneyAddOnSuggestions(
  slug: string,
  limit = 3
): JourneyDestinationSuggestion[] {
  return (journeyAddOnDestinationMap[slug] ?? [])
    .map((item) => {
      const destination = destinations.find(
        (destinationItem) => destinationItem.slug === item.slug
      );

      if (!destination) {
        return null;
      }

      return {
        destination,
        reason: item.reason,
      };
    })
    .filter(
      (item): item is JourneyDestinationSuggestion => Boolean(item)
    )
    .slice(0, limit);
}
