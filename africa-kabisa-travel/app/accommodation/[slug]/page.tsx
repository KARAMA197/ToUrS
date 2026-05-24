import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BedDouble,
  CheckCircle2,
  Compass,
  MapPinned,
  Mountain,
  ShieldCheck,
  Sparkles,
  Waves,
} from "lucide-react";
import TrackedLink from "@/components/TrackedLink";
import {
  getAccommodationBySlug,
  getAccommodationSlugs,
  isAccommodationRecommendedForJourney,
  type AccommodationCategoryKey,
} from "@/accommodations-data";
import { getJourneyBySlug } from "@/journeys-data";
import {
  addStayToTripPlan,
  buildTripPlanHref,
  parseRouteIndex,
  parseTripPlanParam,
} from "@/lib/trip-plan";
import { siteConfig } from "@/lib/site";

const categoryIcons = {
  safari: Compass,
  mountain: Mountain,
  beach: Waves,
} satisfies Record<AccommodationCategoryKey, typeof Compass>;

type AccommodationDetailPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    journey?: string | string[];
    plan?: string | string[];
    routeIndex?: string | string[];
  }>;
};

function getSearchParamValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export async function generateStaticParams() {
  return getAccommodationSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: AccommodationDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const stay = getAccommodationBySlug(slug);

  if (!stay) {
    return {
      title: "Accommodation not found",
    };
  }

  return {
    title: `${stay.title} | Tanzania Accommodation Planning`,
    description: stay.overview,
    alternates: {
      canonical: `/accommodation/${stay.slug}`,
    },
    openGraph: {
      title: `${stay.title} | Tanzania Accommodation Planning`,
      description: stay.overview,
      url: `/accommodation/${stay.slug}`,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: stay.title,
        },
      ],
    },
  };
}

