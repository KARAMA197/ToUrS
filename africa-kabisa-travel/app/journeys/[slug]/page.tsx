import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  CalendarRange,
  CheckCircle2,
  Compass,
  Mountain,
  Sparkles,
  Waves,
} from "lucide-react";
import {
  getAccommodationBySlug,
  isJourneyRecommendedForStay,
} from "@/accommodations-data";
import BrandLogo from "@/components/BrandLogo";
import TrackedLink from "@/components/TrackedLink";
import {
  applyJourneyToTripPlan,
  buildTripPlanHref,
  parseRouteIndex,
  parseTripPlanParam,
} from "@/lib/trip-plan";
import {
  getJourneyAddOnSuggestions,
  getJourneyBySlug,
  getJourneySlugs,
  getRelatedJourneys,
} from "@/journeys-data";
import { siteConfig } from "@/lib/site";

const iconMap = {
  compass: Compass,
  mountain: Mountain,
  waves: Waves,
};

const moodMap = {
  compass: {
    label: "Classic safari rhythm",
    description:
      "Built for travelers who want strong wildlife viewing with a route that still feels calm and easy to follow.",
  },
  mountain: {
    label: "High-altitude adventure",
    description:
      "A more active Tanzania journey shaped around challenge, climb support, and a steady mountain pace.",
  },
  waves: {
    label: "Soft coastal finish",
    description:
      "A slower route style with room to recover, rest, and enjoy Zanzibar at an easy pace.",
  },
};

type JourneyDetailPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    plan?: string | string[];
    routeIndex?: string | string[];
    stay?: string | string[];
  }>;
};

function getSearchParamValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export function generateStaticParams() {
  return getJourneySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: JourneyDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const journey = getJourneyBySlug(slug);

  if (!journey) {
    return {
      title: `Journey not found | ${siteConfig.name}`,
    };
  }

  return {
    title: `${journey.title} | ${siteConfig.name}`,
    description: journey.description,
    alternates: {
      canonical: `/journeys/${journey.slug}`,
    },
    openGraph: {
      title: `${journey.title} | ${siteConfig.name}`,
      description: journey.description,
      url: `/journeys/${journey.slug}`,
      images: [
        {
          url: journey.image,
          width: 1200,
          height: 630,
          alt: journey.title,
        },
      ],
    },
  };
}

