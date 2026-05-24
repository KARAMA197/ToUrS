"use client";

import { useEffect, useSyncExternalStore } from "react";
import { trackEvent } from "@/lib/analytics";

export type PrimaryCtaVariant = {
  id: string;
  label: string;
};

const primaryCtaVariants: PrimaryCtaVariant[] = [
  {
    id: "plan_my_trip",
    label: "Plan my trip",
  },
  {
    id: "first_trip_idea",
    label: "Get my first trip idea",
  },
];

const storageKey = "ak:experiment:primary-cta-copy";
const viewedExperiments = new Set<string>();

function getRandomVariant() {
  if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
    const randomBuffer = new Uint32Array(1);
    window.crypto.getRandomValues(randomBuffer);

    return primaryCtaVariants[randomBuffer[0] % primaryCtaVariants.length];
  }

  return primaryCtaVariants[Math.floor(Math.random() * primaryCtaVariants.length)];
}

function resolvePrimaryCtaVariant() {
  if (typeof window === "undefined") {
    return primaryCtaVariants[0];
  }

  const storedVariantId = window.localStorage.getItem(storageKey);
  const storedVariant = primaryCtaVariants.find((variant) => variant.id === storedVariantId);

  if (storedVariant) {
    return storedVariant;
  }

  const newVariant = getRandomVariant();
  window.localStorage.setItem(storageKey, newVariant.id);
  return newVariant;
}

function subscribe() {
  return () => {};
}

function getServerSnapshot() {
  return primaryCtaVariants[0];
}

function getClientSnapshot() {
  return resolvePrimaryCtaVariant();
}

export function usePrimaryCtaExperiment(section: string) {
  const variant = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );

  useEffect(() => {
    const viewKey = `${section}:${variant.id}`;

    if (!viewedExperiments.has(viewKey)) {
      trackEvent("experiment_view", {
        experiment_name: "primary_cta_copy",
        experiment_variant: variant.id,
        section,
      });
      viewedExperiments.add(viewKey);
    }
  }, [section, variant.id]);

  return variant;
}
