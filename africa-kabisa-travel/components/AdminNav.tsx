"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type AdminNavSection = {
  key: string;
  label: string;
  href: string;
};

type AdminNavProps = {
  sections: AdminNavSection[];
};

export default function AdminNav({ sections }: AdminNavProps) {
  const pathname = usePathname();

  const links = [
    { key: "dashboard", label: "Dashboard", href: "/admin" },
    ...sections,
  ];

  return (
    <div className="mt-8 flex flex-wrap gap-3">
      {links.map((link) => {
        const isCurrent =
          pathname === link.href ||
          (link.href !== "/admin" && pathname.startsWith(`${link.href}`));

        return (
          <Link
            key={link.key}
            href={link.href}
            className={
              isCurrent
                ? "inline-flex items-center rounded-full bg-[var(--forest)] px-4 py-2 text-sm font-semibold text-white"
                : "inline-flex items-center rounded-full border border-[rgba(16,37,28,0.14)] bg-white px-4 py-2 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
            }
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
