import Link from "next/link";
import {
  ArrowRight,
  CalendarRange,
  Compass,
  Mountain,
  Users,
  WalletCards,
  Waves,
} from "lucide-react";
import type { HomepageContent } from "@/homepage-content-schema";

const planningTopics = [
  {
    icon: CalendarRange,
    title: "Best time to go",
    intro: "Tanzania works well in more than one season, not just one short window.",
    points: [
      "Dry periods are popular for classic safari and climbing days.",
      "Greener periods can feel fresh, quieter, and very beautiful.",
      "We match your exact dates to the route that works best at that time.",
    ],
  },
  {
    icon: Compass,
    title: "How long should you stay?",
    intro: "The right trip length depends on whether you want one main experience or a bigger mix.",
    points: [
      "5 to 7 days works well for one strong safari or one main focus.",
      "8 to 10 days gives room for safari plus beach time.",
      "10 days or more works well for a fuller Tanzania journey.",
    ],
  },
  {
    icon: WalletCards,
    title: "Budget guidance",
    intro: "A good Tanzania trip can be shaped around different comfort levels.",
    points: [
      "Budget trips focus on simple, comfortable stays and smart routing.",
      "Mid-range is a strong balance of comfort and value.",
      "Luxury adds top stays, more space, and extra ease.",
    ],
  },
  {
    icon: Users,
    title: "Who Tanzania suits well",
    intro: "Different trip styles work better for different travelers.",
    points: [
      "First-time safari travelers often do well with a classic northern route.",
      "Honeymoons often pair safari with Zanzibar very well.",
      "Families usually do best with smoother pacing and fewer stay changes.",
    ],
  },
];

const tripMixes = [
  {
    icon: Compass,
    title: "Safari focus",
    duration: "5 to 7 days",
    description:
      "A strong choice for first-time travelers who want wildlife, good guiding, and a simple route.",
    bestFor: "Best if you want one main experience and an easy travel flow.",
  },
  {
    icon: Waves,
    title: "Safari + Zanzibar",
    duration: "8 to 10 days",
    description:
      "One of the most popular Tanzania pairings because it mixes adventure and rest in one smooth trip.",
    bestFor: "Best for couples, honeymoon travel, or travelers who want balance.",
  },
  {
    icon: Mountain,
    title: "Kilimanjaro + recovery time",
    duration: "8 days or more",
    description:
      "Climb first, then add safari or beach time to slow down and enjoy the finish.",
    bestFor: "Best for active travelers who want a bigger challenge and a proud finish.",
  },
];

type PlanningGuideProps = {
  content: HomepageContent["planningGuide"];
};

export default function PlanningGuide({ content }: PlanningGuideProps) {
  return (
    <section id="travel-guide" className="relative scroll-mt-24 overflow-hidden px-5 py-16 sm:px-6 sm:py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(11,24,20,0.14),transparent)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-[radial-gradient(circle_at_center,rgba(200,154,70,0.1),transparent_68%)]" />
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 sm:gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              {content.eyebrow}
            </p>
            <h2 className="font-display mt-3 max-w-2xl text-3xl text-[var(--forest)] sm:text-5xl">
              {content.title}
            </h2>
          </div>

          <div className="max-w-2xl lg:justify-self-end">
            <p className="text-base leading-8 text-[color:rgba(19,32,24,0.72)]">
              {content.description}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-2">
          {planningTopics.map((topic) => {
            const Icon = topic.icon;

            return (
              <article
                key={topic.title}
                className="rounded-[24px] border border-[var(--border)] bg-[rgba(255,255,255,0.82)] p-5 shadow-[0_24px_70px_-48px_rgba(8,18,15,0.42)] backdrop-blur sm:rounded-[30px] sm:p-7"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-[var(--sand)] p-3 text-[var(--forest)]">
                    <Icon size={18} />
                  </div>
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--gold)]">
                    {topic.title}
                  </p>
                </div>

                <p className="mt-4 text-sm leading-6 text-[color:rgba(19,32,24,0.72)] sm:mt-5 sm:leading-7">
                  {topic.intro}
                </p>

                <div className="mt-5 space-y-3 sm:mt-6 sm:space-y-4">
                  {topic.points.map((point) => (
                    <div key={point} className="flex gap-3">
                      <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--gold)]" />
                      <p className="text-sm leading-6 text-[var(--forest)] sm:leading-7">{point}</p>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8 rounded-[28px] bg-[var(--forest)] p-5 text-white shadow-[0_34px_100px_-50px_rgba(8,18,15,0.82)] sm:mt-10 sm:rounded-[34px] sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold-soft)]">
                Popular Tanzania trip mixes
              </p>
              <h3 className="font-display mt-4 max-w-2xl text-2xl sm:text-4xl">
                Simple ways many travelers build their trip.
              </h3>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72 sm:mt-5 sm:leading-8">
                These are strong starting points, not fixed packages. We still shape the route
                around your dates, group size, and budget.
              </p>

              <div className="mt-6 grid gap-3 sm:mt-8 sm:gap-4">
                {tripMixes.map((mix) => {
                  const Icon = mix.icon;

                  return (
                    <article
                      key={mix.title}
                      className="rounded-[22px] border border-white/10 bg-white/6 p-4 backdrop-blur sm:rounded-[26px] sm:p-5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-white/10 p-3 text-[var(--gold-soft)]">
                          <Icon size={18} />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold">{mix.title}</h4>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/56">
                            {mix.duration}
                          </p>
                        </div>
                      </div>

                      <p className="mt-3 text-sm leading-6 text-white/74 sm:mt-4 sm:leading-7">{mix.description}</p>
                      <p className="mt-3 text-sm leading-6 text-[var(--gold-soft)] sm:leading-7">{mix.bestFor}</p>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/6 p-5 backdrop-blur sm:rounded-[30px] sm:p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold-soft)]">
                {content.advisorEyebrow}
              </p>
              <h3 className="font-display mt-4 text-3xl text-white">
                {content.advisorTitle}
              </h3>
              <p className="mt-4 text-sm leading-7 text-white/72">
                {content.advisorDescription}
              </p>

              <div className="mt-6 space-y-3 text-sm leading-7 text-white/74">
                {content.advisorPoints.map((point) => (
                  <p key={point}>{point}</p>
                ))}
              </div>

              <Link
                href="/custom-itinerary"
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--forest)] transition hover:bg-[var(--gold-soft)]"
              >
                {content.advisorPrimaryLabel}
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/travel-guides"
                className="mt-4 inline-flex items-center gap-3 text-sm font-semibold text-[var(--gold-soft)] transition hover:text-white"
              >
                {content.advisorSecondaryLabel}
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/how-we-plan"
                className="mt-3 inline-flex items-center gap-3 text-sm font-semibold text-white/72 transition hover:text-white"
              >
                See how we plan trips
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/before-you-book"
                className="mt-3 inline-flex items-center gap-3 text-sm font-semibold text-white/72 transition hover:text-white"
              >
                Read before you book
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/know-before-you-go"
                className="mt-3 inline-flex items-center gap-3 text-sm font-semibold text-white/72 transition hover:text-white"
              >
                Know before you go
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
