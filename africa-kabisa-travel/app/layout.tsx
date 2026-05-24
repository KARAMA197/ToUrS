import { Suspense } from "react";
import type { Metadata } from "next";
import "./globals.css";
import Analytics from "@/components/Analytics";
import BusinessJsonLd from "@/components/BusinessJsonLd";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { getSiteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  applicationName: siteConfig.name,
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
  keywords: [
    "Tanzania safari",
    "Kilimanjaro trek",
    "Zanzibar holiday",
    "luxury Africa travel",
    "custom Tanzania itinerary",
    "Tanzania travel agency",
    "Tanzania tour operator",
    "local Tanzania trip planner",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "travel",
  openGraph: {
    title: siteConfig.name,
    description: "Big Tanzania adventures made easy, exciting, and well planned.",
    url: "/",
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} safari experience`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: "Big Tanzania adventures made easy, exciting, and well planned.",
    images: [siteConfig.ogImage],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <BusinessJsonLd />
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        <div className="relative min-h-screen overflow-x-hidden">
          <div className="print:hidden">
            <Navbar />
          </div>
          <div className="pt-24 md:pt-28 print:pt-0">{children}</div>
          <div className="print:hidden">
            <Footer />
          </div>
          <div className="print:hidden">
            <WhatsAppFloat />
          </div>
        </div>
      </body>
    </html>
  );
}
