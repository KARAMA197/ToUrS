import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarRange,
  Compass,
  MapPinned,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import { brandPagesContent } from "@/brand-pages-content";
import { siteConfig } from "@/lib/site";

const beforeYouBookContent = brandPagesContent.beforeYouBook;
const firstReplyIcons = [Compass, CalendarRange, WalletCards, MapPinned];

export const metadata: Metadata = {
  title: "Before You Book Your Tanzania Trip",
  description:
    "See what a helpful first reply should include before you book a Tanzania safari, Kilimanjaro climb, Zanzibar holiday, or combined trip.",
  alternates: {
    canonical: "/before-you-book",
  },
  openGraph: {
    title: "Before You Book Your Tanzania Trip",
    description:
      "See what a helpful first reply should include before you book a Tanzania safari, Kilimanjaro climb, Zanzibar holiday, or combined trip.",
    url: "/before-you-book",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Before you book a Tanzania trip",
      },
    ],
  },
};

export default function BeforeYouBookPage() {
  return (
    <main className="pb-24">
      <section className="relative isolate overflow-hidden px-6 pb-16 pt-10">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(196,150,85,0.18),transparent_36%),linear-gradient(180deg,rgba(250,246,238,0.92),rgba(244,237,224,0.78))]" />
        <div className="absolute inset-y-10 left-1/2 -z-10 hidden h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[rgba(16,37,28,0.08)] blur-3xl lg:block" />

        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              {beforeYouBookContent.eyebrow}
            </p>
            <h1 className="font-display mt-4 text-4xl text-[var(--forest)] sm:text-5xl xl:text-6xl">
              {beforeYouBookContent.title}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[color:rgba(19,32,24,0.74)] sm:text-lg">
              {beforeYouBookContent.description}
            </p>
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
              href="/contact"
              className="inline-flex items-center gap-3 rounded-full border border-[rgba(16,37,28,0.14)] bg-white/75 px-6 py-3 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
            >
              Talk to us first
            </Link>
            <Link
              href="/know-before-you-go"
              className="inline-flex items-center gap-3 rounded-full border border-[rgba(16,37,28,0.14)] bg-white/75 px-6 py-3 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
            >
              Know before you go
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {beforeYouBookContent.processSteps.map((step, index) => (
              <article
                key={step.title}
                className="rounded-[24px] border border-[var(--border)] bg-white/78 p-5 shadow-[0_24px_60px_-38px_rgba(8,18,15,0.45)] backdrop-blur"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--sand)] text-sm font-semibold text-[var(--forest)]">
                    0{index + 1}
                  </span>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:rgba(19,32,24,0.58)]">
                    Next step
                  </p>
                </div>
                <h2 className="mt-4 text-xl font-semibold text-[var(--forest)]">{step.title}</h2>
                <p className="mt-3 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <article className="rounded-[32px] border border-[var(--border)] bg-[rgba(255,255,255,0.82)] p-8 shadow-[0_26px_70px_-48px_rgba(8,18,15,0.45)] backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              First reply
            </p>
            <h2 className="font-display mt-4 text-4xl text-[var(--forest)]">
              {beforeYouBookContent.firstReplyTitle}
            </h2>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {beforeYouBookContent.firstReplyItems.map((item, index) => {
                const Icon = firstReplyIcons[index] ?? Compass;

                return (
                  <article
                    key={item}
                    className="rounded-[26px] border border-[var(--border)] bg-white p-6"
                  >
                    <div className="mb-4 inline-flex rounded-full bg-[var(--sand)] p-3 text-[var(--forest)]">
                      <Icon size={18} />
                    </div>
                    <p className="text-sm leading-7 text-[var(--forest)]">{item}</p>
                  </article>
                );
              })}
            </div>
          </article>

          <article className="rounded-[32px] bg-[var(--forest)] p-8 text-white shadow-[0_28px_70px_-42px_rgba(8,18,15,0.8)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold-soft)]">
              Price guidance
            </p>
            <h2 className="font-display mt-4 text-4xl text-white">
              {beforeYouBookContent.priceTitle}
            </h2>
            <div className="mt-8 space-y-4">
              {beforeYouBookContent.priceItems.map((item) => (
                <div key={item} className="flex gap-3">
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--gold-soft)]" />
                  <p className="text-sm leading-7 text-white/82">{item}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm leading-7 text-white/68">
              Good planning should show why the price moves, not just present one number without
              context.
            </p>
          </article>
        </div>
      </section>

      <section className="px-6 py-6">
        <div className="mx-auto max-w-7xl rounded-[34px] border border-[var(--border)] bg-[rgba(255,250,243,0.86)] p-8 shadow-[0_24px_70px_-48px_rgba(8,18,15,0.42)] backdrop-blur lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                Planning protection
              </p>
              <h2 className="font-display mt-4 max-w-2xl text-4xl text-[var(--forest)]">
                {beforeYouBookContent.planningTitle}
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-8 text-[color:rgba(19,32,24,0.72)]">
                Strong planning keeps the route realistic and makes the next decision easier.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {beforeYouBookContent.planningItems.map((item) => (
                <article
                  key={item}
                  className="rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[0_22px_60px_-46px_rgba(8,18,15,0.4)]"
                >
                  <div className="inline-flex rounded-full bg-[var(--sand)] p-3 text-[var(--forest)]">
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
            Ready to start
          </p>
          <h2 className="font-display mt-4 max-w-3xl text-4xl text-white">
            {beforeYouBookContent.ctaTitle}
          </h2>
          <p className="mt-5 max-w-3xl text-sm leading-8 text-white/82">
            {beforeYouBookContent.ctaDescription}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
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
              See contact details
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
