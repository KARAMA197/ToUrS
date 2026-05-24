import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AdminChrome from "@/components/AdminChrome";
import { contentStudioSections, isContentStudioEnabled } from "@/content-studio";

export const metadata: Metadata = {
  title: "Admin Management",
  description: "Manage trip requests, homepage content, journeys, guides, and brand content.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isContentStudioEnabled()) {
    notFound();
  }

  return (
    <AdminChrome
      sections={[
        { key: "requests", label: "Requests", href: "/admin/requests" },
        ...contentStudioSections.map((section) => ({
          key: section.key,
          label: section.label,
          href: section.href,
        })),
      ]}
    >
      {children}
    </AdminChrome>
  );
}

