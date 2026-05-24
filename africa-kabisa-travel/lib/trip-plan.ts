export type TripPlanRoute = {
  journeySlug: string;
  staySlugs: string[];
};

type TripPlanQueryExtras = Record<string, string | number | null | undefined>;

function normalizeStaySlugs(staySlugs: string[]) {
  return Array.from(
    new Set(staySlugs.map((staySlug) => staySlug.trim()).filter(Boolean))
  );
}

export function normalizeTripPlan(plan: TripPlanRoute[]) {
  return plan.flatMap((route) => {
    const journeySlug = route.journeySlug.trim();

    if (!journeySlug) {
      return [];
    }

    return [
      {
        journeySlug,
        staySlugs: normalizeStaySlugs(route.staySlugs),
      },
    ];
  });
}

export function parseTripPlanParam(value?: string | null) {
  if (!value) {
    return [] as TripPlanRoute[];
  }

  try {
    const parsed = JSON.parse(value) as unknown;

    if (!Array.isArray(parsed)) {
      return [] as TripPlanRoute[];
    }

    const routes = parsed.map((item) => {
      if (!item || typeof item !== "object") {
        return {
          journeySlug: "",
          staySlugs: [],
        };
      }

      const maybeRoute = item as {
        journeySlug?: unknown;
        staySlugs?: unknown;
      };

      return {
        journeySlug:
          typeof maybeRoute.journeySlug === "string" ? maybeRoute.journeySlug : "",
        staySlugs: Array.isArray(maybeRoute.staySlugs)
          ? maybeRoute.staySlugs.filter(
              (staySlug): staySlug is string => typeof staySlug === "string"
            )
          : [],
      };
    });

    return normalizeTripPlan(routes);
  } catch {
    return [] as TripPlanRoute[];
  }
}

export function stringifyTripPlan(plan: TripPlanRoute[]) {
  return JSON.stringify(normalizeTripPlan(plan));
}

export function buildLegacyTripPlan(journeySlug?: string, staySlug?: string) {
  if (!journeySlug) {
    return [] as TripPlanRoute[];
  }

  return normalizeTripPlan([
    {
      journeySlug,
      staySlugs: staySlug ? [staySlug] : [],
    },
  ]);
}

export function parseRouteIndex(value?: string | null) {
  if (!value) {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 0) {
    return null;
  }

  return parsed;
}

export function buildTripPlanHref(
  path: string,
  plan: TripPlanRoute[],
  extras: TripPlanQueryExtras = {}
) {
  const params = new URLSearchParams();
  const normalizedPlan = normalizeTripPlan(plan);

  if (normalizedPlan.length > 0) {
    params.set("plan", stringifyTripPlan(normalizedPlan));
  }

  Object.entries(extras).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") {
      return;
    }

    params.set(key, String(value));
  });

  const query = params.toString();

  return query ? `${path}?${query}` : path;
}

export function applyJourneyToTripPlan(
  plan: TripPlanRoute[],
  routeIndex: number | null,
  journeySlug: string
) {
  const normalizedPlan = normalizeTripPlan(plan);
  const nextRoute = {
    journeySlug,
    staySlugs:
      routeIndex !== null && routeIndex < normalizedPlan.length
        ? normalizedPlan[routeIndex].staySlugs
        : [],
  };

  if (routeIndex !== null && routeIndex < normalizedPlan.length) {
    return normalizedPlan.map((route, index) =>
      index === routeIndex ? nextRoute : route
    );
  }

  return normalizeTripPlan([...normalizedPlan, nextRoute]);
}

export function addStayToTripPlan(
  plan: TripPlanRoute[],
  routeIndex: number | null,
  staySlug: string
) {
  const normalizedPlan = normalizeTripPlan(plan);

  if (routeIndex === null || routeIndex >= normalizedPlan.length) {
    return normalizedPlan;
  }

  return normalizedPlan.map((route, index) =>
    index === routeIndex
      ? {
          ...route,
          staySlugs: normalizeStaySlugs([...route.staySlugs, staySlug]),
        }
      : route
  );
}

export function removeRouteFromTripPlan(plan: TripPlanRoute[], routeIndex: number) {
  return normalizeTripPlan(plan.filter((_, index) => index !== routeIndex));
}

export function removeStayFromTripPlan(
  plan: TripPlanRoute[],
  routeIndex: number,
  staySlug: string
) {
  return normalizeTripPlan(
    plan.map((route, index) =>
      index === routeIndex
        ? {
            ...route,
            staySlugs: route.staySlugs.filter(
              (currentStaySlug) => currentStaySlug !== staySlug
            ),
          }
        : route
    )
  );
}

