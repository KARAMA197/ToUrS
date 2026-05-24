import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Globe2,
  Mail,
  MapPinned,
  ShieldCheck,
} from "lucide-react";
import { buildMailtoUrl, businessConfig, getPublicProfileLinks } from "@/lib/business";
import { buildWhatsAppUrl } from "@/lib/contact";

type OperationalProofSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryLinkHref: string;
  primaryLinkLabel: string;
  secondaryLinkHref?: string;
  secondaryLinkLabel?: string;
};

export default function OperationalProofSection({
  eyebrow,
  title,
  description,
  primaryLinkHref,
  primaryLinkLabel,
  secondaryLinkHref,
  secondaryLinkLabel,
}: OperationalProofSectionProps) {
  const publicProfiles = getPublicProfileLinks();
  const whatsappUrl = buildWhatsAppUrl(
    `Hello, I would like to speak with ${businessConfig.name} about a Tanzania trip.`
  );
  const emailUrl = buildMailtoUrl(
    "Tanzania trip planning",
    "Hello, I would like help planning a Tanzania trip."
  );
  const snapshotCards = [
    {
      title: "Planning base",
      value: businessConfig.baseLabel,
      description: "A focused Tanzania planning business instead of a broad, unclear sales front.",
      icon: MapPinned,
    },
    {
      title: "Reply target",
      value: businessConfig.responseTime,
      description: "A useful first direction should come back quickly, not a vague auto reply.",
      icon: Clock3,
    },
    {
      title: "Trip focus",
      value: "Safari, Kilimanjaro, Zanzibar",
      description: "The business is centered on Tanzania route planning, not scattered destination selling.",
      icon: ShieldCheck,
    },
    {
      title: "Public paths",
      value: publicProfiles.length > 0 ? `${publicProfiles.length} linked profiles` : "Direct contact paths",
      description:
        publicProfiles.length > 0
          ? "You can cross-check the same business identity through public profile links."
          : "Direct contact details are already visible while more public proof paths continue to grow.",
      icon: Globe2,
    },
  ];
  const verificationPoints = [
    "The same business name, planning focus, and contact details should stay consistent across the site.",
    publicProfiles.length > 0
      ? "Public profile links should open and match the same business identity."
      : "Even before more profiles are added, direct contact should still feel consistent and reachable.",
    "A good first reply should explain route direction, pace, or next steps instead of only saying thank you.",
  ];

  return (
    <section className="px-6 py-6">
      <div className="mx-auto max-w-7xl rounded-[34px] border border-[var(--border)] bg-[rgba(255,250,243,0.88)] p-8 shadow-[0_24px_70px_-48px_rgba(8,18,15,0.42)] backdrop-blur lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              {eyebrow}
            </p>
            <h2 className="font-display mt-4 max-w-3xl text-4xl text-[var(--forest)] sm:text-5xl">
              {title}
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[color:rgba(19,32,24,0.72)]">
              {description}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {snapshotCards.map((card) => {
                const Icon = card.icon;

                return (
                  <article
                    key={card.title}
                    className="rounded-[24px] border border-[var(--border)] bg-white p-5 shadow-[0_18px_50px_-42px_rgba(8,18,15,0.3)]"
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
          </div>

          <div className="grid gap-6">
            <article className="rounded-[30px] bg-[var(--forest)] p-6 text-white shadow-[0_28px_70px_-42px_rgba(8,18,15,0.8)]">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold-soft)]">
                Ways to verify us today
              </p>
              <h3 className="font-display mt-4 text-3xl text-white">
                The business should feel clear and reachable.
              </h3>

              <div className="mt-6 space-y-4">
                {verificationPoints.map((item) => (
                  <div key={item} className="flex gap-3">
                    <CheckCircle2 size={18} className="mt-1 shrink-0 text-[var(--gold-soft)]" />
                    <p className="text-sm leading-7 text-white/82">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[var(--forest)] transition hover:bg-[var(--gold-soft)]"
                >
                  WhatsApp
                  <ArrowRight size={16} />
                </a>
                <a
                  href="/contact-card"
                  className="inline-flex items-center gap-3 rounded-full border border-white/14 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/8"
                >
                  Save contact
                </a>
                {emailUrl && (
                  <a
                    href={emailUrl}
                    className="inline-flex items-center gap-3 rounded-full border border-white/14 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/8"
                  >
                    <Mail size={16} />
                    Email
                  </a>
                )}
              </div>
            </article>

            <article className="rounded-[30px] border border-[var(--border)] bg-white p-6 shadow-[0_24px_70px_-48px_rgba(8,18,15,0.38)]">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                Public profile links
              </p>

              {publicProfiles.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-3">
                  {publicProfiles.map((profile) => (
                    <a
                      key={profile.label}
                      href={profile.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--sand)]/45 px-4 py-3 text-sm font-semibold text-[var(--forest)] transition hover:bg-[var(--sand)]"
                    >
                      {profile.label}
                      <ExternalLink size={15} />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                  Public profile links can be added here as the business grows. Until then, direct
                  contact, consistent details, and a helpful first reply are the clearest proof
                  points visitors can check.
                </p>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={primaryLinkHref}
                  className="inline-flex items-center gap-3 rounded-full bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--gold)] hover:text-[var(--forest)]"
                >
                  {primaryLinkLabel}
                  <ArrowRight size={16} />
                </Link>
                {secondaryLinkHref && secondaryLinkLabel && (
                  <Link
                    href={secondaryLinkHref}
                    className="inline-flex items-center gap-3 rounded-full border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--forest)] transition hover:bg-[var(--sand)]"
                  >
                    {secondaryLinkLabel}
                  </Link>
                )}
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
