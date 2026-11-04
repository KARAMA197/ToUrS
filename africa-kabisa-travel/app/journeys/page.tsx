import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass, Mountain, Waves } from "lucide-react";
import {
  getAccommodationBySlug,
  isJourneyRecommendedForStay,
} from "@/accommodations-data";
import BrandLogo from "@/components/BrandLogo";
import PricingGuidanceSection from "@/components/PricingGuidanceSection";
import {
  buildTripPlanHref,
  parseRouteIndex,
  parseTripPlanParam,
} from "@/lib/trip-plan";
import { journeys } from "@/journeys-data";
import { siteConfig } from "@/lib/site";
import {
  buildTravelMomentExtras,
  parseTravelMomentSlugsParam,
} from "@/lib/travel-moments";

const iconMap = {
  compass: Compass,
  mountain: Mountain,
  waves: Waves,
};

export const metadata: Metadata = {
  title: "Tanzania Safari Packages and Private Journey Ideas",
  description:
    "Compare private Tanzania safari packages, Kilimanjaro climbs, Zanzibar holidays, and combined route ideas before shaping a custom trip around your dates and budget.",
  alternates: {
    canonical: "/journeys",
  },
  openGraph: {
    title: `Tanzania Safari Packages and Private Journeys | ${siteConfig.name}`,
    description:
      "Compare sample Tanzania safari, Kilimanjaro, Zanzibar, and combined route ideas before planning a private trip.",
    url: "/journeys",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `Sample Tanzania journeys from ${siteConfig.name}`,
      },
    ],
  },
};

type JourneysPageProps = {
  searchParams: Promise<{
    plan?: string | string[];
    routeIndex?: string | string[];
    stay?: string | string[];
    browse?: string | string[];
    moment?: string | string[];
    moments?: string | string[];
  }>;
};

function getSearchParamValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function JourneysPage({
  searchParams,
}: JourneysPageProps) {
  const resolvedSearchParams = await searchParams;
  const plan = parseTripPlanParam(getSearchParamValue(resolvedSearchParams.plan));
  const routeIndex = parseRouteIndex(
    getSearchParamValue(resolvedSearchParams.routeIndex)
  );
  const browse = getSearchParamValue(resolvedSearchParams.browse);
  const selectedMomentSlugs = parseTravelMomentSlugsParam(
    getSearchParamValue(resolvedSearchParams.moments),
    getSearchParamValue(resolvedSearchParams.moment)
  );
  const momentExtras = buildTravelMomentExtras(selectedMomentSlugs);
  const selectedStay = getAccommodationBySlug(
    getSearchParamValue(resolvedSearchParams.stay)
  );
  const editingRoute =
    routeIndex !== null && routeIndex < plan.length ? plan[routeIndex] : undefined;
  const editingRouteStays =
    editingRoute?.staySlugs
      .map((staySlug) => getAccommodationBySlug(staySlug))
      .filter((stay) => Boolean(stay)) ?? [];
  const editingRouteStayCount = editingRoute?.staySlugs.length ?? 0;
  const hasPlanContext = plan.length > 0 || routeIndex !== null;
  const routeFilterStays = editingRouteStays.length > 0
    ? editingRouteStays
    : selectedStay
      ? [selectedStay]
      : [];
  const recommendedJourneys = routeFilterStays.length > 0
    ? journeys.filter((journey) =>
        routeFilterStays.every((stay) =>
          isJourneyRecommendedForStay(stay!, journey)
        )
      )
    : journeys;
  const widerJourneys =
    routeFilterStays.length > 0
      ? journeys.filter(
          (journey) =>
            !recommendedJourneys.some(
              (recommendedJourney) => recommendedJourney.slug === journey.slug
            )
        )
      : [];
  const usingFallbackJourneys =
    routeFilterStays.length > 0 && recommendedJourneys.length === 0;
  const showAllJourneys = browse === "all";
  const showWiderJourneyPrompt =
    routeFilterStays.length > 0 &&
    !usingFallbackJourneys &&
    widerJourneys.length > 0 &&
    !showAllJourneys;
  const showWiderJourneySection =
    routeFilterStays.length > 0 &&
    !usingFallbackJourneys &&
    widerJourneys.length > 0 &&
    showAllJourneys;
  const featuredJourney =
    routeFilterStays.length > 0
      ? recommendedJourneys[0] ?? journeys[0]
      : journeys[0];
  const journeyCategories = Array.from(
    new Set(journeys.map((journey) => journey.subtitle))
  );
  const browseAllJourneysHref = hasPlanContext
    ? buildTripPlanHref("/journeys", plan, {
        routeIndex,
        browse: "all",
        ...momentExtras,
      })
    : selectedStay
      ? buildTripPlanHref("/journeys", [], {
          stay: selectedStay.slug,
          browse: "all",
          ...momentExtras,
        })
      : buildTripPlanHref("/journeys", [], momentExtras);

  const pageTitle = editingRoute
    ? "Preview route ideas for this part of your trip."
    : hasPlanContext
      ? "Add another route to your trip plan."
      : selectedStay
        ? "Preview route ideas that can work with your selected stay."
        : "Sample Tanzania journeys you can make your own.";

  const pageDescription = editingRoute
    ? editingRouteStays.length > 0
      ? "Open any route below to compare it against the route already in your plan. We are prioritizing route ideas that fit the stays already attached to this part of the trip."
      : "Open any route below to compare it against the route already in your plan. The stays on this part of the trip will stay attached while you preview other route ideas."
    : hasPlanContext
      ? "Open the route pages below, preview them properly, then add the one you want into your grouped trip plan."
      : selectedStay
        ? "You already chose a stay. We are showing route ideas that fit that stay best, then you can preview the trip properly and add the route if it fits."
        : "These journey pages give you a clearer look at route ideas, trip style, pace, and what each trip suits best.";

  const renderJourneyCard = (journey: (typeof journeys)[number]) => {
    const Icon = iconMap[journey.iconKey];
    const routeHref = hasPlanContext
      ? buildTripPlanHref(`/journeys/${journey.slug}`, plan, {
          routeIndex,
          ...momentExtras,
        })
      : selectedStay
        ? buildTripPlanHref(`/journeys/${journey.slug}`, [], {
            stay: selectedStay.slug,
            ...momentExtras,
          })
        : buildTripPlanHref(`/journeys/${journey.slug}`, [], momentExtras);
    const planHref = buildTripPlanHref("/custom-itinerary", [
      { journeySlug: journey.slug, staySlugs: [] },
    ], momentExtras);

    return (
      <article
        key={journey.slug}
        className="overflow-hidden rounded-[32px] border border-[var(--border)] bg-[rgba(255,255,255,0.84)] shadow-[0_28px_80px_-48px_rgba(8,18,15,0.48)] backdrop-blur"
      >
        <div className="relative h-80">
          <Image
            src={journey.image}
            alt={journey.title}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/60" />
          <div className="absolute left-5 top-5 inline-flex rounded-full border border-white/20 bg-black/28 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white backdrop-blur">
            {journey.subtitle}
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
            <Icon size={16} />
            {journey.accent}
          </div>

          <h2 className="font-display mt-4 text-3xl text-[var(--forest)]">{journey.title}</h2>
          <p className="mt-3 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
            {journey.description}
          </p>

          <div className="mt-6 flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:rgba(19,32,24,0.58)]">
                Length
              </p>
              <p className="mt-1 text-lg font-semibold text-[var(--forest)]">{journey.duration}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:rgba(19,32,24,0.58)]">
                Price guide
              </p>
              <p className="mt-1 text-lg font-semibold text-[var(--forest)]">{journey.price}</p>
            </div>
          </div>

          <div className="mt-5 space-y-2 text-sm leading-7 text-[color:rgba(19,32,24,0.68)]">
            <p>
              <span className="font-semibold text-[var(--forest)]">Stay style:</span>{" "}
              {journey.stayStyle}
            </p>
            <p>
              <span className="font-semibold text-[var(--forest)]">Best time:</span>{" "}
              {journey.bestTime}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {journey.highlights.slice(0, 3).map((highlight) => (
              <span
                key={highlight}
                className="rounded-full bg-[rgba(244,220,173,0.42)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--forest)]"
              >
                {highlight}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={routeHref}
              className="inline-flex items-center gap-3 font-semibold text-[var(--forest)] transition hover:text-[var(--gold)]"
            >
              {hasPlanContext || selectedStay ? "View route and add it" : "View full journey"}
              <ArrowRight size={16} />
            </Link>
            {!hasPlanContext && !selectedStay && (
              <Link
                href={planHref}
                className="inline-flex items-center justify-center rounded-full bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--forest-soft)]"
              >
                Start with this route
              </Link>
            )}
          </div>
        </div>
      </article>
    );
  };

  return (
    <main className="px-6 py-14">
      <section className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              Tanzania journey ideas
            </p>
            <h1 className="font-display mt-3 text-4xl text-[var(--forest)] sm:text-5xl">
              {pageTitle}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[color:rgba(19,32,24,0.72)]">
              {pageDescription}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              {journeyCategories.map((category) => (
                <span
                  key={category}
                  className="rounded-full border border-[rgba(16,37,28,0.12)] bg-white/86 px-4 py-2 text-sm font-semibold text-[var(--forest)] shadow-[0_16px_30px_-26px_rgba(8,18,15,0.24)]"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[34px] border border-[rgba(16,37,28,0.12)] bg-[rgba(255,255,255,0.82)] p-4 shadow-[0_30px_80px_-46px_rgba(8,18,15,0.42)] backdrop-blur sm:p-5">
            <div className="relative min-h-[420px] overflow-hidden rounded-[30px]">
              <Image
                src={featuredJourney.image}
                alt={featuredJourney.title}
                fill
                priority
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,18,15,0.1),rgba(8,18,15,0.2)_38%,rgba(8,18,15,0.84))]" />

              <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-5">
                <div className="rounded-[22px] border border-white/20 bg-white/88 px-3 py-2 shadow-[0_18px_40px_-28px_rgba(8,18,15,0.45)] backdrop-blur">
                  <BrandLogo tone="dark" size="sm" />
                </div>
                <div className="inline-flex rounded-full border border-white/14 bg-black/22 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--gold-soft)] backdrop-blur">
                  Private route ideas
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/72">
                  Featured route
                </p>
                <h2 className="font-display mt-3 max-w-xl text-3xl leading-none sm:text-4xl">
                  {featuredJourney.title}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-white/78">
                  {featuredJourney.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {featuredJourney.highlights.slice(0, 3).map((highlight) => (
                    <span
                      key={highlight}
                      className="rounded-full border border-white/14 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em]"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {editingRoute && (
          <div className="mt-8 max-w-4xl rounded-[28px] border border-[var(--border)] bg-[rgba(255,255,255,0.84)] p-6 shadow-[0_24px_60px_-40px_rgba(8,18,15,0.4)] backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              Editing route {routeIndex! + 1}
            </p>
            <p className="mt-4 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
              This route currently has {editingRouteStayCount} selected stay{editingRouteStayCount === 1 ? "" : "s"}. Preview another route below if you want to swap it while keeping those stays attached.
            </p>
            {editingRouteStays.length > 0 && (
              <>
                <div className="mt-4 flex flex-wrap gap-2">
                  {editingRouteStays.map((stay) => (
                    <span
                      key={stay!.slug}
                      className="rounded-full bg-[var(--sand)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--forest)]"
                    >
                      {stay!.title}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
                  Showing {recommendedJourneys.length} recommended route idea{recommendedJourneys.length === 1 ? "" : "s"} for the attached stay{editingRouteStays.length === 1 ? "" : "s"}
                </p>
              </>
            )}
          </div>
        )}

        {!editingRoute && selectedStay && (
          <div className="mt-8 max-w-4xl rounded-[28px] border border-[var(--border)] bg-[rgba(255,255,255,0.84)] p-6 shadow-[0_24px_60px_-40px_rgba(8,18,15,0.4)] backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              Selected stay
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <h2 className="font-display text-3xl text-[var(--forest)]">
                {selectedStay.title}
              </h2>
              <span className="rounded-full bg-[var(--sand)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--forest)]">
                {selectedStay.categoryLabel}
              </span>
              <span className="rounded-full bg-[var(--sand)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--forest)]">
                {selectedStay.priceTier}
              </span>
            </div>
            <p className="mt-4 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
              Preview the route pages below, then choose the one you want to pair with this stay.
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
              Showing {recommendedJourneys.length} recommended route idea{recommendedJourneys.length === 1 ? "" : "s"} for this stay
            </p>
          </div>
        )}

        {usingFallbackJourneys && (
          <div className="mt-8 max-w-4xl rounded-[28px] border border-[rgba(196,150,85,0.24)] bg-[rgba(196,150,85,0.1)] p-6 shadow-[0_24px_60px_-40px_rgba(8,18,15,0.18)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              Wider route ideas
            </p>
            <p className="mt-4 text-sm leading-7 text-[color:rgba(19,32,24,0.74)]">
              None of the current route ideas are a perfect match for the stay selection, so we are showing the wider journey list. If you want, we can still help reshape the trip around your preferred stay.
            </p>
          </div>
        )}

        {showWiderJourneyPrompt && (
          <div className="mt-8 max-w-4xl rounded-[28px] border border-[rgba(16,37,28,0.1)] bg-[rgba(255,255,255,0.82)] p-6 shadow-[0_24px_60px_-40px_rgba(8,18,15,0.22)] backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              Recommended first
            </p>
            <p className="mt-4 text-sm leading-7 text-[color:rgba(19,32,24,0.74)]">
              These route ideas are the strongest fit for the stay selection. If you want to compare more widely, you can still browse the other journey ideas too.
            </p>
            <Link
              href={browseAllJourneysHref}
              className="mt-5 inline-flex items-center gap-3 rounded-full border border-[rgba(16,37,28,0.14)] bg-white px-5 py-3 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
            >
              See wider route ideas
              <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {routeFilterStays.length > 0 && !usingFallbackJourneys ? (
          <>
            <div className="mt-12 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                Recommended routes
              </p>
              <h2 className="font-display mt-3 text-3xl text-[var(--forest)] sm:text-4xl">
                Route ideas that fit this stay choice best
              </h2>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {recommendedJourneys.map(renderJourneyCard)}
            </div>

            {showWiderJourneySection && (
              <>
                <div className="mt-14 max-w-3xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                    Wider route ideas
                  </p>
                  <h2 className="font-display mt-3 text-3xl text-[var(--forest)] sm:text-4xl">
                    Other journeys if you want to compare more widely
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                    These can still be discussed, but they are not the closest fit for the current stay selection.
                  </p>
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-3">
                  {widerJourneys.map(renderJourneyCard)}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {(usingFallbackJourneys ? journeys : recommendedJourneys).map(renderJourneyCard)}
          </div>
        )}

        {!hasPlanContext && !selectedStay ? <PricingGuidanceSection compact /> : null}

        <div className="mt-10 rounded-[30px] border border-[var(--border)] bg-[rgba(255,250,243,0.88)] p-6 shadow-[0_24px_70px_-48px_rgba(8,18,15,0.32)]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                Need a custom Tanzania route?
              </p>
              <p className="mt-3 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                Tell us your dates, group size, budget range, and the route style you like. We will
                shape a private safari, Kilimanjaro, Zanzibar, or combined itinerary around you.
              </p>
            </div>
            <Link
              href={buildTripPlanHref("/custom-itinerary", [], momentExtras)}
              className="inline-flex items-center justify-center gap-3 rounded-full bg-[var(--forest)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--forest-soft)]"
            >
              Ask for a custom route
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

