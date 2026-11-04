import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { destinations } from "@/destinations-data";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tanzania Safari, Kilimanjaro, and Zanzibar Destinations",
  description:
    "Compare Tanzania safari destinations, Kilimanjaro, Zanzibar, southern parks, and cultural add-ons before planning a private route around your dates and budget.",
  alternates: {
    canonical: "/destinations",
  },
  openGraph: {
    title: `Tanzania Destinations | ${siteConfig.name}`,
    description:
      "Compare Tanzania safari destinations, Kilimanjaro, Zanzibar, southern parks, and cultural add-ons before shaping a private route.",
    url: "/destinations",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `Tanzania destinations from ${siteConfig.name}`,
      },
    ],
  },
};

const categories = Array.from(
  new Set(destinations.map((destination) => destination.category))
);

export default function DestinationsPage() {
  return (
    <main className="px-6 py-14">
      <section className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              Tanzania destinations
            </p>
            <h1 className="font-display mt-3 text-4xl text-[var(--forest)] sm:text-5xl">
              Tanzania places worth building a private route around.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[color:rgba(19,32,24,0.72)]">
              Some places work best for classic safari. Others are stronger for mountain travel,
              beach time, southern wildlife, or a cultural layer that makes the trip feel more
              complete. Browse the places first, then we can help you connect them into one smooth
              Tanzania journey.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              {categories.map((category) => (
                <span
                  key={category}
                  className="rounded-full border border-[rgba(16,37,28,0.12)] bg-white/86 px-4 py-2 text-sm font-semibold text-[var(--forest)] shadow-[0_16px_30px_-26px_rgba(8,18,15,0.24)]"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[34px] border border-[rgba(16,37,28,0.12)] bg-[rgba(255,255,255,0.82)] p-4 shadow-[0_30px_80px_-46px_rgba(8,18,15,0.42)] backdrop-blur sm:p-5">
            <div className="relative min-h-[420px] overflow-hidden rounded-[30px]">
              <Image
                src={destinations[0].image}
                alt={destinations[0].title}
                fill
                priority
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,18,15,0.1),rgba(8,18,15,0.2)_38%,rgba(8,18,15,0.84))]" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/72">
                  Featured destination
                </p>
                <h2 className="font-display mt-3 max-w-xl text-3xl leading-none sm:text-4xl">
                  {destinations[0].title}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-white/78">
                  {destinations[0].summary}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {destinations.map((destination) => (
            <article
              key={destination.slug}
              className="overflow-hidden rounded-[32px] border border-[var(--border)] bg-[rgba(255,255,255,0.84)] shadow-[0_28px_80px_-48px_rgba(8,18,15,0.48)] backdrop-blur"
            >
              <div className="relative h-72">
                <Image
                  src={destination.image}
                  alt={destination.title}
                  fill
                  sizes="(min-width: 1280px) 33vw, (min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/68" />
                <div className="absolute left-5 top-5 inline-flex rounded-full border border-white/20 bg-black/28 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white backdrop-blur">
                  {destination.category}
                </div>
              </div>

              <div className="p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
                  {destination.accent}
                </p>

                <h2 className="font-display mt-4 text-3xl text-[var(--forest)]">
                  {destination.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                  {destination.summary}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {destination.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="rounded-full bg-[var(--sand)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--forest)]"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href={`/destinations/${destination.slug}`}
                    className="inline-flex items-center gap-3 font-semibold text-[var(--forest)] transition hover:text-[var(--gold)]"
                  >
                    Explore this place
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    href={`/custom-itinerary?destination=${destination.slug}`}
                    className="inline-flex items-center justify-center rounded-full bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--forest-soft)]"
                  >
                    Plan around it
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
