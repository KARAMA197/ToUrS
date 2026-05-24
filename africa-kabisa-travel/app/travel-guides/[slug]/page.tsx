import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarRange,
  Clock3,
  Compass,
  Heart,
  Mountain,
  Sparkles,
  Users,
  Waves,
} from "lucide-react";
import { getJourneyBySlug } from "@/journeys-data";
import { getGuideBySlug, getGuideSlugs } from "@/guides-data";
import TrackedLink from "@/components/TrackedLink";
import { siteConfig } from "@/lib/site";

const iconMap = {
  compass: Compass,
  mountain: Mountain,
  waves: Waves,
  heart: Heart,
  users: Users,
};

type GuideDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: GuideDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return {
      title: `Guide not found | ${siteConfig.name}`,
    };
  }

  return {
    title: guide.title,
    description: guide.description,
    alternates: {
      canonical: `/travel-guides/${guide.slug}`,
    },
    openGraph: {
      title: `${guide.title} | ${siteConfig.name}`,
      description: guide.description,
      url: `/travel-guides/${guide.slug}`,
      images: [
        {
          url: guide.image,
          width: 1200,
          height: 630,
          alt: guide.title,
        },
      ],
    },
  };
}

export default async function GuideDetailPage({ params }: GuideDetailPageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const Icon = iconMap[guide.iconKey];
  const relatedJourney = getJourneyBySlug(guide.relatedJourneySlug);
  const guideSupportUrl = `/ai-support?guide=${guide.slug}`;

  const quickFacts = [
    {
      label: "Best time",
      value: guide.bestTime,
      icon: CalendarRange,
    },
    {
      label: "Ideal length",
      value: guide.idealLength,
      icon: Clock3,
    },
    {
      label: "Good for",
      value: guide.goodFor,
      icon: Icon,
    },
    {
      label: "Focus",
      value: guide.category,
      icon: Sparkles,
    },
  ];

  return (
    <main className="pb-24">
      <section className="relative isolate overflow-hidden px-6 pb-16 pt-10">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(196,150,85,0.18),transparent_36%),linear-gradient(180deg,rgba(250,246,238,0.92),rgba(244,237,224,0.78))]" />
        <div className="absolute inset-y-10 left-1/2 -z-10 hidden h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[rgba(16,37,28,0.08)] blur-3xl lg:block" />

        <div className="mx-auto max-w-7xl">
          <Link
            href="/travel-guides"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--forest)] transition hover:text-[var(--gold)]"
          >
            <ArrowLeft size={16} />
            Back to travel guides
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full border border-[rgba(16,37,28,0.1)] bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--gold)] shadow-[0_18px_40px_-28px_rgba(8,18,15,0.4)]">
                <Icon size={16} />
                {guide.category}
              </div>

              <h1 className="font-display mt-6 max-w-4xl text-4xl text-[var(--forest)] sm:text-5xl xl:text-6xl">
                {guide.title}
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-[color:rgba(19,32,24,0.74)] sm:text-lg">
                {guide.summary}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {quickFacts.map((fact) => {
                  const FactIcon = fact.icon;

                  return (
                    <div
                      key={fact.label}
                      className="rounded-[24px] border border-[var(--border)] bg-white/78 p-5 shadow-[0_24px_60px_-38px_rgba(8,18,15,0.45)] backdrop-blur"
                    >
                      <div className="flex items-center gap-3 text-[var(--gold)]">
                        <FactIcon size={18} />
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:rgba(19,32,24,0.58)]">
                          {fact.label}
                        </p>
                      </div>
                      <p className="mt-4 text-sm leading-7 text-[var(--forest)]">{fact.value}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {guide.highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="rounded-full bg-[var(--sand)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--forest)]"
                  >
                    {highlight}
                  </span>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <TrackedLink
                  href={guideSupportUrl}
                  eventName="cta_click"
                  eventParams={{
                    section: "travel_guide",
                    action: "ai_support",
                    guide_slug: guide.slug,
                    guide_title: guide.title,
                  }}
                  className="inline-flex items-center gap-3 rounded-full bg-[var(--forest)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--gold)] hover:text-[var(--forest)]"
                >
                  Ask AI about this guide
                  <ArrowRight size={16} />
                </TrackedLink>
                <Link
                  href="/journeys"
                  className="inline-flex items-center gap-3 rounded-full border border-[rgba(16,37,28,0.14)] bg-white/75 px-6 py-3 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
                >
                  Browse sample journeys
                </Link>
              </div>
            </div>

            <div className="relative min-h-[420px] overflow-hidden rounded-[36px] border border-[rgba(255,255,255,0.45)] bg-[rgba(255,255,255,0.2)] shadow-[0_36px_90px_-52px_rgba(8,18,15,0.55)]">
              <Image
                src={guide.image}
                alt={guide.title}
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/12 via-black/22 to-black/68" />

              <div className="absolute inset-x-6 bottom-6 rounded-[28px] border border-white/16 bg-black/28 p-6 text-white backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/75">
                  Why people read this guide
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {guide.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em]"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
                <p className="mt-5 text-sm leading-7 text-white/82">{guide.description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.12fr_0.88fr]">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {guide.sections.map((section) => (
              <article
                key={section.title}
                className="rounded-[30px] border border-[var(--border)] bg-[rgba(255,255,255,0.82)] p-7 shadow-[0_24px_70px_-48px_rgba(8,18,15,0.42)] backdrop-blur"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--gold)]">
                  Guide section
                </p>
                <h2 className="font-display mt-4 text-3xl text-[var(--forest)]">{section.title}</h2>
                <p className="mt-4 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                  {section.body}
                </p>
              </article>
            ))}
          </div>

          <div className="grid gap-6">
            <article className="rounded-[30px] border border-[var(--border)] bg-[rgba(255,255,255,0.82)] p-7 shadow-[0_24px_70px_-48px_rgba(8,18,15,0.42)] backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                Quick planning tips
              </p>
              <div className="mt-6 space-y-4">
                {guide.tips.map((tip) => (
                  <div key={tip} className="flex gap-3">
                    <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--gold)]" />
                    <p className="text-sm leading-7 text-[var(--forest)]">{tip}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[30px] bg-[var(--forest)] p-7 text-white shadow-[0_28px_70px_-42px_rgba(8,18,15,0.8)]">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold-soft)]">
                Common questions
              </p>
              <div className="mt-6 space-y-5">
                {guide.faqs.map((faq) => (
                  <div key={faq.question} className="border-b border-white/10 pb-5 last:border-b-0 last:pb-0">
                    <h3 className="text-base font-semibold text-white">{faq.question}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/74">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      {relatedJourney && (
        <section className="px-6 py-4">
          <div className="mx-auto max-w-7xl rounded-[34px] border border-[var(--border)] bg-[rgba(255,250,243,0.86)] p-8 shadow-[0_24px_70px_-48px_rgba(8,18,15,0.42)] backdrop-blur">
            <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                  Suggested journey
                </p>
                <h2 className="font-display mt-4 text-4xl text-[var(--forest)]">
                  {relatedJourney.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                  {relatedJourney.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <span className="rounded-full bg-[var(--sand)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--forest)]">
                    {relatedJourney.duration}
                  </span>
                  <span className="rounded-full bg-[var(--sand)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--forest)]">
                    {relatedJourney.price}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
                <Link
                  href={`/journeys/${relatedJourney.slug}`}
                  className="inline-flex items-center justify-center gap-3 rounded-full border border-[rgba(16,37,28,0.14)] bg-white px-6 py-3 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
                >
                  View this journey
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href={`/custom-itinerary?journey=${relatedJourney.slug}`}
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-[var(--forest)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--forest-soft)]"
                >
                  Shape this trip for me
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl rounded-[34px] bg-[linear-gradient(160deg,rgba(196,150,85,0.18),rgba(16,37,28,0.92))] p-8 text-white shadow-[0_26px_70px_-48px_rgba(8,18,15,0.55)] lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/72">
            Next step
          </p>
          <h2 className="font-display mt-4 max-w-3xl text-4xl text-white">
            {guide.ctaTitle}
          </h2>
          <p className="mt-5 max-w-3xl text-sm leading-8 text-white/82">{guide.ctaText}</p>

          <div className="mt-8 flex flex-wrap gap-4">
            <TrackedLink
              href={guideSupportUrl}
              eventName="cta_click"
              eventParams={{
                section: "travel_guide_final_cta",
                action: "ai_support",
                guide_slug: guide.slug,
                guide_title: guide.title,
              }}
              className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--forest)] transition hover:bg-[var(--sand)]"
            >
              Get instant AI support
              <ArrowRight size={16} />
            </TrackedLink>
            <Link
              href="/travel-guides"
              className="inline-flex items-center gap-3 rounded-full border border-white/18 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/34 hover:bg-white/8"
            >
              Read more travel guides
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
