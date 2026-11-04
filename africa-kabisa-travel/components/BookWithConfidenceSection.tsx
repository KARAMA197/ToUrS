import Link from "next/link";
import {
  ArrowRight,
  BadgeDollarSign,
  CalendarClock,
  ClipboardCheck,
  ShieldCheck,
} from "lucide-react";
import type { HomepageContent } from "@/homepage-content-schema";

const confidenceIcons = [
  ClipboardCheck,
  BadgeDollarSign,
  CalendarClock,
  ShieldCheck,
];

type BookWithConfidenceSectionProps = {
  content: HomepageContent["bookWithConfidence"];
};

export default function BookWithConfidenceSection({
  content,
}: BookWithConfidenceSectionProps) {
  return (
    <section className="px-5 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl rounded-[28px] bg-[var(--forest)] p-5 text-white shadow-[0_34px_100px_-48px_rgba(8,18,15,0.82)] sm:rounded-[36px] sm:p-8 lg:p-10">
        <div className="grid gap-6 sm:gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold-soft)]">
              {content.eyebrow}
            </p>
            <h2 className="font-display mt-4 max-w-3xl text-3xl sm:text-5xl">
              {content.title}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72 sm:mt-5 sm:text-base sm:leading-8">
              {content.description}
            </p>

            <div className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
              {content.checkpoints.map((point) => (
                <div
                  key={point}
                  className="flex gap-3 rounded-[20px] border border-white/10 bg-white/6 p-4 sm:rounded-[22px]"
                >
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--gold-soft)]" />
                  <p className="text-sm leading-6 text-white/78 sm:leading-7">{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {content.blocks.map((block, index) => {
                const Icon = confidenceIcons[index] ?? ClipboardCheck;

                return (
                  <article
                    key={block.title}
                    className="rounded-[20px] border border-white/10 bg-white/6 p-4 backdrop-blur sm:rounded-[26px] sm:p-5"
                  >
                    <div className="inline-flex rounded-full bg-white/10 p-3 text-[var(--gold-soft)]">
                      <Icon size={18} />
                    </div>
                    <h3 className="mt-3 text-base font-semibold leading-6 sm:mt-4 sm:text-lg">{block.title}</h3>
                    <p className="mt-3 hidden text-sm leading-7 text-white/76 sm:block">
                      {block.description}
                    </p>
                  </article>
                );
              })}
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/7 p-5 sm:rounded-[28px] sm:p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold-soft)]">
                What happens next
              </p>
              <div className="mt-5 grid gap-3 sm:gap-4">
                {content.nextSteps.map((step, index) => (
                  <div key={step.title} className="flex gap-3 rounded-[20px] bg-black/10 p-4 sm:gap-4">
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-[var(--gold-soft)]">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-base font-semibold">{step.title}</h4>
                      <p className="mt-2 text-sm leading-6 text-white/74 sm:leading-7">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/before-you-book"
                  className="inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[var(--forest)] transition hover:bg-[var(--gold-soft)]"
                >
                  {content.primaryLabel}
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 rounded-full border border-white/14 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/8"
                >
                  {content.secondaryLabel}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
