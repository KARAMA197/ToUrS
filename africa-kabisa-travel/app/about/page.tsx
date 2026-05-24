import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarRange,
  ClipboardList,
  Compass,
  MapPinned,
  MessageCircle,
  RefreshCcw,
  Route,
  ShieldCheck,
  Users,
  WalletCards,
  Waves,
  Mountain,
} from "lucide-react";
import { brandPagesContent } from "@/brand-pages-content";
import OperationalProofSection from "@/components/OperationalProofSection";
import { businessConfig } from "@/lib/business";
import { siteConfig } from "@/lib/site";

const aboutContent = brandPagesContent.about;
const serviceIcons = [Compass, Mountain, Waves, Users];
const planningStandardIcons = [MapPinned, WalletCards, CalendarRange, ShieldCheck];
const teamIcons = [Users, Compass, MessageCircle];
const teamStructureIcons = [MessageCircle, Route, RefreshCcw, ClipboardList];

export const metadata: Metadata = {
  title: "About Our Tanzania Trip Planning",
  description:
    `Learn how ${siteConfig.name} helps travelers plan private Tanzania safaris, Kilimanjaro trips, Zanzibar holidays, and combined journeys with clearer route guidance.`,
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Our Tanzania Trip Planning",
    description:
      `Learn how ${siteConfig.name} helps travelers plan private Tanzania safaris, Kilimanjaro trips, Zanzibar holidays, and combined journeys with clearer route guidance.`,
    url: "/about",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `About ${siteConfig.name} trip planning`,
      },
    ],
  },
};

