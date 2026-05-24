import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass, MapPinned, MessageCircle } from "lucide-react";
import { brandPagesContent } from "@/brand-pages-content";
import BrandLogo from "@/components/BrandLogo";

const aboutContent = brandPagesContent.about;
const strengthIcons = [MessageCircle, Compass, MapPinned];

export default function HomeAboutSection() {
  const [leadParagraph, ...supportingParagraphs] = aboutContent.companyIntro;

  return (
    <section id="about-home" className="px-6 py-16 scroll-mt-24 lg:py-20">
      <div className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[36px] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,250,243,0.98),rgba(247,240,227,0.94))] p-8 shadow-[0_28px_80px_-52px_rgba(8,18,15,0.45)] backdrop-blur lg:p-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,250,243,0.92),rgba(247,240,227,0.94))]" />
          <div className="absolute -right-12 top-0 h-72 w-72 rounded-full bg-[rgba(196,150,85,0.18)] blur-[110px]" />
          <div className="absolute right-20 top-16 h-40 w-40 rounded-full border border-white/50 bg-[rgba(246,212,142,0.24)] shadow-[0_0_120px_rgba(196,150,85,0.22)] blur-[2px]" />
          <div className="absolute right-28 top-24 h-24 w-24 rounded-full bg-[rgba(255,231,183,0.42)] blur-xl" />
          <div className="absolute -left-10 top-24 h-56 w-56 rounded-full bg-[rgba(244,220,173,0.16)] blur-[100px]" />
          <div className="absolute bottom-0 left-1/4 h-28 w-[24rem] rounded-full bg-[rgba(196,150,85,0.12)] blur-[90px]" />
          <div className="absolute inset-y-0 right-0 w-[36%] bg-[linear-gradient(270deg,rgba(16,37,28,0.03),transparent)]" />
        </div>

        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              {aboutContent.eyebrow}
            </p>
            <h2 className="font-display mt-4 max-w-3xl text-4xl text-[var(--forest)] sm:text-5xl">
              {aboutContent.title}
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-9 text-[color:rgba(19,32,24,0.78)] sm:text-xl">
              {leadParagraph}
            </p>

            <div className="mt-6 max-w-2xl rounded-[26px] border border-[rgba(16,37,28,0.1)] bg-white/72 p-5 shadow-[0_20px_45px_-36px_rgba(8,18,15,0.32)]">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--gold)]">
                Our planning lens
              </p>
              <p className="mt-3 text-base leading-8 text-[color:rgba(19,32,24,0.72)]">
                {aboutContent.introNote}
              </p>
            </div>

            <div className="mt-6 space-y-4">
              {supportingParagraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="max-w-3xl text-base leading-8 text-[color:rgba(19,32,24,0.68)]"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              {aboutContent.serviceAreas.map((area) => (
                <span
                  key={area.title}
                  className="rounded-full border border-[rgba(16,37,28,0.12)] bg-white/88 px-4 py-2 text-sm font-semibold text-[var(--forest)] shadow-[0_16px_30px_-26px_rgba(8,18,15,0.32)]"
                >
                  {area.title}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-3 rounded-full bg-[var(--forest)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--gold)] hover:text-[var(--forest)]"
              >
                Learn more about us
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/custom-itinerary"
                className="inline-flex items-center gap-3 rounded-full border border-[rgba(16,37,28,0.14)] bg-white/85 px-6 py-3 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
              >
                Plan my trip
              </Link>
            </div>
          </div>

          <div className="space-y-5">
            <article className="overflow-hidden rounded-[30px] border border-[rgba(16,37,28,0.12)] bg-white shadow-[0_30px_80px_-46px_rgba(8,18,15,0.28)]">
              <div className="relative h-72">
                <Image
                  src="/images/about-story-kilimanjaro.jpeg"
                  alt="Mount Kilimanjaro above the clouds"
                  fill
                  sizes="(min-width: 1024px) 36vw, 100vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,18,15,0.08),rgba(8,18,15,0.18)_42%,rgba(8,18,15,0.82))]" />
                <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-5">
                  <div className="rounded-[22px] border border-white/20 bg-white/88 px-3 py-2 shadow-[0_18px_40px_-28px_rgba(8,18,15,0.45)] backdrop-blur">
                    <BrandLogo tone="dark" size="sm" />
                  </div>
                  <div className="inline-flex rounded-full border border-white/14 bg-black/22 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--gold-soft)] backdrop-blur">
                    Private Tanzania planning
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/72">
                    Kilimanjaro, safari, and coast
                  </p>
                  <h3 className="font-display mt-3 text-3xl leading-none sm:text-[2.1rem]">
                    Tanzania journeys shaped with calm planning and a clear sense of flow.
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-7 text-white/74">
                    From mountain horizons to safari and beach time, we help travelers shape one
                    balanced journey instead of disconnected plans.
                  </p>
                </div>
              </div>

              <div className="bg-[var(--forest)] p-6 text-white">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold-soft)]">
                  {aboutContent.promiseTitle}
                </p>

                <div className="mt-5 space-y-4">
                  {aboutContent.promiseItems.map((item) => (
                    <div key={item} className="flex gap-3">
                      <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--gold-soft)]" />
                      <p className="text-sm leading-7 text-white/82">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {aboutContent.startupStrengths.map((item, index) => {
                const Icon = strengthIcons[index] ?? Compass;

                return (
                  <article
                    key={item.title}
                    className="rounded-[24px] border border-[var(--border)] bg-white p-5 shadow-[0_18px_50px_-42px_rgba(8,18,15,0.32)]"
                  >
                    <div className="mb-4 inline-flex rounded-full bg-[var(--sand)] p-3 text-[var(--forest)]">
                      <Icon size={18} />
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--forest)]">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                      {item.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