export default async function AccommodationDetailPage({
  params,
  searchParams,
}: AccommodationDetailPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const stay = getAccommodationBySlug(slug);
  const plan = parseTripPlanParam(getSearchParamValue(resolvedSearchParams.plan));
  const routeIndex = parseRouteIndex(
    getSearchParamValue(resolvedSearchParams.routeIndex)
  );
  const selectedPlanRoute =
    routeIndex !== null && routeIndex < plan.length ? plan[routeIndex] : undefined;
  const selectedJourney = getJourneyBySlug(
    selectedPlanRoute?.journeySlug ?? getSearchParamValue(resolvedSearchParams.journey)
  );

  if (!stay) {
    notFound();
  }

  const CategoryIcon = categoryIcons[stay.categoryKey];
  const hasPlanContext = plan.length > 0 || routeIndex !== null;
  const isRecommendedForSelectedJourney = selectedJourney
    ? isAccommodationRecommendedForJourney(stay, selectedJourney)
    : true;
  const nextPlanWithStay = hasPlanContext ? addStayToTripPlan(plan, routeIndex, stay.slug) : plan;
  const inquiryHref = hasPlanContext
    ? buildTripPlanHref("/custom-itinerary", nextPlanWithStay)
    : selectedJourney
      ? `/custom-itinerary?journey=${selectedJourney.slug}&stay=${stay.slug}`
      : `/custom-itinerary?stay=${stay.slug}`;
  const backToStaysHref = hasPlanContext
    ? buildTripPlanHref("/accommodation", plan, { routeIndex })
    : selectedJourney
      ? `/accommodation?journey=${selectedJourney.slug}`
      : "/accommodation";
  const primaryLabel = hasPlanContext
    ? `Add this stay to route ${routeIndex! + 1}`
    : selectedJourney
      ? "Add this stay to my route"
      : "Ask about this stay";
  const secondaryLabel = hasPlanContext
    ? "Back to route stays"
    : selectedJourney
      ? "Back to route stays"
      : "Back to all stays";
  const nextStepItems = hasPlanContext
    ? [
        "We attach this stay to the selected route inside your trip plan.",
        "We review whether the stay location and comfort level still fit the full trip flow.",
        "We come back with the clearest next adjustment if anything should change before you continue.",
      ]
    : selectedJourney
      ? [
          `We review how ${stay.title} fits the pace and travel flow of ${selectedJourney.title}.`,
          "We check whether the stay level, board basis, and location match the rest of the route well.",
          "We reply with the clearest next step so the route and stay feel like one smooth plan.",
        ]
      : [
          "We look at when you want to travel and what kind of Tanzania trip you are trying to build.",
          "We check whether this stay is the right fit for safari, Kilimanjaro, Zanzibar, or a combined route.",
          "We guide you toward the route and stay direction that make the most sense together.",
        ];
  const replyChecklist = [
    "Your travel dates or rough travel window",
    "Whether this stay is for safari, Kilimanjaro, Zanzibar, or a mixed trip",
    "Your comfort level or budget range",
    selectedJourney
      ? `Any changes you already expect around the ${selectedJourney.title} route`
      : "Whether you already have a route idea or still need help choosing one",
  ];
  const priceGuideNotes = [
    "The price guide shows the general level of the stay, not a live hotel rate.",
    "Season, occupancy, stay style, and how this stay fits the full trip can all affect the final quote.",
    selectedJourney
      ? `Once we review this stay with ${selectedJourney.title}, we can guide you toward the level that fits the route best.`
      : "Once we know the route and travel dates, we can guide you toward the strongest stay fit for the full trip.",
  ];

  return (
    <main className="pb-24">
      <section className="relative isolate overflow-hidden px-6 pb-16 pt-10">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(196,150,85,0.18),transparent_36%),linear-gradient(180deg,rgba(250,246,238,0.92),rgba(244,237,224,0.8))]" />
        <div className="absolute right-0 top-0 -z-10 h-72 w-72 rounded-full bg-[rgba(196,150,85,0.14)] blur-[120px]" />

        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.98fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              Accommodation details
            </p>
            <h1 className="font-display mt-4 text-4xl text-[var(--forest)] sm:text-5xl xl:text-6xl">
              {stay.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[color:rgba(19,32,24,0.74)] sm:text-lg">
              {stay.overview}
            </p>

            {selectedJourney && (
              <div className="mt-6 rounded-[28px] border border-[var(--border)] bg-white/82 p-5 shadow-[0_24px_60px_-38px_rgba(8,18,15,0.28)] backdrop-blur">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                  {hasPlanContext ? `Route ${routeIndex! + 1}` : "Selected route"}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-semibold text-[var(--forest)]">
                    {selectedJourney.title}
                  </h2>
                  <span className="rounded-full border border-[rgba(16,37,28,0.1)] bg-[var(--sand)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--forest)]">
                    {selectedJourney.duration}
                  </span>
                  <span className="rounded-full border border-[rgba(16,37,28,0.1)] bg-[var(--sand)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--forest)]">
                    {selectedJourney.subtitle}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                  {hasPlanContext
                    ? "You are matching this stay with one route in your trip plan. When you continue, this stay will attach to that route and return to the builder."
                    : "You are matching this stay with your selected route. When you continue, both choices will go into one trip request."}
                </p>
                {!isRecommendedForSelectedJourney && (
                  <p className="mt-3 rounded-[20px] border border-[rgba(196,150,85,0.28)] bg-[rgba(196,150,85,0.12)] px-4 py-3 text-sm leading-7 text-[color:rgba(19,32,24,0.78)]">
                    This stay can still be discussed, but it is not one of the usual matches for this route. We would normally guide you toward stays closer to this part of the journey.
                  </p>
                )}
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(16,37,28,0.12)] bg-white px-4 py-2 text-sm font-semibold text-[var(--forest)]">
                <CategoryIcon size={16} />
                {stay.categoryLabel}
              </span>
              <span className="rounded-full border border-[rgba(16,37,28,0.12)] bg-white px-4 py-2 text-sm font-semibold text-[var(--forest)]">
                {stay.location}
              </span>
              <span className="rounded-full border border-[rgba(16,37,28,0.12)] bg-white px-4 py-2 text-sm font-semibold text-[var(--forest)]">
                {stay.priceTier}
              </span>
              <span className="rounded-full border border-[rgba(16,37,28,0.12)] bg-white px-4 py-2 text-sm font-semibold text-[var(--forest)]">
                {stay.luxuryLevel}
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <TrackedLink
                href={inquiryHref}
                eventName="cta_click"
                eventParams={{
                  section: "accommodation_detail_hero",
                  action: hasPlanContext ? "add_stay_to_trip_plan" : selectedJourney ? "add_stay_to_route" : "ask_about_stay",
                  route_index: routeIndex,
                  journey_slug: selectedJourney?.slug,
                  stay_slug: stay.slug,
                  stay_category: stay.categoryKey,
                }}
                className="inline-flex items-center gap-3 rounded-full bg-[var(--forest)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--gold)] hover:text-[var(--forest)]"
              >
                {primaryLabel}
                <ArrowRight size={16} />
              </TrackedLink>
              <TrackedLink
                href={backToStaysHref}
                eventName="cta_click"
                eventParams={{
                  section: "accommodation_detail_hero",
                  action: "back_to_stays",
                  route_index: routeIndex,
                  journey_slug: selectedJourney?.slug,
                }}
                className="inline-flex items-center gap-3 rounded-full border border-[rgba(16,37,28,0.14)] bg-white/75 px-6 py-3 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
              >
                {secondaryLabel}
              </TrackedLink>
            </div>
          </div>

          <div className="overflow-hidden rounded-[32px] border border-[var(--border)] bg-white shadow-[0_30px_80px_-46px_rgba(8,18,15,0.32)]">
            <div className="relative h-[420px]">
              <Image
                src={stay.image}
                alt={stay.title}
                fill
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(180deg, rgba(8,18,15,0.08), rgba(8,18,15,0.22) 44%, rgba(8,18,15,0.82)), ${stay.accent}`,
                  mixBlendMode: "multiply",
                }}
              />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/72">
                  {stay.stayStyle}
                </p>
                <h2 className="font-display mt-3 text-3xl leading-none">{stay.title}</h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-white/76">
                  {stay.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-6">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[0_22px_60px_-46px_rgba(8,18,15,0.4)]">
            <div className="mb-4 inline-flex rounded-full bg-[var(--sand)] p-3 text-[var(--forest)]">
              <Sparkles size={18} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
              Luxury level
            </p>
            <p className="mt-3 text-lg font-semibold text-[var(--forest)]">{stay.luxuryLevel}</p>
            <p className="mt-3 text-sm leading-7 text-[color:rgba(19,32,24,0.7)]">
              This tells you the general comfort feel, not a live hotel star rating.
            </p>
          </article>

          <article className="rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[0_22px_60px_-46px_rgba(8,18,15,0.4)]">
            <div className="mb-4 inline-flex rounded-full bg-[var(--sand)] p-3 text-[var(--forest)]">
              <BedDouble size={18} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
              Stay style
            </p>
            <p className="mt-3 text-lg font-semibold text-[var(--forest)]">{stay.stayStyle}</p>
            <p className="mt-3 text-sm leading-7 text-[color:rgba(19,32,24,0.7)]">
              Board basis: {stay.boardBasis}
            </p>
          </article>

          <article className="rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[0_22px_60px_-46px_rgba(8,18,15,0.4)]">
            <div className="mb-4 inline-flex rounded-full bg-[var(--sand)] p-3 text-[var(--forest)]">
              <MapPinned size={18} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
              Location
            </p>
            <p className="mt-3 text-lg font-semibold text-[var(--forest)]">{stay.location}</p>
            <p className="mt-3 text-sm leading-7 text-[color:rgba(19,32,24,0.7)]">
              Chosen to fit the route flow, not just to fill a map point.
            </p>
          </article>

          <article className="rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[0_22px_60px_-46px_rgba(8,18,15,0.4)]">
            <div className="mb-4 inline-flex rounded-full bg-[var(--sand)] p-3 text-[var(--forest)]">
              <ShieldCheck size={18} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
              Price guide
            </p>
            <p className="mt-3 text-lg font-semibold text-[var(--forest)]">{stay.priceTier}</p>
            <p className="mt-3 text-sm leading-7 text-[color:rgba(19,32,24,0.7)]">
              {stay.priceGuide}
            </p>
          </article>
        </div>
      </section>

      <section className="px-6 py-6">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-[32px] border border-[var(--border)] bg-white p-8 shadow-[0_26px_70px_-48px_rgba(8,18,15,0.45)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              What this stay includes
            </p>
            <h2 className="font-display mt-4 text-4xl text-[var(--forest)]">
              Services and stay feel
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-8 text-[color:rgba(19,32,24,0.72)]">
              This is the type of service and comfort you can usually expect from this stay style.
            </p>

            <div className="mt-8 space-y-4">
              {stay.services.map((service) => (
                <div key={service} className="flex gap-3">
                  <CheckCircle2 size={18} className="mt-1 shrink-0 text-[var(--gold)]" />
                  <p className="text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">{service}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[32px] bg-[var(--forest)] p-8 text-white shadow-[0_28px_70px_-42px_rgba(8,18,15,0.8)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold-soft)]">
              Who it suits
            </p>
            <h2 className="font-display mt-4 text-4xl text-white">Best fit for this style</h2>

            <div className="mt-8 space-y-4">
              {stay.goodFor.map((item) => (
                <div key={item} className="flex gap-3">
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--gold-soft)]" />
                  <p className="text-sm leading-7 text-white/82">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[24px] border border-white/10 bg-white/6 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold-soft)]">
                Ideal traveler
              </p>
              <p className="mt-3 text-sm leading-7 text-white/82">{stay.idealFor}</p>
            </div>
          </article>
        </div>
      </section>

      <section className="px-6 py-6">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_1fr]">
          <article className="rounded-[32px] border border-[var(--border)] bg-[rgba(255,250,243,0.88)] p-8 shadow-[0_24px_70px_-48px_rgba(8,18,15,0.42)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              Location notes
            </p>
            <h2 className="font-display mt-4 text-4xl text-[var(--forest)]">
              Why the location matters
            </h2>

            <div className="mt-8 space-y-4">
              {stay.locationHighlights.map((item) => (
                <div key={item} className="flex gap-3">
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--gold)]" />
                  <p className="text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">{item}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[32px] border border-[var(--border)] bg-white p-8 shadow-[0_24px_70px_-48px_rgba(8,18,15,0.42)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              Planning advice
            </p>
            <h2 className="font-display mt-4 text-4xl text-[var(--forest)]">
              What to think about before choosing it
            </h2>

            <div className="mt-8 space-y-4">
              {stay.planningAdvice.map((item) => (
                <div key={item} className="flex gap-3">
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--gold)]" />
                  <p className="text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[24px] bg-[var(--sand)]/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
                Quick note
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--forest)]">{stay.planningNote}</p>
            </div>
          </article>
        </div>
      </section>

      <section className="px-6 py-6">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <article className="rounded-[32px] border border-[var(--border)] bg-white p-8 shadow-[0_26px_70px_-48px_rgba(8,18,15,0.45)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              What happens after you ask
            </p>
            <h2 className="font-display mt-4 text-4xl text-[var(--forest)]">
              The next step should make the stay choice easier.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-8 text-[color:rgba(19,32,24,0.72)]">
              You should know whether this stay fits your route, pace, and comfort level before any
              pressure to move ahead.
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
            <article className="rounded-[32px] border border-[var(--border)] bg-[rgba(255,255,255,0.8)] p-8 shadow-[0_26px_70px_-48px_rgba(8,18,15,0.45)]">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                What we usually confirm first
              </p>
              <h2 className="font-display mt-4 text-3xl text-[var(--forest)]">
                The details that help us guide the stay well
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
                About the price guide
              </p>
              <h2 className="font-display mt-4 text-3xl text-white">
                Use it as a level guide, not a fixed hotel rate
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

      <section className="px-6 py-10">
        <div className="mx-auto max-w-7xl rounded-[34px] bg-[linear-gradient(160deg,rgba(196,150,85,0.18),rgba(16,37,28,0.92))] p-8 text-white shadow-[0_26px_70px_-48px_rgba(8,18,15,0.55)] lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/72">
            Next step
          </p>
          <h2 className="font-display mt-4 max-w-3xl text-4xl text-white">
            If this stay feels right, we can match it to your dates and route.
          </h2>
          <p className="mt-5 max-w-3xl text-sm leading-8 text-white/82">
            {hasPlanContext
              ? "Tell us your dates, group size, and what you want to adjust. We will add this stay to the right part of your trip plan and shape the whole flow around you."
              : selectedJourney
                ? `Tell us your dates, group size, and what you want to adjust. We will shape ${stay.title} around the ${selectedJourney.title} route so the whole plan feels smooth.`
                : "Tell us when you want to travel, what kind of Tanzania trip you want, and how much comfort matters to you. We will help shape the right stay around the rest of the plan."}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <TrackedLink
              href={inquiryHref}
              eventName="cta_click"
              eventParams={{
                section: "accommodation_detail_bottom_cta",
                action: hasPlanContext ? "add_stay_to_trip_plan" : selectedJourney ? "add_stay_to_route" : "ask_about_stay",
                route_index: routeIndex,
                journey_slug: selectedJourney?.slug,
                stay_slug: stay.slug,
                stay_category: stay.categoryKey,
              }}
              className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--forest)] transition hover:bg-[var(--sand)]"
            >
              {primaryLabel}
              <ArrowRight size={16} />
            </TrackedLink>
            <TrackedLink
              href={backToStaysHref}
              eventName="cta_click"
              eventParams={{
                section: "accommodation_detail_bottom_cta",
                action: "back_to_stays",
                route_index: routeIndex,
                journey_slug: selectedJourney?.slug,
              }}
              className="inline-flex items-center gap-3 rounded-full border border-white/18 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/34 hover:bg-white/8"
            >
              {secondaryLabel}
            </TrackedLink>
          </div>
        </div>
      </section>
    </main>
  );
}

