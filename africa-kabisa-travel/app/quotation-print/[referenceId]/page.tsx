import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import QuotationPrintActions from "@/components/QuotationPrintActions";
import { requireAdminAuth } from "@/lib/admin-auth";
import { businessConfig } from "@/lib/business";
import { findReceivedRequest } from "@/lib/request-inbox";
import { siteConfig } from "@/lib/site";

type QuotationPrintPageProps = {
  params: Promise<{ referenceId: string }>;
};

export const metadata: Metadata = {
  title: "Printable quotation",
  description: "Print or save a traveler quotation as PDF.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

function buildQuotationNumber(referenceId: string) {
  if (!referenceId) {
    return "BES-QTN-DRAFT";
  }

  return referenceId.startsWith("BES-")
    ? referenceId.replace("BES-", "BES-QTN-")
    : `BES-QTN-${referenceId}`;
}

function formatDateLabel(dateValue: string) {
  if (!dateValue) {
    return "Not set";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Africa/Dar_es_Salaam",
    dateStyle: "long",
  }).format(date);
}

function formatDateTimeLabel(dateValue: string) {
  if (!dateValue) {
    return "Not set";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Africa/Dar_es_Salaam",
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function LabelValue({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-[11px] font-medium text-[color:rgba(19,32,24,0.58)]">
        {label}
      </p>
      <p className="text-sm leading-7 text-[color:rgba(19,32,24,0.76)]">{value}</p>
    </div>
  );
}

export default async function QuotationPrintPage({
  params,
}: QuotationPrintPageProps) {
  const { referenceId } = await params;
  await requireAdminAuth(`/quotation-print/${referenceId}`);

  const requestRecord = await findReceivedRequest(referenceId);

  if (!requestRecord) {
    notFound();
  }

  const { quotation } = requestRecord;
  const includedItems = splitLines(quotation.includedItems);
  const excludedItems = splitLines(quotation.excludedItems);
  const importantNotes = splitLines(quotation.importantNotes);
  const quotationBodyLines = splitLines(quotation.body);
  const quotationNumber = buildQuotationNumber(requestRecord.referenceId);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,rgba(250,246,238,0.95),rgba(244,237,224,0.86))] px-6 py-8 print:bg-white print:px-0 print:py-0">
      <div className="mx-auto max-w-5xl">
        <QuotationPrintActions backHref="/admin/requests" />

        <article className="overflow-hidden rounded-[32px] border border-[var(--border)] bg-white shadow-[0_36px_90px_-56px_rgba(8,18,15,0.45)] print:rounded-none print:border-0 print:shadow-none">
          <header className="relative overflow-hidden border-b border-[var(--border)] bg-[linear-gradient(135deg,rgba(16,37,28,0.98),rgba(28,52,40,0.94),rgba(196,150,85,0.26))] px-8 py-10 text-white print:px-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_28%),radial-gradient(circle_at_left_center,rgba(217,178,106,0.18),transparent_36%)]" />
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="relative z-10 max-w-3xl">
                <div className="inline-flex rounded-[24px] bg-white px-4 py-3 shadow-[0_18px_38px_-26px_rgba(8,18,15,0.48)]">
                  <Image
                    src="/branding/brilliant-explore-safaris-logo-transparent.png"
                    alt="Brilliant Explore Safaris"
                    width={820}
                    height={889}
                    priority
                    className="h-[78px] w-auto sm:h-[92px]"
                  />
                </div>
                <h1 className="font-display mt-3 text-4xl leading-tight">
                  Quotation for {requestRecord.selectedRequest}
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/76">
                  Private Tanzania travel planning, safari, Kilimanjaro, and Zanzibar trip design prepared for {requestRecord.name} by {siteConfig.name}.
                </p>
              </div>

              <div className="relative z-10 min-w-[17rem] rounded-[24px] border border-white/12 bg-white/8 p-5 backdrop-blur">
                <div className="space-y-2 text-sm leading-7 text-white/82">
                  <p>
                    <span className="font-semibold text-white">Quotation number:</span>{" "}
                    {quotationNumber}
                  </p>
                  <p>
                    <span className="font-semibold text-white">Reference:</span>{" "}
                    {requestRecord.referenceId}
                  </p>
                  <p>
                    <span className="font-semibold text-white">Prepared:</span>{" "}
                    {formatDateTimeLabel(
                      quotation.lastPreparedAt || requestRecord.lastUpdatedAt
                    )}
                  </p>
                  <p>
                    <span className="font-semibold text-white">Phone:</span>{" "}
                    {businessConfig.phoneDisplay}
                  </p>
                  {businessConfig.publicEmail ? (
                    <p>
                      <span className="font-semibold text-white">Email:</span>{" "}
                      {businessConfig.publicEmail}
                    </p>
                  ) : null}
                  <p>
                    <span className="font-semibold text-white">Website:</span>{" "}
                    {siteConfig.url}
                  </p>
                  <p>
                    <span className="font-semibold text-white">Base:</span>{" "}
                    {businessConfig.baseLabel}
                  </p>
                </div>
              </div>
            </div>
          </header>

          <div className="space-y-8 px-8 py-8 print:px-10">
            <section className="grid gap-6 md:grid-cols-[0.98fr_1.02fr]">
              <div className="rounded-[26px] border border-[var(--border)] bg-[var(--sand)]/55 p-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  <LabelValue label="Name" value={requestRecord.name} />
                  <LabelValue label="Email" value={requestRecord.email} />
                  <LabelValue
                    label="Phone / WhatsApp"
                    value={requestRecord.phone || "Not provided"}
                  />
                  <LabelValue
                    label="Travelers"
                    value={requestRecord.travelers}
                  />
                  <LabelValue
                    label="Expected trip length"
                    value={requestRecord.tripLength}
                  />
                  <LabelValue
                    label="Trip style"
                    value={requestRecord.tripStyleLabel || "Not specified"}
                  />
                  <LabelValue
                    label="Travel date"
                    value={requestRecord.travelDate}
                  />
                </div>
              </div>

              <div className="rounded-[26px] border border-[var(--border)] bg-white p-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  <LabelValue label="Quoted amount / range" value={quotation.quotedAmount} />
                  <LabelValue label="Quotation number" value={quotationNumber} />
                  <LabelValue
                    label="Valid until"
                    value={quotation.validUntil ? formatDateLabel(quotation.validUntil) : "Not set"}
                  />
                  <LabelValue label="Prepared by" value={quotation.preparedBy} />
                  <LabelValue label="Status" value={quotation.status} />
                  <LabelValue
                    label="Price summary"
                    value={quotation.priceSummary}
                  />
                  <LabelValue
                    label="Trip plan summary"
                    value={requestRecord.tripPlanSummary}
                  />
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-[var(--border)] bg-[linear-gradient(160deg,rgba(196,150,85,0.16),rgba(255,250,243,0.92))] p-6">
              <h2 className="text-3xl font-semibold text-[var(--forest)]">
                {quotation.quotedAmount}
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-8 text-[color:rgba(19,32,24,0.76)]">
                {quotation.priceSummary}
              </p>
            </section>

            <section className="rounded-[26px] border border-[var(--border)] bg-white p-6">
              <div className="space-y-3 text-sm leading-8 text-[color:rgba(19,32,24,0.76)]">
                {quotationBodyLines.map((line, index) => (
                  <p key={`${index}-${line}`}>{line}</p>
                ))}
              </div>
            </section>

            <section className="rounded-[26px] border border-[var(--border)] bg-white p-6">
              <div className="space-y-4">
                {requestRecord.tripPlan.length > 0 ? (
                  requestRecord.tripPlan.map((route, index) => (
                    <div
                      key={`${route.journeySlug}-${index}`}
                      className="rounded-[22px] border border-[rgba(16,37,28,0.08)] bg-[var(--sand)]/52 p-5 break-inside-avoid"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
                        Route {index + 1}
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold text-[var(--forest)]">
                        {route.journey}
                      </h3>
                      {route.stays.length > 0 ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {route.stays.map((stay) => (
                            <span
                              key={`${route.journeySlug}-${stay.slug || stay.title}`}
                              className="rounded-full border border-[rgba(16,37,28,0.12)] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--forest)]"
                            >
                              {stay.title}
                              {stay.category ? ` | ${stay.category}` : ""}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-3 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                          Stays will be matched to this route and comfort level.
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="rounded-[22px] border border-[rgba(16,37,28,0.08)] bg-[var(--sand)]/52 p-5 break-inside-avoid">
                    <p className="text-sm leading-7 text-[color:rgba(19,32,24,0.76)]">
                      {requestRecord.selectedRequest}
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-[26px] border border-[var(--border)] bg-white p-6 break-inside-avoid">
                <p className="mb-4 text-sm font-semibold text-[var(--forest)]">
                  Included in this quotation
                </p>
                <ul className="space-y-3 text-sm leading-8 text-[color:rgba(19,32,24,0.76)]">
                  {includedItems.map((item) => (
                    <li key={item} className="rounded-[16px] bg-[var(--sand)]/45 px-4 py-3">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[26px] border border-[var(--border)] bg-white p-6 break-inside-avoid">
                <p className="mb-4 text-sm font-semibold text-[var(--forest)]">
                  Not included
                </p>
                <ul className="space-y-3 text-sm leading-8 text-[color:rgba(19,32,24,0.76)]">
                  {excludedItems.map((item) => (
                    <li key={item} className="rounded-[16px] bg-[var(--sand)]/45 px-4 py-3">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="rounded-[26px] border border-[var(--border)] bg-white p-6 break-inside-avoid">
              <p className="mb-4 text-sm font-semibold text-[var(--forest)]">
                Important notes
              </p>
              <ul className="space-y-3 text-sm leading-8 text-[color:rgba(19,32,24,0.76)]">
                {importantNotes.map((item) => (
                  <li key={item} className="rounded-[16px] bg-[var(--sand)]/45 px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-[26px] border border-[var(--border)] bg-[linear-gradient(160deg,rgba(255,250,243,0.98),rgba(246,239,228,0.88))] p-6 break-inside-avoid">
              <div className="grid gap-6 md:grid-cols-[1fr_0.9fr] md:items-end">
                <div>
                  <div className="h-px w-full max-w-sm bg-[rgba(16,37,28,0.24)]" />
                  <p className="mt-3 text-lg font-semibold text-[var(--forest)]">
                    {quotation.preparedBy}
                  </p>
                  <p className="text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                    For {siteConfig.name}
                  </p>
                </div>
                <div className="rounded-[20px] border border-[rgba(16,37,28,0.08)] bg-white/78 p-4 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                  <p>
                    <span className="font-semibold text-[var(--forest)]">Quotation number:</span>{" "}
                    {quotationNumber}
                  </p>
                  <p>
                    <span className="font-semibold text-[var(--forest)]">Prepared:</span>{" "}
                    {formatDateTimeLabel(
                      quotation.lastPreparedAt || requestRecord.lastUpdatedAt
                    )}
                  </p>
                  <p>
                    <span className="font-semibold text-[var(--forest)]">Valid until:</span>{" "}
                    {quotation.validUntil ? formatDateLabel(quotation.validUntil) : "Not set"}
                  </p>
                </div>
              </div>
            </section>

            <footer className="border-t border-[var(--border)] pt-6 text-sm leading-7 text-[color:rgba(19,32,24,0.68)]">
              <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-[color:rgba(19,32,24,0.72)]">
                <span className="font-semibold text-[var(--forest)]">{siteConfig.name}</span>
                <span>{businessConfig.phoneDisplay}</span>
                {businessConfig.publicEmail ? <span>{businessConfig.publicEmail}</span> : null}
                <span>{siteConfig.url}</span>
              </div>
              <p>
                This document is a planning quotation prepared by {siteConfig.name}. Final trip confirmation depends on the final route, stay level, and travel details you approve.
              </p>
            </footer>
          </div>
        </article>
      </div>
    </main>
  );
}
