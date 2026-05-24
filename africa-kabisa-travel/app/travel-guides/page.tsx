import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass, Heart, Mountain, Users, Waves } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { travelGuides } from "@/guides-data";

const iconMap = {
  compass: Compass,
  mountain: Mountain,
  waves: Waves,
  heart: Heart,
  users: Users,
};

export const metadata: Metadata = {
  title: "Tanzania Travel Guides",
  description:
    "Explore practical Tanzania travel guides for safari planning, Kilimanjaro climbs, Zanzibar add-ons, honeymoon trips, and family safari ideas.",
  alternates: {
    canonical: "/travel-guides",
  },
  openGraph: {
    title: "Tanzania Travel Guides",
    description:
      "Explore practical Tanzania travel guides for safari planning, Kilimanjaro climbs, Zanzibar add-ons, honeymoon trips, and family safari ideas.",
    url: "/travel-guides",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `Tanzania travel guides from ${siteConfig.name}`,
      },
    ],
  },
};

export default function TravelGuidesPage() {
  return (
    <main className="px-6 py-14">
      <section className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              Travel guides
            </p>
            <h1 className="font-display mt-3 text-4xl text-[var(--forest)] sm:text-5xl">
              Practical Tanzania guides for travelers who want clear direction.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[color:rgba(19,32,24,0.72)]">
              These guides answer common planning questions about safari, Kilimanjaro, Zanzibar,
              honeymoon travel, and family trips. They are built to help you choose the right
              route faster and with more confidence.
            </p>
          </div>

          <div className="rounded-[32px] border border-[var(--border)] bg-[rgba(255,255,255,0.82)] p-6 shadow-[0_24px_70px_-48px_rgba(8,18,15,0.42)] backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              Most searched topics
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {travelGuides.map((guide) => (
                <span
                  key={guide.slug}
                  className="rounded-full bg-[var(--sand)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--forest)]"
                >
                  {guide.category}
                </span>
              ))}
            </div>
            <p className="mt-5 text-sm leading-7 text-[color:rgba(19,32,24,0.7)]">
              Start with the guide that matches your biggest question, then tell us your dates and
              we can help shape the right Tanzania route for you.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {travelGuides.map((guide) => {
            const Icon = iconMap[guide.iconKey];

            return (
              <article
                key={guide.slug}
                className="overflow-hidden rounded-[32px] border border-[var(--border)] bg-[rgba(255,255,255,0.84)] shadow-[0_28px_80px_-48px_rgba(8,18,15,0.48)] backdrop-blur"
              >
                <div className="relative h-72">
                  <Image
                    src={guide.image}
                    alt={guide.title}
                    fill
                    sizes="(min-width: 1280px) 33vw, (min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/68" />
                  <div className="absolute left-5 top-5 inline-flex rounded-full border border-white/20 bg-black/28 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white backdrop-blur">
                    {guide.category}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
                    <Icon size={16} />
                    {guide.accent}
                  </div>

                  <h2 className="font-display mt-4 text-3xl text-[var(--forest)]">{guide.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                    {guide.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {guide.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="rounded-full bg-[var(--sand)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--forest)]"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/travel-guides/${guide.slug}`}
                    className="mt-8 inline-flex items-center gap-3 font-semibold text-[var(--forest)] transition hover:text-[var(--gold)]"
                  >
                    Read guide
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 rounded-[30px] border border-[var(--border)] bg-[rgba(255,250,243,0.86)] p-6 shadow-[0_24px_70px_-48px_rgba(8,18,15,0.4)] backdrop-blur">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                Need more than a guide?
              </p>
              <p className="mt-3 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                If you already know your dates, budget, or the type of trip you want, we can help
                turn that into a real Tanzania plan.
              </p>
            </div>

            <Link
              href="/ai-support"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-[var(--forest)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--forest-soft)]"
            >
              Ask AI to guide my trip
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
