import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Globe2,
  MessageCircle,
  Quote,
  Repeat2,
  ShieldCheck,
} from "lucide-react";
import { brandPagesContent } from "@/brand-pages-content";
import { buildMailtoUrl, getPublicProfileLinks } from "@/lib/business";
import { buildWhatsAppUrl } from "@/lib/contact";
import { siteConfig } from "@/lib/site";
import { getPublishedTravelerProofs, readTravelerProofs } from "@/traveler-proofs-content";

const travelerProofContent = brandPagesContent.travelerProof;
const sourceIcons = [Globe2, Quote, MessageCircle, Repeat2];

export const metadata: Metadata = {
  title: `Traveler Proof and Review Standards | ${siteConfig.name}`,
  description:
    `See how ${siteConfig.name} approaches real traveler proof, public review signals, and honest trust-building as the business grows.`,
  alternates: {
    canonical: "/traveler-proof",
  },
  openGraph: {
    title: `Traveler Proof and Review Standards | ${siteConfig.name}`,
    description:
      `See how ${siteConfig.name} approaches real traveler proof, public review signals, and honest trust-building as the business grows.`,
    url: "/traveler-proof",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `Traveler proof for ${siteConfig.name}`,
      },
    ],
  },
};

const proofTypeLabels: Record<string, string> = {
  review: "Real review",
  photo: "Traveler photo",
  "public-signal": "Public signal",
};

