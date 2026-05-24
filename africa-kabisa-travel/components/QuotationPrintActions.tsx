"use client";

import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";

type QuotationPrintActionsProps = {
  backHref: string;
};

export default function QuotationPrintActions({
  backHref,
}: QuotationPrintActionsProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
      <Link
        href={backHref}
        className="inline-flex items-center gap-3 rounded-full border border-[rgba(16,37,28,0.14)] bg-white px-5 py-3 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
      >
        <ArrowLeft size={16} />
        Back to requests
      </Link>

      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex items-center gap-3 rounded-full bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--forest-soft)]"
      >
        <Printer size={16} />
        Print / Save as PDF
      </button>
    </div>
  );
}
