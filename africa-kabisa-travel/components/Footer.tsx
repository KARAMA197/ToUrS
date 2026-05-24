import Link from "next/link";
import { ArrowRight, Compass, Mail, MessageCircle } from "lucide-react";
import { brandPagesContent } from "@/brand-pages-content";
import BrandLogo from "@/components/BrandLogo";
import { buildMailtoUrl, businessConfig, getPublicProfileLinks } from "@/lib/business";
import { buildWhatsAppUrl } from "@/lib/contact";

const footerContent = brandPagesContent.footer;

const exploreLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/how-we-plan", label: "How we plan" },
  { href: "/know-before-you-go", label: "Know before you go" },
  { href: "/responsible-travel", label: "Responsible travel" },
  { href: "/contact", label: "Contact" },
  { href: "/#featured-packages", label: "Signature journeys" },
  { href: "/accommodation", label: "Accommodation" },
  { href: "/destinations", label: "Destinations" },
  { href: "/#travel-guide", label: "Trip planning guide" },
  { href: "/travel-guides", label: "Travel guides" },
  { href: "/traveler-proof", label: "Traveler proof" },
];

const serviceLinks = [
  { href: "/custom-itinerary", label: "Custom itinerary" },
  { href: "/accommodation", label: "Accommodation planning" },
  { href: "/how-we-plan", label: "How we plan trips" },
  { href: "/before-you-book", label: "Before you book" },
  { href: "/know-before-you-go", label: "Know before you go" },
  { href: "/responsible-travel", label: "Responsible travel" },
  { href: "/traveler-proof", label: "Traveler proof" },
  { href: "/contact", label: "Contact details" },
  { href: "/#contact", label: "Planning process" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const whatsappUrl = buildWhatsAppUrl(
    `Hello, I would like to speak with ${businessConfig.name} about a Tanzania trip.`
  );
  const emailUrl = buildMailtoUrl(
    "Tanzania trip planning",
    "Hello, I would like help planning a Tanzania trip."
  );
  const publicProfiles = getPublicProfileLinks();

  return (
    <footer className="bg-[#08120f] px-6 pb-10 pt-16 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 border-b border-white/10 pb-12 lg:grid-cols-[1.1fr_0.7fr_0.7fr_0.9fr]">
          <div>
            <Link href="/" className="inline-flex">
              <BrandLogo tone="light" size="md" />
            </Link>

            <p className="mt-6 max-w-md text-sm leading-7 text-white/70">
              {footerContent.description}
            </p>

            <Link
              href="/custom-itinerary"
              className="mt-6 inline-flex items-center gap-3 text-sm font-semibold text-[var(--gold-soft)] transition hover:text-white"
            >
              Plan my trip
              <ArrowRight size={16} />
            </Link>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--gold-soft)]">
              Explore
            </p>
            <div className="mt-5 flex flex-col gap-3 text-sm text-white/70">
              {exploreLinks.map((link) => (
                <Link key={link.href} href={link.href} className="transition hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--gold-soft)]">
              Services
            </p>
            <div className="mt-5 flex flex-col gap-3 text-sm text-white/70">
              {serviceLinks.map((link) => (
                <Link key={link.href} href={link.href} className="transition hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--gold-soft)]">
              Contact
            </p>
            <div className="mt-5 space-y-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 rounded-[24px] border border-white/10 bg-white/5 p-4 transition hover:bg-white/8"
              >
                <div className="mt-1 rounded-full bg-white/10 p-3 text-[var(--gold-soft)]">
                  <MessageCircle size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold">WhatsApp chat</p>
                  <p className="mt-1 text-sm leading-7 text-white/70">
                    {footerContent.whatsappDescription} {businessConfig.phoneDisplay}.
                  </p>
                </div>
              </a>

              <Link
                href="/contact"
                className="flex items-start gap-3 rounded-[24px] border border-white/10 bg-white/5 p-4 transition hover:bg-white/8"
              >
                <div className="mt-1 rounded-full bg-white/10 p-3 text-[var(--gold-soft)]">
                  <Compass size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold">{footerContent.contactTitle}</p>
                  <p className="mt-1 text-sm leading-7 text-white/70">
                    {footerContent.contactDescription}
                  </p>
                </div>
              </Link>

              {emailUrl && (
                <a
                  href={emailUrl}
                  className="flex items-start gap-3 rounded-[24px] border border-white/10 bg-white/5 p-4 transition hover:bg-white/8"
                >
                  <div className="mt-1 rounded-full bg-white/10 p-3 text-[var(--gold-soft)]">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{footerContent.emailTitle}</p>
                    <p className="mt-1 text-sm leading-7 text-white/70">
                      {businessConfig.publicEmail}
                    </p>
                  </div>
                </a>
              )}
            </div>

            <div className="mt-5 space-y-2 text-sm text-white/56">
              <p>Tanzania-based private trip planning</p>
              <p>Reply target: {businessConfig.responseTime}</p>
              <p>Safari, Kilimanjaro, and Zanzibar trip planning</p>
            </div>

            {publicProfiles.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-3">
                {publicProfiles.map((profile) => (
                  <a
                    key={profile.label}
                    href={profile.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/72 transition hover:border-white/24 hover:text-white"
                  >
                    {profile.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 text-sm text-white/56 sm:flex-row sm:items-center sm:justify-between">
          <p>{year} {businessConfig.name}. All rights reserved.</p>
          <p>{footerContent.bottomNote}</p>
        </div>
      </div>
    </footer>
  );
}
