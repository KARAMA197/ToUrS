import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarRange,
  Compass,
  MapPinned,
  Sparkles,
} from "lucide-react";
import { getDestinationBySlug, getDestinationSlugs } from "@/destinations-data";
import { getJourneyBySlug } from "@/journeys-data";
import { siteConfig } from "@/lib/site";

type DestinationDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getDestinationSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: DestinationDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const destination = getDestinationBySlug(slug);

  if (!destination) {
    return {
      title: `Destination not found | ${siteConfig.name}`,
    };
  }

  return {
    title: `${destination.title} | ${siteConfig.name}`,
    description: destination.description,
    alternates: {
      canonical: `/destinations/${destination.slug}`,
    },
    openGraph: {
      title: `${destination.title} | ${siteConfig.name}`,
      description: destination.description,
      url: `/destinations/${destination.slug}`,
      images: [
        {
          url: destination.image,
          width: 1200,
          height: 630,
          alt: destination.title,
        },
      ],
    },
  };
}

export default async function DestinationDetailPage({
  params,
}: DestinationDetailPageProps) {
  const { slug } = await params;
  const destination = getDestinationBySlug(slug);

  if (!destination) {
    notFound();
  }

  const relatedJourney = destination.relatedJourneySlug
    ? getJourneyBySlug(destination.relatedJourneySlug)
    : null;

  const quickFacts = [
    {
      label: "Region",
      value: destination.region,
      icon: MapPinned,
    },
    {
      label: "Best for",
      value: destination.goodFor,
      icon: Compass,
    },
    {
      label: "Best timing",
      value: destination.bestTime,
      icon: CalendarRange,
    },
    {
      label: "Ideal stay",
      value: destination.idealStay,
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
            href="/destinations"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--forest)] transition hover:text-[var(--gold)]"
          >
            <ArrowLeft size={16} />
            Back to destinations
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full border border-[rgba(16,37,28,0.1)] bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--gold)] shadow-[0_18px_40px_-28px_rgba(8,18,15,0.4)]">
                {destination.category}
              </div>

              <h1 className="font-display mt-6 max-w-4xl text-4xl text-[var(--forest)] sm:text-5xl xl:text-6xl">
                {destination.title}
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-[color:rgba(19,32,24,0.74)] sm:text-lg">
                {destination.summary}
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
                {destination.highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="rounded-full bg-[var(--sand)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--forest)]"
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
                  Plan a trip around {destination.title}
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/journeys"
                  className="inline-flex items-center gap-3 rounded-full border border-[rgba(16,37,28,0.14)] bg-white/75 px-6 py-3 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
                >
                  Browse sample routes
                </Link>
              </div>
            </div>

            <div className="relative min-h-[420px] overflow-hidden rounded-[36px] border border-[rgba(255,255,255,0.45)] bg-[rgba(255,255,255,0.2)] shadow-[0_36px_90px_-52px_rgba(8,18,15,0.55)]">
              <Image
                src={destination.image}
                alt={destination.title}
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/12 via-black/22 to-black/68" />
              <div className="absolute inset-x-6 bottom-6 rounded-[28px] border border-white/16 bg-black/28 p-6 text-white backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/75">
                  Why people choose this place
                </p>
                <p className="mt-4 text-sm leading-7 text-white/82">
                  {destination.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
          <article className="rounded-[32px] border border-[var(--border)] bg-[rgba(255,255,255,0.82)] p-8 shadow-[0_26px_70px_-48px_rgba(8,18,15,0.45)] backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              Why visit
            </p>
            <h2 className="font-display mt-4 text-3xl text-[var(--forest)]">
              What makes {destination.title} worth considering
            </h2>

            <div className="mt-8 space-y-4">
              {destination.whyVisit.map((item) => (
                <div key={item} className="flex gap-3">
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--gold)]" />
                  <p className="text-sm leading-7 text-[var(--forest)]">{item}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[32px] border border-[var(--border)] bg-[rgba(255,250,243,0.84)] p-8 shadow-[0_26px_70px_-48px_rgba(8,18,15,0.45)] backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              Planning notes
            </p>
            <h2 className="font-display mt-4 text-3xl text-[var(--forest)]">
              Helpful things to know before you add it
            </h2>

            <div className="mt-8 space-y-4">
              {destination.planningNotes.map((item) => (
                <div key={item} className="flex gap-3">
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--gold)]" />
                  <p className="text-sm leading-7 text-[var(--forest)]">{item}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[32px] bg-[rgba(16,37,28,0.96)] p-8 text-white shadow-[0_26px_70px_-48px_rgba(8,18,15,0.55)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold-soft)]">
              Combines well with
            </p>
            <h2 className="font-display mt-4 text-3xl text-white">
              Places and route ideas that fit naturally
            </h2>

            <div className="mt-8 flex flex-wrap gap-3">
              {destination.combinesWith.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/14 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em]"
                >
                  {item}
                </span>
              ))}
            </div>
          </article>
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
              </div>

              <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
                <Link
                  href={`/journeys/${relatedJourney.slug}`}
                  className="inline-flex items-center justify-center gap-3 rounded-full border border-[rgba(16,37,28,0.14)] bg-white px-6 py-3 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
                >
                  View related journey
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
    </main>
  );
}

