import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BedDouble,
  CalendarRange,
  Compass,
  MapPinned,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from "lucide-react";
import { brandPagesContent } from "@/brand-pages-content";
import { businessConfig } from "@/lib/business";
import { siteConfig } from "@/lib/site";

const howWePlanContent = brandPagesContent.howWePlan;
const processIcons = [MessageCircle, Compass, BedDouble, CalendarRange, ShieldCheck];
const fitIcons = [CalendarRange, Compass, WalletCards, MapPinned];

export const metadata: Metadata = {
  title: "How We Plan Your Tanzania Trip",
  description:
    `See how ${siteConfig.name} turns your dates, budget, and travel style into a clearer Tanzania safari, Kilimanjaro, Zanzibar, or combined trip plan.`,
  alternates: {
    canonical: "/how-we-plan",
  },
  openGraph: {
    title: "How We Plan Your Tanzania Trip",
    description:
      `See how ${siteConfig.name} turns your dates, budget, and travel style into a clearer Tanzania route and trip plan.`,
    url: "/how-we-plan",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `How ${siteConfig.name} plans Tanzania trips`,
      },
    ],
  },
};

export default function HowWePlanPage() {
  return (
    <main className="pb-24">
      <section className="relative isolate overflow-hidden px-6 pb-16 pt-10">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(196,150,85,0.18),transparent_36%),linear-gradient(180deg,rgba(250,246,238,0.92),rgba(244,237,224,0.78))]" />
        <div className="absolute inset-y-10 left-1/2 -z-10 hidden h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[rgba(16,37,28,0.08)] blur-3xl lg:block" />

        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              {howWePlanContent.eyebrow}
            </p>
            <h1 className="font-display mt-4 text-4xl text-[var(--forest)] sm:text-5xl xl:text-6xl">
              {howWePlanContent.title}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[color:rgba(19,32,24,0.74)] sm:text-lg">
              {howWePlanContent.description}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {howWePlanContent.highlights.map((highlight) => (
              <span
                key={highlight}
                className="rounded-full border border-[rgba(16,37,28,0.12)] bg-white/82 px-4 py-2 text-sm font-semibold text-[var(--forest)] shadow-[0_18px_30px_-24px_rgba(8,18,15,0.24)]"
              >
                {highlight}
              </span>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/custom-itinerary"
              className="inline-flex items-center gap-3 rounded-full bg-[var(--forest)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--gold)] hover:text-[var(--forest)]"
            >
              Plan my trip
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/before-you-book"
              className="inline-flex items-center gap-3 rounded-full border border-[rgba(16,37,28,0.14)] bg-white/75 px-6 py-3 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
            >
              Read before you book
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <article className="rounded-[24px] border border-[var(--border)] bg-white/78 p-5 shadow-[0_24px_60px_-38px_rgba(8,18,15,0.45)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:rgba(19,32,24,0.58)]">
                Reply target
              </p>
              <p className="mt-3 text-2xl font-semibold text-[var(--forest)]">
                {businessConfig.responseTime}
              </p>
              <p className="mt-2 text-sm leading-7 text-[color:rgba(19,32,24,0.68)]">
                We aim to come back with a useful first direction instead of a generic reply.
              </p>
            </article>

            <article className="rounded-[24px] border border-[var(--border)] bg-white/78 p-5 shadow-[0_24px_60px_-38px_rgba(8,18,15,0.45)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:rgba(19,32,24,0.58)]">
                Trip style
              </p>
              <p className="mt-3 text-2xl font-semibold text-[var(--forest)]">Private planning</p>
              <p className="mt-2 text-sm leading-7 text-[color:rgba(19,32,24,0.68)]">
                Safari, Kilimanjaro, Zanzibar, and mixed Tanzania journeys shaped around your trip.
              </p>
            </article>

            <article className="rounded-[24px] border border-[var(--border)] bg-white/78 p-5 shadow-[0_24px_60px_-38px_rgba(8,18,15,0.45)] backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:rgba(19,32,24,0.58)]">
                Support style
              </p>
              <p className="mt-3 text-2xl font-semibold text-[var(--forest)]">Clear next steps</p>
              <p className="mt-2 text-sm leading-7 text-[color:rgba(19,32,24,0.68)]">
                We explain route logic, stay direction, and what to do next in simple language.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="mx-auto max-w-7xl rounded-[34px] border border-[var(--border)] bg-[rgba(255,255,255,0.84)] p-8 shadow-[0_26px_70px_-48px_rgba(8,18,15,0.45)] backdrop-blur lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                Planning flow
              </p>
              <h2 className="font-display mt-4 max-w-2xl text-4xl text-[var(--forest)]">
                {howWePlanContent.processTitle}
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-8 text-[color:rgba(19,32,24,0.72)]">
                {howWePlanContent.processDescription}
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {howWePlanContent.processSteps.map((step, index) => {
                const Icon = processIcons[index] ?? Compass;

                return (
                  <article
                    key={step.title}
                    className="rounded-[28px] border border-[var(--border)] bg-[rgba(255,250,243,0.78)] p-6 shadow-[0_22px_60px_-46px_rgba(8,18,15,0.4)]"
                  >
                    <div className="inline-flex rounded-full bg-[var(--sand)] p-3 text-[var(--forest)]">
                      <Icon size={18} />
                    </div>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
                      Step {index + 1}
                    </p>
                    <h3 className="mt-3 text-xl font-semibold text-[var(--forest)]">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                      {step.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-6">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-[32px] border border-[var(--border)] bg-[rgba(255,250,243,0.86)] p-8 shadow-[0_24px_70px_-48px_rgba(8,18,15,0.42)] backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              Route fit
            </p>
            <h2 className="font-display mt-4 text-4xl text-[var(--forest)]">
              {howWePlanContent.fitTitle}
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-8 text-[color:rgba(19,32,24,0.72)]">
              {howWePlanContent.fitDescription}
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {howWePlanContent.fitFactors.map((factor, index) => {
                const Icon = fitIcons[index] ?? Compass;

                return (
                  <article
                    key={factor.title}
                    className="rounded-[26px] border border-[var(--border)] bg-white p-6"
                  >
                    <div className="mb-4 inline-flex rounded-full bg-[var(--sand)] p-3 text-[var(--forest)]">
                      <Icon size={18} />
                    </div>
                    <h3 className="text-xl font-semibold text-[var(--forest)]">{factor.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                      {factor.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </article>

          <article className="rounded-[32px] bg-[var(--forest)] p-8 text-white shadow-[0_28px_70px_-42px_rgba(8,18,15,0.8)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold-soft)]">
              Good first reply
            </p>
            <h2 className="font-display mt-4 text-4xl text-white">
              {howWePlanContent.replyTitle}
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/74">
              {howWePlanContent.replyDescription}
            </p>

            <div className="mt-8 space-y-4">
              {howWePlanContent.replyPoints.map((point) => (
                <div key={point} className="flex gap-3">
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--gold-soft)]" />
                  <p className="text-sm leading-7 text-white/82">{point}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[24px] border border-white/10 bg-white/6 p-5">
              <div className="inline-flex rounded-full bg-white/10 p-3 text-[var(--gold-soft)]">
                <Sparkles size={18} />
              </div>
              <p className="mt-4 text-sm leading-7 text-white/74">
                The goal is simple: by the end of the first reply, your trip should feel more
                organized and easier to move forward with.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="px-6 py-6">
        <div className="mx-auto max-w-7xl rounded-[34px] bg-[linear-gradient(160deg,rgba(196,150,85,0.18),rgba(16,37,28,0.92))] p-8 text-white shadow-[0_26px_70px_-48px_rgba(8,18,15,0.55)] lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/72">
                What to send
              </p>
              <h2 className="font-display mt-4 max-w-2xl text-4xl text-white">
                {howWePlanContent.checklistTitle}
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-8 text-white/82">
                {howWePlanContent.checklistDescription}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {howWePlanContent.checklistItems.map((item) => (
                <article
                  key={item}
                  className="rounded-[24px] border border-white/10 bg-white/6 p-5 backdrop-blur"
                >
                  <p className="text-sm leading-7 text-white/84">{item}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl rounded-[34px] border border-[var(--border)] bg-[rgba(255,255,255,0.88)] p-8 shadow-[0_26px_70px_-48px_rgba(8,18,15,0.42)] lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
            Ready to start
          </p>
          <h2 className="font-display mt-4 max-w-3xl text-4xl text-[var(--forest)]">
            {howWePlanContent.closingTitle}
          </h2>
          <p className="mt-5 max-w-3xl text-sm leading-8 text-[color:rgba(19,32,24,0.72)]">
            {howWePlanContent.closingDescription}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/custom-itinerary"
              className="inline-flex items-center gap-3 rounded-full bg-[var(--forest)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--forest-soft)]"
            >
              Share my trip ideas
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 rounded-full border border-[rgba(16,37,28,0.14)] bg-white px-6 py-3 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
            >
              Talk to us first
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
