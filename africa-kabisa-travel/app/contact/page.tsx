import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  MapPinned,
  MessageCircle,
  NotebookText,
} from "lucide-react";
import { brandPagesContent } from "@/brand-pages-content";
import OperationalProofSection from "@/components/OperationalProofSection";
import { buildWhatsAppUrl } from "@/lib/contact";
import { buildMailtoUrl, businessConfig } from "@/lib/business";
import { siteConfig } from "@/lib/site";

const contactContent = brandPagesContent.contact;
const teamStructurePreview = brandPagesContent.about.teamStructureRoles.slice(0, 3);

const contactCards = [
  {
    icon: MessageCircle,
    title: contactContent.cardTitles[0],
    description: contactContent.cardDescriptions[0],
    value: businessConfig.phoneDisplay,
    href: buildWhatsAppUrl("Hello, I would like help planning a Tanzania trip."),
    external: true,
  },
  {
    icon: NotebookText,
    title: contactContent.cardTitles[1],
    description: contactContent.cardDescriptions[1],
    value: "Custom itinerary form",
    href: "/custom-itinerary",
    external: false,
  },
  {
    icon: Clock3,
    title: contactContent.cardTitles[2],
    description: contactContent.cardDescriptions[2],
    value: businessConfig.responseTime,
    href: "/about",
    external: false,
  },
  {
    icon: MapPinned,
    title: contactContent.cardTitles[3],
    description: contactContent.cardDescriptions[3],
    value: "Tanzania-based private trip planning",
    href: "/about",
    external: false,
  },
];

const emailHref = buildMailtoUrl(
  "Tanzania trip planning",
  "Hello, I would like help planning a Tanzania trip."
);

export const metadata: Metadata = {
  title: "Contact Our Tanzania Trip Planning Team",
  description:
    `Contact ${siteConfig.name} for private Tanzania safari planning, Kilimanjaro trips, Zanzibar holidays, and custom combined itineraries.`,
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Our Tanzania Trip Planning Team",
    description:
      `Contact ${siteConfig.name} for private Tanzania safari planning, Kilimanjaro trips, Zanzibar holidays, and custom combined itineraries.`,
    url: "/contact",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `Contact ${siteConfig.name}`,
      },
    ],
  },
};

