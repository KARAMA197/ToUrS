export type TravelMoment = {
  slug: string;
  title: string;
  location: string;
  description: string;
  bestFor: string;
  routeFit: string;
  image: string;
  alt: string;
};

export const travelMoments = [
  {
    slug: "balloon-over-the-plains",
    title: "Balloon over the plains",
    location: "Serengeti sunrise",
    description:
      "A quiet start above the savannah, with the day opening slowly before the safari tracks begin.",
    bestFor: "Honeymoon, photography, and once-in-a-lifetime safari starts",
    routeFit: "Works best inside a Serengeti-focused northern circuit.",
    image: "/images/travel-moments/balloon-safari.jpeg",
    alt: "Hot air balloon floating over Tanzania safari plains",
  },
  {
    slug: "cheetah-sighting",
    title: "A cheetah sighting",
    location: "Open grassland safari",
    description:
      "Those still, breath-held minutes when the guide slows the vehicle and the whole group leans in.",
    bestFor: "Wildlife lovers, photographers, and classic safari travelers",
    routeFit: "Fits routes with enough time in open Serengeti or similar grassland areas.",
    image: "/images/travel-moments/cheetah-sighting.jpeg",
    alt: "Cheetah standing in Tanzania grassland",
  },
  {
    slug: "elephant-on-the-track",
    title: "Elephant on the track",
    location: "Bush road moments",
    description:
      "Simple route choices can create the best encounters: the right road, the right hour, and room to wait.",
    bestFor: "First-time safari travelers and families who want close wildlife moments",
    routeFit: "Works well when the route avoids rushing between parks.",
    image: "/images/travel-moments/elephant-track.jpeg",
    alt: "Elephant walking beside a Tanzania safari track",
  },
  {
    slug: "wildlife-crossing",
    title: "Wildlife crossing",
    location: "Safari road flow",
    description:
      "Some of the best safari memories happen between destinations, when the journey itself becomes the sighting.",
    bestFor: "Travelers who want the whole journey to feel alive, not only game drives",
    routeFit: "Best in routes with scenic transfers and flexible guide time.",
    image: "/images/travel-moments/wildlife-road-crossing.jpeg",
    alt: "Wildlife crossing a road in Tanzania",
  },
  {
    slug: "waterfall-cool-down",
    title: "Waterfall cool down",
    location: "Materuni foothills",
    description:
      "A green pause near Kilimanjaro, ideal when the route needs a softer local day between bigger adventures.",
    bestFor: "Kilimanjaro travelers, families, and guests who want a gentle local day",
    routeFit: "Fits before or after Kilimanjaro, or as a softer Arusha-area add-on.",
    image: "/images/travel-moments/materuni-waterfall.jpeg",
    alt: "Waterfall in the green Materuni foothills",
  },
  {
    slug: "stone-town-walk",
    title: "Stone Town walk",
    location: "Zanzibar culture",
    description:
      "A slower day through alleys, doors, markets, and stories before the coast becomes all ocean and sand.",
    bestFor: "Culture lovers, couples, and travelers who want Zanzibar beyond the beach",
    routeFit: "Works well as a one-night Stone Town stop before the coast.",
    image: "/images/travel-moments/stone-town-walk.jpeg",
    alt: "Travelers walking through Stone Town in Zanzibar",
  },
  {
    slug: "clear-water-afternoon",
    title: "Clear-water afternoon",
    location: "Zanzibar ocean",
    description:
      "Beach time works best when it is planned as recovery, not an afterthought squeezed onto the end.",
    bestFor: "Honeymoons, post-safari recovery, and relaxed beach endings",
    routeFit: "Best after safari or Kilimanjaro when the trip needs a slower finish.",
    image: "/images/travel-moments/zanzibar-water-moment.jpeg",
    alt: "Traveler enjoying clear blue water in Zanzibar",
  },
  {
    slug: "stay-close-to-the-sea",
    title: "Stay close to the sea",
    location: "Zanzibar beach lodge",
    description:
      "The right stay changes the pace of the trip, especially when the final days are meant to feel easy.",
    bestFor: "Couples, families, and travelers who care about the final stay feeling restful",
    routeFit: "Fits as the closing chapter of a safari, climb, or combined Tanzania route.",
    image: "/images/travel-moments/zanzibar-beach-lodge.jpeg",
    alt: "Beach lodge beside turquoise water in Zanzibar",
  },
] as const satisfies readonly TravelMoment[];

export function getTravelMomentBySlug(value?: string | null) {
  if (!value) {
    return undefined;
  }

  return travelMoments.find((moment) => moment.slug === value);
}

export function parseTravelMomentSlugsParam(
  momentsValue?: string | null,
  legacyMomentValue?: string | null
) {
  const slugs = [
    ...(momentsValue?.split(",") ?? []),
    ...(legacyMomentValue ? [legacyMomentValue] : []),
  ]
    .map((slug) => slug.trim())
    .filter(Boolean);

  return Array.from(
    new Set(
      slugs.filter((slug) => travelMoments.some((moment) => moment.slug === slug))
    )
  );
}

export function getTravelMomentsBySlugs(slugs: string[]): TravelMoment[] {
  return slugs.reduce<TravelMoment[]>((moments, slug) => {
    const moment = getTravelMomentBySlug(slug);

    if (moment) {
      moments.push(moment);
    }

    return moments;
  }, []);
}

export function stringifyTravelMomentSlugs(slugs: string[]) {
  return Array.from(new Set(slugs.map((slug) => slug.trim()).filter(Boolean))).join(",");
}

export function buildTravelMomentExtras(slugs: string[]) {
  const moments = stringifyTravelMomentSlugs(slugs);

  return moments ? { moments } : {};
}

export function buildTravelMomentPlanHref(moment: TravelMoment) {
  const params = new URLSearchParams({
    moments: moment.slug,
    source: "travel_moment_start_planning",
  });

  return `/custom-itinerary?${params.toString()}`;
}
