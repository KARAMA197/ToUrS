"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  ArrowRight,
  CalendarDays,
  Compass,
  Mountain,
  ShieldCheck,
  Waves,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import TrackedLink from "@/components/TrackedLink";
import type { HomepageContent } from "@/homepage-content-schema";
import { usePrimaryCtaExperiment } from "@/lib/experiments";
import { buildWhatsAppUrl } from "@/lib/contact";

const highlightIcons = [ShieldCheck, Mountain, Waves];
const journeyNoteIcons = [CalendarDays, Compass];
const tripDirections = [
  { label: "Safari", href: "/journeys/classic-northern-circuit" },
  { label: "Kilimanjaro", href: "/journeys/machame-kilimanjaro-ascent" },
  { label: "Zanzibar", href: "/journeys/zanzibar-recovery-escape" },
  { label: "Custom route", href: "/custom-itinerary" },
];

type HeroProps = {
  content: HomepageContent["hero"];
};

export default function Hero({ content }: HeroProps) {
  const primaryCta = usePrimaryCtaExperiment("hero");
  const whatsappUrl = buildWhatsAppUrl(
    "Hello, I would like to start planning a Tanzania trip."
  );

  return (
    <section id="home" className="relative overflow-hidden bg-[#08120f] px-5 pb-20 pt-8 text-white sm:px-6 sm:pb-28 sm:pt-12">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top_left,rgba(200,154,70,0.24),transparent_32%),radial-gradient(circle_at_85%_12%,rgba(255,255,255,0.08),transparent_22%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-10 sm:gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex rounded-full border border-white/10 bg-white/[0.07] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--gold-soft)] backdrop-blur"
          >
            {content.eyebrow}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display mt-6 max-w-4xl text-4xl leading-[1.02] sm:text-6xl sm:leading-[0.96] lg:text-7xl"
          >
            {content.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-5 max-w-2xl text-base leading-7 text-white/74 sm:mt-6 sm:text-lg sm:leading-8"
          >
            {content.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4"
          >
            <TrackedLink
              href="/custom-itinerary"
              eventName="cta_click"
              eventParams={{
                section: "hero",
                action: "primary_cta",
                experiment_name: "primary_cta_copy",
                experiment_variant: primaryCta.id,
              }}
              className="inline-flex items-center justify-center gap-3 rounded-full bg-[var(--gold)] px-7 py-4 font-semibold text-[var(--forest)] transition hover:brightness-105"
            >
              {primaryCta.label}
              <ArrowRight size={18} />
            </TrackedLink>
            <TrackedLink
              href="/#featured-packages"
              eventName="cta_click"
              eventParams={{ section: "hero", action: "see_trip_ideas" }}
              className="inline-flex items-center justify-center rounded-full border border-white/16 px-7 py-4 font-semibold text-white transition hover:bg-white/8"
            >
              See trip ideas
            </TrackedLink>
            <TrackedLink
              href={whatsappUrl}
              eventName="whatsapp_click"
              eventParams={{ section: "hero", action: "quick_whatsapp" }}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/16 px-7 py-4 font-semibold text-white transition hover:bg-white/8"
            >
              WhatsApp us
            </TrackedLink>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-6 flex flex-wrap gap-3 text-sm text-white/70"
          >
            {[
              "Private Tanzania planning",
              "Safari, Kilimanjaro, and Zanzibar",
              "Reply within 24 hours",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 backdrop-blur"
              >
                {item}
              </span>
            ))}
          </motion.div>

          <motion.nav
            aria-label="Popular Tanzania trip starts"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-5 flex flex-wrap items-center gap-2 rounded-[24px] border border-white/10 bg-white/[0.05] p-2 backdrop-blur"
          >
            <span className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold-soft)]">
              Start with
            </span>
            {tripDirections.map((direction) => (
              <TrackedLink
                key={direction.label}
                href={direction.href}
                eventName="cta_click"
                eventParams={{
                  section: "hero_trip_directions",
                  action: "open_trip_direction",
                  direction: direction.label,
                }}
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-[var(--gold-soft)] hover:text-[var(--gold-soft)]"
              >
                {direction.label}
              </TrackedLink>
            ))}
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-3 sm:gap-4"
          >
            {content.highlights.map((item, index) => {
              const Icon = highlightIcons[index] ?? ShieldCheck;

              return (
                <div
                  key={item.title}
                  className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.04))] p-4 backdrop-blur sm:rounded-[24px] sm:p-5"
                >
                  <div className="mb-4 inline-flex rounded-full bg-[var(--gold)]/18 p-3 text-[var(--gold-soft)]">
                    <Icon size={18} />
                  </div>
                  <h2 className="text-lg font-semibold text-white">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-white/72 sm:leading-7">{item.description}</p>
                </div>
              );
            })}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -inset-6 rounded-[40px] bg-[radial-gradient(circle,rgba(200,154,70,0.18),transparent_60%)] blur-3xl" />
          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#10251f] shadow-[0_35px_120px_-40px_rgba(8,18,15,0.85)]">
            <div className="relative h-[460px] sm:h-[560px]">
              <Image
                src="/images/tour-gallery/safari-dust-road.jpeg"
                alt="Safari vehicles crossing a Tanzania landscape at golden hour"
                fill
                priority
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#08120f]/12 via-[#08120f]/38 to-[#08120f]" />
            </div>

            <div className="absolute inset-x-0 top-0 p-4 sm:p-8">
              <div className="max-w-sm rounded-[24px] border border-white/14 bg-[linear-gradient(180deg,rgba(0,0,0,0.3),rgba(0,0,0,0.24))] p-4 shadow-[0_26px_70px_-40px_rgba(8,18,15,0.75)] backdrop-blur-md sm:rounded-[28px] sm:p-5">
                <div className="mb-3 inline-flex rounded-[22px] border border-white/12 bg-white/8 px-3 py-2 sm:mb-4">
                  <BrandLogo tone="light" size="sm" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--gold-soft)]">
                  {content.featuredJourneyEyebrow}
                </p>
                <h2 className="font-display mt-3 text-2xl leading-[1.04] sm:text-3xl sm:leading-[1.02]">
                  {content.featuredJourneyTitle}
                </h2>
                <p className="mt-3 text-sm leading-6 text-white/72 sm:leading-7">
                  {content.featuredJourneyDescription}
                </p>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-8">
              <div className="grid gap-3 sm:grid-cols-2">
                {content.journeyNotes.map((item, index) => {
                  const Icon = journeyNoteIcons[index] ?? Compass;

                  return (
                    <div
                      key={item.title}
                      className="rounded-[22px] border border-white/12 bg-[linear-gradient(180deg,rgba(0,0,0,0.28),rgba(0,0,0,0.2))] p-4 backdrop-blur-md sm:rounded-[24px] sm:p-5"
                    >
                      <div className="mb-3 inline-flex rounded-full bg-white/10 p-3 text-white">
                        <Icon size={18} />
                      </div>
                      <h3 className="text-base font-semibold">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-white/72 sm:leading-7">{item.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
