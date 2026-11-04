import BookWithConfidenceSection from "@/components/BookWithConfidenceSection";
import dynamicImport from "next/dynamic";
import type { Metadata } from "next";
import Destinations from "@/components/Destinations";
import Hero from "@/components/Hero";
import HomeAboutSection from "@/components/HomeAboutSection";
import PlanningGuide from "@/components/PlanningGuide";
import PricingGuidanceSection from "@/components/PricingGuidanceSection";
import TravelMomentsSection from "@/components/TravelMomentsSection";
import TravelStylesSection from "@/components/TravelStylesSection";
import TrustEvidenceSection from "@/components/TrustEvidenceSection";
import { readHomepageContent } from "@/homepage-content";
import { siteConfig } from "@/lib/site";

const CTA = dynamicImport(() => import("@/components/CTA"));
const FeaturedPackages = dynamicImport(() => import("@/components/FeaturedPackages"));
const StatsSection = dynamicImport(() => import("@/components/StatsSection"));
const Testimonials = dynamicImport(() => import("@/components/Testimonials"));

export const metadata: Metadata = {
  title: `${siteConfig.name} | Private Tanzania Safaris, Kilimanjaro, and Zanzibar`,
  description:
    "Plan private Tanzania safaris, Kilimanjaro climbs, Zanzibar holidays, and combined routes with clear local support around your dates, budget, and travel style.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${siteConfig.name} | Private Tanzania Safaris, Kilimanjaro, and Zanzibar`,
    description:
      "Plan private Tanzania safaris, Kilimanjaro climbs, Zanzibar holidays, and combined routes with clear local support around your dates, budget, and travel style.",
    url: "/",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `Safari in Tanzania with ${siteConfig.name}`,
      },
    ],
  },
};

export const dynamic = "force-dynamic";

export default async function Home() {
  const homepageContent = await readHomepageContent();

  return (
    <main className="relative overflow-hidden">
      <Hero content={homepageContent.hero} />
      <HomeAboutSection />
      <StatsSection content={homepageContent.trust} />
      <TravelStylesSection content={homepageContent.travelStyles} />
      <TravelMomentsSection />
      <FeaturedPackages content={homepageContent.featuredPackages} />
      <PricingGuidanceSection />
      <Destinations />
      <PlanningGuide content={homepageContent.planningGuide} />
      <BookWithConfidenceSection content={homepageContent.bookWithConfidence} />
      <TrustEvidenceSection />
      <Testimonials content={homepageContent.testimonials} />
      <CTA content={homepageContent.finalCta} />
    </main>
  );
}
