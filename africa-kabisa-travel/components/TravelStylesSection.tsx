import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Compass,
  Heart,
  Mountain,
  Sparkles,
  Users,
  Waves,
} from "lucide-react";
import type { HomepageContent } from "@/homepage-content-schema";
import { tripStyleOptions } from "@/lib/trip-styles";

const styleIcons = [Compass, Mountain, Waves, Sparkles, Users, Heart];

const styleImages: Record<
  string,
  {
    src: string;
    alt: string;
    objectPosition?: string;
  }
> = {
  "Private safari journeys": {
    src: "/images/tour-gallery/safari-dust-road.jpeg",
    alt: "Safari vehicles driving through a Tanzania landscape",
  },
  "Kilimanjaro climbs": {
    src: "/images/tour-gallery/kilimanjaro-summit-ridge.jpeg",
    alt: "Kilimanjaro summit landscape in warm mountain light",
  },
  "Zanzibar holidays": {
    src: "/images/zanzibar.png",
    alt: "Zanzibar beach and ocean view",
  },
  "Combined Tanzania trips": {
    src: "/images/tour-gallery/serengeti-balloon.jpeg",
    alt: "Hot air balloon over a Tanzania safari landscape",
  },
  "Family Tanzania travel": {
    src: "/images/tour-gallery/family-campfire.jpeg",
    alt: "Family relaxing by a safari campfire",
  },
  "Honeymoon and romantic trips": {
    src: "/images/tour-gallery/zanzibar-beach-couple.jpeg",
    alt: "Couple walking along a Zanzibar beach",
  },
};

type TravelStylesSectionProps = {
  content: HomepageContent["travelStyles"];
};

export default function TravelStylesSection({
  content,
}: TravelStylesSectionProps) {
  return (
    <section className="px-5 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 sm:gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              {content.eyebrow}
            </p>
            <h2 className="font-display mt-3 max-w-3xl text-3xl text-[var(--forest)] sm:text-5xl">
              {content.title}
            </h2>
          </div>

          <div className="max-w-2xl lg:justify-self-end">
            <p className="text-base leading-8 text-[color:rgba(19,32,24,0.72)]">
              {content.description}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:mt-12 sm:gap-6 lg:grid-cols-3">
          {content.styles.map((style, index) => {
            const Icon = styleIcons[index] ?? Compass;
            const styleImage = styleImages[style.title];
            const tripStyle = tripStyleOptions.find(
              (option) => option.label === style.title
            );
            const planStyleHref = tripStyle
              ? `/custom-itinerary?tripStyle=${tripStyle.value}`
              : style.actionHref;

            return (
              <article
                key={style.title}
                className="overflow-hidden rounded-[32px] border border-[var(--border)] bg-[rgba(255,255,255,0.86)] shadow-[0_28px_70px_-48px_rgba(8,18,15,0.42)]"
              >
                {styleImage ? (
                  <div className="relative h-40 overflow-hidden border-b border-[rgba(16,37,28,0.08)] sm:h-48">
                    <Image
                      src={styleImage.src}
                      alt={styleImage.alt}
                      fill
                      sizes="(min-width: 1024px) 30vw, 100vw"
                      className="object-cover transition duration-500 hover:scale-[1.03]"
                      style={{
                        objectPosition: styleImage.objectPosition ?? "center",
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/18 to-black/62" />
                    <div className="absolute left-5 top-5 inline-flex rounded-full bg-white/88 p-3 text-[var(--forest)] shadow-[0_18px_40px_-28px_rgba(8,18,15,0.48)] backdrop-blur">
                      <Icon size={18} />
                    </div>
                  </div>
                ) : (
                  <div className="px-7 pt-7">
                    <div className="inline-flex rounded-full bg-[var(--sand)] p-3 text-[var(--forest)]">
                      <Icon size={18} />
                    </div>
                  </div>
                )}

                <div className="p-5 sm:p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
                    {style.routeLabel}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-[var(--forest)] sm:text-2xl">
                    {style.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[color:rgba(19,32,24,0.72)] sm:mt-4 sm:leading-7">
                    {style.description}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[color:rgba(19,32,24,0.68)] sm:mt-4 sm:leading-7">
                    <span className="font-semibold text-[var(--forest)]">Best for:</span>{" "}
                    {style.bestFor}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3 sm:mt-7">
                    <Link
                      href={style.routeHref}
                      className="inline-flex items-center gap-3 rounded-full bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--forest-soft)]"
                    >
                      {style.actionLabel}
                      <ArrowRight size={16} />
                    </Link>
                    <Link
                      href={planStyleHref}
                      className="inline-flex items-center gap-3 rounded-full border border-[rgba(16,37,28,0.14)] bg-white px-5 py-3 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
                    >
                      Plan this style
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8 rounded-[28px] border border-[var(--border)] bg-[linear-gradient(160deg,rgba(255,250,243,0.98),rgba(246,239,228,0.92))] p-5 shadow-[0_26px_80px_-52px_rgba(8,18,15,0.38)] sm:mt-10 sm:rounded-[34px] sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                {content.routeIdeasEyebrow}
              </p>
              <h3 className="font-display mt-3 text-2xl text-[var(--forest)] sm:text-3xl">
                {content.routeIdeasTitle}
              </h3>
            </div>

            <Link
              href="/journeys"
              className="inline-flex items-center gap-3 self-start rounded-full border border-[rgba(16,37,28,0.14)] bg-white px-5 py-3 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
            >
              Browse all journeys
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:mt-8 md:grid-cols-2 xl:grid-cols-4">
            {content.routeIdeas.map((idea) => (
              <div
                key={idea.title}
                className="rounded-[22px] border border-[rgba(16,37,28,0.1)] bg-white p-4 sm:rounded-[24px] sm:p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
                  {idea.duration}
                </p>
                <h4 className="mt-3 text-lg font-semibold text-[var(--forest)]">
                  {idea.title}
                </h4>
                <p className="mt-3 text-sm leading-6 text-[color:rgba(19,32,24,0.72)] sm:leading-7">
                  {idea.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
