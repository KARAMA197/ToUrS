import Link from "next/link";
import { ArrowRight, BadgeDollarSign, CalendarClock, Users } from "lucide-react";
import { budgetBands, priceGuideNote, pricingDrivers } from "@/lib/pricing-guidance";

const driverIcons = [CalendarClock, Users, BadgeDollarSign];

type PricingGuidanceSectionProps = {
  compact?: boolean;
};

export default function PricingGuidanceSection({
  compact = false,
}: PricingGuidanceSectionProps) {
  return (
    <section className={compact ? "mt-10" : "px-5 py-16 sm:px-6 sm:py-24"}>
      <div className="mx-auto max-w-7xl rounded-[30px] border border-[var(--border)] bg-[rgba(255,250,243,0.9)] p-6 shadow-[0_24px_70px_-48px_rgba(8,18,15,0.34)] sm:rounded-[36px] sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              Pricing guidance
            </p>
            <h2 className="font-display mt-3 text-3xl text-[var(--forest)] sm:text-5xl">
              Start with a budget range, then we shape the route properly.
            </h2>
            <p className="mt-5 text-sm leading-7 text-[color:rgba(19,32,24,0.72)] sm:text-base sm:leading-8">
              {priceGuideNote}
            </p>

            <div className="mt-6 rounded-[24px] bg-[var(--forest)] p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold-soft)]">
                What changes the final quote
              </p>
              <div className="mt-4 grid gap-3">
                {pricingDrivers.map((driver, index) => {
                  const Icon = driverIcons[index % driverIcons.length];

                  return (
                    <div key={driver} className="flex gap-3 text-sm leading-6 text-white/78">
                      <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-[var(--gold-soft)]">
                        <Icon size={14} />
                      </span>
                      <span>{driver}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {budgetBands.map((band) => (
              <article
                key={band.label}
                className="rounded-[24px] border border-[var(--border)] bg-white p-5 shadow-[0_18px_50px_-42px_rgba(8,18,15,0.28)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
                  {band.label}
                </p>
                <h3 className="mt-3 text-xl font-semibold leading-7 text-[var(--forest)]">
                  {band.range}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                  {band.description}
                </p>
              </article>
            ))}
          </div>
        </div>

        {!compact ? (
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[rgba(16,37,28,0.1)] pt-6">
            <p className="max-w-2xl text-sm leading-7 text-[color:rgba(19,32,24,0.68)]">
              Share the range that feels comfortable. We can then explain what is realistic,
              what can be upgraded, and where the route should stay simple.
            </p>
            <Link
              href="/custom-itinerary"
              className="inline-flex items-center gap-3 rounded-full bg-[var(--forest)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--forest-soft)]"
            >
              Share my budget range
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
