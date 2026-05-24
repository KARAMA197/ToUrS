"use client";

import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, MessageCircle, ShieldCheck } from "lucide-react";
import TrackedLink from "@/components/TrackedLink";
import type { HomepageContent } from "@/homepage-content-schema";
import { usePrimaryCtaExperiment } from "@/lib/experiments";
import { buildWhatsAppUrl } from "@/lib/contact";

const nextActionIcons = [CalendarDays, ShieldCheck, MessageCircle];

type CustomItineraryCTAProps = {
  content: HomepageContent["finalCta"];
};

export default function CustomItineraryCTA({ content }: CustomItineraryCTAProps) {
  const expertChatUrl = buildWhatsAppUrl(
    "Hello, I would like to speak to a travel expert about a Tanzania trip."
  );
  const primaryCta = usePrimaryCtaExperiment("final_cta");

  return (
    <section id="contact" className="relative scroll-mt-24 px-6 pb-24 pt-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(15,44,36,0.1),transparent_72%)]" />
      <div className="mx-auto grid max-w-6xl gap-8 overflow-hidden rounded-[36px] bg-[var(--forest)] p-8 text-white shadow-[0_36px_110px_-44px_rgba(8,18,15,0.8)] lg:grid-cols-[1.02fr_0.98fr] lg:p-10">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold-soft)]">
            {content.eyebrow}
          </p>
          <h2 className="font-display mt-4 max-w-xl text-4xl leading-none sm:text-5xl">
            {content.title}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-white/72">
            {content.description}
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <TrackedLink
              href="/custom-itinerary"
              eventName="cta_click"
              eventParams={{
                section: "final_cta",
                action: "start_planning",
                experiment_name: "primary_cta_copy",
                experiment_variant: primaryCta.id,
              }}
              className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-6 py-4 font-semibold text-[var(--forest)] transition hover:bg-[var(--gold-soft)]"
            >
              {primaryCta.label}
              <ArrowRight size={18} />
            </TrackedLink>
            <TrackedLink
              href={expertChatUrl}
              eventName="whatsapp_click"
              eventParams={{ section: "final_cta", action: "expert_chat" }}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/16 px-6 py-4 font-semibold transition hover:bg-white/8"
            >
              {content.whatsappLabel}
            </TrackedLink>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/68">
            {content.decisionNotes.map((note) => (
              <span
                key={note}
                className="rounded-full border border-white/10 px-4 py-2"
              >
                {note}
              </span>
            ))}
          </div>

          <p className="mt-4 max-w-lg text-sm leading-7 text-white/68">
            Most travelers start with dates, group size, and budget. We take it from there.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          viewport={{ once: true }}
          className="rounded-[30px] border border-white/10 bg-white/6 p-6 backdrop-blur"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold-soft)]">
            How it works
          </p>

          <div className="mt-6 space-y-5">
            {content.nextActions.map((action, index) => {
              const Icon = nextActionIcons[index] ?? MessageCircle;

              return (
                <div key={action.title} className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-[var(--gold-soft)]">
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{action.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-white/72">{action.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