export default function AboutPage() {
  const [leadParagraph, ...supportingParagraphs] = aboutContent.companyIntro;

  return (
    <main className="pb-24">
      <section className="relative isolate overflow-hidden px-6 pb-16 pt-10">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(196,150,85,0.18),transparent_36%),linear-gradient(180deg,rgba(250,246,238,0.92),rgba(244,237,224,0.78))]" />
        <div className="absolute inset-y-10 left-1/2 -z-10 hidden h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[rgba(16,37,28,0.08)] blur-3xl lg:block" />

        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.6fr)_minmax(360px,0.4fr)] lg:items-start xl:gap-14">
            <div className="max-w-none">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                {aboutContent.eyebrow}
              </p>
              <h1 className="font-display mt-4 text-4xl text-[var(--forest)] sm:text-5xl xl:text-6xl">
                {aboutContent.title}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-9 text-[color:rgba(19,32,24,0.78)] sm:text-xl">
                {leadParagraph}
              </p>

              <div className="mt-6 max-w-2xl rounded-[28px] border border-[rgba(16,37,28,0.1)] bg-white/72 p-5 shadow-[0_22px_50px_-40px_rgba(8,18,15,0.28)]">
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
                    className="max-w-3xl text-base leading-8 text-[color:rgba(19,32,24,0.68)] sm:text-lg"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                {aboutContent.serviceAreas.map((area) => (
                  <span
                    key={area.title}
                    className="rounded-full border border-[rgba(16,37,28,0.12)] bg-white/88 px-4 py-2 text-sm font-semibold text-[var(--forest)] shadow-[0_16px_30px_-26px_rgba(8,18,15,0.26)]"
                  >
                    {area.title}
                  </span>
                ))}
              </div>
            </div>

            <aside className="mx-auto w-full max-w-xl self-start lg:mx-0 lg:pt-5">
              <div className="rounded-[34px] border border-[rgba(16,37,28,0.12)] bg-white/84 p-4 shadow-[0_30px_80px_-46px_rgba(8,18,15,0.42)] backdrop-blur sm:p-5">
                <div
                  className="relative min-h-[440px] overflow-hidden rounded-[30px] border border-[rgba(16,37,28,0.08)] bg-[#dbe5ef] bg-cover bg-center sm:min-h-[520px] lg:min-h-[640px]"
                  style={{ backgroundImage: "url('/images/about-story-kilimanjaro.jpeg')" }}
                  aria-label="Mount Kilimanjaro above the clouds"
                >
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(8,18,15,0.82)] via-[rgba(8,18,15,0.22)] to-transparent px-6 pb-6 pt-20">
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--gold-soft)]">
                      Tanzania spirit
                    </p>
                    <p className="mt-2 max-w-sm text-sm leading-7 text-white/84">
                      A view that reflects the kind of journey we help travelers plan across
                      Tanzania, from mountain horizons to safari and coast.
                    </p>
                  </div>
                </div>
                <div className="mt-4 rounded-[24px] bg-[rgba(255,248,236,0.86)] px-5 py-4 text-center">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--gold)]">
                    A Tanzania journey starts with the right direction
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                    Good planning should feel connected to the landscapes, travel flow, and pace
                    that shape the journey from the start.
                  </p>
                </div>
              </div>
            </aside>
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
              href="/travel-guides"
              className="inline-flex items-center gap-3 rounded-full border border-[rgba(16,37,28,0.14)] bg-white/75 px-6 py-3 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
            >
              Read travel guides
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {aboutContent.planningStandards.map((standard, index) => {
              const Icon = planningStandardIcons[index] ?? MapPinned;

              return (
                <article
                  key={standard.title}
                  className="rounded-[24px] border border-[var(--border)] bg-white/78 p-5 shadow-[0_24px_60px_-38px_rgba(8,18,15,0.45)] backdrop-blur"
                >
                  <div className="flex items-center gap-3 text-[var(--gold)]">
                    <Icon size={18} />
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:rgba(19,32,24,0.58)]">
                      {standard.title}
                    </p>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[var(--forest)]">
                    {standard.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-[32px] border border-[var(--border)] bg-[rgba(255,255,255,0.82)] p-8 shadow-[0_26px_70px_-48px_rgba(8,18,15,0.45)] backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              What we help plan
            </p>
            <h2 className="font-display mt-4 text-4xl text-[var(--forest)]">
              {aboutContent.servicesTitle}
            </h2>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {aboutContent.serviceAreas.map((area, index) => {
                const Icon = serviceIcons[index] ?? Compass;

                return (
                  <article
                    key={area.title}
                    className="rounded-[26px] border border-[var(--border)] bg-white p-6"
                  >
                    <div className="mb-4 inline-flex rounded-full bg-[var(--sand)] p-3 text-[var(--forest)]">
                      <Icon size={18} />
                    </div>
                    <h3 className="text-xl font-semibold text-[var(--forest)]">{area.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                      {area.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </article>

          <article className="rounded-[32px] bg-[var(--forest)] p-8 text-white shadow-[0_28px_70px_-42px_rgba(8,18,15,0.8)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold-soft)]">
              Before you reach out
            </p>
            <h2 className="font-display mt-4 text-4xl text-white">
              {aboutContent.checklistTitle}
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/74">
              {aboutContent.checklistDescription}
            </p>

            <div className="mt-8 space-y-4">
              {aboutContent.checklistItems.map((item) => (
                <div key={item} className="flex gap-3">
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--gold-soft)]" />
                  <p className="text-sm leading-7 text-white/82">{item}</p>
                </div>
              ))}
            </div>

            <p className="mt-6 text-sm leading-7 text-white/68">
              If you only know your dates and your main travel idea, that is still enough to start.
            </p>
          </article>
        </div>
      </section>

      <section className="px-6 py-6">
        <div className="mx-auto max-w-7xl rounded-[34px] border border-[var(--border)] bg-[rgba(255,250,243,0.86)] p-8 shadow-[0_24px_70px_-48px_rgba(8,18,15,0.42)] backdrop-blur lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                Who this works well for
              </p>
              <h2 className="font-display mt-4 max-w-2xl text-4xl text-[var(--forest)]">
                {aboutContent.travelerTypesTitle}
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-8 text-[color:rgba(19,32,24,0.72)]">
                {aboutContent.travelerTypesDescription}
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {aboutContent.travelerTypes.map((type) => (
                <article
                  key={type.title}
                  className="rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[0_22px_60px_-46px_rgba(8,18,15,0.4)]"
                >
                  <h3 className="text-xl font-semibold text-[var(--forest)]">{type.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                    {type.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-6">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-[32px] border border-[var(--border)] bg-[rgba(255,255,255,0.82)] p-8 shadow-[0_26px_70px_-48px_rgba(8,18,15,0.45)] backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              {aboutContent.startupEyebrow}
            </p>
            <h2 className="font-display mt-4 text-4xl text-[var(--forest)]">
              {aboutContent.startupTitle}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-8 text-[color:rgba(19,32,24,0.72)]">
              {aboutContent.startupDescription}
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {aboutContent.startupStrengths.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[26px] border border-[var(--border)] bg-white p-6"
                >
                  <h3 className="text-xl font-semibold text-[var(--forest)]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </article>

          <article className="rounded-[32px] bg-[var(--forest)] p-8 text-white shadow-[0_28px_70px_-42px_rgba(8,18,15,0.8)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold-soft)]">
              Planning promise
            </p>
            <h2 className="font-display mt-4 text-4xl text-white">
              {aboutContent.promiseTitle}
            </h2>

            <div className="mt-8 space-y-4">
              {aboutContent.promiseItems.map((item) => (
                <div key={item} className="flex gap-3">
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--gold-soft)]" />
                  <p className="text-sm leading-7 text-white/82">{item}</p>
                </div>
              ))}
            </div>

              <p className="mt-6 text-sm leading-7 text-white/68">
                We believe a travel business should feel clear, careful, and reliable when the
                communication stays honest.
              </p>
          </article>
        </div>
      </section>

      <OperationalProofSection
        eyebrow="Operational proof"
        title="Simple business details should make the company easier to trust."
        description="We do not need to look like a huge operator to be clear and reachable. These are some of the practical proof points visitors should be able to check before deciding to continue the conversation."
        primaryLinkHref="/contact"
        primaryLinkLabel="See contact details"
        secondaryLinkHref="/how-we-plan"
        secondaryLinkLabel="See how we plan"
      />

      <section className="px-6 py-6">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-[32px] border border-[var(--border)] bg-[rgba(255,255,255,0.82)] p-8 shadow-[0_26px_70px_-48px_rgba(8,18,15,0.45)] backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              {aboutContent.teamStructureEyebrow}
            </p>
            <h2 className="font-display mt-4 max-w-3xl text-4xl text-[var(--forest)]">
              {aboutContent.teamStructureTitle}
            </h2>
            <p className="mt-5 max-w-3xl text-sm leading-8 text-[color:rgba(19,32,24,0.72)]">
              {aboutContent.teamStructureDescription}
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {aboutContent.teamStructureRoles.map((role, index) => {
                const Icon = teamStructureIcons[index] ?? ClipboardList;

                return (
                  <article
                    key={role.title}
                    className="rounded-[26px] border border-[var(--border)] bg-white p-6 shadow-[0_20px_50px_-42px_rgba(8,18,15,0.26)]"
                  >
                    <div className="mb-4 inline-flex rounded-full bg-[var(--sand)] p-3 text-[var(--forest)]">
                      <Icon size={18} />
                    </div>
                    <h3 className="text-xl font-semibold text-[var(--forest)]">{role.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                      {role.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </article>

          <article className="rounded-[32px] bg-[var(--forest)] p-8 text-white shadow-[0_28px_70px_-42px_rgba(8,18,15,0.8)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold-soft)]">
              {aboutContent.teamStructureNoteTitle}
            </p>
            <h2 className="font-display mt-4 text-4xl text-white">
              The planning side should feel organized and reliable.
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/74">
              {aboutContent.teamStructureNoteDescription}
            </p>

            <div className="mt-8 space-y-4">
              {aboutContent.teamStructureNoteItems.map((item) => (
                <div key={item} className="flex gap-3">
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--gold-soft)]" />
                  <p className="text-sm leading-7 text-white/82">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[24px] border border-white/10 bg-white/6 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold-soft)]">
                Business snapshot
              </p>
              <div className="mt-4 space-y-3 text-sm leading-7 text-white/82">
                <p>{businessConfig.baseLabel}</p>
                <p>Reply target: {businessConfig.responseTime}</p>
                <p>WhatsApp planning line: {businessConfig.phoneDisplay}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--forest)] transition hover:bg-[var(--sand)]"
              >
                Talk to us
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/custom-itinerary"
                className="inline-flex items-center gap-3 rounded-full border border-white/18 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/34 hover:bg-white/8"
              >
                Plan my trip
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="px-6 py-6">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_1fr]">
          <article className="rounded-[32px] border border-[var(--border)] bg-[rgba(255,250,243,0.86)] p-8 shadow-[0_24px_70px_-48px_rgba(8,18,15,0.42)] backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              {aboutContent.teamEyebrow}
            </p>
            <h2 className="font-display mt-4 max-w-2xl text-4xl text-[var(--forest)]">
              {aboutContent.teamTitle}
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-8 text-[color:rgba(19,32,24,0.72)]">
              {aboutContent.teamDescription}
            </p>

            <div className="mt-8 grid gap-5">
              {aboutContent.teamRoles.map((role, index) => {
                const Icon = teamIcons[index] ?? Users;

                return (
                  <article
                    key={role.title}
                    className="rounded-[26px] border border-[var(--border)] bg-white p-6"
                  >
                    <div className="mb-4 inline-flex rounded-full bg-[var(--sand)] p-3 text-[var(--forest)]">
                      <Icon size={18} />
                    </div>
                    <h3 className="text-xl font-semibold text-[var(--forest)]">{role.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                      {role.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </article>

          <article className="rounded-[32px] bg-[var(--forest)] p-8 text-white shadow-[0_28px_70px_-42px_rgba(8,18,15,0.8)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold-soft)]">
              Human side
            </p>
            <h2 className="font-display mt-4 text-4xl text-white">
              {aboutContent.teamNoteTitle}
            </h2>

            <div className="mt-8 space-y-4">
              {aboutContent.teamNoteItems.map((item) => (
                <div key={item} className="flex gap-3">
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--gold-soft)]" />
                  <p className="text-sm leading-7 text-white/82">{item}</p>
                </div>
              ))}
            </div>

            <p className="mt-6 text-sm leading-7 text-white/68">
              Clear communication and a steady planning process make the whole experience easier to
              trust from the start.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--forest)] transition hover:bg-[var(--sand)]"
              >
                Talk to us
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/before-you-book"
                className="inline-flex items-center gap-3 rounded-full border border-white/18 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/34 hover:bg-white/8"
              >
                Read before you book
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl rounded-[34px] bg-[linear-gradient(160deg,rgba(196,150,85,0.18),rgba(16,37,28,0.92))] p-8 text-white shadow-[0_26px_70px_-48px_rgba(8,18,15,0.55)] lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/72">
            Next step
          </p>
          <h2 className="font-display mt-4 max-w-3xl text-4xl text-white">
            {aboutContent.closingTitle}
          </h2>
          <p className="mt-5 max-w-3xl text-sm leading-8 text-white/82">
            {aboutContent.closingDescription}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/custom-itinerary"
              className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--forest)] transition hover:bg-[var(--sand)]"
            >
              Plan my trip
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
