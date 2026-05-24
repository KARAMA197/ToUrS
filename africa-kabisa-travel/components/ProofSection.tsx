import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Mail,
  MapPinned,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { buildMailtoUrl, businessConfig, getPublicProfileLinks } from "@/lib/business";
import { buildWhatsAppUrl } from "@/lib/contact";

export default function ProofSection() {
  const publicProfiles = getPublicProfileLinks();
  const whatsappUrl = buildWhatsAppUrl(
    `Hello, I would like to speak with ${businessConfig.name} about a Tanzania trip.`
  );
  const emailUrl = buildMailtoUrl(
    "Tanzania trip planning",
    "Hello, I would like help planning a Tanzania trip."
  );
  const proofCards = [
    {
      title: "WhatsApp planning line",
      value: businessConfig.phoneDisplay,
      description: "A direct way to reach the same planning team again if you want to continue.",
      icon: MessageCircle,
    },
    {
      title: "Reply target",
      value: businessConfig.responseTime,
      description: "Your first reply should give route direction, not just a generic thank-you note.",
      icon: Clock3,
    },
    {
      title: "Planning base",
      value: businessConfig.baseLabel,
      description: "We focus on Tanzania safari, Kilimanjaro, Zanzibar, and combined trip planning.",
      icon: MapPinned,
    },
    {
      title: "Public proof paths",
      value: publicProfiles.length > 0 ? `${publicProfiles.length} live links` : "Direct site contact paths",
      description:
        publicProfiles.length > 0
          ? "You can compare the brand and contact details through our linked public profiles."
          : "Until more public profiles are added, you can still verify us through consistent site contact paths.",
      icon: ShieldCheck,
    },
  ];
  const verificationChecks = [
    "The same business name and contact details should appear across the site.",
    publicProfiles.length > 0
      ? "Public profile links should open and match the same business identity."
      : "Direct contact should still feel consistent even before more public profiles are added.",
    "A useful first reply should make the trip clearer, not leave you guessing the next step.",
  ];
  const firstReplyPoints = [
    "A route direction that fits your dates, travel style, and priorities.",
    "A realistic idea of pace, comfort level, and how the trip flows.",
    "A clear next step if you want to refine the route further.",
  ];

  return (
    <section className="px-6 py-8">
      <div className="mx-auto max-w-7xl rounded-[34px] border border-[var(--border)] bg-[rgba(255,250,243,0.9)] p-8 shadow-[0_28px_80px_-52px_rgba(8,18,15,0.45)] backdrop-blur lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              Proof you can check
            </p>
            <h2 className="font-display mt-4 max-w-2xl text-4xl text-[var(--forest)] sm:text-5xl">
              What should make you feel confident to continue.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[color:rgba(19,32,24,0.72)]">
              A growing travel business should still feel clear and reachable. Before you move
              forward, you should be able to verify who you are speaking to, how they reply, and
              whether the first planning step actually helps your trip make sense.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {proofCards.map((card) => {
                const Icon = card.icon;

                return (
                  <article
                    key={card.title}
                    className="rounded-[24px] border border-[var(--border)] bg-white p-5 shadow-[0_18px_50px_-42px_rgba(8,18,15,0.32)]"
                  >
                    <div className="mb-4 inline-flex rounded-full bg-[var(--sand)] p-3 text-[var(--forest)]">
                      <Icon size={18} />
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
                      {card.title}
                    </p>
                    <p className="mt-3 text-lg font-semibold text-[var(--forest)]">{card.value}</p>
                    <p className="mt-2 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                      {card.description}
                    </p>
                  </article>
                );
              })}
            </div>

            <div className="mt-6 rounded-[26px] border border-[var(--border)] bg-white p-6 shadow-[0_18px_50px_-42px_rgba(8,18,15,0.24)]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
                What to check first
              </p>
              <div className="mt-4 grid gap-3">
                {verificationChecks.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 text-[var(--forest)]">
                      <CheckCircle2 size={18} />
                    </span>
                    <p className="text-sm leading-7 text-[color:rgba(19,32,24,0.74)]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-[30px] bg-[var(--forest)] p-6 text-white shadow-[0_30px_80px_-46px_rgba(8,18,15,0.82)]">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold-soft)]">
                What your first reply should include
              </p>
              <h3 className="font-display mt-4 text-3xl text-white">
                Helpful trip guidance before any pressure to continue.
              </h3>
              <p className="mt-4 text-sm leading-7 text-white/74">
                A good first reply should help you understand route shape, pace, and the strongest
                next step for your Tanzania trip.
              </p>

              <div className="mt-6 space-y-3">
                {firstReplyPoints.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-[20px] border border-white/10 bg-white/6 p-4">
                    <span className="mt-0.5 text-[var(--gold-soft)]">
                      <CheckCircle2 size={18} />
                    </span>
                    <p className="text-sm leading-7 text-white/76">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/how-we-plan"
                  className="inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[var(--forest)] transition hover:bg-[var(--gold-soft)]"
                >
                  See how we plan
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/before-you-book"
                  className="inline-flex items-center gap-3 rounded-full border border-white/14 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/8"
                >
                  Before you book
                </Link>
              </div>
            </div>

            <div className="rounded-[30px] border border-[var(--border)] bg-white p-6 shadow-[0_24px_70px_-48px_rgba(8,18,15,0.38)]">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                Check our contact paths
              </p>
              <h3 className="font-display mt-4 text-3xl text-[var(--forest)]">
                Reach us in the way that feels easiest for you.
              </h3>
              <p className="mt-4 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                You can message on WhatsApp, use the trip form, email us, save the business
                contact, or cross-check any public profiles we have linked.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-full bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--forest-2)]"
                >
                  WhatsApp
                  <ArrowRight size={16} />
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 rounded-full border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--forest)] transition hover:bg-[var(--sand)]"
                >
                  Contact page
                </Link>
                <Link
                  href="/custom-itinerary"
                  className="inline-flex items-center gap-3 rounded-full border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--forest)] transition hover:bg-[var(--sand)]"
                >
                  Trip form
                </Link>
                <a
                  href="/contact-card"
                  className="inline-flex items-center gap-3 rounded-full border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--forest)] transition hover:bg-[var(--sand)]"
                >
                  Save contact
                </a>
                {emailUrl && (
                  <a
                    href={emailUrl}
                    className="inline-flex items-center gap-3 rounded-full border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--forest)] transition hover:bg-[var(--sand)]"
                  >
                    <Mail size={16} />
                    Email
                  </a>
                )}
              </div>

              <div className="mt-8 rounded-[24px] border border-[var(--border)] bg-[var(--sand)]/55 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                  Public profiles
                </p>

                {publicProfiles.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-3">
                    {publicProfiles.map((profile) => (
                      <a
                        key={profile.label}
                        href={profile.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--forest)] transition hover:bg-[var(--sand)]"
                      >
                        {profile.label}
                        <ExternalLink size={15} />
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                    Public profile links can be added here as the business grows. For now, the
                    clearest proof is direct contact, consistent details, and a helpful first reply.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
