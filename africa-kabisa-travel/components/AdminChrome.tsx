"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminNav from "@/components/AdminNav";
import AdminLogoutButton from "@/components/AdminLogoutButton";

type AdminChromeSection = {
  key: string;
  label: string;
  href: string;
};

type AdminChromeProps = {
  children: React.ReactNode;
  sections: AdminChromeSection[];
};

export default function AdminChrome({ children, sections }: AdminChromeProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return (
      <main className="px-6 py-14">
        <div className="mx-auto max-w-3xl">{children}</div>
      </main>
    );
  }

  return (
    <main className="px-6 py-14">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[34px] border border-[var(--border)] bg-[linear-gradient(135deg,rgba(255,250,243,0.96),rgba(246,239,228,0.92))] p-8 shadow-[0_30px_90px_-50px_rgba(8,18,15,0.38)]">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
                Admin management
              </p>
              <h1 className="font-display mt-3 text-4xl text-[var(--forest)] sm:text-5xl">
                Manage your website content from one place.
              </h1>
              <p className="mt-5 text-base leading-8 text-[color:rgba(19,32,24,0.72)]">
                This admin area gives you one clear workflow for editing the homepage,
                journeys, guides, and brand pages without jumping around the project.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--forest-soft)]"
              >
                Open website
              </Link>
              <AdminLogoutButton />
            </div>
          </div>

          <AdminNav sections={sections} />
        </div>

        <div className="mt-10">{children}</div>
      </div>
    </main>
  );
}
