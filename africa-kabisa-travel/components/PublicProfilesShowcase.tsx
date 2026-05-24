import Link from "next/link";
import { ArrowRight, ExternalLink, Globe2, MessageCircle } from "lucide-react";
import { getPublicProfileLinks } from "@/lib/business";
import { buildWhatsAppUrl } from "@/lib/contact";

export default function PublicProfilesShowcase() {
  const publicProfiles = getPublicProfileLinks();

  if (publicProfiles.length === 0) {
    return null;
  }

  const whatsappUrl = buildWhatsAppUrl(
    "Hello, I would like to ask a few questions about a Tanzania trip."
  );

  return (
    <section className="px-6 py-6">
      <div className="mx-auto max-w-7xl rounded-[34px] border border-[var(--border)] bg-[rgba(255,250,243,0.88)] p-8 shadow-[0_24px_70px_-48px_rgba(8,18,15,0.42)] backdrop-blur lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              Public profile paths
            </p>
            <h2 className="font-display mt-4 max-w-2xl text-4xl text-[var(--forest)] sm:text-5xl">
              See the public side of the business as it grows.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[color:rgba(19,32,24,0.72)]">
              Public profiles help visitors check the brand, keep up with the business, and use the
              contact path that feels easiest to them.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 rounded-full bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--gold)] hover:text-[var(--forest)]"
              >
                Contact details
                <ArrowRight size={16} />
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-full border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--forest)] transition hover:bg-[var(--sand)]"
              >
                <MessageCircle size={16} />
                WhatsApp
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {publicProfiles.map((profile) => (
              <a
                key={profile.label}
                href={profile.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-[28px] border border-[var(--border)] bg-white p-6 shadow-[0_18px_50px_-42px_rgba(8,18,15,0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-42px_rgba(8,18,15,0.34)]"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="inline-flex rounded-full bg-[var(--sand)] p-3 text-[var(--forest)]">
                    <Globe2 size={18} />
                  </div>
                  <ExternalLink
                    size={16}
                    className="text-[color:rgba(19,32,24,0.46)] transition group-hover:text-[var(--gold)]"
                  />
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
                  Public platform
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-[var(--forest)]">
                  {profile.label}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                  Open this profile to check the brand publicly and stay connected on that
                  platform.
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
