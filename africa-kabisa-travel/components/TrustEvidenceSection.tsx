import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  ExternalLink,
  Mail,
  MapPinned,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/contact";
import { businessConfig, getPublicProfileLinks } from "@/lib/business";

const trustPhotos = [
  {
    src: "/images/tour-gallery/serengeti-lion-pride.jpeg",
    alt: "Lions in the Serengeti during a Tanzania safari",
    label: "Safari routes",
  },
  {
    src: "/images/tour-gallery/kilimanjaro-climbers-camp.jpeg",
    alt: "Kilimanjaro climbers camp on the mountain route",
    label: "Mountain support",
  },
  {
    src: "/images/tour-gallery/zanzibar-beach-couple.jpeg",
    alt: "Travelers walking on a Zanzibar beach",
    label: "Beach add-ons",
  },
];

const proofPoints = [
  {
    title: "Direct contact details",
    description: `Reach the planning team by WhatsApp at ${businessConfig.phoneDisplay}${
      businessConfig.publicEmail ? ` or email at ${businessConfig.publicEmail}` : ""
    }.`,
    icon: MessageCircle,
  },
  {
    title: "Public social profiles",
    description:
      "Check the same brand identity on Instagram, TikTok, Facebook, and any public review profiles as they grow.",
    icon: ShieldCheck,
  },
  {
    title: "Tanzania route knowledge",
    description:
      "Ask about season, park order, Kilimanjaro pacing, Zanzibar timing, or how to combine experiences without rushing.",
    icon: MapPinned,
  },
  {
    title: "Real trip media first",
    description:
      "We use Tanzania trip imagery and only add traveler reviews or personal photos when they can be shared accurately.",
    icon: Camera,
  },
];

export default function TrustEvidenceSection() {
  const publicProfiles = getPublicProfileLinks().filter((profile) =>
    ["Instagram", "TikTok", "Facebook", "Tripadvisor", "Google Business Profile"].includes(
      profile.label
    )
  );

  return (
    <section className="px-5 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              Trust signals
            </p>
            <h2 className="font-display mt-4 max-w-3xl text-3xl text-[var(--forest)] sm:text-5xl">
              Proof should feel easy to check before you start planning.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[color:rgba(19,32,24,0.72)] sm:text-base sm:leading-8">
              Before you share trip details, you should be able to see who you are contacting,
              how to reach us again, and what kind of planning standard we are working toward.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {proofPoints.map((point) => {
                const Icon = point.icon;

                return (
                  <article
                    key={point.title}
                    className="rounded-[24px] border border-[var(--border)] bg-white p-5 shadow-[0_22px_60px_-46px_rgba(8,18,15,0.34)]"
                  >
                    <div className="inline-flex rounded-full bg-[var(--sand)] p-3 text-[var(--forest)]">
                      <Icon size={18} />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-[var(--forest)]">
                      {point.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                      {point.description}
                    </p>
                  </article>
                );
              })}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={buildWhatsAppUrl("Hello, I would like to check your availability for a Tanzania trip.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-full bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--gold)] hover:text-[var(--forest)]"
              >
                WhatsApp us
                <MessageCircle size={16} />
              </a>
              {businessConfig.publicEmail ? (
                <a
                  href={`mailto:${businessConfig.publicEmail}`}
                  className="inline-flex items-center gap-3 rounded-full border border-[rgba(16,37,28,0.14)] bg-white px-5 py-3 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
                >
                  Email us
                  <Mail size={16} />
                </a>
              ) : null}
              <Link
                href="/traveler-proof"
                className="inline-flex items-center gap-3 rounded-full border border-[rgba(16,37,28,0.14)] bg-white px-5 py-3 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
              >
                Proof standards
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {trustPhotos.map((photo, index) => (
                <figure
                  key={photo.src}
                  className={`overflow-hidden rounded-[24px] border border-[var(--border)] bg-white shadow-[0_22px_70px_-50px_rgba(8,18,15,0.45)] ${
                    index === 0 ? "col-span-3 sm:col-span-2" : ""
                  }`}
                >
                  <div className={index === 0 ? "relative h-56 sm:h-72" : "relative h-36 sm:h-72"}>
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes={index === 0 ? "(min-width: 1024px) 34vw, 100vw" : "(min-width: 1024px) 17vw, 50vw"}
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,18,15,0.04),rgba(8,18,15,0.56))]" />
                    <figcaption className="absolute inset-x-0 bottom-0 p-4 text-sm font-semibold text-white">
                      {photo.label}
                    </figcaption>
                  </div>
                </figure>
              ))}
            </div>

            {publicProfiles.length > 0 ? (
              <div className="rounded-[28px] border border-[var(--border)] bg-[rgba(255,250,243,0.9)] p-5 shadow-[0_22px_60px_-46px_rgba(8,18,15,0.26)]">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--gold)]">
                  Public profiles
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {publicProfiles.map((profile) => (
                    <a
                      key={profile.label}
                      href={profile.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
                    >
                      {profile.label}
                      <ExternalLink size={14} />
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