export default async function TravelerProofPage() {
  const publicProfiles = getPublicProfileLinks();
  const whatsappUrl = buildWhatsAppUrl(
    `Hello, I would like to speak with ${siteConfig.name} about a Tanzania trip.`
  );
  const emailUrl = buildMailtoUrl(
    "Tanzania trip planning",
    "Hello, I would like help planning a Tanzania trip."
  );
  const travelerProofs = await readTravelerProofs();
  const publishedProofs = getPublishedTravelerProofs(travelerProofs);

  return (
    <main className="pb-24">
      <section className="relative isolate overflow-hidden px-6 pb-16 pt-10">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(196,150,85,0.18),transparent_36%),linear-gradient(180deg,rgba(250,246,238,0.92),rgba(244,237,224,0.78))]" />
        <div className="absolute inset-y-10 left-1/2 -z-10 hidden h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[rgba(16,37,28,0.08)] blur-3xl lg:block" />

        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              {travelerProofContent.eyebrow}
            </p>
            <h1 className="font-display mt-4 text-4xl text-[var(--forest)] sm:text-5xl xl:text-6xl">
              {travelerProofContent.title}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[color:rgba(19,32,24,0.74)] sm:text-lg">
              {travelerProofContent.description}
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-[var(--forest)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--gold)] hover:text-[var(--forest)]"
            >
              Ask us a question
              <ArrowRight size={16} />
            </a>
            <Link
              href="/how-we-plan"
              className="inline-flex items-center gap-3 rounded-full border border-[rgba(16,37,28,0.14)] bg-white/75 px-6 py-3 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
            >
              See how we plan
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-6">
        <div className="mx-auto max-w-7xl rounded-[34px] border border-[var(--border)] bg-[rgba(255,250,243,0.88)] p-8 shadow-[0_24px_70px_-48px_rgba(8,18,15,0.42)] backdrop-blur lg:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              Where proof grows from
            </p>
            <h2 className="font-display mt-4 text-4xl text-[var(--forest)]">
              {travelerProofContent.sourcesTitle}
            </h2>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {travelerProofContent.sources.map((item, index) => {
              const Icon = sourceIcons[index] ?? Quote;

              return (
                <article
                  key={item.title}
                  className="rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[0_22px_60px_-46px_rgba(8,18,15,0.4)]"
                >
                  <div className="mb-4 inline-flex rounded-full bg-[var(--sand)] p-3 text-[var(--forest)]">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--forest)]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-6">
        <div className="mx-auto max-w-7xl rounded-[34px] border border-[var(--border)] bg-[rgba(255,255,255,0.84)] p-8 shadow-[0_24px_70px_-48px_rgba(8,18,15,0.42)] backdrop-blur lg:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              Real proof library
            </p>
            <h2 className="font-display mt-4 text-4xl text-[var(--forest)]">
              This is where published traveler proof can appear over time.
            </h2>
            <p className="mt-5 text-sm leading-8 text-[color:rgba(19,32,24,0.72)]">
              We only want real traveler proof here. If nothing is published yet, we would rather
              say that clearly than fill the page with fake-looking praise.
            </p>
          </div>

          {publishedProofs.length > 0 ? (
            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {publishedProofs.map((proof) => (
                <article
                  key={proof.slug}
                  className="rounded-[28px] border border-[var(--border)] bg-[rgba(255,250,243,0.72)] p-6 shadow-[0_20px_50px_-42px_rgba(8,18,15,0.26)]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
                    {proofTypeLabels[proof.type]}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-[var(--forest)]">
                    {proof.title}
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-[var(--border)] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--forest)]">
                      {proof.sourceLabel}
                    </span>
                    <span className="rounded-full border border-[var(--border)] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--forest)]">
                      {proof.tripLabel}
                    </span>
                  </div>
                  <p className="mt-5 text-sm leading-7 text-[color:rgba(19,32,24,0.74)]">
                    {proof.summary}
                  </p>
                  <p className="mt-5 text-sm leading-7 text-[color:rgba(19,32,24,0.6)]">
                    {proof.proofNote}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <article className="mt-8 rounded-[30px] border border-[var(--border)] bg-[var(--sand)]/58 p-6 shadow-[0_18px_50px_-42px_rgba(8,18,15,0.22)]">
              <p className="text-sm leading-8 text-[color:rgba(19,32,24,0.74)]">
                No public traveler proof has been published here yet. That is intentional. This
                space is reserved for real reviews, real traveler notes, and real trip moments once
                they are ready to share.
              </p>
            </article>
          )}
        </div>
      </section>

      <section className="px-6 py-6">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <article className="rounded-[32px] bg-[var(--forest)] p-8 text-white shadow-[0_28px_70px_-42px_rgba(8,18,15,0.8)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold-soft)]">
              Honest standards
            </p>
            <h2 className="font-display mt-4 text-4xl text-white">
              {travelerProofContent.standardsTitle}
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/74">
              {travelerProofContent.standardsDescription}
            </p>

            <div className="mt-8 space-y-4">
              {travelerProofContent.standards.map((item) => (
                <div key={item} className="flex gap-3">
                  <CheckCircle2 size={18} className="mt-1 shrink-0 text-[var(--gold-soft)]" />
                  <p className="text-sm leading-7 text-white/82">{item}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[32px] border border-[var(--border)] bg-white p-8 shadow-[0_26px_70px_-48px_rgba(8,18,15,0.45)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              What you can verify today
            </p>
            <h2 className="font-display mt-4 text-4xl text-[var(--forest)]">
              {travelerProofContent.nowTitle}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
              {travelerProofContent.nowDescription}
            </p>

            <div className="mt-8 space-y-4">
              {travelerProofContent.nowPoints.map((item) => (
                <div key={item} className="flex gap-3">
                  <ShieldCheck size={18} className="mt-1 shrink-0 text-[var(--gold)]" />
                  <p className="text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 rounded-full bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--gold)] hover:text-[var(--forest)]"
              >
                Contact details
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/before-you-book"
                className="inline-flex items-center gap-3 rounded-full border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--forest)] transition hover:bg-[var(--sand)]"
              >
                Before you book
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="px-6 py-6">
        <div className="mx-auto max-w-7xl rounded-[34px] border border-[var(--border)] bg-[rgba(255,250,243,0.88)] p-8 shadow-[0_24px_70px_-48px_rgba(8,18,15,0.42)] backdrop-blur lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                Public profile links
              </p>
              <h2 className="font-display mt-4 max-w-2xl text-4xl text-[var(--forest)]">
                These are the public paths visitors can use as the brand grows.
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-8 text-[color:rgba(19,32,24,0.72)]">
                Public profiles help travelers check the brand outside the website itself and keep
                contact details consistent across platforms.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {publicProfiles.length > 0 ? (
                publicProfiles.map((profile) => (
                  <a
                    key={profile.label}
                    href={profile.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[0_22px_60px_-46px_rgba(8,18,15,0.4)] transition hover:-translate-y-0.5"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
                      Public platform
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold text-[var(--forest)]">
                      {profile.label}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                      Open this profile to check the same business identity and public contact path.
                    </p>
                  </a>
                ))
              ) : (
                <article className="rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[0_22px_60px_-46px_rgba(8,18,15,0.4)] sm:col-span-2">
                  <p className="text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                    Public profile links will appear here as the traveler-proof layer grows. Until
                    then, the clearest signals are direct contact, route clarity, and consistent
                    business details across the site.
                  </p>
                </article>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl rounded-[34px] bg-[linear-gradient(160deg,rgba(196,150,85,0.18),rgba(16,37,28,0.92))] p-8 text-white shadow-[0_26px_70px_-48px_rgba(8,18,15,0.55)] lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/72">
            Next step
          </p>
          <h2 className="font-display mt-4 max-w-3xl text-4xl text-white">
            {travelerProofContent.closingTitle}
          </h2>
          <p className="mt-5 max-w-3xl text-sm leading-8 text-white/82">
            {travelerProofContent.closingDescription}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/custom-itinerary"
              className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--forest)] transition hover:bg-[var(--sand)]"
            >
              Plan my trip
              <ArrowRight size={16} />
            </Link>
            {emailUrl && (
              <a
                href={emailUrl}
                className="inline-flex items-center gap-3 rounded-full border border-white/18 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/34 hover:bg-white/8"
              >
                Email us
              </a>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