export default function ContactPage() {
  return (
    <main className="pb-24">
      <section className="relative isolate overflow-hidden px-6 pb-16 pt-10">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(196,150,85,0.18),transparent_36%),linear-gradient(180deg,rgba(250,246,238,0.92),rgba(244,237,224,0.78))]" />
        <div className="absolute inset-y-10 left-1/2 -z-10 hidden h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-[rgba(16,37,28,0.08)] blur-3xl lg:block" />

        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              {contactContent.eyebrow}
            </p>
            <h1 className="font-display mt-4 text-4xl text-[var(--forest)] sm:text-5xl xl:text-6xl">
              {contactContent.title}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[color:rgba(19,32,24,0.74)] sm:text-lg">
              {contactContent.description}
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href={buildWhatsAppUrl("Hello, I would like help planning a Tanzania trip.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-[var(--forest)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--gold)] hover:text-[var(--forest)]"
            >
              Message on WhatsApp
              <ArrowRight size={16} />
            </a>
            <Link
              href="/custom-itinerary"
              className="inline-flex items-center gap-3 rounded-full border border-[rgba(16,37,28,0.14)] bg-white/75 px-6 py-3 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
            >
              Use the trip form
            </Link>
            <a
              href="/contact-card"
              className="inline-flex items-center gap-3 rounded-full border border-[rgba(16,37,28,0.14)] bg-white/75 px-6 py-3 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
            >
              Save contact
            </a>
            {emailHref && (
              <a
                href={emailHref}
                className="inline-flex items-center gap-3 rounded-full border border-[rgba(16,37,28,0.14)] bg-white/75 px-6 py-3 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
              >
                Email us
              </a>
            )}
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {contactCards.map((card) => {
              const Icon = card.icon;
              const content = (
                <article className="h-full rounded-[24px] border border-[var(--border)] bg-white/78 p-5 shadow-[0_24px_60px_-38px_rgba(8,18,15,0.45)] backdrop-blur transition hover:-translate-y-0.5">
                  <div className="flex items-center gap-3 text-[var(--gold)]">
                    <Icon size={18} />
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:rgba(19,32,24,0.58)]">
                      {card.title}
                    </p>
                  </div>
                  <p className="mt-4 text-lg font-semibold text-[var(--forest)]">{card.value}</p>
                  <p className="mt-3 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                    {card.description}
                  </p>
                </article>
              );

              if (card.external) {
                return (
                  <a
                    key={card.title}
                    href={card.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    {content}
                  </a>
                );
              }

              return (
                <Link key={card.title} href={card.href} className="block">
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <article className="rounded-[32px] border border-[var(--border)] bg-[rgba(255,255,255,0.82)] p-8 shadow-[0_26px_70px_-48px_rgba(8,18,15,0.45)] backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              Best details to send
            </p>
            <h2 className="font-display mt-4 text-4xl text-[var(--forest)]">
              {contactContent.checklistTitle}
            </h2>
            <div className="mt-8 space-y-4">
              {contactContent.checklistItems.map((item) => (
                <div key={item} className="flex gap-3">
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--gold)]" />
                  <p className="text-sm leading-7 text-[var(--forest)]">{item}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm leading-7 text-[color:rgba(19,32,24,0.68)]">
              {contactContent.checklistNote}
            </p>
          </article>

          <article className="rounded-[32px] bg-[var(--forest)] p-8 text-white shadow-[0_28px_70px_-42px_rgba(8,18,15,0.8)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold-soft)]">
              Service area
            </p>
            <h2 className="font-display mt-4 text-4xl text-white">
              {contactContent.serviceTitle}
            </h2>
            <div className="mt-8 flex flex-wrap gap-3">
              {businessConfig.serviceAreas.map((area) => (
                <span
                  key={area}
                  className="rounded-full border border-white/14 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white"
                >
                  {area}
                </span>
              ))}
            </div>
            <p className="mt-6 text-sm leading-7 text-white/78">
              {contactContent.serviceDescription}
            </p>
          </article>
        </div>
      </section>

      <section className="px-6 py-6">
        <div className="mx-auto max-w-7xl rounded-[34px] border border-[var(--border)] bg-[rgba(255,250,243,0.86)] p-8 shadow-[0_24px_70px_-48px_rgba(8,18,15,0.42)] backdrop-blur lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                Planning strength
              </p>
              <h2 className="font-display mt-4 max-w-2xl text-4xl text-[var(--forest)]">
                {contactContent.startupNoteTitle}
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-8 text-[color:rgba(19,32,24,0.72)]">
                {contactContent.startupNoteDescription}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {contactContent.startupNoteItems.map((item) => (
                <article
                  key={item}
                  className="rounded-[26px] border border-[var(--border)] bg-white p-6 shadow-[0_22px_60px_-46px_rgba(8,18,15,0.4)]"
                >
                  <p className="text-sm leading-7 text-[var(--forest)]">{item}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-6">
        <div className="mx-auto max-w-7xl rounded-[34px] border border-[var(--border)] bg-[rgba(255,255,255,0.82)] p-8 shadow-[0_24px_70px_-48px_rgba(8,18,15,0.42)] backdrop-blur lg:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              Who handles your inquiry
            </p>
            <h2 className="font-display mt-4 text-4xl text-[var(--forest)]">
              A clearer planning conversation keeps the trip closer to your needs.
            </h2>
            <p className="mt-5 text-sm leading-8 text-[color:rgba(19,32,24,0.72)]">
              When the trip is still taking shape, it helps when the same planning side stays close
              to the route, the changes, and the next reply.
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {teamStructurePreview.map((item) => (
              <article
                key={item.title}
                className="rounded-[26px] border border-[var(--border)] bg-white p-6 shadow-[0_18px_50px_-42px_rgba(8,18,15,0.26)]"
              >
                <h3 className="text-xl font-semibold text-[var(--forest)]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <OperationalProofSection
        eyebrow="Verification and contact"
        title="Contact should feel easy, and the business details should hold together."
        description="Before a traveler moves forward, it should be simple to check the planning focus, reply path, contact consistency, and any public profiles already linked to the business."
        primaryLinkHref="/custom-itinerary"
        primaryLinkLabel="Start the trip form"
        secondaryLinkHref="/about"
        secondaryLinkLabel="Read our story"
      />
    </main>
  );
}
