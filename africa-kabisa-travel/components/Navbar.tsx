"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import TrackedLink from "@/components/TrackedLink";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/how-we-plan", label: "How we plan" },
  { href: "/#featured-packages", label: "Journeys" },
  { href: "/accommodation", label: "Stays" },
  { href: "/destinations", label: "Destinations" },
  { href: "/travel-guides", label: "Guides" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrollRatio, setScrollRatio] = useState(0);

  useEffect(() => {
    const updateScrollRatio = () => {
      setScrollRatio(Math.min(window.scrollY / 260, 1));
    };

    updateScrollRatio();
    window.addEventListener("scroll", updateScrollRatio, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrollRatio);
    };
  }, []);

  const shellStyle: CSSProperties = {
    backgroundColor: `rgba(8, 18, 15, ${0.82 - scrollRatio * 0.48})`,
    borderColor: `rgba(255, 255, 255, ${0.1 - scrollRatio * 0.03})`,
    boxShadow: `0 24px 60px -28px rgba(8, 18, 15, ${0.9 - scrollRatio * 0.38})`,
    backdropFilter: `blur(${24 - scrollRatio * 8}px)`,
  };

  const mobileStyle: CSSProperties = {
    backgroundColor: `rgba(8, 18, 15, ${0.94 - scrollRatio * 0.18})`,
    borderColor: `rgba(255, 255, 255, 0.1)`,
    boxShadow: `0 24px 60px -28px rgba(8, 18, 15, 0.9)`,
    backdropFilter: "blur(24px)",
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 pt-4">
        <div
          style={shellStyle}
          className="rounded-full border px-4 py-3 text-white transition-all duration-500"
        >
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="shrink-0">
              <BrandLogo tone="light" size="sm" />
            </Link>

            <div className="hidden items-center gap-6 text-sm font-medium text-white/80 lg:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden lg:block">
              <TrackedLink
                href="/custom-itinerary"
                eventName="cta_click"
                eventParams={{ section: "navbar", action: "plan_my_trip" }}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[var(--forest)] transition hover:bg-[var(--gold-soft)]"
              >
                Plan my trip
                <ArrowRight size={16} />
              </TrackedLink>
            </div>

            <button
              className="lg:hidden"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {open && (
          <div
            style={mobileStyle}
            className="mt-3 rounded-[28px] border p-5 text-white transition-all duration-500 lg:hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-2xl px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/6 hover:text-white"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <TrackedLink
                href="/custom-itinerary"
                eventName="cta_click"
                eventParams={{ section: "navbar_mobile", action: "plan_my_trip" }}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[var(--forest)] transition hover:bg-[var(--gold-soft)]"
                onClick={() => setOpen(false)}
              >
                Plan my trip
                <ArrowRight size={16} />
              </TrackedLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
