import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowRight,
  BedDouble,
  Clock3,
  Compass,
  MapPinned,
  Mountain,
  Waves,
} from "lucide-react";
import TrackedLink from "@/components/TrackedLink";
import {
  getAccommodationsByCategory,
  getJourneyStayProfile,
  isAccommodationRecommendedForJourney,
  getRecommendedAccommodationsByCategory,
  getRecommendedAccommodationsForJourney,
  type AccommodationCategoryKey,
} from "@/accommodations-data";
import { getJourneyBySlug } from "@/journeys-data";
import {
  buildTripPlanHref,
  parseRouteIndex,
  parseTripPlanParam,
} from "@/lib/trip-plan";
import { siteConfig } from "@/lib/site";

const categoryOrder: AccommodationCategoryKey[] = ["safari", "mountain", "beach"];

const categoryMeta = {
  safari: {
    title: "Safari lodges and wildlife stays",
    description:
      "These stay styles work well for Serengeti, Ngorongoro, and wider Northern Circuit routes.",
    icon: Compass,
  },
  mountain: {
    title: "Arusha and Kilimanjaro base stays",
    description:
      "Useful for arrival nights, safari transitions, Kilimanjaro climbs, and recovery days.",
    icon: Mountain,
  },
  beach: {
    title: "Zanzibar town and beach stays",
    description:
      "Best for travelers who want culture, coast time, or a softer finish after safari or the mountain.",
    icon: Waves,
  },
} satisfies Record<
  AccommodationCategoryKey,
  { title: string; description: string; icon: typeof Compass }
>;

const planningNotes = [
  {
    title: "Curated, not random",
    description:
      "We help you choose the kind of stay that fits your route instead of leaving you to scroll endless booking sites.",
    icon: BedDouble,
  },
  {
    title: "Dates still matter",
    description:
      "Availability and price move with season, so we confirm the right stay after you share your dates.",
    icon: Clock3,
  },
  {
    title: "Built into your route",
    description:
      "We match the stay to your safari flow, Kilimanjaro schedule, or Zanzibar finish so the trip feels smoother.",
    icon: MapPinned,
  },
];

export const metadata: Metadata = {
  title: "Tanzania Accommodation and Stay Planning",
  description:
    "Browse curated safari lodges, Arusha and Kilimanjaro stays, and Zanzibar accommodation ideas you can add to your Tanzania trip.",
  alternates: {
    canonical: "/accommodation",
  },
  openGraph: {
    title: "Tanzania Accommodation and Stay Planning",
    description:
      "Browse curated safari lodges, Arusha and Kilimanjaro stays, and Zanzibar accommodation ideas for your Tanzania trip.",
    url: "/accommodation",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `Accommodation planning with ${siteConfig.name}`,
      },
    ],
  },
};

type AccommodationPageProps = {
  searchParams: Promise<{
    journey?: string | string[];
    plan?: string | string[];
    routeIndex?: string | string[];
    browse?: string | string[];
  }>;
};

function getSearchParamValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function AccommodationPage({
  searchParams,
}: AccommodationPageProps) {
  const resolvedSearchParams = await searchParams;
  const plan = parseTripPlanParam(getSearchParamValue(resolvedSearchParams.plan));
  const routeIndex = parseRouteIndex(
    getSearchParamValue(resolvedSearchParams.routeIndex)
  );
  const browse = getSearchParamValue(resolvedSearchParams.browse);
  const selectedPlanRoute =
    routeIndex !== null && routeIndex < plan.length ? plan[routeIndex] : undefined;
  const selectedJourney = getJourneyBySlug(
    selectedPlanRoute?.journeySlug ?? getSearchParamValue(resolvedSearchParams.journey)
  );
  const selectedJourneyProfile = getJourneyStayProfile(selectedJourney);
  const hasPlanContext = plan.length > 0 || routeIndex !== null;
  const planSummaryHref = hasPlanContext
    ? buildTripPlanHref("/custom-itinerary", plan)
    : selectedJourney
      ? `/custom-itinerary?journey=${selectedJourney.slug}`
      : "/custom-itinerary";
  const recommendedCategoryOrder = selectedJourney
    ? categoryOrder.filter(
        (categoryKey) =>
          getRecommendedAccommodationsByCategory(categoryKey, selectedJourney).length > 0
      )
    : categoryOrder;
  const widerCategoryOrder = selectedJourney
    ? categoryOrder.filter(
        (categoryKey) =>
          getAccommodationsByCategory(categoryKey).filter(
            (stay) => !isAccommodationRecommendedForJourney(stay, selectedJourney)
          ).length > 0
      )
    : [];
  const totalRecommendedStays = selectedJourney
    ? getRecommendedAccommodationsForJourney(selectedJourney).length
    : 0;
  const totalWiderStays = selectedJourney
    ? categoryOrder.reduce(
        (count, categoryKey) =>
          count +
          getAccommodationsByCategory(categoryKey).filter(
            (stay) => !isAccommodationRecommendedForJourney(stay, selectedJourney)
          ).length,
        0
      )
    : 0;
  const showAllStays = browse === "all";
  const showWiderStayPrompt =
    Boolean(selectedJourney) && totalWiderStays > 0 && !showAllStays;
  const showWiderStaySection =
    Boolean(selectedJourney) && totalWiderStays > 0 && showAllStays;
  const browseAllStaysHref = hasPlanContext
    ? buildTripPlanHref("/accommodation", plan, { routeIndex, browse: "all" })
    : selectedJourney
      ? `/accommodation?journey=${selectedJourney.slug}&browse=all`
      : "/accommodation";
  const routeStayFocusCopy =
    selectedJourneyProfile === "safari"
      ? "For safari routes, we keep the stay ideas focused on Arusha arrival nights and the wildlife areas on your route."
      : selectedJourneyProfile === "climb"
        ? "For Kilimanjaro routes, we keep the stay ideas focused on Moshi and practical mountain-base stays."
        : selectedJourneyProfile === "beach"
          ? "For Zanzibar routes, we keep the stay ideas focused on Stone Town and the beach areas that fit your finish."
          : "";

  const renderStaySection = (
    categoryKey: AccommodationCategoryKey,
    stays: ReturnType<typeof getAccommodationsByCategory>,
    sectionVariant: "recommended" | "wider" | "default"
  ) => {
    const meta = categoryMeta[categoryKey];
    const Icon = meta.icon;

    return (
      <section
        key={`${sectionVariant}-${categoryKey}`}
        className="px-6 py-6"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex max-w-3xl items-start gap-4">
            <div className="mt-1 rounded-full bg-[var(--sand)] p-3 text-[var(--forest)]">
              <Icon size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                Stay category
              </p>
              <h2 className="font-display mt-3 text-3xl text-[var(--forest)] sm:text-4xl">
                {meta.title}
              </h2>
              <p className="mt-3 text-sm leading-8 text-[color:rgba(19,32,24,0.72)] sm:text-base">
                {meta.description}
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {stays.map((stay) => (
              <article
                key={stay.slug}
                className="overflow-hidden rounded-[32px] border border-[var(--border)] bg-white shadow-[0_26px_70px_-48px_rgba(8,18,15,0.45)]"
              >
                <div className="relative h-64">
                  <Image
                    src={stay.image}
                    alt={stay.title}
                    fill
                    sizes="(min-width: 1280px) 30vw, (min-width: 1024px) 46vw, 100vw"
                    className="object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(180deg, rgba(8,18,15,0.08), rgba(8,18,15,0.18) 42%, rgba(8,18,15,0.8)), ${stay.accent}`,
                      mixBlendMode: "multiply",
                    }}
                  />
                  <div className="absolute inset-x-0 top-0 flex flex-wrap gap-2 p-5">
                    <span className="rounded-full border border-white/14 bg-black/22 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold-soft)] backdrop-blur">
                      {stay.categoryLabel}
                    </span>
                    <span className="rounded-full border border-white/14 bg-black/22 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
                      {stay.priceTier}
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/72">
                      {stay.location}
                    </p>
                    <h3 className="font-display mt-3 text-3xl leading-none">{stay.title}</h3>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                    {stay.description}
                  </p>

                  <div className="mt-5 rounded-[24px] bg-[var(--sand)]/70 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
                      Best for
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[var(--forest)]">
                      {stay.idealFor}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-[rgba(16,37,28,0.12)] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--forest)]">
                      {stay.luxuryLevel}
                    </span>
                    <span className="rounded-full border border-[rgba(16,37,28,0.12)] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--forest)]">
                      {stay.boardBasis}
                    </span>
                  </div>

                  <div className="mt-5 space-y-3">
                    {stay.highlights.map((highlight) => (
                      <div key={highlight} className="flex gap-3">
                        <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--gold)]" />
                        <p className="text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                          {highlight}
                        </p>
                      </div>
                    ))}
                  </div>

                  <p className="mt-5 text-sm leading-7 text-[color:rgba(19,32,24,0.64)]">
                    {stay.planningNote}
                  </p>

                  <TrackedLink
                    href={
                      hasPlanContext
                        ? buildTripPlanHref(`/accommodation/${stay.slug}`, plan, {
                            routeIndex,
                          })
                        : selectedJourney
                          ? `/accommodation/${stay.slug}?journey=${selectedJourney.slug}`
                          : `/accommodation/${stay.slug}`
                    }
                    eventName="cta_click"
                    eventParams={{
                      section:
                        sectionVariant === "wider"
                          ? "accommodation_page_wider"
                          : "accommodation_page",
                      action: "view_stay_details",
                      stay_slug: stay.slug,
                      stay_category: stay.categoryKey,
                      journey_slug: selectedJourney?.slug,
                      route_index: routeIndex,
                    }}
                    className="mt-6 inline-flex items-center gap-3 rounded-full bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--gold)] hover:text-[var(--forest)]"
                  >
                    {selectedJourney
                      ? sectionVariant === "wider"
                        ? "See details and compare"
                        : "See details and add to route"
                      : "See stay details"}
                    <ArrowRight size={16} />
                  </TrackedLink>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  };

  return (
    <main className="pb-24">
      <section className="relative isolate overflow-hidden px-6 pb-16 pt-10">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(196,150,85,0.18),transparent_36%),linear-gradient(180deg,rgba(250,246,238,0.92),rgba(244,237,224,0.8))]" />
        <div className="absolute right-0 top-0 -z-10 h-72 w-72 rounded-full bg-[rgba(196,150,85,0.14)] blur-[120px]" />

        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              Accommodation planning
            </p>
            <h1 className="font-display mt-4 text-4xl text-[var(--forest)] sm:text-5xl xl:text-6xl">
              {selectedJourney
                ? `Choose a stay that fits the ${selectedJourney.title} route.`
                : "Choose the right Tanzania stay without getting lost in too many options."}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[color:rgba(19,32,24,0.74)] sm:text-lg">
              {selectedJourney
                ? "You already picked the route for this part of your trip. Now you can preview the stay styles that fit the pace, comfort level, and location flow of this route without mixing in unrelated parts of Tanzania."
                : "This page shows the kind of accommodation we can help add to your trip. It is not a live booking engine. Instead, it gives you a clearer starting point for safari lodges, Arusha and Kilimanjaro base stays, and Zanzibar finishes."}
            </p>
            <p className="mt-4 max-w-3xl text-base leading-8 text-[color:rgba(19,32,24,0.68)] sm:text-lg">
              {selectedJourney
                ? routeStayFocusCopy
                : "Once you choose a stay style you like, we can match it to your dates, route, budget, and comfort level, then include it in the wider plan."}
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <TrackedLink
              href={planSummaryHref}
              eventName="cta_click"
              eventParams={{
                section: "accommodation_hero",
                action: hasPlanContext ? "back_to_trip_plan" : selectedJourney ? "ask_about_route" : "plan_my_trip",
                journey_slug: selectedJourney?.slug,
                route_index: routeIndex,
              }}
              className="inline-flex items-center gap-3 rounded-full bg-[var(--forest)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--gold)] hover:text-[var(--forest)]"
            >
              {hasPlanContext
                ? "Back to my trip plan"
                : selectedJourney
                  ? "Ask about this route now"
                  : "Plan my trip"}
              <ArrowRight size={16} />
            </TrackedLink>
            <TrackedLink
              href="/before-you-book"
              eventName="cta_click"
              eventParams={{ section: "accommodation_hero", action: "before_you_book" }}
              className="inline-flex items-center gap-3 rounded-full border border-[rgba(16,37,28,0.14)] bg-white/75 px-6 py-3 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
            >
              Read before you book
            </TrackedLink>
          </div>

          {selectedJourney && (
            <div className="mt-10 rounded-[30px] border border-[var(--border)] bg-white/82 p-6 shadow-[0_24px_60px_-38px_rgba(8,18,15,0.45)] backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                Selected route
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <h2 className="font-display text-3xl text-[var(--forest)]">
                  {selectedJourney.title}
                </h2>
                <span className="rounded-full border border-[rgba(16,37,28,0.1)] bg-[var(--sand)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--forest)]">
                  {selectedJourney.duration}
                </span>
                <span className="rounded-full border border-[rgba(16,37,28,0.1)] bg-[var(--sand)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--forest)]">
                  {selectedJourney.stayStyle}
                </span>
              </div>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                You are now choosing stays for this route. We are only showing the stay ideas that make sense for this part of the trip, then you can bring the ones you like back into your plan.
              </p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
                {totalRecommendedStays} route-matched stay ideas for this route
              </p>
            </div>
          )}

          {showWiderStayPrompt && (
            <div className="mt-8 max-w-4xl rounded-[28px] border border-[rgba(16,37,28,0.1)] bg-[rgba(255,255,255,0.82)] p-6 shadow-[0_24px_60px_-40px_rgba(8,18,15,0.22)] backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                Recommended first
              </p>
              <p className="mt-4 text-sm leading-7 text-[color:rgba(19,32,24,0.74)]">
                These stay ideas are the closest fit for this route. If you want to compare more widely, you can still browse the other stay options too.
              </p>
              <TrackedLink
                href={browseAllStaysHref}
                eventName="cta_click"
                eventParams={{
                  section: "accommodation_recommendation_prompt",
                  action: "browse_all_stays",
                  journey_slug: selectedJourney?.slug,
                  route_index: routeIndex,
                }}
                className="mt-5 inline-flex items-center gap-3 rounded-full border border-[rgba(16,37,28,0.14)] bg-white px-5 py-3 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
              >
                See wider stay ideas
                <ArrowRight size={16} />
              </TrackedLink>
            </div>
          )}

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {planningNotes.map((note) => {
              const Icon = note.icon;

              return (
                <article
                  key={note.title}
                  className="rounded-[24px] border border-[var(--border)] bg-white/78 p-5 shadow-[0_24px_60px_-38px_rgba(8,18,15,0.45)] backdrop-blur"
                >
                  <div className="mb-4 inline-flex rounded-full bg-[var(--sand)] p-3 text-[var(--forest)]">
                    <Icon size={18} />
                  </div>
                  <h2 className="text-lg font-semibold text-[var(--forest)]">{note.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                    {note.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {selectedJourney ? (
        <>
          <section className="px-6 py-6">
            <div className="mx-auto max-w-7xl">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                  Recommended stays
                </p>
                <h2 className="font-display mt-3 text-3xl text-[var(--forest)] sm:text-4xl">
                  Stay ideas that fit this route best
                </h2>
              </div>
            </div>
          </section>

          {recommendedCategoryOrder.map((categoryKey) =>
            renderStaySection(
              categoryKey,
              getRecommendedAccommodationsByCategory(categoryKey, selectedJourney),
              "recommended"
            )
          )}

          {showWiderStaySection && (
            <>
              <section className="px-6 py-6">
                <div className="mx-auto max-w-7xl">
                  <div className="max-w-3xl">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                      Wider stay ideas
                    </p>
                    <h2 className="font-display mt-3 text-3xl text-[var(--forest)] sm:text-4xl">
                      Other stays if you want to compare more widely
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                      These can still be discussed, but they are not the closest fit for the current route choice.
                    </p>
                  </div>
                </div>
              </section>

              {widerCategoryOrder.map((categoryKey) =>
                renderStaySection(
                  categoryKey,
                  getAccommodationsByCategory(categoryKey).filter(
                    (stay) => !isAccommodationRecommendedForJourney(stay, selectedJourney)
                  ),
                  "wider"
                )
              )}
            </>
          )}
        </>
      ) : (
        recommendedCategoryOrder.map((categoryKey) =>
          renderStaySection(
            categoryKey,
            getAccommodationsByCategory(categoryKey),
            "default"
          )
        )
      )}

      <section className="px-6 py-10">
        <div className="mx-auto max-w-7xl rounded-[34px] bg-[linear-gradient(160deg,rgba(196,150,85,0.18),rgba(16,37,28,0.92))] p-8 text-white shadow-[0_26px_70px_-48px_rgba(8,18,15,0.55)] lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/72">
            Need more than a stay?
          </p>
          <h2 className="font-display mt-4 max-w-3xl text-4xl text-white">
            We can shape the accommodation, the route, and the full trip together.
          </h2>
          <p className="mt-5 max-w-3xl text-sm leading-8 text-white/82">
            Tell us your dates, route idea, comfort level, and whether you want safari, Kilimanjaro, Zanzibar, or a mixed journey. We will help match the right stay to the right trip flow.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <TrackedLink
              href={planSummaryHref}
              eventName="cta_click"
              eventParams={{
                section: "accommodation_bottom_cta",
                action: hasPlanContext ? "back_to_trip_plan" : selectedJourney ? "ask_about_route" : "plan_my_trip",
                journey_slug: selectedJourney?.slug,
                route_index: routeIndex,
              }}
              className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--forest)] transition hover:bg-[var(--sand)]"
            >
              {hasPlanContext
                ? "Back to my trip plan"
                : selectedJourney
                  ? "Ask about this route now"
                  : "Plan my trip"}
              <ArrowRight size={16} />
            </TrackedLink>
            <TrackedLink
              href="/contact"
              eventName="cta_click"
              eventParams={{ section: "accommodation_bottom_cta", action: "contact_page" }}
              className="inline-flex items-center gap-3 rounded-full border border-white/18 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/34 hover:bg-white/8"
            >
              See contact details
            </TrackedLink>
          </div>
        </div>
      </section>
    </main>
  );
}

