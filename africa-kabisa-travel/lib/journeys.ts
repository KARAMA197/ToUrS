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
  sampleDays: JourneyDay[];
};

export const journeys: Journey[] = [
  {
    slug: "classic-northern-circuit",
    title: "Classic Northern Circuit",
    subtitle: "Safari",
    description:
      "See some of Tanzania's best parks with a private guide, amazing wildlife, and a pace that feels easy.",
    duration: "7 days",
    price: "from $2,450",
    image: "/images/serengeti.png",
    accent: "Great for a first safari",
    iconKey: "compass",
    highlights: ["Private game drives", "Good wildlife viewing", "Easy pace"],
    overview:
      "This is a strong first safari for travelers who want famous parks, great wildlife, and a route that feels simple to follow. It gives you a good mix of variety and comfort without trying to do too much at once.",
    route: ["Arusha", "Tarangire", "Ngorongoro", "Central Serengeti", "Arusha"],
    goodFor: [
      "First-time safari travelers",
      "Couples and small private groups",
      "Travelers who want a balanced pace",
      "Guests who want strong wildlife viewing"
    ],
    sampleFeatures: [
      "Private guide and safari vehicle",
      "Carefully paced park routing",
      "Lodge or camp options by budget",
      "Help before and during the trip"
    ],
    planningNotes: [
      "Easy to extend with Zanzibar after the safari",
      "Works well for travelers with one week in Tanzania",
      "Can be shaped for luxury or mid-range travel"
    ],
    season: "Good most of the year, with strong wildlife viewing in dry months",
    pace: "Comfortable and balanced",
    stayStyle: "Safari lodges or tented camps",
    sampleDays: [
      {
        day: "Day 1",
        title: "Arrive in Arusha",
        description:
          "Arrive, rest, and get ready for the safari. This first night gives you time to settle in before the parks begin."
      },
      {
        day: "Day 2",
        title: "Drive to Tarangire",
        description:
          "Start with elephants, baobabs, and classic game viewing in Tarangire, then continue to your lodge for the night."
      },
      {
        day: "Day 3",
        title: "Ngorongoro area",
        description:
          "Travel toward the highlands and prepare for a full day in one of Tanzania's most famous wildlife areas."
      },
      {
        day: "Day 4",
        title: "Ngorongoro to Serengeti",
        description:
          "Enjoy wildlife viewing and continue on toward the Serengeti for the next part of the journey."
      },
      {
        day: "Day 5",
        title: "Full day in Serengeti",
        description:
          "Spend the day on game drives across the plains, looking for big cats and the wildlife the park is known for."
      },
      {
        day: "Day 6",
        title: "Final safari day",
        description:
          "Enjoy one more strong safari day, with time to slow down and take in the best moments of the trip."
      },
      {
        day: "Day 7",
        title: "Return and depart",
        description:
          "Travel back toward Arusha for your onward flight or the next part of your Tanzania journey."
      }
    ]
  },
  {
    slug: "machame-kilimanjaro-ascent",
    title: "Machame Kilimanjaro Ascent",
    subtitle: "Climb",
    description:
      "Climb Kilimanjaro with a strong team, a clear route, and good time to adjust to the altitude.",
    duration: "6 days",
    price: "from $1,950",
    image: "/images/kilimanjaro.png",
    accent: "Great for active travelers",
    iconKey: "mountain",
    highlights: ["Strong mountain team", "Time to adjust", "Private support"],
    overview:
      "This trip is built for travelers who want the challenge of Kilimanjaro with a route that gives good scenery, a clear climb rhythm, and steady support from the crew. It is active, rewarding, and best for guests who are ready for a real adventure.",
    route: ["Moshi", "Machame Gate", "Shira", "Barranco", "Barafu", "Summit", "Moshi"],
    goodFor: [
      "Active travelers",
      "Guests who want a famous African climb",
      "Travelers who like mountain adventure",
      "Private climbers or small groups"
    ],
    sampleFeatures: [
      "Experienced mountain support team",
      "Camp-based climb structure",
      "Altitude-focused daily rhythm",
      "Pre-climb and post-climb planning help"
    ],
    planningNotes: [
      "Can be followed by safari or Zanzibar recovery time",
      "Best for guests prepared for long walking days",
      "Works well for travelers who want a strong challenge"
    ],
    season: "Best in drier months with clearer mountain conditions",
    pace: "Demanding but steady",
    stayStyle: "Mountain camps during the climb",
    sampleDays: [
      {
        day: "Day 1",
        title: "Moshi briefing",
        description:
          "Arrive, meet the team, and prepare your gear before the climb begins."
      },
      {
        day: "Day 2",
        title: "Machame Gate to first camp",
        description:
          "Start the climb through forest paths and settle into the mountain rhythm with your crew."
      },
      {
        day: "Day 3",
        title: "Climb higher through changing views",
        description:
          "Gain altitude, enjoy wider views, and continue building strength for the summit push."
      },
      {
        day: "Day 4",
        title: "Barranco and acclimatization",
        description:
          "Move through one of the best-known sections of the route and continue adjusting to the mountain."
      },
      {
        day: "Day 5",
        title: "Final camp before summit",
        description:
          "Take a shorter day, rest, and get ready for the late-night summit attempt."
      },
      {
        day: "Day 6",
        title: "Summit and descend",
        description:
          "Push for the summit, celebrate the achievement, and begin the descent with the support of the team."
      }
    ]
  },
  {
    slug: "zanzibar-recovery-escape",
    title: "Zanzibar Recovery Escape",
    subtitle: "Beach stay",
    description:
      "Slow down by the sea, enjoy warm beaches, and add simple island fun if you want.",
    duration: "5 days",
    price: "from $1,200",
    image: "/images/zanzibar.png",
    accent: "Great after safari or for a honeymoon",
    iconKey: "waves",
    highlights: ["Beachfront stays", "Slow island pace", "Easy add-on"],
    overview:
      "This is a soft, easy trip for travelers who want to rest, reset, and enjoy the coast. It works especially well after safari or Kilimanjaro, and it can be kept very simple or made more special for a honeymoon feel.",
    route: ["Stone Town", "East Coast or North Coast", "Zanzibar Airport"],
    goodFor: [
      "Post-safari relaxation",
      "Honeymoons and couples",
      "Travelers who want beach time without pressure",
      "Guests who want a short coastal finish"
    ],
    sampleFeatures: [
      "Beachfront or boutique stay options",
      "Easy transfer planning",
      "Optional island activities",
      "Flexible pace with room to rest"
    ],
    planningNotes: [
      "Very easy to add after safari or Kilimanjaro",
      "Can be shaped for quiet beach time or light activity",
      "Works well for honeymoon-style travel"
    ],
    season: "Good most of the year, depending on rain and beach conditions",
    pace: "Slow and easy",
    stayStyle: "Boutique beach resort or relaxed coastal stay",
    sampleDays: [
      {
        day: "Day 1",
        title: "Arrive in Zanzibar",
        description:
          "Arrive on the island, transfer to your stay, and settle into a slower pace."
      },
      {
        day: "Day 2",
        title: "Beach day",
        description:
          "Take a full day to swim, rest, and enjoy the beach with no pressure to rush anywhere."
      },
      {
        day: "Day 3",
        title: "Optional island activity",
        description:
          "Add something light like Stone Town, a spice visit, or a short boat trip if you want more variety."
      },
      {
        day: "Day 4",
        title: "More time to relax",
        description:
          "Enjoy another slow day by the sea with time for food, sun, and quiet moments."
      },
      {
        day: "Day 5",
        title: "Departure",
        description:
          "Transfer to the airport or continue to your onward travel feeling rested and refreshed."
      }
    ]
  }
];

export function getJourneyBySlug(slug: string) {
  return journeys.find((journey) => journey.slug === slug);
}

export function getJourneySlugs() {
  return journeys.map((journey) => journey.slug);
}
