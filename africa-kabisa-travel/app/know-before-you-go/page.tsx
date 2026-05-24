import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BedDouble,
  CalendarRange,
  MapPinned,
  MessageCircle,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import { brandPagesContent } from "@/brand-pages-content";
import { siteConfig } from "@/lib/site";

const knowBeforeYouGoContent = brandPagesContent.knowBeforeYouGo;
const rhythmIcons = [CalendarRange, ShieldCheck, BedDouble, MapPinned];

export const metadata: Metadata = {
  title: "Know Before You Go for Tanzania Travel",
  description:
    "Read practical Tanzania travel tips for arrival, packing, money, connectivity, and preparation before safari, Kilimanjaro, Zanzibar, or combined trips.",
  alternates: {
    canonical: "/know-before-you-go",
  },
  openGraph: {
    title: "Know Before You Go for Tanzania Travel",
    description:
      "Read practical Tanzania travel tips for arrival, packing, money, connectivity, and trip preparation.",
    url: "/know-before-you-go",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Know before you go Tanzania travel guidance",
      },
    ],
  },
};

export default function KnowBeforeYouGoPage() {
  return (
    <main className="pb-24">
      <section className="relative isolate overflow-hidden px-6 pb-16 pt-10">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(196,150,85,0.18),transparent_36%),linear-gradient(180deg,rgba(250,246,238,0.92),rgba(244,237,224,0.78))]" />
        <div className="absolute inset-y-10 left-1/2 -z-10 hidden h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[rgba(16,37,28,0.08)] blur-3xl lg:block" />

        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              {knowBeforeYouGoContent.eyebrow}
            </p>
            <h1 className="font-display mt-4 text-4xl text-[var(--forest)] sm:text-5xl xl:text-6xl">
              {knowBeforeYouGoContent.title}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[color:rgba(19,32,24,0.74)] sm:text-lg">
              {knowBeforeYouGoContent.description}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {knowBeforeYouGoContent.highlights.map((highlight) => (
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
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_1fr]">
          <article className="rounded-[32px] border border-[var(--border)] bg-[rgba(255,255,255,0.82)] p-8 shadow-[0_26px_70px_-48px_rgba(8,18,15,0.45)] backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              Arrival
            </p>
            <h2 className="font-display mt-4 text-4xl text-[var(--forest)]">
              {knowBeforeYouGoContent.arrivalTitle}
            </h2>
            <p className="mt-4 text-sm leading-8 text-[color:rgba(19,32,24,0.72)]">
              {knowBeforeYouGoContent.arrivalDescription}
            </p>

            <div className="mt-8 space-y-4">
              {knowBeforeYouGoContent.arrivalPoints.map((item) => (
                <div key={item} className="flex gap-3">
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--gold)]" />
                  <p className="text-sm leading-7 text-[var(--forest)]">{item}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[32px] bg-[var(--forest)] p-8 text-white shadow-[0_28px_70px_-42px_rgba(8,18,15,0.8)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold-soft)]">
              Packing
            </p>
            <h2 className="font-display mt-4 text-4xl text-white">
              {knowBeforeYouGoContent.packingTitle}
            </h2>
            <p className="mt-4 text-sm leading-8 text-white/74">
              {knowBeforeYouGoContent.packingDescription}
            </p>

            <div className="mt-8 space-y-4">
              {knowBeforeYouGoContent.packingPoints.map((item) => (
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
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-[32px] border border-[var(--border)] bg-[rgba(255,250,243,0.86)] p-8 shadow-[0_24px_70px_-48px_rgba(8,18,15,0.42)] backdrop-blur">
            <div className="inline-flex rounded-full bg-[var(--sand)] p-3 text-[var(--forest)]">
              <WalletCards size={18} />
            </div>
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              Money and comfort
            </p>
            <h2 className="font-display mt-4 text-4xl text-[var(--forest)]">
              {knowBeforeYouGoContent.moneyTitle}
            </h2>
            <p className="mt-4 text-sm leading-8 text-[color:rgba(19,32,24,0.72)]">
              {knowBeforeYouGoContent.moneyDescription}
            </p>

            <div className="mt-8 space-y-4">
              {knowBeforeYouGoContent.moneyPoints.map((item) => (
                <div key={item} className="flex gap-3">
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--gold)]" />
                  <p className="text-sm leading-7 text-[var(--forest)]">{item}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[32px] border border-[var(--border)] bg-[rgba(255,255,255,0.84)] p-8 shadow-[0_24px_70px_-48px_rgba(8,18,15,0.42)] backdrop-blur">
            <div className="inline-flex rounded-full bg-[var(--sand)] p-3 text-[var(--forest)]">
              <MessageCircle size={18} />
            </div>
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              Staying connected
            </p>
            <h2 className="font-display mt-4 text-4xl text-[var(--forest)]">
              {knowBeforeYouGoContent.connectivityTitle}
            </h2>
            <p className="mt-4 text-sm leading-8 text-[color:rgba(19,32,24,0.72)]">
              {knowBeforeYouGoContent.connectivityDescription}
            </p>

            <div className="mt-8 space-y-4">
              {knowBeforeYouGoContent.connectivityPoints.map((item) => (
                <div key={item} className="flex gap-3">
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--gold)]" />
                  <p className="text-sm leading-7 text-[var(--forest)]">{item}</p>
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
              <div className="inline-flex rounded-full bg-[var(--sand)] p-3 text-[var(--forest)]">
                <ShieldCheck size={18} />
              </div>
              <p className="mt-5 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                Official checks
              </p>
              <h2 className="font-display mt-4 max-w-2xl text-4xl text-[var(--forest)]">
                {knowBeforeYouGoContent.healthTitle}
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-8 text-[color:rgba(19,32,24,0.72)]">
                {knowBeforeYouGoContent.healthDescription}
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {knowBeforeYouGoContent.healthPoints.map((item) => (
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

      <section className="px-6 py-6">
        <div className="mx-auto max-w-7xl rounded-[34px] bg-[linear-gradient(160deg,rgba(196,150,85,0.18),rgba(16,37,28,0.92))] p-8 text-white shadow-[0_26px_70px_-48px_rgba(8,18,15,0.55)] lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/72">
                Trip rhythm
              </p>
              <h2 className="font-display mt-4 max-w-2xl text-4xl text-white">
                {knowBeforeYouGoContent.rhythmTitle}
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-8 text-white/82">
                {knowBeforeYouGoContent.rhythmDescription}
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {knowBeforeYouGoContent.rhythmItems.map((item, index) => {
                const Icon = rhythmIcons[index] ?? CalendarRange;

                return (
                  <article
                    key={item.title}
                    className="rounded-[28px] border border-white/10 bg-white/6 p-6 backdrop-blur"
                  >
                    <div className="inline-flex rounded-full bg-white/10 p-3 text-[var(--gold-soft)]">
                      <Icon size={18} />
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/78">{item.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl rounded-[34px] border border-[var(--border)] bg-[rgba(255,255,255,0.88)] p-8 shadow-[0_26px_70px_-48px_rgba(8,18,15,0.42)] lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
            Final note
          </p>
          <h2 className="font-display mt-4 max-w-3xl text-4xl text-[var(--forest)]">
            {knowBeforeYouGoContent.reminderTitle}
          </h2>
          <p className="mt-5 max-w-3xl text-sm leading-8 text-[color:rgba(19,32,24,0.72)]">
            {knowBeforeYouGoContent.reminderDescription}
          </p>

          <div className="mt-8 rounded-[28px] bg-[rgba(255,250,243,0.86)] p-6">
            <h3 className="font-display text-2xl text-[var(--forest)]">
              {knowBeforeYouGoContent.ctaTitle}
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
              {knowBeforeYouGoContent.ctaDescription}
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
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
        </div>
      </section>
    </main>
  );
}
