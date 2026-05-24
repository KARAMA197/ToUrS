import { getDestinationBySlug, type Destination } from "@/destinations-data";

type TripStyleDefinition = {
  value: string;
  label: string;
  shortLabel: string;
  description: string;
  planningNote: string;
  destinationSlugs: string[];
  relatedHref: string;
  relatedLabel: string;
};

export const tripStyleOptions = [
  {
    value: "private-safari",
    label: "Private safari journeys",
    shortLabel: "Safari trip",
    description:
      "A wildlife-first Tanzania route shaped around strong park flow, the right number of nights, and a safari pace that feels clear from the start.",
    planningNote:
      "Safari routes often work best when the core wildlife stops flow naturally instead of trying to cover every park too fast.",
    destinationSlugs: [
      "serengeti",
      "ngorongoro-crater",
      "tarangire",
      "lake-manyara",
      "arusha-national-park",
    ],
    relatedHref: "/journeys/classic-northern-circuit",
    relatedLabel: "See a matching safari route",
  },
  {
    value: "honeymoon-romantic",
    label: "Honeymoon and romantic trips",
    shortLabel: "Honeymoon trip",
    description:
      "A couples-focused Tanzania journey built around privacy, atmosphere, and a softer flow between safari, coast, and memorable scenic stops.",
    planningNote:
      "Honeymoon routes often feel strongest with a classic safari core first, then a calmer finish in Zanzibar or Stone Town.",
    destinationSlugs: [
      "zanzibar",
      "stone-town",
      "serengeti",
      "ngorongoro-crater",
      "tarangire",
    ],
    relatedHref: "/travel-guides/tanzania-honeymoon-guide",
    relatedLabel: "See a matching honeymoon guide",
  },
  {
    value: "family-tanzania",
    label: "Family Tanzania travel",
    shortLabel: "Family trip",
    description:
      "A Tanzania plan shaped for smoother pacing, mixed ages, and route choices that keep the trip easier to enjoy together.",
    planningNote:
      "Family routes usually feel best when park changes are not too rushed and the stay plan keeps long travel days manageable.",
    destinationSlugs: [
      "tarangire",
      "lake-manyara",
      "arusha-national-park",
      "serengeti",
      "zanzibar",
    ],
    relatedHref: "/travel-guides/family-safari-guide",
    relatedLabel: "See a matching family guide",
  },
  {
    value: "kilimanjaro-climb",
    label: "Kilimanjaro climbs",
    shortLabel: "Kilimanjaro climb",
    description:
      "A mountain-focused Tanzania trip shaped around route choice, acclimatization, recovery time, and what should happen before and after the climb.",
    planningNote:
      "Mountain trips usually need pre-climb support nights, route pacing, and a softer recovery idea after the summit.",
    destinationSlugs: [
      "kilimanjaro",
      "materuni",
      "arusha-national-park",
      "zanzibar",
    ],
    relatedHref: "/journeys/machame-kilimanjaro-ascent",
    relatedLabel: "See a matching climb route",
  },
  {
    value: "zanzibar-holiday",
    label: "Zanzibar holidays",
    shortLabel: "Zanzibar holiday",
    description:
      "A coast-first escape for travelers who want beach time, a slower pace, and the option to add Stone Town for a more layered island stay.",
    planningNote:
      "Beach trips can stay simple, or you can pair Stone Town with the coast for a more layered island rhythm.",
    destinationSlugs: ["zanzibar", "stone-town"],
    relatedHref: "/journeys/zanzibar-recovery-escape",
    relatedLabel: "See a matching Zanzibar route",
  },
  {
    value: "combined-tanzania",
    label: "Combined Tanzania trips",
    shortLabel: "Combined trip",
    description:
      "A multi-part Tanzania journey that blends safari, mountain, or beach time into one route so the whole trip feels connected.",
    planningNote:
      "Combined trips work best when safari, mountain, and beach are shaped as one smooth route instead of separate pieces.",
    destinationSlugs: [
      "serengeti",
      "ngorongoro-crater",
      "kilimanjaro",
      "zanzibar",
      "stone-town",
    ],
    relatedHref: "/travel-guides/tanzania-safari-planning-guide",
    relatedLabel: "See a matching planning guide",
  },
] as const satisfies readonly TripStyleDefinition[];

export type TripStyleValue = (typeof tripStyleOptions)[number]["value"];

export function isTripStyleValue(value: string): value is TripStyleValue {
  return tripStyleOptions.some((style) => style.value === value);
}

export function getTripStyleByValue(value?: string | null) {
  if (!value) {
    return undefined;
  }

  return tripStyleOptions.find((style) => style.value === value);
}

export function getTripStyleDestinations(value?: string | null): Destination[] {
  const tripStyle = getTripStyleByValue(value);

  if (!tripStyle) {
    return [];
  }

  return tripStyle.destinationSlugs
    .map((destinationSlug) => getDestinationBySlug(destinationSlug))
    .filter((destination): destination is Destination => Boolean(destination));
}
