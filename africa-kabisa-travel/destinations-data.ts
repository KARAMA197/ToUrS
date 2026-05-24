export type DestinationCategory =
  | "Safari"
  | "Mountain"
  | "Coast"
  | "Culture"
  | "Southern safari";

export type Destination = {
  slug: string;
  title: string;
  category: DestinationCategory;
  region: string;
  accent: string;
  image: string;
  summary: string;
  description: string;
  bestTime: string;
  idealStay: string;
  goodFor: string;
  highlights: string[];
  whyVisit: string[];
  planningNotes: string[];
  combinesWith: string[];
  relatedJourneySlug?: string;
};

export const destinations: Destination[] = [
  {
    slug: "serengeti",
    title: "Serengeti",
    category: "Safari",
    region: "Northern Tanzania",
    accent: "Classic safari icon",
    image: "/images/tour-gallery/serengeti-lion-pride.jpeg",
    summary:
      "The Serengeti is one of Tanzania’s best-known safari landscapes, with big wildlife moments and wide open views that feel cinematic from the first drive.",
    description:
      "Travelers choose the Serengeti when they want a strong safari core. It works well for first-time wildlife trips, private safari routes, and bigger journeys that combine parks with Zanzibar or other parts of Tanzania.",
    bestTime:
      "Works well in different seasons, with the exact area shaped around your travel dates and what you most want to see.",
    idealStay: "2 to 4 nights",
    goodFor: "First safari trips, classic wildlife routes, and combined Tanzania journeys",
    highlights: ["Big wildlife", "Classic safari feel", "Private route planning"],
    whyVisit: [
      "It gives the kind of classic safari feel many travelers picture first.",
      "It works well as a main wildlife stop in both shorter and longer northern routes.",
      "It can be shaped around migration interest, quieter safari pacing, or a bigger multi-park journey.",
    ],
    planningNotes: [
      "The best Serengeti area can change with season and route shape.",
      "It often works best when paired with Ngorongoro, Tarangire, or a softer ending in Zanzibar.",
      "Good pacing matters because the park is large and the route can feel rushed if too much is added.",
    ],
    combinesWith: ["Ngorongoro Crater", "Tarangire", "Zanzibar", "Family safari routes"],
    relatedJourneySlug: "classic-northern-circuit",
  },
  {
    slug: "kilimanjaro",
    title: "Kilimanjaro",
    category: "Mountain",
    region: "Northern Tanzania",
    accent: "Tanzania’s mountain goal",
    image: "/images/tour-gallery/kilimanjaro-summit-ridge.jpeg",
    summary:
      "Kilimanjaro is the strongest fit for travelers who want challenge, high-altitude views, and a proud mountain finish as part of their Tanzania trip.",
    description:
      "A Kilimanjaro trip is shaped less by speed and more by route choice, altitude rhythm, and recovery planning. It can stand alone or be paired with safari or Zanzibar once the climb pacing is right.",
    bestTime:
      "Drier periods are often preferred, but the route and support plan should still be matched to your exact dates.",
    idealStay: "6 to 9 days on the mountain, plus pre and post-climb nights",
    goodFor: "Active travelers, summit-focused trips, and mountain plus safari or coast plans",
    highlights: ["Summit goal", "Route choice", "Recovery planning"],
    whyVisit: [
      "It offers one of Tanzania’s most rewarding achievement-based travel experiences.",
      "Different route lengths make it possible to match the climb to your pace and goal.",
      "It combines well with safari or Zanzibar when the post-climb recovery flow is planned well.",
    ],
    planningNotes: [
      "A pre-climb support night usually makes the trip feel smoother.",
      "The route should be chosen by acclimatization and pace, not just the shortest number of days.",
      "Recovery time matters if you want to enjoy the rest of Tanzania after the mountain.",
    ],
    combinesWith: ["Moshi or Arusha support stays", "Zanzibar", "Safari after the climb"],
    relatedJourneySlug: "machame-kilimanjaro-ascent",
  },
  {
    slug: "zanzibar",
    title: "Zanzibar",
    category: "Coast",
    region: "Indian Ocean coast",
    accent: "Easy beach finish",
    image: "/images/tour-gallery/zanzibar-beach-couple.jpeg",
    summary:
      "Zanzibar gives safari and mountain trips a softer finish with warm water, slower pace, and room to rest after the more active part of the journey.",
    description:
      "Some travelers want only beach time. Others want Stone Town plus a coast stay. Zanzibar works best when it is added with the right number of nights and the right pace for the rest of the trip.",
    bestTime:
      "Works through much of the year, with the exact island plan shaped around weather, flights, and the rest of your route.",
    idealStay: "3 to 5 nights",
    goodFor: "Safari plus beach, honeymoon travel, and post-Kilimanjaro recovery",
    highlights: ["Beach time", "Slower pace", "Strong add-on option"],
    whyVisit: [
      "It gives the trip a calmer ending after wildlife or mountain days.",
      "It works well for couples, shorter luxury add-ons, and mixed Tanzania itineraries.",
      "It can be shaped as simple beach time or beach plus cultural time in Stone Town.",
    ],
    planningNotes: [
      "Three to five nights is enough for many travelers.",
      "A beach-only stay and a Stone Town plus beach plan feel quite different, so the route should be chosen on purpose.",
      "It usually works better as the end of the trip rather than the start.",
    ],
    combinesWith: ["Serengeti", "Kilimanjaro", "Stone Town", "Honeymoon routes"],
    relatedJourneySlug: "zanzibar-recovery-escape",
  },
  {
    slug: "ngorongoro-crater",
    title: "Ngorongoro Crater",
    category: "Safari",
    region: "Northern Tanzania",
    accent: "Compact but dramatic safari",
    image: "/images/serengeti.png",
    summary:
      "Ngorongoro Crater is one of Tanzania’s most dramatic safari landscapes and works very well as a shorter but high-impact wildlife stop.",
    description:
      "Many travelers include Ngorongoro because it adds strong scenery and a different safari feel to the wider northern route. It is especially useful when you want variety without adding a very long extra stay.",
    bestTime:
      "Can work well across much of the year when it is placed carefully inside a northern safari route.",
    idealStay: "1 to 2 nights",
    goodFor: "Classic northern routes, shorter safari plans, and wildlife variety",
    highlights: ["Crater landscape", "Wildlife variety", "Easy route pairing"],
    whyVisit: [
      "It gives a striking change of landscape inside the northern circuit.",
      "It works well for travelers who want a strong safari moment without adding many extra days.",
      "It pairs naturally with Serengeti, Tarangire, and Lake Manyara.",
    ],
    planningNotes: [
      "It often feels best as part of a wider northern route rather than a standalone safari.",
      "One well-placed crater day can add a lot of value to a shorter route.",
      "The route should be balanced so the crater is not squeezed in too tightly between long drives.",
    ],
    combinesWith: ["Serengeti", "Tarangire", "Lake Manyara"],
    relatedJourneySlug: "classic-northern-circuit",
  },
  {
    slug: "tarangire",
    title: "Tarangire",
    category: "Safari",
    region: "Northern Tanzania",
    accent: "Elephants and baobabs",
    image: "/images/serengeti.png",
    summary:
      "Tarangire is a strong northern safari stop for travelers who want elephants, baobab scenery, and a quieter rhythm early in the route.",
    description:
      "Tarangire often works well near the start of a safari because it is easy to combine with the rest of the northern circuit and helps the trip settle into a calmer wildlife pace.",
    bestTime:
      "Often strongest in drier periods, though route shape still matters more than one fixed rule.",
    idealStay: "1 to 2 nights",
    goodFor: "Northern safari beginnings, families, and travelers who like a calmer first safari rhythm",
    highlights: ["Elephants", "Baobabs", "Calmer safari feel"],
    whyVisit: [
      "It adds a different visual feel to the northern circuit.",
      "It works well as an easier opening safari stop before larger parks.",
      "It often suits families and private groups who do not want the route to feel too intense too early.",
    ],
    planningNotes: [
      "Tarangire usually fits best as part of a wider northern circuit.",
      "It can help reduce route fatigue when used as a calmer early park stop.",
      "It is often more useful when paired with Serengeti or Ngorongoro than when treated as the main safari on its own.",
    ],
    combinesWith: ["Ngorongoro Crater", "Serengeti", "Lake Manyara"],
    relatedJourneySlug: "classic-northern-circuit",
  },
  {
    slug: "lake-manyara",
    title: "Lake Manyara",
    category: "Safari",
    region: "Northern Tanzania",
    accent: "Shorter safari variety",
    image: "/images/serengeti.png",
    summary:
      "Lake Manyara is a lighter northern safari stop that can add variety, scenery, and easier pacing inside a broader route.",
    description:
      "It is often used as part of a multi-park northern plan rather than the main safari focus. That makes it useful for travelers who want a richer route without needing every stop to be very long.",
    bestTime:
      "Can be used flexibly in different seasons when the wider northern route is balanced well.",
    idealStay: "1 night or a day visit",
    goodFor: "Short add-ons, smoother northern pacing, and travelers who want more variety",
    highlights: ["Scenic change", "Compact stop", "Flexible route fit"],
    whyVisit: [
      "It helps break up the northern route with a different landscape and mood.",
      "It works well when you want more variety without adding many extra nights.",
      "It can support a smoother pacing plan in shorter private safaris.",
    ],
    planningNotes: [
      "It usually works best as part of a wider route rather than the main trip focus.",
      "The value comes from balance and variety, not from trying to stay too long there.",
      "It is easiest to use when the route already includes other stronger safari anchors.",
    ],
    combinesWith: ["Tarangire", "Ngorongoro Crater", "Arusha"],
    relatedJourneySlug: "classic-northern-circuit",
  },
  {
    slug: "arusha-national-park",
    title: "Arusha National Park",
    category: "Safari",
    region: "Near Arusha",
    accent: "Light park near town",
    image: "/images/tour-gallery/materuni-coffee.jpeg",
    summary:
      "Arusha National Park is an easier park option near the start or end of a trip, especially when you want lighter wildlife time, forest scenery, or a softer transition day.",
    description:
      "It is not usually the main safari centerpiece, but it can be a very useful support stop in the right route. It works well for shorter travel windows, softer first-day pacing, or a nearby park experience before moving on.",
    bestTime:
      "Flexible across much of the year when used as a lighter route addition.",
    idealStay: "Day trip or 1 night nearby",
    goodFor: "Shorter trips, softer first-day safari, and mixed routes near Arusha",
    highlights: ["Near Arusha", "Light safari", "Good support stop"],
    whyVisit: [
      "It is easy to reach and can help a trip start or end more gently.",
      "It suits travelers who want a lighter park experience before the bigger safari sections.",
      "It can work nicely in shorter routes or mixed plans that already include Kilimanjaro or transfers.",
    ],
    planningNotes: [
      "Best used as a support stop, not usually the main safari headline.",
      "It can help with pacing if you arrive late or want an easier first wildlife day.",
      "It works especially well in routes that begin or end near Arusha.",
    ],
    combinesWith: ["Kilimanjaro", "Tarangire", "Northern circuit starts"],
  },
  {
    slug: "nyerere",
    title: "Nyerere",
    category: "Southern safari",
    region: "Southern Tanzania",
    accent: "A different safari direction",
    image: "/images/serengeti.png",
    summary:
      "Nyerere gives travelers a southern Tanzania safari direction that feels different from the northern circuit and can suit people looking for a quieter route idea.",
    description:
      "This is a stronger fit for travelers who already know they want a different safari rhythm or who want to compare northern and southern route character before choosing.",
    bestTime:
      "Usually shaped carefully around season because southern safari flow is more date-sensitive than generic route ideas suggest.",
    idealStay: "2 to 4 nights",
    goodFor: "Repeat safari travelers, quieter route ideas, and southern Tanzania interest",
    highlights: ["Southern safari", "Quieter feel", "Different route character"],
    whyVisit: [
      "It offers a different safari feel from the classic north.",
      "It can suit travelers who want to avoid a more expected route pattern.",
      "It works well when the trip is built specifically around southern Tanzania rather than added casually.",
    ],
    planningNotes: [
      "Southern routes should be shaped carefully around dates and travel flow.",
      "It is often better to commit to a southern safari direction properly than to mix it too heavily with the north.",
      "This kind of route usually benefits from clearer planning before the trip starts.",
    ],
    combinesWith: ["Ruaha", "Fly-in safari planning", "Longer private wildlife trips"],
  },
  {
    slug: "ruaha",
    title: "Ruaha",
    category: "Southern safari",
    region: "Southern Tanzania",
    accent: "Remote safari atmosphere",
    image: "/images/serengeti.png",
    summary:
      "Ruaha is a stronger fit for travelers who want a more remote safari atmosphere and a route that feels farther from the more familiar northern circuit.",
    description:
      "It is best for travelers who already know they want a different safari mood rather than a classic first-time route. It can be a very rewarding choice when the trip is designed around that intention.",
    bestTime:
      "Best matched carefully to season and travel style because the route is more specific than a general northern safari plan.",
    idealStay: "2 to 4 nights",
    goodFor: "Remote safari interest, repeat travelers, and southern route comparison",
    highlights: ["Remote feel", "Southern route", "Wild safari atmosphere"],
    whyVisit: [
      "It gives a more remote safari feel than the standard northern route.",
      "It suits travelers who want something less expected.",
      "It can work very well in a southern Tanzania-focused trip shape.",
    ],
    planningNotes: [
      "Ruaha usually works best when the trip is clearly built around southern Tanzania.",
      "It should be matched to dates and logistics carefully, not added casually.",
      "A strong southern route often needs more planning clarity before it becomes the right choice.",
    ],
    combinesWith: ["Nyerere", "Southern Tanzania planning", "Longer private safari routes"],
  },
  {
    slug: "stone-town",
    title: "Stone Town",
    category: "Culture",
    region: "Zanzibar",
    accent: "History before the beach",
    image: "/images/zanzibar.png",
    summary:
      "Stone Town is a strong cultural stop for travelers who want more than only beach time in Zanzibar and like the idea of adding atmosphere and history to the island part of the trip.",
    description:
      "Some travelers stay only on the beach. Others enjoy one night in Stone Town first so the coast section feels more layered. It works best when added on purpose rather than squeezed in without time.",
    bestTime:
      "Can be added flexibly inside a Zanzibar plan when the rest of the island stay is paced well.",
    idealStay: "1 night, sometimes 2",
    goodFor: "Beach plus culture, honeymoon routes, and travelers who want more texture in Zanzibar",
    highlights: ["History", "Character", "Beach plus culture"],
    whyVisit: [
      "It gives Zanzibar more depth than beach-only travel.",
      "It can make the island part of the trip feel more complete.",
      "It works well for couples and travelers who enjoy place, atmosphere, and a slower first island night.",
    ],
    planningNotes: [
      "Best used as a deliberate part of a Zanzibar stay rather than a rushed add-on.",
      "It often works well before moving to the beach section.",
      "One night is enough for many travelers when the beach part is still the main focus.",
    ],
    combinesWith: ["Zanzibar beach stays", "Honeymoon routes", "Post-safari island plans"],
    relatedJourneySlug: "zanzibar-recovery-escape",
  },
  {
    slug: "materuni",
    title: "Materuni",
    category: "Culture",
    region: "Kilimanjaro foothills",
    accent: "A softer local add-on",
    image: "/images/kilimanjaro.png",
    summary:
      "Materuni is a softer local add-on near Kilimanjaro for travelers who want coffee, waterfalls, and a gentler landscape experience before or after the mountain.",
    description:
      "It works especially well for travelers who want one more layer near Kilimanjaro without turning the trip into a much bigger route. It can be relaxing, scenic, and easy to place in the right mountain plan.",
    bestTime:
      "Can work in different seasons when it is placed around the mountain route sensibly.",
    idealStay: "Half day to 1 night nearby",
    goodFor: "Kilimanjaro support days, softer local add-ons, and cultural landscape interest",
    highlights: ["Waterfall visit", "Coffee experience", "Mountain foothills"],
    whyVisit: [
      "It gives the Kilimanjaro side of the trip a softer local dimension.",
      "It can be a good option before or after the mountain when you want a gentler day.",
      "It adds scenic value without needing a full extra destination shift.",
    ],
    planningNotes: [
      "It is best treated as a lighter support experience, not the headline of the whole trip.",
      "It works naturally around Kilimanjaro or nearby support stays.",
      "Good when you want to slow the trip down a little near the mountain.",
    ],
    combinesWith: ["Kilimanjaro", "Moshi or Arusha stays", "Recovery days"],
    relatedJourneySlug: "machame-kilimanjaro-ascent",
  },
];

export function getDestinationBySlug(slug: string) {
  return destinations.find((destination) => destination.slug === slug);
}

export function getDestinationSlugs() {
  return destinations.map((destination) => destination.slug);
}
