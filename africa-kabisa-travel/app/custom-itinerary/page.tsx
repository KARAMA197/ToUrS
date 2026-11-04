"use client";

import {
  Suspense,
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { motion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Clock3,
  CheckCircle2,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { getAccommodationBySlug } from "@/accommodations-data";
import TrackedLink from "@/components/TrackedLink";
import { getDestinationBySlug } from "@/destinations-data";
import { trackEvent } from "@/lib/analytics";
import { buildWhatsAppUrl } from "@/lib/contact";
import { budgetBands, priceGuideNote } from "@/lib/pricing-guidance";
import {
  getTripStyleByValue,
  getTripStyleDestinations,
  isTripStyleValue,
  tripStyleOptions,
  type TripStyleValue,
} from "@/lib/trip-styles";
import {
  buildLegacyTripPlan,
  buildTripPlanHref,
  parseTripPlanParam,
  removeRouteFromTripPlan,
  removeStayFromTripPlan,
} from "@/lib/trip-plan";
import {
  buildTravelMomentExtras,
  getTravelMomentsBySlugs,
  parseTravelMomentSlugsParam,
  stringifyTravelMomentSlugs,
  travelMoments,
} from "@/lib/travel-moments";
import { getJourneyBySlug } from "@/journeys-data";

type FormState = {
  name: string;
  email: string;
  phone: string;
  travelers: string;
  tripLength: string;
  tripStyle: TripStyleValue | "";
  budget: string;
  travelDate: string;
  contactPreference: "Email" | "WhatsApp" | "Either is fine";
  message: string;
};

type SuccessState = {
  contactPreference: FormState["contactPreference"];
  phoneProvided: boolean;
  submittedRequest: string;
  whatsappUrl: string;
  referenceId?: string;
  deliveryWarning?: string;
};

type FormFieldElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

const initialForm: FormState = {
  name: "",
  email: "",
  phone: "",
  travelers: "",
  tripLength: "",
  tripStyle: "",
  budget: "",
  travelDate: "",
  contactPreference: "Email",
  message: "",
};

const planningNotes = [
  {
    icon: ShieldCheck,
    title: "Local planning",
    description: "Our team knows Tanzania and helps you choose what works best.",
  },
  {
    icon: Sparkles,
    title: "Made for you",
    description: "Your trip matches your style, pace, and budget.",
  },
  {
    icon: Clock3,
    title: "Fast reply",
    description: "You will hear from us within 24 hours.",
  },
  {
    icon: Users,
    title: "Private trip",
    description: "Your plan is made for your own group and your own goals.",
  },
];

const nextSteps = [
  "We read your message and focus on what matters most to you.",
  "We send a first trip idea with route and stay suggestions.",
  "We make changes until the plan feels just right.",
];

const reassuranceNotes = [
  "Reply within 24 hours",
  "No pressure to book",
  "Private trip planning",
];

const priorityPrompts = [
  "Strong wildlife viewing",
  "A slower pace",
  "Honeymoon feeling",
  "Family-friendly flow",
  "Comfortable stays",
  "Good photography time",
  "Beach recovery",
  "Local culture",
];

function CustomItineraryContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const parsedTripPlan = parseTripPlanParam(searchParams.get("plan"));
  const legacyJourneySlug = searchParams.get("journey") ?? "";
  const legacyStaySlug = searchParams.get("stay") ?? "";
  const selectedDestination = getDestinationBySlug(
    searchParams.get("destination") ?? ""
  );
  const selectedTravelMomentSlugs = parseTravelMomentSlugsParam(
    searchParams.get("moments"),
    searchParams.get("moment")
  );
  const tripStyleParam = searchParams.get("tripStyle") ?? "";
  const initialTripStyle = isTripStyleValue(tripStyleParam)
    ? tripStyleParam
    : "";
  const selectedTravelMoments = getTravelMomentsBySlugs(selectedTravelMomentSlugs);
  const selectedTravelMoment = selectedTravelMoments[0];
  const hasSelectedTravelMoments = selectedTravelMoments.length > 0;
  const selectedTravelMomentTitle =
    selectedTravelMoment?.title ?? "your selected travel moment";
  const tripPlan =
    parsedTripPlan.length > 0
      ? parsedTripPlan
      : buildLegacyTripPlan(legacyJourneySlug, legacyStaySlug);
  const standaloneStay =
    parsedTripPlan.length === 0 && !legacyJourneySlug
      ? getAccommodationBySlug(legacyStaySlug)
      : undefined;
  const resolvedTripPlan = tripPlan
    .map((route, index) => {
      const journey = getJourneyBySlug(route.journeySlug);

      if (!journey) {
        return null;
      }

      return {
        index,
        journey,
        stays: route.staySlugs
          .map((staySlug) => getAccommodationBySlug(staySlug))
          .filter((stay) => Boolean(stay)),
      };
    })
    .filter(
      (route): route is {
        index: number;
        journey: NonNullable<ReturnType<typeof getJourneyBySlug>>;
        stays: NonNullable<ReturnType<typeof getAccommodationBySlug>>[];
      } => Boolean(route)
    );
  const [form, setForm] = useState<FormState>({
    ...initialForm,
    tripStyle: initialTripStyle,
  });
  const [loading, setLoading] = useState(false);
  const [successState, setSuccessState] = useState<SuccessState | null>(null);
  const [emailAcceptedReference, setEmailAcceptedReference] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialTripStyle) {
      return;
    }

    setForm((currentForm) =>
      currentForm.tripStyle === initialTripStyle
        ? currentForm
        : {
            ...currentForm,
            tripStyle: initialTripStyle,
          }
    );
  }, [initialTripStyle]);

  const routeCount = resolvedTripPlan.length;
  const stayCount = resolvedTripPlan.reduce(
    (total, route) => total + route.stays.length,
    0
  );
  const selectedTripStyle = getTripStyleByValue(form.tripStyle);
  const suggestedTripStyleDestinations = getTripStyleDestinations(form.tripStyle);
  const primaryRoute = routeCount === 1 ? resolvedTripPlan[0] : undefined;
  const primaryJourney = primaryRoute?.journey;
  const primaryStay = primaryRoute?.stays[0] ?? standaloneStay;
  const hasTripPlan = routeCount > 0;
  const hasMultiRoutePlan = routeCount > 1 || stayCount > 1;
  const routeCountLabel = `${routeCount} route${routeCount === 1 ? "" : "s"}`;
  const stayCountLabel = `${stayCount} stay${stayCount === 1 ? "" : "s"}`;

  const replaceSelections = (
    nextPlan: typeof tripPlan,
    nextStandaloneStaySlug?: string
  ) => {
    setSuccessState(null);
    setError(null);

    let nextUrl = pathname;

    const momentExtras = buildTravelMomentExtras(selectedTravelMomentSlugs);

    if (nextPlan.length > 0) {
      nextUrl = buildTripPlanHref(pathname, nextPlan, momentExtras);
    } else if (nextStandaloneStaySlug) {
      nextUrl = buildTripPlanHref(pathname, [], {
        stay: nextStandaloneStaySlug,
        ...momentExtras,
      });
    } else {
      nextUrl = buildTripPlanHref(pathname, [], momentExtras);
    }

    router.replace(nextUrl, { scroll: false });
  };

  const clearSelectionsAfterSubmit = () => {
    setError(null);
    router.replace(pathname, { scroll: false });
  };

  const handleRemoveRoute = (routeIndex: number) => {
    replaceSelections(removeRouteFromTripPlan(tripPlan, routeIndex));
  };

  const handleRemoveStay = (routeIndex: number, staySlug: string) => {
    replaceSelections(removeStayFromTripPlan(tripPlan, routeIndex, staySlug));
  };

  const handleClearStandaloneStay = () => {
    replaceSelections([]);
  };

  const replaceTravelMoments = (nextMomentSlugs: string[]) => {
    setSuccessState(null);
    setError(null);

    const moments = stringifyTravelMomentSlugs(nextMomentSlugs);
    const nextUrl = buildTripPlanHref(pathname, tripPlan, {
      ...(standaloneStay ? { stay: standaloneStay.slug } : {}),
      ...(moments ? { moments } : {}),
    });

    router.replace(nextUrl, { scroll: false });
  };

  const handleAddTravelMoment = (momentSlug: string) => {
    replaceTravelMoments([...selectedTravelMomentSlugs, momentSlug]);
  };

  const handleRemoveTravelMoment = (momentSlug: string) => {
    replaceTravelMoments(
      selectedTravelMomentSlugs.filter(
        (selectedMomentSlug) => selectedMomentSlug !== momentSlug
      )
    );
  };

  const addFirstRouteHref = standaloneStay
    ? buildTripPlanHref("/journeys", [], {
        stay: standaloneStay.slug,
        ...buildTravelMomentExtras(selectedTravelMomentSlugs),
      })
    : buildTripPlanHref("/journeys", tripPlan, {
        routeIndex: routeCount,
        ...buildTravelMomentExtras(selectedTravelMomentSlugs),
      });
  const addAnotherRouteHref = buildTripPlanHref("/journeys", tripPlan, {
    routeIndex: routeCount,
    ...buildTravelMomentExtras(selectedTravelMomentSlugs),
  });

  const pageTitle = hasMultiRoutePlan
    ? "Let us shape your Tanzania trip plan."
    : primaryJourney && primaryRoute && primaryRoute.stays.length > 1
      ? `Let us shape your ${primaryJourney.title} route with your selected stays.`
      : primaryJourney && primaryStay
        ? `Let us shape your ${primaryJourney.title} route with ${primaryStay.title}.`
        : primaryJourney
          ? `Let us shape your ${primaryJourney.title} trip.`
          : standaloneStay
            ? `Let us help you choose your ${standaloneStay.title} stay.`
            : selectedDestination
              ? `Let us shape a trip around ${selectedDestination.title}.`
            : hasSelectedTravelMoments
              ? selectedTravelMoments.length > 1
                ? "Let us shape a trip around your selected travel moments."
                : `Let us shape a trip around ${selectedTravelMomentTitle.toLowerCase()}.`
            : selectedTripStyle
              ? `Let us shape your ${selectedTripStyle.shortLabel.toLowerCase()}.`
              : "Tell us your dream Tanzania trip.";

  const pageDescription = hasMultiRoutePlan
    ? "You already built a multi-stop plan. Tell us your dates, group size, and what you want to adjust, and we will shape these routes and stays into one smooth Tanzania trip."
    : primaryJourney && primaryRoute && primaryRoute.stays.length > 1
      ? "You already chose a route and more than one stay. Tell us what you want to keep, change, add, or remove, and we will shape the whole flow around you."
      : primaryJourney && primaryStay
        ? "You already chose a route and a stay. Tell us your dates, group size, and what you want to adjust, and we will shape them into one smooth Tanzania trip."
        : primaryJourney
        ? "You already picked a strong starting point. Tell us what you want to keep, change, add, or remove, and we will turn this journey into a trip that fits you well."
        : standaloneStay
          ? "You already picked a stay style you like. Tell us your dates, route idea, and comfort level, and we will help fit this stay into the wider trip."
          : selectedDestination
            ? `You already chose ${selectedDestination.title}. Tell us your dates, group size, and travel style, and we will suggest the route flow that fits this place best.`
          : hasSelectedTravelMoments
              ? `You chose ${selectedTravelMoments.length} travel moment${selectedTravelMoments.length === 1 ? "" : "s"} from the slideshow. Tell us your dates, group size, and budget direction, and we will suggest a route that can include this kind of experience.`
            : selectedTripStyle
              ? `You already know the kind of trip you want. Tell us your dates, group size, and budget, and we will suggest the right places and route flow for this ${selectedTripStyle.shortLabel.toLowerCase()}.`
              : "Share what excites you, when you want to travel, and how you like to travel. We will turn it into a clear and exciting trip idea.";

  const whatsappIntroMessage = hasMultiRoutePlan
    ? `Hello, I would like help planning a Tanzania trip with ${routeCountLabel} and ${stayCountLabel}.`
    : primaryJourney && primaryRoute && primaryRoute.stays.length > 1
      ? `Hello, I would like help planning the ${primaryJourney.title} journey with more than one stay.`
      : primaryJourney && primaryStay
        ? `Hello, I would like help planning the ${primaryJourney.title} journey with the ${primaryStay.title} stay.`
        : primaryJourney
        ? `Hello, I would like help planning the ${primaryJourney.title} journey.`
        : standaloneStay
          ? `Hello, I would like help choosing a ${standaloneStay.title} stay for my Tanzania trip.`
          : selectedDestination
            ? `Hello, I would like help planning a Tanzania trip around ${selectedDestination.title}.`
          : hasSelectedTravelMoments
              ? `Hello, I would like help planning a Tanzania trip around these travel moments: ${selectedTravelMoments.map((moment) => moment.title).join(", ")}.`
            : selectedTripStyle
              ? `Hello, I would like help planning a ${selectedTripStyle.shortLabel.toLowerCase()} in Tanzania.`
              : "Hello, I would like help planning a custom Tanzania itinerary.";

  const selectedSummaryTitle = hasMultiRoutePlan
    ? `${routeCountLabel} and ${stayCountLabel}`
    : primaryJourney && primaryRoute && primaryRoute.stays.length > 1
      ? `${primaryJourney.title} with ${stayCountLabel}`
      : primaryJourney && primaryStay
        ? `${primaryJourney.title} + ${primaryStay.title}`
        : primaryJourney?.title ??
          standaloneStay?.title ??
          selectedDestination?.title ??
          (hasSelectedTravelMoments
            ? selectedTravelMoments.length === 1
              ? selectedTravelMomentTitle
              : `${selectedTravelMoments.length} travel moments`
            : undefined) ??
          selectedTripStyle?.label ??
          "Custom Tanzania trip";

  const selectedSummaryTags = hasMultiRoutePlan
    ? [routeCountLabel, stayCountLabel]
    : primaryJourney && primaryRoute && primaryRoute.stays.length > 1
      ? [primaryJourney.duration, stayCountLabel]
      : primaryJourney && primaryStay
        ? [
            primaryJourney.duration,
            primaryJourney.subtitle,
            primaryStay.categoryLabel,
            primaryStay.priceTier,
          ]
        : primaryJourney
          ? [primaryJourney.duration, primaryJourney.subtitle]
        : standaloneStay
          ? [standaloneStay.categoryLabel, standaloneStay.priceTier]
          : selectedDestination
            ? [selectedDestination.category, selectedDestination.region]
          : hasSelectedTravelMoments
            ? [
                `${selectedTravelMoments.length} moment${selectedTravelMoments.length === 1 ? "" : "s"}`,
                ...selectedTravelMoments.slice(0, 2).map((moment) => moment.location),
              ]
          : selectedTripStyle
            ? [
                selectedTripStyle.shortLabel,
                `${suggestedTripStyleDestinations.length} suggested place${suggestedTripStyleDestinations.length === 1 ? "" : "s"}`,
              ]
            : [];

  const formHeading = hasMultiRoutePlan
    ? "Tell us about your trip plan"
    : primaryJourney && primaryRoute && primaryRoute.stays.length > 1
      ? `Tell us about your ${primaryJourney.title} route and stays`
      : primaryJourney && primaryStay
        ? "Tell us about your route and stay"
        : primaryJourney
          ? `Tell us about your ${primaryJourney.title} plan`
        : standaloneStay
          ? `Tell us about your ${standaloneStay.title} stay`
          : selectedDestination
            ? `Tell us about ${selectedDestination.title}`
          : hasSelectedTravelMoments
            ? "Tell us about these travel moments"
            : selectedTripStyle
              ? `Tell us about your ${selectedTripStyle.shortLabel.toLowerCase()}`
              : "Tell us the basics";

  const formDescription = hasMultiRoutePlan
    ? "A few simple details are enough for us to shape these routes and stays into one clear plan."
    : primaryJourney && primaryRoute && primaryRoute.stays.length > 1
      ? "A few simple details are enough for us to shape this route and its stays into one clear plan."
      : primaryJourney && primaryStay
        ? "A few simple details are enough for us to shape this route and stay into one clear plan."
        : primaryJourney
          ? "A few simple details are enough for us to shape this journey around your travel style."
          : standaloneStay
            ? "A few simple details are enough for us to help match this stay to your dates, route, and comfort level."
            : selectedDestination
              ? "A few simple details are enough for us to build a route that makes this place fit your wider Tanzania trip."
            : hasSelectedTravelMoments
              ? "A few simple details are enough for us to shape this inspiration into a route, pace, and stay direction."
            : selectedTripStyle
              ? "A few simple details are enough for us to suggest the right places, route shape, and pace for this kind of trip."
              : "A few simple details are enough to get your first trip idea started.";

  const messagePlaceholder = hasMultiRoutePlan
    ? "Tell us how you want to combine these routes and stays, and anything else we should know."
    : primaryJourney && primaryRoute && primaryRoute.stays.length > 1
      ? `Tell us how you want to shape the ${primaryJourney.title} route with these stays, and anything else we should know.`
      : primaryJourney && primaryStay
        ? `Tell us how you want to shape the ${primaryJourney.title} journey with the ${primaryStay.title} stay, and anything else we should know.`
        : primaryJourney
          ? `Tell us how you want to shape the ${primaryJourney.title} journey, and anything else we should know.`
          : standaloneStay
            ? `Tell us how you want to use the ${standaloneStay.title} stay, your dates, and anything else we should know.`
            : selectedDestination
              ? `Tell us what interests you about ${selectedDestination.title}, your dates, group size, budget, and anything else we should know.`
            : hasSelectedTravelMoments
              ? `Tell us what you liked about ${selectedTravelMoments.map((moment) => moment.title.toLowerCase()).join(", ")}, your dates, group size, budget, and anything else we should know.`
            : selectedTripStyle
              ? `Tell us what kind of ${selectedTripStyle.shortLabel.toLowerCase()} you want, the places that interest you most, and anything else we should know.`
              : "Tell us what you want to do, how you like to travel, and anything else we should know.";

  const submitLabel = loading
    ? "Sending..."
    : hasMultiRoutePlan
      ? "Ask about this trip plan"
      : primaryJourney && primaryRoute && primaryRoute.stays.length > 1
      ? "Ask about this route and stays"
      : primaryJourney && primaryStay
        ? "Ask about this route and stay"
        : primaryJourney
          ? `Get my ${primaryJourney.title} plan`
        : standaloneStay
          ? "Ask about this stay"
          : selectedDestination
            ? `Plan around ${selectedDestination.title}`
          : hasSelectedTravelMoments
            ? "Plan around this moment"
          : selectedTripStyle
            ? `Get my ${selectedTripStyle.shortLabel.toLowerCase()} idea`
            : "Get my first trip idea";

  const whatsappUrl = buildWhatsAppUrl(whatsappIntroMessage);

  const handleChange = (event: ChangeEvent<FormFieldElement>) => {
    const { name, value } = event.target;
    setSuccessState(null);
    if (name === "tripStyle" && value) {
      trackEvent("select_trip_style", {
        trip_style: value,
      });
    }
    setForm((currentForm) => ({
      ...currentForm,
      [name as keyof FormState]: value,
    }));
  };

  const handleAddPriority = (priority: string) => {
    setSuccessState(null);
    setForm((currentForm) => {
      const existingMessage = currentForm.message.trim();

      if (existingMessage.includes(priority)) {
        return currentForm;
      }

      return {
        ...currentForm,
        message: existingMessage
          ? `${existingMessage}\n- ${priority}`
          : `I care about:\n- ${priority}`,
      };
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading || emailAcceptedReference) return;
    setLoading(true);
    setSuccessState(null);
    setError(null);

    const inquiryType = hasMultiRoutePlan
      ? "trip_plan"
      : primaryJourney && primaryRoute && primaryRoute.stays.length > 1
        ? "route_with_multiple_stays"
        : primaryJourney && primaryStay
          ? "journey_with_stay"
        : primaryJourney
          ? "journey"
        : standaloneStay
          ? "accommodation"
          : selectedDestination
            ? "destination"
          : hasSelectedTravelMoments
            ? "travel_moment"
          : "custom";
    const leadSource = parsedTripPlan.length > 0
      ? "trip_plan_builder"
      : primaryJourney && primaryStay
        ? "journey_and_stay_flow"
        : primaryJourney
          ? "journey_detail"
        : standaloneStay
          ? "accommodation_page"
          : selectedDestination
            ? "destination_page"
          : hasSelectedTravelMoments
            ? "travel_moment_slideshow"
          : "custom_itinerary_page";

    if (form.contactPreference === "WhatsApp" && !form.phone.trim()) {
      setError("Please add a phone or WhatsApp number if you want us to reply there.");
      setLoading(false);
      return;
    }

    const submittedRequest = selectedSummaryTitle;
    const submittedContactPreference = form.contactPreference;
    const submittedPhoneProvided = Boolean(form.phone.trim());

    trackEvent("submit_inquiry", {
      inquiry_type: inquiryType,
      route_count: routeCount,
      stay_count: stayCount,
      journey_slug: primaryJourney?.slug,
      stay_slug: primaryStay?.slug ?? standaloneStay?.slug,
      destination_slug: selectedDestination?.slug,
      trip_style: form.tripStyle || undefined,
      contact_preference: form.contactPreference,
    });

    try {
      const response = await fetch("/api/custom-itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          tripStyle: form.tripStyle,
          journey: primaryJourney?.title ?? "",
          journeySlug: primaryJourney?.slug ?? "",
          stay: primaryStay?.title ?? standaloneStay?.title ?? "",
          staySlug: primaryStay?.slug ?? standaloneStay?.slug ?? "",
          stayCategory: primaryStay?.categoryLabel ?? standaloneStay?.categoryLabel ?? "",
          destinationTitle: selectedDestination?.title ?? "",
          destinationSlug: selectedDestination?.slug ?? "",
          destinationRegion: selectedDestination?.region ?? "",
          travelMomentTitle: selectedTravelMoments.map((moment) => moment.title).join(", "),
          travelMomentSlug: selectedTravelMomentSlugs.join(","),
          travelMomentLocation: selectedTravelMoments.map((moment) => moment.location).join(", "),
          leadSource,
          tripPlan: resolvedTripPlan.map((route) => ({
            journey: route.journey.title,
            journeySlug: route.journey.slug,
            stays: route.stays.map((stay) => ({
              title: stay.title,
              slug: stay.slug,
              category: stay.categoryLabel,
            })),
          })),
        }),
      });

      const result = (await response.json().catch(() => null)) as
        | { success?: boolean; error?: string; referenceId?: string; deliveryWarning?: string; emailAccepted?: boolean }
        | null;

      if (!response.ok || !result?.success) {
        if (result?.emailAccepted && result.referenceId) {
          setEmailAcceptedReference(result.referenceId);
        }
        throw new Error(result?.error ?? "We could not send your request.");
      }

      trackEvent("generate_lead", {
        form_name: "custom_itinerary",
        inquiry_type: inquiryType,
        route_count: routeCount,
        stay_count: stayCount,
        journey_slug: primaryJourney?.slug,
        stay_slug: primaryStay?.slug ?? standaloneStay?.slug,
        trip_style: form.tripStyle || undefined,
        lead_reference: result?.referenceId,
      });

      setSuccessState({
        contactPreference: submittedContactPreference,
        phoneProvided: submittedPhoneProvided,
        submittedRequest,
        referenceId: result.referenceId,
        deliveryWarning: result.deliveryWarning,
        whatsappUrl: buildWhatsAppUrl(
          `Hello, I have submitted my trip request${result.referenceId ? ` (${result.referenceId})` : ""} and would like to follow up.`
        ),
      });
      setForm({ ...initialForm });
      clearSelectionsAfterSubmit();
    } catch (submissionError) {
      trackEvent("submit_inquiry_failed", {
        inquiry_type: inquiryType,
        route_count: routeCount,
        stay_count: stayCount,
        journey_slug: primaryJourney?.slug,
        stay_slug: primaryStay?.slug ?? standaloneStay?.slug,
        trip_style: form.tripStyle || undefined,
        contact_preference: form.contactPreference,
      });

      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "We could not send your request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#08120f] px-6 pb-24 pt-10 text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[24rem] bg-[radial-gradient(circle_at_top_left,rgba(200,154,70,0.22),transparent_34%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.08),transparent_22%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="space-y-8 lg:sticky lg:top-32 lg:self-start">
          <div className="inline-flex rounded-full border border-white/12 bg-white/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--gold-soft)] backdrop-blur">
            Custom trip form
          </div>

          <div className="space-y-5">
            <h1 className="font-display max-w-3xl text-4xl leading-none sm:text-5xl lg:text-6xl">
              {pageTitle}
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-white/72">{pageDescription}</p>
          </div>

          {!successState && hasTripPlan && (
            <div className="rounded-[28px] border border-white/10 bg-white/6 p-6 backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold-soft)]">
                Current trip plan
              </p>
              <div className="mt-5 space-y-5">
                {resolvedTripPlan.map((route, index) => (
                  <div key={`${route.journey.slug}-${index}`} className="border-b border-white/10 pb-5 last:border-b-0 last:pb-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-semibold text-white">{route.journey.title}</h2>
                      <span className="rounded-full border border-white/14 bg-white/8 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/82">
                        Route {index + 1}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-white/72">
                      {route.stays.length > 0
                        ? `${route.stays.length} selected stay${route.stays.length === 1 ? "" : "s"}`
                        : "No stays added to this route yet."}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!successState && standaloneStay && !hasTripPlan && (
            <div className="rounded-[28px] border border-white/10 bg-white/6 p-6 backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold-soft)]">
                Selected stay
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white">{standaloneStay.title}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/14 bg-white/8 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/82">
                  {standaloneStay.categoryLabel}
                </span>
                <span className="rounded-full border border-white/14 bg-white/8 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/82">
                  {standaloneStay.priceTier}
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-white/72">
                You can keep this stay as a simple inquiry, or preview route ideas and attach it to a larger trip.
              </p>
            </div>
          )}

          {!successState && selectedTripStyle && !hasTripPlan && !standaloneStay && (
            <div className="rounded-[28px] border border-white/10 bg-white/6 p-6 backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold-soft)]">
                Selected travel style
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white">
                {selectedTripStyle.label}
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/72">
                {selectedTripStyle.description}
              </p>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {planningNotes.map((note) => {
              const Icon = note.icon;

              return (
                <div
                  key={note.title}
                  className="rounded-[24px] border border-white/10 bg-white/6 p-5 backdrop-blur"
                >
                  <div className="mb-4 inline-flex rounded-full bg-[var(--gold)]/18 p-3 text-[var(--gold-soft)]">
                    <Icon size={18} />
                  </div>
                  <h2 className="text-lg font-semibold">{note.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-white/72">{note.description}</p>
                </div>
              );
            })}
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold-soft)]">
              What happens next
            </p>
            <div className="mt-5 space-y-4">
              {nextSteps.map((step, index) => (
                <div key={step} className="flex gap-4">
                  <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-7 text-white/72">{step}</p>
                </div>
              ))}
            </div>

            <TrackedLink
              href={whatsappUrl}
              eventName="whatsapp_click"
              eventParams={{
                section: "custom_itinerary_sidebar",
                action: "quick_start",
                route_count: routeCount,
                stay_count: stayCount,
                journey_slug: primaryJourney?.slug,
                stay_slug: primaryStay?.slug ?? standaloneStay?.slug,
              }}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-3 text-sm font-semibold text-[var(--gold-soft)] transition hover:text-white"
            >
              <MessageCircle size={16} />
              Want a quick start? Send us a WhatsApp message
            </TrackedLink>
          </div>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          onSubmit={handleSubmit}
          className="rounded-[32px] border border-[var(--border)] bg-[var(--surface)] p-6 text-[var(--foreground)] shadow-[0_35px_120px_-40px_rgba(8,18,15,0.55)] sm:p-8"
        >
          {!successState && (hasTripPlan || standaloneStay || selectedTravelMoment || selectedTripStyle) && (
            <div className="mb-6 rounded-[28px] border border-[rgba(16,37,28,0.1)] bg-[rgba(196,150,85,0.12)] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                {hasTripPlan
                  ? "You selected this trip plan"
                  : standaloneStay
                    ? "You selected this stay"
                    : selectedTravelMoment
                      ? "You selected this travel moment"
                      : "You selected this travel style"}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <h2 className="font-display text-2xl text-[var(--forest)]">{selectedSummaryTitle}</h2>
                {selectedSummaryTags.map((tag, index) => (
                  <span
                    key={`${tag}-${index}`}
                    className="rounded-full bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--forest)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                {hasTripPlan
                  ? "Your request will include every selected route and stay so we can shape the full plan together."
                  : standaloneStay
                    ? "Your request will mention this stay so we know exactly which accommodation style you want us to help you plan around."
                    : selectedTravelMoment
                      ? "Your request will mention this travel moment so we know the feeling and experience you want us to plan around."
                      : "Your request will include this travel style so we can suggest the best route, pace, and places for it."}
              </p>
            </div>
          )}

          <div className="border-b border-[var(--border)] pb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              Plan your trip
            </p>
            <h2 className="font-display mt-3 text-3xl text-[var(--forest)] sm:text-4xl">
              {formHeading}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
              {formDescription}
            </p>
          </div>

          {!successState && hasSelectedTravelMoments && (
            <div className="mt-8 rounded-[28px] border border-[rgba(16,37,28,0.1)] bg-[rgba(196,150,85,0.08)] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                Travel moments
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-[var(--forest)]">
                Keep this inspiration and add more if you want
              </h3>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                You can plan around more than one feeling. Add another moment here, or add a route below so we can connect the experience to real places and timing.
              </p>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {selectedTravelMoments.map((moment) => (
                  <div
                    key={moment.slug}
                    className="rounded-[22px] border border-[var(--border)] bg-white p-4 shadow-[0_18px_40px_-34px_rgba(8,18,15,0.24)]"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
                      Selected moment
                    </p>
                    <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h4 className="text-lg font-semibold text-[var(--forest)]">
                          {moment.title}
                        </h4>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-[color:rgba(19,32,24,0.56)]">
                          {moment.location}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveTravelMoment(moment.slug)}
                        className="rounded-full border border-[rgba(16,37,28,0.12)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {travelMoments
                  .filter(
                    (moment) => !selectedTravelMomentSlugs.includes(moment.slug)
                  )
                  .map((moment) => (
                    <button
                      key={moment.slug}
                      type="button"
                      onClick={() => handleAddTravelMoment(moment.slug)}
                      className="rounded-[22px] border border-[rgba(16,37,28,0.1)] bg-white p-4 text-left transition hover:border-[var(--gold)] hover:shadow-[0_18px_40px_-34px_rgba(8,18,15,0.3)]"
                    >
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
                        Add moment
                      </span>
                      <span className="mt-2 block text-sm font-semibold text-[var(--forest)]">
                        {moment.title}
                      </span>
                      <span className="mt-1 block text-xs uppercase tracking-[0.16em] text-[color:rgba(19,32,24,0.56)]">
                        {moment.location}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {!successState && (
            <div className="mt-8 rounded-[28px] border border-[rgba(16,37,28,0.1)] bg-[rgba(196,150,85,0.08)] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                Trip builder
              </p>
            <h3 className="mt-3 text-2xl font-semibold text-[var(--forest)]">
              Build your route and stay plan
            </h3>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
              Preview the full journey and accommodation pages first, then bring each choice back into this grouped plan.
            </p>

            <div className="mt-6 space-y-5">
              {hasTripPlan &&
                resolvedTripPlan.map((route) => (
                  <article
                    key={`${route.journey.slug}-${route.index}`}
                    className="rounded-[24px] border border-[var(--border)] bg-white p-5 shadow-[0_18px_40px_-32px_rgba(8,18,15,0.28)]"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
                          Route {route.index + 1}
                        </p>
                        <h4 className="mt-3 text-2xl font-semibold text-[var(--forest)]">
                          {route.journey.title}
                        </h4>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded-full bg-[var(--sand)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--forest)]">
                            {route.journey.duration}
                          </span>
                          <span className="rounded-full bg-[var(--sand)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--forest)]">
                            {route.journey.subtitle}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveRoute(route.index)}
                        className="rounded-full border border-[rgba(16,37,28,0.14)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
                      >
                        Remove route
                      </button>
                    </div>

                    <div className="mt-5 rounded-[22px] bg-[var(--sand)]/55 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
                        Attached stays
                      </p>
                      {route.stays.length > 0 ? (
                        <div className="mt-3 space-y-3">
                          {route.stays.map((stay) => (
                            <div
                              key={stay.slug}
                              className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-[rgba(16,37,28,0.08)] bg-white px-4 py-3"
                            >
                              <div>
                                <p className="font-semibold text-[var(--forest)]">{stay.title}</p>
                                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[color:rgba(19,32,24,0.58)]">
                                  {stay.categoryLabel} • {stay.priceTier}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveStay(route.index, stay.slug)}
                                className="rounded-full border border-[rgba(16,37,28,0.12)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
                              >
                                Remove stay
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-3 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                          No stays added to this route yet. Preview stays and attach the ones that fit this part of the trip.
                        </p>
                      )}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <TrackedLink
                        href={buildTripPlanHref("/journeys", tripPlan, {
                          routeIndex: route.index,
                        })}
                        eventName="cta_click"
                        eventParams={{
                          section: "trip_builder",
                          action: "preview_route",
                          route_index: route.index,
                          journey_slug: route.journey.slug,
                        }}
                        className="inline-flex items-center gap-3 rounded-full bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--gold)] hover:text-[var(--forest)]"
                      >
                        Preview route
                        <ArrowRight size={16} />
                      </TrackedLink>
                      <TrackedLink
                        href={buildTripPlanHref("/accommodation", tripPlan, {
                          routeIndex: route.index,
                        })}
                        eventName="cta_click"
                        eventParams={{
                          section: "trip_builder",
                          action: "preview_stays",
                          route_index: route.index,
                          journey_slug: route.journey.slug,
                        }}
                        className="inline-flex items-center gap-3 rounded-full border border-[rgba(16,37,28,0.14)] bg-white px-5 py-3 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
                      >
                        Add stay to this route
                        <ArrowRight size={16} />
                      </TrackedLink>
                    </div>
                  </article>
                ))}

              {!hasTripPlan && standaloneStay && (
                <article className="rounded-[24px] border border-[var(--border)] bg-white p-5 shadow-[0_18px_40px_-32px_rgba(8,18,15,0.28)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
                    Stay picked first
                  </p>
                  <h4 className="mt-3 text-2xl font-semibold text-[var(--forest)]">
                    {standaloneStay.title}
                  </h4>
                  <p className="mt-3 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                    Preview route pages next and choose the one that fits this stay best. Once you select a route, this stay will attach to it.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <TrackedLink
                      href={addFirstRouteHref}
                      eventName="cta_click"
                      eventParams={{
                        section: "trip_builder",
                        action: "preview_routes_for_stay",
                        stay_slug: standaloneStay.slug,
                      }}
                      className="inline-flex items-center gap-3 rounded-full bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--gold)] hover:text-[var(--forest)]"
                    >
                      Preview routes and pair this stay
                      <ArrowRight size={16} />
                    </TrackedLink>
                    <button
                      type="button"
                      onClick={handleClearStandaloneStay}
                      className="rounded-full border border-[rgba(16,37,28,0.14)] px-5 py-3 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
                    >
                      Clear stay
                    </button>
                  </div>
                </article>
              )}

              {!hasTripPlan && !standaloneStay && (
                <div className="grid gap-5 md:grid-cols-2">
                  <article className="rounded-[24px] border border-[var(--border)] bg-white p-5 shadow-[0_18px_40px_-32px_rgba(8,18,15,0.28)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
                      Start with a route
                    </p>
                    <h4 className="mt-3 text-2xl font-semibold text-[var(--forest)]">
                      Preview routes and add your first one
                    </h4>
                    <p className="mt-3 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                      Start with the route that excites you most, then add stays that fit the pace, budget, and comfort level you want.
                    </p>
                    <TrackedLink
                      href={addFirstRouteHref}
                      eventName="cta_click"
                      eventParams={{
                        section: "trip_builder",
                        action: "preview_first_route",
                      }}
                      className="mt-5 inline-flex items-center gap-3 rounded-full bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--gold)] hover:text-[var(--forest)]"
                    >
                      Preview routes and start building
                      <ArrowRight size={16} />
                    </TrackedLink>
                  </article>

                  <article className="rounded-[24px] border border-[var(--border)] bg-white p-5 shadow-[0_18px_40px_-32px_rgba(8,18,15,0.28)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
                      Stay first
                    </p>
                    <h4 className="mt-3 text-2xl font-semibold text-[var(--forest)]">
                      Preview stay ideas if you already know the comfort style
                    </h4>
                    <p className="mt-3 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                      You can still preview stays first, then choose the route that fits them afterwards.
                    </p>
                    <TrackedLink
                      href="/accommodation"
                      eventName="cta_click"
                      eventParams={{
                        section: "trip_builder",
                        action: "preview_stays_first",
                      }}
                      className="mt-5 inline-flex items-center gap-3 rounded-full border border-[rgba(16,37,28,0.14)] bg-white px-5 py-3 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
                    >
                      Preview stays first
                      <ArrowRight size={16} />
                    </TrackedLink>
                  </article>
                </div>
              )}
            </div>

              {hasTripPlan && (
                <div className="mt-5 flex flex-wrap gap-3">
                  <TrackedLink
                    href={addAnotherRouteHref}
                    eventName="cta_click"
                    eventParams={{
                      section: "trip_builder",
                      action: "add_another_route",
                      route_count: routeCount,
                    }}
                    className="inline-flex items-center gap-3 rounded-full bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--gold)] hover:text-[var(--forest)]"
                  >
                    Add another route
                    <ArrowRight size={16} />
                  </TrackedLink>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-[var(--forest)]">Full name</span>
              <input
                name="name"
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--gold)]"
                required
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-[var(--forest)]">Email address</span>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--gold)]"
                required
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-[var(--forest)]">Phone or WhatsApp</span>
              <input
                name="phone"
                placeholder="+255..."
                value={form.phone}
                onChange={handleChange}
                className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--gold)]"
              />
              <p className="text-xs leading-6 text-[color:rgba(19,32,24,0.56)]">
                Helpful if you want us to follow up on WhatsApp.
              </p>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-[var(--forest)]">Best way to contact you</span>
              <select
                name="contactPreference"
                value={form.contactPreference}
                onChange={handleChange}
                className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--gold)]"
              >
                <option value="Email">Email</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Either is fine">Either is fine</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-[var(--forest)]">Number of travelers</span>
              <input
                name="travelers"
                placeholder="2 adults, 1 child"
                value={form.travelers}
                onChange={handleChange}
                className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--gold)]"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-[var(--forest)]">Expected trip length</span>
              <input
                name="tripLength"
                placeholder="Example: 6-8 days or 10 days"
                value={form.tripLength}
                onChange={handleChange}
                className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--gold)]"
              />
              <p className="text-xs leading-6 text-[color:rgba(19,32,24,0.56)]">
                You can share an exact number or a range of days.
              </p>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-[var(--forest)]">Trip style / itinerary type</span>
              <select
                name="tripStyle"
                value={form.tripStyle}
                onChange={handleChange}
                className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--gold)]"
              >
                <option value="">Choose a trip style</option>
                {tripStyleOptions.map((tripStyle) => (
                  <option key={tripStyle.value} value={tripStyle.value}>
                    {tripStyle.label}
                  </option>
                ))}
              </select>
              <p className="text-xs leading-6 text-[color:rgba(19,32,24,0.56)]">
                Choose one if you already know the kind of Tanzania trip you want.
              </p>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-[var(--forest)]">Preferred budget</span>
              <select
                name="budget"
                value={form.budget}
                onChange={handleChange}
                className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--gold)]"
              >
                <option value="">Select a range</option>
                {budgetBands.map((band) => (
                  <option key={band.label} value={`${band.label} (${band.range})`}>
                    {band.label} ({band.range})
                  </option>
                ))}
              </select>
              <p className="text-xs leading-6 text-[color:rgba(19,32,24,0.56)]">
                {priceGuideNote}
              </p>
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-semibold text-[var(--forest)]">Travel date (about)</span>
              <input
                type="date"
                name="travelDate"
                value={form.travelDate}
                onChange={handleChange}
                className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--gold)]"
              />
            </label>

            {selectedTripStyle ? (
              <div className="space-y-5 rounded-[28px] border border-[var(--border)] bg-[var(--sand)]/52 p-5 md:col-span-2">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
                    Suggested places for {selectedTripStyle.shortLabel.toLowerCase()}
                  </p>
                  <h3 className="text-2xl font-semibold text-[var(--forest)]">
                    {selectedTripStyle.label}
                  </h3>
                  <p className="text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                    {selectedTripStyle.description}
                  </p>
                  <p className="text-sm leading-7 text-[color:rgba(19,32,24,0.68)]">
                    {selectedTripStyle.planningNote}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {suggestedTripStyleDestinations.map((destination) => (
                    <TrackedLink
                      key={destination.slug}
                      href={`/destinations/${destination.slug}`}
                      eventName="cta_click"
                      eventParams={{
                        section: "trip_style_suggestions",
                        action: "open_destination",
                        trip_style: selectedTripStyle.value,
                        destination_slug: destination.slug,
                      }}
                      className="rounded-[22px] border border-[rgba(16,37,28,0.08)] bg-white p-5 shadow-[0_18px_40px_-34px_rgba(8,18,15,0.24)] transition hover:-translate-y-0.5 hover:border-[var(--gold)]"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-lg font-semibold text-[var(--forest)]">
                            {destination.title}
                          </p>
                          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gold)]">
                            {destination.category} | {destination.region}
                          </p>
                        </div>
                        <ArrowRight
                          size={18}
                          className="shrink-0 text-[var(--gold)]"
                        />
                      </div>
                      <p className="mt-4 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                        {destination.summary}
                      </p>
                    </TrackedLink>
                  ))}
                </div>

                <TrackedLink
                  href={selectedTripStyle.relatedHref}
                  eventName="cta_click"
                  eventParams={{
                    section: "trip_style_suggestions",
                    action: "open_related_direction",
                    trip_style: selectedTripStyle.value,
                  }}
                  className="inline-flex items-center gap-3 rounded-full border border-[rgba(16,37,28,0.14)] bg-white px-5 py-3 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
                >
                  {selectedTripStyle.relatedLabel}
                  <ArrowRight size={16} />
                </TrackedLink>
              </div>
            ) : null}

            <div className="space-y-3 md:col-span-2">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-[var(--forest)]">
                    What matters most?
                  </p>
                  <p className="mt-1 text-xs leading-6 text-[color:rgba(19,32,24,0.56)]">
                    Tap any that fit. We will add them to your message.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {priorityPrompts.map((priority) => (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => handleAddPriority(priority)}
                    className="rounded-full border border-[rgba(16,37,28,0.12)] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-semibold text-[var(--forest)]">Tell us what you want</span>
              <textarea
                name="message"
                placeholder={messagePlaceholder}
                rows={7}
                value={form.message}
                onChange={handleChange}
                className="w-full rounded-[24px] border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--gold)]"
              />
            </label>
          </div>

          <div className="mt-8 rounded-[24px] bg-[var(--sand)] p-4 text-sm leading-7 text-[var(--forest)]">
            Every request is read by a real person. We use your selected route, moment, destination,
            travel style, and priorities to send a first plan that fits you.
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            {reassuranceNotes.map((note) => (
              <span
                key={note}
                className="rounded-full border border-[rgba(16,37,28,0.12)] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[color:rgba(19,32,24,0.66)]"
              >
                {note}
              </span>
            ))}
          </div>

          <p className="mt-4 text-sm leading-7 text-[color:rgba(19,32,24,0.68)]">
            The fastest way to get a strong first plan is to share your dates, group size, budget
            range, expected trip length, trip style, and how you want us to reply.
          </p>

          <div className="mt-5 grid gap-3 rounded-[24px] border border-[rgba(16,37,28,0.1)] bg-white p-4 sm:grid-cols-3">
            {[
              "We confirm the best route direction first.",
              "We explain what affects price before you decide.",
              "You can refine the plan before committing.",
            ].map((point) => (
              <div key={point} className="flex gap-3">
                <CheckCircle2 className="mt-0.5 shrink-0 text-[var(--gold)]" size={18} />
                <p className="text-sm leading-6 text-[var(--forest)]">{point}</p>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || Boolean(emailAcceptedReference)}
            className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[var(--forest)] px-6 py-4 font-semibold text-white transition hover:bg-[var(--forest-soft)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitLabel}
            <ArrowRight size={18} />
          </button>

          {successState && (
            <div
              className="mt-5 rounded-[28px] border border-emerald-200 bg-emerald-50 px-5 py-5 text-sm text-emerald-900 shadow-[0_20px_50px_-35px_rgba(16,120,70,0.45)]"
              aria-live="polite"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-700" size={22} />
                <div>
                  <p className="font-semibold">
                    Your trip request has been saved.
                  </p>
                  {successState.referenceId && (
                    <p className="mt-2">Reference: <span className="font-semibold">{successState.referenceId}</span></p>
                  )}
                  <p className="mt-2 leading-7">
                    Submitted request:{" "}
                    <span className="font-semibold">{successState.submittedRequest}</span>
                  </p>
                </div>
              </div>
              {successState.deliveryWarning ? (
                <p role="alert" className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 p-4 leading-7 text-amber-950">
                  {successState.deliveryWarning}
                </p>
              ) : (
              <p className="mt-2 leading-7">
                {successState.contactPreference === "WhatsApp" && successState.phoneProvided
                  ? "We will follow up on WhatsApp shortly."
                  : successState.contactPreference === "Either is fine" &&
                      successState.phoneProvided
                    ? "Your confirmation email has been queued for sending. We can also follow up on WhatsApp."
                    : "Your confirmation email has been queued for sending. Please check your inbox and spam folder."}
              </p>
              )}
              <div className="mt-4 rounded-[22px] border border-emerald-200/80 bg-white/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  What happens next
                </p>
                <div className="mt-3 space-y-3 text-sm leading-7 text-emerald-900">
                  <p>1. We review your request and check the route and stay details you sent.</p>
                  <p>2. We prepare the next step for you, with the right trip guidance or first plan.</p>
                  <p>
                    3. We get back to you shortly by{" "}
                    {successState.contactPreference === "WhatsApp" && successState.phoneProvided
                      ? "WhatsApp."
                      : successState.contactPreference === "Either is fine" &&
                          successState.phoneProvided
                        ? "email or WhatsApp."
                        : "email."}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <TrackedLink
                  href={successState.whatsappUrl}
                  eventName="whatsapp_click"
                  eventParams={{
                    section: "custom_itinerary_success",
                    action: "faster_follow_up",
                    contact_preference: successState.contactPreference,
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-full bg-[#128c7e] px-5 py-3 font-semibold text-white transition hover:bg-[#0f7b70]"
                >
                  <MessageCircle size={18} />
                  {successState.deliveryWarning ? "Follow up on WhatsApp" : "WhatsApp for faster follow-up"}
                </TrackedLink>
              </div>
              <p className="mt-4 leading-7">
                The form has been cleared, and you can start a new request below whenever you are ready.
              </p>
            </div>
          )}

          {(error || emailAcceptedReference) && (
            <div className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              <p>{error ?? "Your request was accepted by our email service, but we could not save it. Please follow up on WhatsApp before submitting again."}</p>
              {emailAcceptedReference && (
                <a
                  href={buildWhatsAppUrl(`Hello, please check my trip request ${emailAcceptedReference}. The email was accepted but the website could not save my request.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block font-semibold underline"
                >
                  Follow up on WhatsApp with reference {emailAcceptedReference}
                </a>
              )}
            </div>
          )}
        </motion.form>
      </div>
    </section>
  );
}

function CustomItineraryFallback() {
  return (
    <section className="relative overflow-hidden bg-[#08120f] px-6 pb-24 pt-10 text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[24rem] bg-[radial-gradient(circle_at_top_left,rgba(200,154,70,0.22),transparent_34%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.08),transparent_22%)]" />
      <div className="relative mx-auto max-w-7xl rounded-[32px] border border-white/10 bg-white/6 p-8 backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold-soft)]">
          Loading trip form
        </p>
      </div>
    </section>
  );
}

export default function CustomItineraryPage() {
  return (
    <Suspense fallback={<CustomItineraryFallback />}>
      <CustomItineraryContent />
    </Suspense>
  );
}
