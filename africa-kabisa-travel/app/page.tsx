import BookWithConfidenceSection from "@/components/BookWithConfidenceSection";
import dynamicImport from "next/dynamic";
import type { Metadata } from "next";
import Destinations from "@/components/Destinations";
import Hero from "@/components/Hero";
import HomeAboutSection from "@/components/HomeAboutSection";
import PlanningGuide from "@/components/PlanningGuide";
import ProofSection from "@/components/ProofSection";
import PublicProfilesShowcase from "@/components/PublicProfilesShowcase";
import TravelStylesSection from "@/components/TravelStylesSection";
import WhyChoose from "@/components/WhyChooseUs";
import { readHomepageContent } from "@/homepage-content";
import { siteConfig } from "@/lib/site";

const CTA = dynamicImport(() => import("@/components/CTA"));
const FeaturedPackages = dynamicImport(() => import("@/components/FeaturedPackages"));
const StatsSection = dynamicImport(() => import("@/components/StatsSection"));
const Testimonials = dynamicImport(() => import("@/components/Testimonials"));

export const metadata: Metadata = {
  title: `${siteConfig.name} | Tanzania Safaris, Kilimanjaro Trips, and Zanzibar Holidays`,
  description:
    "Plan Tanzania safaris, Kilimanjaro climbs, and Zanzibar holidays with local support, clear advice, and custom routes that fit your travel style.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${siteConfig.name} | Tanzania Safaris, Kilimanjaro Trips, and Zanzibar Holidays`,
    description:
      "Plan Tanzania safaris, Kilimanjaro climbs, and Zanzibar holidays with local support and custom routes that fit your travel style.",
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
      <HomeAboutSection />
      <Hero content={homepageContent.hero} />
      <StatsSection content={homepageContent.trust} />
      <ProofSection />
      <WhyChoose content={homepageContent.whyChoose} />
      <TravelStylesSection content={homepageContent.travelStyles} />
      <FeaturedPackages content={homepageContent.featuredPackages} />
      <Destinations />
      <PlanningGuide content={homepageContent.planningGuide} />
      <BookWithConfidenceSection content={homepageContent.bookWithConfidence} />
      <Testimonials content={homepageContent.testimonials} />
      <PublicProfilesShowcase />
      <CTA content={homepageContent.finalCta} />
    </main>
  );
}