export default async function JourneyDetailPage({
  params,
  searchParams,
}: JourneyDetailPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const journey = getJourneyBySlug(slug);
  const plan = parseTripPlanParam(getSearchParamValue(resolvedSearchParams.plan));
  const routeIndex = parseRouteIndex(
    getSearchParamValue(resolvedSearchParams.routeIndex)
  );
  const selectedStay = getAccommodationBySlug(
    getSearchParamValue(resolvedSearchParams.stay)
  );

  if (!journey) {
    notFound();
  }

  const Icon = iconMap[journey.iconKey];
  const routeMood = moodMap[journey.iconKey];
  const hasPlanContext = plan.length > 0 || routeIndex !== null;
  const nextPlanWithJourney = hasPlanContext
    ? applyJourneyToTripPlan(plan, routeIndex, journey.slug)
    : plan;
  const activeRouteIndex = hasPlanContext
    ? routeIndex !== null && routeIndex < nextPlanWithJourney.length
      ? routeIndex
      : nextPlanWithJourney.length - 1
    : null;
  const selectedPlanRoute =
    activeRouteIndex !== null && activeRouteIndex < nextPlanWithJourney.length
      ? nextPlanWithJourney[activeRouteIndex]
      : undefined;
  const selectedPlanStays =
    selectedPlanRoute?.staySlugs
      .map((staySlug) => getAccommodationBySlug(staySlug))
      .filter((stay) => Boolean(stay)) ?? [];
  const stayFitWarnings = hasPlanContext
    ? selectedPlanStays.filter((stay) => !isJourneyRecommendedForStay(stay!, journey))
    : selectedStay && !isJourneyRecommendedForStay(selectedStay, journey)
      ? [selectedStay]
      : [];
  const inquiryHref = hasPlanContext
    ? buildTripPlanHref("/custom-itinerary", nextPlanWithJourney)
    : selectedStay
      ? `/custom-itinerary?journey=${journey.slug}&stay=${selectedStay.slug}`
      : `/custom-itinerary?journey=${journey.slug}`;
  const secondaryHref = hasPlanContext
    ? buildTripPlanHref("/accommodation", nextPlanWithJourney, {
        routeIndex: activeRouteIndex,
      })
    : selectedStay
      ? `/journeys?stay=${selectedStay.slug}`
      : `/accommodation?journey=${journey.slug}`;
  const secondaryLabel = hasPlanContext
    ? "Preview stays for this route"
    : selectedStay
      ? "See more route ideas"
      : "Choose a stay for this route";
  const primaryLabel = hasPlanContext
    ? "Use this route in my plan"
    : selectedStay
      ? "Add this route to my stay"
      : `Ask about ${journey.title}`;

  const quickFacts = [
    {
      label: "Length",
      value: journey.duration,
      icon: CalendarRange,
    },
    {
      label: "Price guide",
      value: journey.price,
      icon: Sparkles,
    },
    {
      label: "Pace",
      value: journey.pace,
      icon: Icon,
    },
    {
      label: "Stay style",
      value: journey.stayStyle,
      icon: BedDouble,
    },
  ];

  const conversionNotes = [
    "Reply within 24 hours",
    "Private trip planning",
    "No pressure first chat",
  ];
  const nextStepItems = hasPlanContext
    ? [
        "We keep this route inside your trip plan and review how it fits the rest of the journey.",
        "We look at your dates, route order, and attached stays before suggesting any route changes.",
        "We come back with a clearer next direction so the whole trip still feels smooth.",
      ]
    : selectedStay
      ? [
          `We review how ${journey.title} and ${selectedStay.title} fit together in one trip flow.`,
          "We look at your dates, comfort level, and whether the route or stay should be adjusted first.",
          "We come back with a clearer route direction and the strongest next step for the whole plan.",
        ]
      : [
          "We look at your dates, group size, and the type of Tanzania trip you want.",
          "We check whether this sample route needs a different pace, stay level, or trip length for you.",
          "We reply with a clearer route direction before anything is pushed into a booking step.",
        ];
  const replyChecklist = [
    "Your travel dates or rough travel window",
    "How many people are traveling",
    "Your comfort level or budget range",
    hasPlanContext
      ? "Any parts of the route or attached stays you already know you want to change"
      : selectedStay
        ? `Whether ${selectedStay.title} should stay in the plan as it is or be swapped later`
        : "Whether you want safari only or a bigger trip that also includes Kilimanjaro or Zanzibar",
  ];
  const priceGuideNotes = [
    "The sample price guide is there to help compare route level before a final quote is prepared.",
    "Season, trip length, group size, and stay level are some of the biggest price drivers.",
    selectedStay
      ? `${selectedStay.title} will also affect the final comfort level and route cost once both choices are reviewed together.`
      : "Once we know your dates and priorities, we can guide you toward the stay level that fits this route best.",
  ];
  const relatedJourneys = getRelatedJourneys(journey.slug);
  const addOnSuggestions = getJourneyAddOnSuggestions(journey.slug);

  return (
    <main className="pb-24">
      <section className="relative isolate overflow-hidden px-6 pb-16 pt-10">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(196,150,85,0.18),transparent_36%),linear-gradient(180deg,rgba(250,246,238,0.92),rgba(244,237,224,0.78))]" />
        <div className="absolute inset-y-10 left-1/2 -z-10 hidden h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[rgba(16,37,28,0.08)] blur-3xl lg:block" />

        <div className="mx-auto max-w-7xl">
          <Link
            href="/#featured-packages"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--forest)] transition hover:text-[var(--gold)]"
          >
            <ArrowLeft size={16} />
            Back to trip ideas
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full border border-[rgba(16,37,28,0.1)] bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--gold)] shadow-[0_18px_40px_-28px_rgba(8,18,15,0.4)]">
                <Icon size={16} />
                {journey.subtitle}
              </div>

              <h1 className="font-display mt-6 max-w-4xl text-4xl text-[var(--forest)] sm:text-5xl xl:text-6xl">
                {journey.title}
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-[color:rgba(19,32,24,0.74)] sm:text-lg">
                {journey.overview}
              </p>

              {hasPlanContext && (
                <div className="mt-6 rounded-[28px] border border-[var(--border)] bg-white/82 p-5 shadow-[0_24px_60px_-38px_rgba(8,18,15,0.28)] backdrop-blur">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                    Trip builder route {activeRouteIndex! + 1}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                    {selectedPlanStays.length > 0
                      ? `${selectedPlanStays.length} stay${selectedPlanStays.length === 1 ? " is" : "s are"} already attached to this part of the trip. If you use this route, those stays will stay connected to it.`
                      : "No stays are attached yet. If this route feels right, you can keep it and preview stays for this part of the trip next."}
                  </p>
                  {stayFitWarnings.length > 0 && (
                    <p className="mt-3 rounded-[20px] border border-[rgba(196,150,85,0.28)] bg-[rgba(196,150,85,0.12)] px-4 py-3 text-sm leading-7 text-[color:rgba(19,32,24,0.78)]">
                      {stayFitWarnings.length === 1
                        ? `${stayFitWarnings[0]!.title} is not one of the usual stay matches for this route. We would normally guide you toward a route closer to that stay.`
                        : "Some attached stays are not the usual match for this route. We would normally guide you toward a route that sits closer to those stays."}
                    </p>
                  )}
                  {selectedPlanStays.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {selectedPlanStays.map((stay) => (
                        <span
                          key={stay!.slug}
                          className="rounded-full border border-[rgba(16,37,28,0.1)] bg-[var(--sand)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--forest)]"
                        >
                          {stay!.title}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {!hasPlanContext && selectedStay && (
                <div className="mt-6 rounded-[28px] border border-[var(--border)] bg-white/82 p-5 shadow-[0_24px_60px_-38px_rgba(8,18,15,0.28)] backdrop-blur">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                    Selected stay
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-semibold text-[var(--forest)]">
                      {selectedStay.title}
                    </h2>
                    <span className="rounded-full border border-[rgba(16,37,28,0.1)] bg-[var(--sand)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--forest)]">
                      {selectedStay.categoryLabel}
                    </span>
                    <span className="rounded-full border border-[rgba(16,37,28,0.1)] bg-[var(--sand)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--forest)]">
                      {selectedStay.priceTier}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                    You are previewing this route for your chosen stay. If it fits well, continue and we will carry both selections back into one request.
                  </p>
                  {stayFitWarnings.length > 0 && (
                    <p className="mt-3 rounded-[20px] border border-[rgba(196,150,85,0.28)] bg-[rgba(196,150,85,0.12)] px-4 py-3 text-sm leading-7 text-[color:rgba(19,32,24,0.78)]">
                      {selectedStay!.title} is not one of the usual stay matches for this route. We can still discuss it, but we would normally guide you toward a route closer to this stay.
                    </p>
                  )}
                </div>
              )}

              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {quickFacts.map((fact) => {
                  const FactIcon = fact.icon;

                  return (
                    <div
                      key={fact.label}
                      className="rounded-[24px] border border-[var(--border)] bg-white/78 p-5 shadow-[0_24px_60px_-38px_rgba(8,18,15,0.45)] backdrop-blur"
                    >
                      <div className="flex items-center gap-3 text-[var(--gold)]">
                        <FactIcon size={18} />
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:rgba(19,32,24,0.58)]">
                          {fact.label}
                        </p>
                      </div>
                      <p className="mt-4 text-lg font-semibold text-[var(--forest)]">
                        {fact.value}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {journey.highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="rounded-full bg-[var(--sand)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--forest)]"
                  >
                    {highlight}
                  </span>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <TrackedLink
                  href={inquiryHref}
                  eventName="journey_inquiry_click"
                  eventParams={{
                    section: "journey_hero",
                    journey_slug: journey.slug,
                    stay_slug: selectedStay?.slug,
                    route_index: activeRouteIndex,
                  }}
                  className="inline-flex items-center gap-3 rounded-full bg-[var(--forest)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--gold)] hover:text-[var(--forest)]"
                >
                  {primaryLabel}
                  <ArrowRight size={16} />
                </TrackedLink>
                <TrackedLink
                  href={secondaryHref}
                  eventName="cta_click"
                  eventParams={{
                    section: "journey_hero",
                    action: hasPlanContext
                      ? "preview_stays_for_route"
                      : selectedStay
                        ? "browse_more_routes"
                        : "choose_stay_for_route",
                    journey_slug: journey.slug,
                    stay_slug: selectedStay?.slug,
                    route_index: activeRouteIndex,
                  }}
                  className="inline-flex items-center gap-3 rounded-full border border-[rgba(16,37,28,0.14)] bg-white/75 px-6 py-3 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
                >
                  {secondaryLabel}
                </TrackedLink>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {conversionNotes.map((note) => (
                  <span
                    key={note}
                    className="rounded-full border border-[rgba(16,37,28,0.12)] bg-white/78 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[color:rgba(19,32,24,0.62)]"
                  >
                    {note}
                  </span>
                ))}
              </div>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[color:rgba(19,32,24,0.7)]">
                Tell us your dates, group size, and budget, and we will shape this journey around you.
              </p>
            </div>

            <div className="relative min-h-[420px] overflow-hidden rounded-[36px] border border-[rgba(255,255,255,0.45)] bg-[rgba(255,255,255,0.2)] shadow-[0_36px_90px_-52px_rgba(8,18,15,0.55)]">
              <Image
                src={journey.image}
                alt={journey.title}
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/12 via-black/22 to-black/68" />

              <div className="absolute inset-x-6 top-6 flex items-start justify-between gap-4">
                <div className="rounded-[22px] border border-white/20 bg-white/88 px-3 py-2 shadow-[0_18px_40px_-28px_rgba(8,18,15,0.45)] backdrop-blur">
                  <BrandLogo tone="dark" size="sm" />
                </div>
                <div className="inline-flex rounded-full border border-white/16 bg-black/26 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--gold-soft)] backdrop-blur">
                  Private route example
                </div>
              </div>

              <div className="absolute inset-x-6 bottom-[10.5rem] rounded-[26px] border border-white/16 bg-black/22 p-5 text-white backdrop-blur-md">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/75">
                  {routeMood.label}
                </p>
                <p className="mt-3 max-w-md text-sm leading-7 text-white/82">
                  {routeMood.description}
                </p>
              </div>

              <div className="absolute inset-x-6 bottom-6 rounded-[28px] border border-white/16 bg-black/28 p-6 text-white backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/75">
                  Sample route
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {journey.route.map((stop, index) => (
                    <span
                      key={`${stop}-${index}`}
                      className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em]"
                    >
                      {stop}
                    </span>
                  ))}
                </div>
                <p className="mt-5 text-sm leading-7 text-white/82">
                  {journey.season}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.88fr_1.12fr]">
          <article className="rounded-[32px] border border-[var(--border)] bg-[rgba(255,255,255,0.82)] p-8 shadow-[0_26px_70px_-48px_rgba(8,18,15,0.45)] backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              Good for
            </p>
            <h2 className="font-display mt-4 text-3xl text-[var(--forest)]">
              Who this trip suits best
            </h2>
            <p className="mt-4 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
              We use this as a starting point, then shape the route around your pace, your budget, and the way you want to travel.
            </p>

            <div className="mt-8 space-y-4">
              {journey.goodFor.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="mt-1 shrink-0 text-[var(--gold)]" />
                  <p className="text-sm leading-7 text-[var(--forest)]">{item}</p>
                </div>
              ))}
            </div>
          </article>

          <div className="grid gap-6 md:grid-cols-2">
            <article className="rounded-[32px] border border-[var(--border)] bg-[rgba(255,255,255,0.8)] p-8 shadow-[0_26px_70px_-48px_rgba(8,18,15,0.45)] backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                Transport and transfers
              </p>
              <h2 className="font-display mt-4 text-3xl text-[var(--forest)]">
                How the route moves
              </h2>
              <p className="mt-4 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                {journey.transportStyle}
              </p>
              <p className="mt-4 text-sm leading-7 text-[color:rgba(19,32,24,0.68)]">
                {journey.transferPlan}
              </p>
            </article>

            <article className="rounded-[32px] border border-[var(--border)] bg-[rgba(255,255,255,0.8)] p-8 shadow-[0_26px_70px_-48px_rgba(8,18,15,0.45)] backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                Stay logic
              </p>
              <h2 className="font-display mt-4 text-3xl text-[var(--forest)]">
                Where the route usually stays
              </h2>
              <p className="mt-4 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                {journey.accommodationLogic}
              </p>
              <p className="mt-4 text-sm leading-7 text-[color:rgba(19,32,24,0.68)]">
                Main stay style: {journey.stayStyle}.
              </p>
            </article>

            <article className="rounded-[32px] border border-[var(--border)] bg-[rgba(255,255,255,0.8)] p-8 shadow-[0_26px_70px_-48px_rgba(8,18,15,0.45)] backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                Support level
              </p>
              <h2 className="font-display mt-4 text-3xl text-[var(--forest)]">
                Help around the trip
              </h2>
              <p className="mt-4 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                {journey.supportLevel}
              </p>
            </article>

            <article className="rounded-[32px] border border-[var(--border)] bg-[rgba(16,37,28,0.96)] p-8 text-white shadow-[0_26px_70px_-48px_rgba(8,18,15,0.55)]">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                Best timing and length
              </p>
              <h2 className="font-display mt-4 text-3xl text-white">
                When this route works best
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/82">{journey.bestTime}</p>
              <p className="mt-4 text-sm leading-7 text-white/72">{journey.bestTripLength}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="px-6 py-6">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
          <article className="rounded-[32px] border border-[var(--border)] bg-[rgba(255,255,255,0.82)] p-8 shadow-[0_26px_70px_-48px_rgba(8,18,15,0.45)] backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              Included in this sample
            </p>
            <h2 className="font-display mt-4 text-3xl text-[var(--forest)]">
              What is usually covered
            </h2>

            <div className="mt-8 space-y-4">
              {journey.inclusions.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="mt-1 shrink-0 text-[var(--gold)]" />
                  <p className="text-sm leading-7 text-[var(--forest)]">{item}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[32px] border border-[var(--border)] bg-[rgba(255,250,243,0.84)] p-8 shadow-[0_26px_70px_-48px_rgba(8,18,15,0.45)] backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              Usually outside the trip
            </p>
            <h2 className="font-display mt-4 text-3xl text-[var(--forest)]">
              What you should still plan for
            </h2>

            <div className="mt-8 space-y-4">
              {journey.exclusions.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="mt-1 shrink-0 text-[var(--gold)]" />
                  <p className="text-sm leading-7 text-[var(--forest)]">{item}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[32px] border border-[var(--border)] bg-[rgba(16,37,28,0.96)] p-8 text-white shadow-[0_26px_70px_-48px_rgba(8,18,15,0.55)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              Planning notes
            </p>
            <h2 className="font-display mt-4 text-3xl text-white">
              Helpful things to know
            </h2>

            <div className="mt-8 space-y-5">
              {journey.planningNotes.map((note) => (
                <div key={note} className="border-b border-white/10 pb-5 last:border-b-0 last:pb-0">
                  <p className="text-sm leading-7 text-white/82">{note}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="px-6 py-6">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <article className="rounded-[32px] border border-[var(--border)] bg-white p-8 shadow-[0_26px_70px_-48px_rgba(8,18,15,0.45)] backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              What happens after you ask
            </p>
            <h2 className="font-display mt-4 text-4xl text-[var(--forest)]">
              The next step should make the route clearer.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-8 text-[color:rgba(19,32,24,0.72)]">
              You should not need to commit before the route, pace, and comfort direction make
              sense for your trip.
            </p>

            <div className="mt-8 space-y-4">
              {nextStepItems.map((item, index) => (
                <div
                  key={item}
                  className="flex gap-4 rounded-[24px] border border-[var(--border)] bg-[rgba(255,250,243,0.72)] p-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--forest)] text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-7 text-[color:rgba(19,32,24,0.76)]">{item}</p>
                </div>
              ))}
            </div>
          </article>

          <div className="grid gap-6">
            <article className="rounded-[32px] border border-[var(--border)] bg-[rgba(255,255,255,0.8)] p-8 shadow-[0_26px_70px_-48px_rgba(8,18,15,0.45)] backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                What we usually confirm first
              </p>
              <h2 className="font-display mt-4 text-3xl text-[var(--forest)]">
                The basics that help us reply well
              </h2>

              <div className="mt-8 space-y-4">
                {replyChecklist.map((item) => (
                  <div key={item} className="flex gap-3">
                    <CheckCircle2 size={18} className="mt-1 shrink-0 text-[var(--gold)]" />
                    <p className="text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">{item}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[32px] bg-[rgba(16,37,28,0.96)] p-8 text-white shadow-[0_26px_70px_-48px_rgba(8,18,15,0.55)]">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                About the sample price guide
              </p>
              <h2 className="font-display mt-4 text-3xl text-white">
                Use it as direction, not a final quote
              </h2>

              <div className="mt-8 space-y-4">
                {priceGuideNotes.map((item) => (
                  <div key={item} className="flex gap-3">
                    <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--gold-soft)]" />
                    <p className="text-sm leading-7 text-white/82">{item}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="px-6 py-6">
        <div className="mx-auto max-w-7xl rounded-[34px] border border-[var(--border)] bg-[rgba(255,250,243,0.88)] p-8 shadow-[0_30px_80px_-52px_rgba(8,18,15,0.4)] backdrop-blur">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                Keep comparing
              </p>
              <h2 className="font-display mt-4 text-4xl text-[var(--forest)]">
                Related journeys and add-on ideas for this route.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[color:rgba(19,32,24,0.72)]">
                Many travelers compare one or two route directions before they settle the final
                plan. These ideas can help you see what often pairs well with {journey.title}.
              </p>
            </div>

            <div className="rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[0_22px_60px_-46px_rgba(8,18,15,0.28)]">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                Best next move
              </p>
              <p className="mt-4 text-sm leading-8 text-[color:rgba(19,32,24,0.72)]">
                If the route feels close but not final yet, compare the related journey ideas
                first. If the route already feels right, the add-on ideas below can help you shape
                a more complete Tanzania trip.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <TrackedLink
                  href={inquiryHref}
                  eventName="journey_inquiry_click"
                  eventParams={{
                    section: "journey_recommendations",
                    journey_slug: journey.slug,
                    stay_slug: selectedStay?.slug,
                    route_index: activeRouteIndex,
                  }}
                  className="inline-flex items-center gap-3 rounded-full bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--forest-soft)]"
                >
                  {primaryLabel}
                  <ArrowRight size={16} />
                </TrackedLink>
                <TrackedLink
                  href="/journeys"
                  eventName="cta_click"
                  eventParams={{
                    section: "journey_recommendations",
                    action: "browse_all_journeys",
                    journey_slug: journey.slug,
                  }}
                  className="inline-flex items-center gap-3 rounded-full border border-[rgba(16,37,28,0.14)] bg-white px-5 py-3 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
                >
                  Browse all journeys
                  <ArrowRight size={16} />
                </TrackedLink>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-10 xl:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--gold)]">
                Related journeys
              </p>
              <div className="mt-5 grid gap-4">
                {relatedJourneys.map((relatedJourney) => (
                  <article
                    key={relatedJourney.slug}
                    className="rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[0_20px_50px_-42px_rgba(8,18,15,0.28)]"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
                      {relatedJourney.subtitle}
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold text-[var(--forest)]">
                      {relatedJourney.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                      {relatedJourney.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-[var(--sand)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--forest)]">
                        {relatedJourney.duration}
                      </span>
                      <span className="rounded-full bg-[var(--sand)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--forest)]">
                        {relatedJourney.price}
                      </span>
                    </div>
                    <TrackedLink
                      href={`/journeys/${relatedJourney.slug}`}
                      eventName="journey_select"
                      eventParams={{
                        section: "journey_related_journeys",
                        journey_slug: journey.slug,
                        related_journey_slug: relatedJourney.slug,
                      }}
                      className="mt-6 inline-flex items-center gap-3 text-sm font-semibold text-[var(--forest)] transition hover:text-[var(--gold)]"
                    >
                      View this journey
                      <ArrowRight size={16} />
                    </TrackedLink>
                  </article>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--gold)]">
                Recommended add-ons
              </p>
              <div className="mt-5 grid gap-4">
                {addOnSuggestions.map(({ destination, reason }) => (
                  <article
                    key={destination.slug}
                    className="rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[0_20px_50px_-42px_rgba(8,18,15,0.28)]"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
                      {destination.category}
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold text-[var(--forest)]">
                      {destination.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                      {reason}
                    </p>
                    <p className="mt-4 text-sm leading-7 text-[color:rgba(19,32,24,0.66)]">
                      {destination.summary}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-[var(--sand)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--forest)]">
                        {destination.region}
                      </span>
                      <span className="rounded-full bg-[var(--sand)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--forest)]">
                        {destination.idealStay}
                      </span>
                    </div>
                    <TrackedLink
                      href={`/destinations/${destination.slug}`}
                      eventName="destination_select"
                      eventParams={{
                        section: "journey_add_ons",
                        journey_slug: journey.slug,
                        destination_slug: destination.slug,
                      }}
                      className="mt-6 inline-flex items-center gap-3 text-sm font-semibold text-[var(--forest)] transition hover:text-[var(--gold)]"
                    >
                      Explore this add-on
                      <ArrowRight size={16} />
                    </TrackedLink>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              Sample day by day
            </p>
            <h2 className="font-display mt-4 text-4xl text-[var(--forest)]">
              A clear look at how the trip can flow
            </h2>
            <p className="mt-5 text-base leading-8 text-[color:rgba(19,32,24,0.72)]">
              This is a simple sample outline. We can shorten it, extend it, or combine it with another part of Tanzania if you want a bigger journey.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {journey.sampleDays.map((day) => (
              <article
                key={`${day.day}-${day.title}`}
                className="rounded-[30px] border border-[var(--border)] bg-[rgba(255,255,255,0.82)] p-7 shadow-[0_26px_70px_-48px_rgba(8,18,15,0.45)] backdrop-blur"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                  {day.day}
                </p>
                <h3 className="font-display mt-4 text-2xl text-[var(--forest)]">{day.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                  {day.description}
                </p>
              </article>
            ))}

            <article className="rounded-[30px] border border-[var(--border)] bg-[linear-gradient(160deg,rgba(196,150,85,0.18),rgba(16,37,28,0.92))] p-8 text-white shadow-[0_26px_70px_-48px_rgba(8,18,15,0.55)]">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/72">
                Next step
              </p>
              <h3 className="font-display mt-4 text-3xl text-white">
                Want this trip shaped around your own travel plan?
              </h3>
              <p className="mt-5 text-sm leading-7 text-white/82">
                {hasPlanContext
                  ? "If this route feels right, use it in your trip plan and then preview stays for this part of the journey."
                  : selectedStay
                    ? `Tell us your dates, group size, and what you want to adjust. We will shape ${journey.title} with ${selectedStay.title} into one trip that fits you better.`
                    : "Tell us your dates, group size, budget level, and the feel you want. We will turn this sample into a trip that fits you better."}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <TrackedLink
                  href={inquiryHref}
                  eventName="journey_inquiry_click"
                  eventParams={{
                    section: "journey_final_cta",
                    journey_slug: journey.slug,
                    stay_slug: selectedStay?.slug,
                    route_index: activeRouteIndex,
                  }}
                  className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--forest)] transition hover:bg-[var(--sand)]"
                >
                  {hasPlanContext
                    ? "Use this route in my plan"
                    : selectedStay
                      ? "Add this route to my stay"
                      : "Start my custom plan"}
                  <ArrowRight size={16} />
                </TrackedLink>
                <TrackedLink
                  href={secondaryHref}
                  eventName="cta_click"
                  eventParams={{
                    section: "journey_final_cta",
                    action: hasPlanContext
                      ? "preview_stays_for_route"
                      : selectedStay
                        ? "browse_more_routes"
                        : "choose_stay_for_route",
                    journey_slug: journey.slug,
                    stay_slug: selectedStay?.slug,
                    route_index: activeRouteIndex,
                  }}
                  className="inline-flex items-center gap-3 rounded-full border border-white/18 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/34 hover:bg-white/8"
                >
                  {secondaryLabel}
                </TrackedLink>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}

