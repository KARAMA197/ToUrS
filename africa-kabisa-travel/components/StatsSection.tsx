"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Clock3,
  MapPinned,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import type { HomepageContent } from "@/homepage-content-schema";

const trustIcons = [MapPinned, ShieldCheck, Clock3, MessageCircle];

type StatsSectionProps = {
  content: HomepageContent["trust"];
};

export default function StatsSection({ content }: StatsSectionProps) {
  return (
    <section className="relative z-20 -mt-10 px-5 pb-16 sm:-mt-16 sm:px-6 sm:pb-24">
      <div className="mx-auto max-w-6xl rounded-[28px] border border-[var(--border)] bg-[rgba(255,250,243,0.92)] p-5 shadow-[0_32px_100px_-48px_rgba(8,18,15,0.6)] backdrop-blur-xl sm:rounded-[32px] sm:p-8 lg:p-10">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[0.94fr_1.06fr] lg:items-start">
          <div>
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                {content.eyebrow}
              </p>
              <h2 className="font-display mt-3 text-3xl text-[var(--forest)] sm:text-5xl">
                {content.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[color:rgba(19,32,24,0.72)] sm:text-base sm:leading-8">
                {content.description}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4">
              {content.points.map((point, index) => {
                const Icon = trustIcons[index] ?? ShieldCheck;

                return (
                  <motion.div
                    key={point.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    viewport={{ once: true }}
                    className="rounded-[20px] border border-[var(--border)] bg-white p-4 shadow-[0_20px_60px_-40px_rgba(8,18,15,0.42)] sm:rounded-[24px] sm:p-5"
                  >
                    <div className="mb-4 inline-flex rounded-full bg-[var(--sand)] p-3 text-[var(--forest)]">
                      <Icon size={18} />
                    </div>
                    <h3 className="text-base font-semibold leading-6 text-[var(--forest)] sm:text-lg">{point.title}</h3>
                    <p className="mt-2 hidden text-sm leading-7 text-[color:rgba(19,32,24,0.72)] sm:block">
                      {point.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[26px] bg-[var(--forest)] p-5 text-white shadow-[0_28px_70px_-42px_rgba(8,18,15,0.8)] sm:rounded-[30px] sm:p-6 lg:sticky lg:top-28">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold-soft)]">
              {content.faqEyebrow}
            </p>
            <h3 className="font-display mt-3 text-3xl">
              {content.faqTitle}
            </h3>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/72">
              {content.faqDescription}
            </p>

            <div className="mt-5 grid gap-3 sm:mt-6">
              {content.faqs.slice(0, 5).map((item, index) => (
                <motion.details
                  key={item.question}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.04 }}
                  viewport={{ once: true }}
                  className="group rounded-[20px] border border-white/10 bg-white/6 p-4 sm:rounded-[22px] sm:p-5"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-left marker:hidden">
                    <span className="text-base font-semibold text-white">{item.question}</span>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/6 transition group-open:bg-[var(--gold)]/16">
                      <ChevronDown
                        size={16}
                        className="text-[var(--gold-soft)] transition-transform duration-300 group-open:rotate-180"
                      />
                    </span>
                  </summary>
                  <p className="mt-3 pr-2 text-sm leading-6 text-white/72 sm:pr-10 sm:leading-7">{item.answer}</p>
                </motion.details>
              ))}
            </div>

            <div className="mt-6 rounded-[24px] border border-white/10 bg-white/8 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold-soft)]">
                {content.ctaEyebrow}
              </p>
              <p className="mt-3 text-sm leading-7 text-white/72">{content.ctaText}</p>
              <Link
                href="/custom-itinerary"
                className="mt-5 inline-flex items-center gap-3 text-sm font-semibold text-white transition hover:text-[var(--gold-soft)]"
              >
                {content.ctaLinkLabel}
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
