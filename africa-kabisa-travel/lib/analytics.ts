"use client";

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

export type AnalyticsEventParams = Record<
  string,
  string | number | boolean | undefined | null
>;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function isAnalyticsReady() {
  return (
    typeof window !== "undefined" &&
    Boolean(GA_MEASUREMENT_ID) &&
    typeof window.gtag === "function"
  );
}

function cleanParams(params: AnalyticsEventParams = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null)
  );
}

export function trackPageView(path: string) {
  if (!isAnalyticsReady()) {
    return;
  }

  const pageLocation = new URL(path, window.location.origin).toString();

  window.gtag?.("event", "page_view", {
    page_title: document.title,
    page_path: path,
    page_location: pageLocation,
    send_to: GA_MEASUREMENT_ID,
  });
}

export function trackEvent(
  eventName: string,
  params: AnalyticsEventParams = {}
) {
  if (!isAnalyticsReady()) {
    return;
  }

  window.gtag?.("event", eventName, cleanParams(params));
}
