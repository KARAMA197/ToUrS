import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarRange,
  Compass,
  MapPinned,
  ShieldCheck,
} from "lucide-react";
import { brandPagesContent } from "@/brand-pages-content";
import { siteConfig } from "@/lib/site";

const responsibleTravelContent = brandPagesContent.responsibleTravel;
const principleIcons = [MapPinned, CalendarRange, Compass, ShieldCheck];

export const metadata: Metadata = {
  title: "Responsible Travel in Tanzania",
  description:
    `See how ${siteConfig.name} approaches responsible Tanzania travel through clear planning, wildlife respect, honest route advice, and care for place and pace.`,
  alternates: {
    canonical: "/responsible-travel",
  },
  openGraph: {
    title: "Responsible Travel in Tanzania",
    description:
      `See how ${siteConfig.name} approaches responsible Tanzania travel through clear planning and respectful route design.`,
    url: "/responsible-travel",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `Responsible travel guidance from ${siteConfig.name}`,
      },
    ],
  },
};

export default function ResponsibleTravelPage() {
  return (
    <main className="pb-24">
      <section className="relative isolate overflow-hidden px-6 pb-16 pt-10">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(196,150,85,0.18),transparent_36%),linear-gradient(180deg,rgba(250,246,238,0.92),rgba(244,237,224,0.78))]" />
        <div className="absolute inset-y-10 left-1/2 -z-10 hidden h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[rgba(16,37,28,0.08)] blur-3xl lg:block" />

        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              {responsibleTravelContent.eyebrow}
            </p>
            <h1 className="font-display mt-4 text-4xl text-[var(--forest)] sm:text-5xl xl:text-6xl">
              {responsibleTravelContent.title}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[color:rgba(19,32,24,0.74)] sm:text-lg">
              {responsibleTravelContent.description}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {responsibleTravelContent.highlights.map((highlight) => (
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
              href="/how-we-plan"
              className="inline-flex items-center gap-3 rounded-full border border-[rgba(16,37,28,0.14)] bg-white/75 px-6 py-3 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
            >
              See how we plan trips
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="mx-auto max-w-7xl rounded-[34px] border border-[var(--border)] bg-[rgba(255,255,255,0.84)] p-8 shadow-[0_26px_70px_-48px_rgba(8,18,15,0.45)] backdrop-blur lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                Standards
              </p>
              <h2 className="font-display mt-4 max-w-2xl text-4xl text-[var(--forest)]">
                {responsibleTravelContent.principlesTitle}
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-8 text-[color:rgba(19,32,24,0.72)]">
                {responsibleTravelContent.principlesDescription}
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {responsibleTravelContent.principles.map((principle, index) => {
                const Icon = principleIcons[index] ?? ShieldCheck;

                return (
                  <article
                    key={principle.title}
                    className="rounded-[28px] border border-[var(--border)] bg-[rgba(255,250,243,0.86)] p-6 shadow-[0_22px_60px_-46px_rgba(8,18,15,0.4)]"
                  >
                    <div className="inline-flex rounded-full bg-white p-3 text-[var(--forest)]">
                      <Icon size={18} />
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-[var(--forest)]">
                      {principle.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                      {principle.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-6">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_1fr]">
          <article className="rounded-[32px] border border-[var(--border)] bg-[rgba(255,250,243,0.86)] p-8 shadow-[0_24px_70px_-48px_rgba(8,18,15,0.42)] backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              Wildlife respect
            </p>
            <h2 className="font-display mt-4 text-4xl text-[var(--forest)]">
              {responsibleTravelContent.wildlifeTitle}
            </h2>
            <p className="mt-4 text-sm leading-8 text-[color:rgba(19,32,24,0.72)]">
              {responsibleTravelContent.wildlifeDescription}
            </p>

            <div className="mt-8 space-y-4">
              {responsibleTravelContent.wildlifePoints.map((item) => (
                <div key={item} className="flex gap-3">
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--gold)]" />
                  <p className="text-sm leading-7 text-[var(--forest)]">{item}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[32px] bg-[var(--forest)] p-8 text-white shadow-[0_28px_70px_-42px_rgba(8,18,15,0.8)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold-soft)]">
              Local respect
            </p>
            <h2 className="font-display mt-4 text-4xl text-white">
              {responsibleTravelContent.localTitle}
            </h2>
            <p className="mt-4 text-sm leading-8 text-white/74">
              {responsibleTravelContent.localDescription}
            </p>

            <div className="mt-8 space-y-4">
              {responsibleTravelContent.localPoints.map((item) => (
                <div key={item} className="flex gap-3">
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--gold-soft)]" />
                  <p className="text-sm leading-7 text-white/82">{item}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="px-6 py-6">
        <div className="mx-auto max-w-7xl rounded-[34px] border border-[var(--border)] bg-[rgba(255,255,255,0.88)] p-8 shadow-[0_26px_70px_-48px_rgba(8,18,15,0.42)] lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                Traveler care
              </p>
              <h2 className="font-display mt-4 max-w-2xl text-4xl text-[var(--forest)]">
                {responsibleTravelContent.planningTitle}
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-8 text-[color:rgba(19,32,24,0.72)]">
                {responsibleTravelContent.planningDescription}
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {responsibleTravelContent.planningPoints.map((item) => (
                <article
                  key={item}
                  className="rounded-[28px] border border-[var(--border)] bg-[rgba(255,250,243,0.86)] p-6 shadow-[0_22px_60px_-46px_rgba(8,18,15,0.4)]"
                >
                  <div className="inline-flex rounded-full bg-white p-3 text-[var(--forest)]">
                    <ShieldCheck size={18} />
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">{item}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl rounded-[34px] bg-[linear-gradient(160deg,rgba(196,150,85,0.18),rgba(16,37,28,0.92))] p-8 text-white shadow-[0_26px_70px_-48px_rgba(8,18,15,0.55)] lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/72">
            Closing thought
          </p>
          <h2 className="font-display mt-4 max-w-3xl text-4xl text-white">
            {responsibleTravelContent.closingTitle}
          </h2>
          <p className="mt-5 max-w-3xl text-sm leading-8 text-white/82">
            {responsibleTravelContent.closingDescription}
          </p>

          <div className="mt-8 rounded-[28px] border border-white/10 bg-white/6 p-6 backdrop-blur">
            <h3 className="font-display text-2xl text-white">{responsibleTravelContent.ctaTitle}</h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/78">
              {responsibleTravelContent.ctaDescription}
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/custom-itinerary"
                className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--forest)] transition hover:bg-[var(--sand)]"
              >
                Share my trip ideas
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 rounded-full border border-white/18 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/34 hover:bg-white/8"
              >
                Talk to us first
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
