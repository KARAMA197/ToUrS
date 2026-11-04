"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import type { HomepageContent } from "@/homepage-content-schema";
import { getPublicProfileLinks } from "@/lib/business";

type TestimonialsProps = {
  content: HomepageContent["testimonials"];
};

export default function Testimonials({ content }: TestimonialsProps) {
  const socialProfiles = getPublicProfileLinks().filter((profile) =>
    ["Instagram", "TikTok", "Facebook", "Tripadvisor", "Google Business Profile"].includes(
      profile.label
    )
  );

  return (
    <section id="testimonials" className="relative scroll-mt-24 overflow-hidden px-6 py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,rgba(200,154,70,0.12),transparent_70%)]" />
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
            {content.eyebrow}
          </p>
          <h2 className="font-display mt-3 text-4xl text-[var(--forest)] sm:text-5xl">
            {content.title}
          </h2>
          <p className="mt-5 text-base leading-8 text-[color:rgba(19,32,24,0.72)]">
            {content.description}
          </p>
        </div>

        {socialProfiles.length > 0 && (
          <div className="mt-12 rounded-[30px] border border-[var(--border)] bg-[rgba(255,250,243,0.82)] p-6 shadow-[0_22px_60px_-46px_rgba(8,18,15,0.26)]">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                  Social proof
                </p>
                <h3 className="font-display mt-3 text-3xl text-[var(--forest)]">
                  Follow the brand where travelers already check updates.
                </h3>
                <p className="mt-3 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                  These channels help visitors see the same business identity beyond the website
                  while real traveler reviews and trip stories continue to grow.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {socialProfiles.map((profile) => (
                  <a
                    key={profile.label}
                    href={profile.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
                  >
                    {profile.label}
                    <ExternalLink size={15} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {content.reviews.map((review, index) => (
            <motion.article
              key={review.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="rounded-[32px] border border-[var(--border)] bg-[rgba(255,255,255,0.82)] p-6 shadow-[0_28px_80px_-48px_rgba(8,18,15,0.48)] backdrop-blur"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
                    {review.country}
                  </p>
                  <h3 className="font-display mt-3 text-3xl text-[var(--forest)]">
                    {review.name}
                  </h3>
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--forest)] text-sm font-semibold text-[var(--gold-soft)]">
                  {(index + 1).toString().padStart(2, "0")}
                </div>
              </div>

              <div className="mt-5 inline-flex rounded-full bg-[var(--sand)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--forest)]">
                {review.trip}
              </div>

              <p className="mt-5 text-base leading-8 text-[color:rgba(19,32,24,0.78)]">
                {review.quote}
              </p>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 rounded-[30px] border border-[var(--border)] bg-[rgba(255,250,243,0.78)] p-6 text-center shadow-[0_22px_60px_-46px_rgba(8,18,15,0.26)]">
          <p className="text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
            We will only publish real traveler reviews and trip photos when they are ready to be
            shared publicly. Until then, this section stays honest about what you can check today.
          </p>
          <Link
            href="/traveler-proof"
            className="mt-5 inline-flex items-center gap-3 text-sm font-semibold text-[var(--forest)] transition hover:text-[var(--gold)]"
          >
            See our traveler-proof standards
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
