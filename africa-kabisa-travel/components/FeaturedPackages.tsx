"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Compass, Mountain, Waves } from "lucide-react";
import TrackedLink from "@/components/TrackedLink";
import type { HomepageContent } from "@/homepage-content-schema";
import { journeys } from "@/journeys-data";
import { priceGuideNote } from "@/lib/pricing-guidance";
import { buildTripPlanHref } from "@/lib/trip-plan";

const iconMap = {
  compass: Compass,
  mountain: Mountain,
  waves: Waves,
};

type FeaturedPackagesProps = {
  content: HomepageContent["featuredPackages"];
};

export default function FeaturedPackages({ content }: FeaturedPackagesProps) {
  return (
    <section id="featured-packages" className="scroll-mt-24 px-5 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
            {content.eyebrow}
          </p>
          <h2 className="font-display mt-3 text-3xl text-[var(--forest)] sm:text-5xl">
            {content.title}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[color:rgba(19,32,24,0.72)]">
            {content.description}
          </p>
          <p className="mt-4 max-w-2xl rounded-[22px] border border-[rgba(16,37,28,0.1)] bg-[rgba(255,250,243,0.82)] px-4 py-3 text-sm leading-7 text-[color:rgba(19,32,24,0.68)]">
            {priceGuideNote}
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:mt-12 sm:gap-6 lg:grid-cols-3">
          {journeys.map((journey, index) => {
            const Icon = iconMap[journey.iconKey];

            return (
              <motion.article
                key={journey.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="overflow-hidden rounded-[32px] border border-[var(--border)] bg-[rgba(255,255,255,0.84)] shadow-[0_28px_80px_-48px_rgba(8,18,15,0.48)] backdrop-blur"
              >
                <div className="relative h-60 sm:h-80">
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

                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
                    <Icon size={16} />
                    {journey.accent}
                  </div>

                  <h3 className="font-display mt-4 text-2xl text-[var(--forest)] sm:text-3xl">
                    {journey.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                    {journey.description}
                  </p>

                  <div className="mt-5 flex items-end justify-between gap-4 sm:mt-6 sm:gap-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:rgba(19,32,24,0.58)]">
                        Length
                      </p>
                      <p className="mt-1 text-lg font-semibold text-[var(--forest)]">
                        {journey.duration}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:rgba(19,32,24,0.58)]">
                        Price guide
                      </p>
                      <p className="mt-1 text-lg font-semibold text-[var(--forest)]">
                        {journey.price}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {journey.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="rounded-full bg-[var(--sand)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--forest)]"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>

                  <TrackedLink
                    href={`/journeys/${journey.slug}`}
                    eventName="journey_select"
                    eventParams={{ section: "featured_packages", journey_slug: journey.slug }}
                    className="mt-8 inline-flex items-center gap-3 font-semibold text-[var(--forest)] transition hover:text-[var(--gold)]"
                  >
                    View full journey
                    <ArrowRight size={16} />
                  </TrackedLink>

                  <TrackedLink
                    href={buildTripPlanHref("/custom-itinerary", [
                      { journeySlug: journey.slug, staySlugs: [] },
                    ])}
                    eventName="cta_click"
                    eventParams={{
                      section: "featured_packages",
                      action: "start_with_journey",
                      journey_slug: journey.slug,
                    }}
                    className="mt-4 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--forest-soft)]"
                  >
                    Start with this route
                    <ArrowRight size={16} />
                  </TrackedLink>
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-10 rounded-[30px] border border-[var(--border)] bg-[rgba(255,250,243,0.86)] p-6 shadow-[0_24px_70px_-48px_rgba(8,18,15,0.4)] backdrop-blur">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                {content.helpEyebrow}
              </p>
              <p className="mt-3 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                {content.helpText}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <TrackedLink
                href="/journeys"
                eventName="cta_click"
                eventParams={{ section: "featured_packages", action: "browse_all_journeys" }}
                className="inline-flex items-center justify-center gap-3 rounded-full border border-[rgba(16,37,28,0.14)] bg-white/75 px-6 py-3 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
              >
                {content.browseLabel}
                <ArrowRight size={16} />
              </TrackedLink>
              <TrackedLink
                href="/custom-itinerary"
                eventName="cta_click"
                eventParams={{ section: "featured_packages", action: "help_me_choose" }}
                className="inline-flex items-center justify-center gap-3 rounded-full bg-[var(--forest)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--forest-soft)]"
              >
                {content.chooseLabel}
                <ArrowRight size={16} />
              </TrackedLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
