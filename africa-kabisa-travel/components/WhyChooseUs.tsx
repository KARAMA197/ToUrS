import Link from "next/link";
import {
  ArrowRight,
  Headphones,
  MapPinned,
  Route,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import type { HomepageContent } from "@/homepage-content-schema";

const benefitIcons = [MapPinned, ShieldCheck, WalletCards, Headphones];

type WhyChooseProps = {
  content: HomepageContent["whyChoose"];
};

export default function WhyChoose({ content }: WhyChooseProps) {
  return (
    <section id="why-choose" className="px-6 py-24 scroll-mt-24">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.92fr_1.08fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
            {content.eyebrow}
          </p>
          <h2 className="font-display mt-3 max-w-xl text-4xl text-[var(--forest)] sm:text-5xl">
            {content.title}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-[color:rgba(19,32,24,0.72)]">
            {content.description}
          </p>

          <div className="mt-8 rounded-[28px] bg-[var(--forest)] p-6 text-white shadow-[0_28px_70px_-42px_rgba(8,18,15,0.8)]">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-white/10 p-3">
                <Route size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--gold-soft)]">
                  {content.processEyebrow}
                </p>
                <p className="mt-1 text-lg font-semibold">{content.processTitle}</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {content.processSteps.map((step, index) => (
                <div key={step} className="flex gap-4">
                  <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-7 text-white/72">{step}</p>
                </div>
              ))}
            </div>

            <Link
              href="/about"
              className="mt-6 inline-flex items-center gap-3 text-sm font-semibold text-[var(--gold-soft)] transition hover:text-white"
            >
              <ArrowRight size={16} />
              {content.processCtaLabel}
            </Link>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {content.benefits.map((benefit, index) => {
            const Icon = benefitIcons[index] ?? MapPinned;

            return (
              <div
                key={benefit.title}
                className="rounded-[28px] border border-[var(--border)] bg-[rgba(255,255,255,0.78)] p-6 shadow-[0_24px_70px_-48px_rgba(8,18,15,0.45)] backdrop-blur"
              >
                <div className="mb-5 inline-flex rounded-full bg-[var(--sand)] p-3 text-[var(--forest)]">
                  <Icon size={18} />
                </div>
                <h3 className="text-xl font-semibold text-[var(--forest)]">{benefit.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
