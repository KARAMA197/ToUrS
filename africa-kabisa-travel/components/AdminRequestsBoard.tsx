"use client";

import Link from "next/link";
import { useState } from "react";
import AdminQuotationComposer from "@/components/AdminQuotationComposer";
import AdminRequestControls from "@/components/AdminRequestControls";
import { getRequestAttentionMeta } from "@/lib/request-attention";
import {
  isTerminalLeadStatus,
  requestLeadStatusOptions,
  requestLeadStatusPriority,
  type ReceivedRequestLeadStatus,
} from "@/lib/request-pipeline";
import type { ReceivedRequestQuotation } from "@/lib/request-quotation";
import { getRequestReminderMeta } from "@/lib/request-reminders";

type RequestBoardItem = {
  referenceId: string;
  submittedAt: string;
  submittedAtLabel: string;
  lastUpdatedAt: string;
  leadType: string;
  selectedRequest: string;
  tripPlanSummary: string;
  name: string;
  email: string;
  phone: string;
  travelers: string;
  tripLength: string;
  tripStyleLabel: string;
  budget: string;
  travelDate: string;
  message: string;
  stayCategory: string;
  destinationTitle: string;
  destinationSlug: string;
  destinationRegion: string;
  travelMomentTitle: string;
  travelMomentSlug: string;
  travelMomentLocation: string;
  contactPreference: string;
  followUpChannel: string;
  leadSourceLabel: string;
  customerWhatsappFollowUpLink: string;
  deliveryStatus: import("@/lib/request-inbox").ReceivedRequestDeliveryStatus;
  leadStatus: ReceivedRequestLeadStatus;
  adminNote: string;
  quotation: ReceivedRequestQuotation;
  deliveryError?: string;
  tripPlan: Array<{
    journey: string;
    journeySlug: string;
    stays: Array<{
      title: string;
      slug: string;
      category: string;
    }>;
  }>;
};

type AdminRequestsBoardProps = {
  requests: RequestBoardItem[];
};

function getDateKey(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Dar_es_Salaam",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function formatUpdatedTime(dateValue: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Africa/Dar_es_Salaam",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateValue));
}

function escapeCsvValue(value: string | number | boolean) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function buildTripPlanCsvSummary(
  tripPlan: RequestBoardItem["tripPlan"]
) {
  if (tripPlan.length === 0) {
    return "";
  }

  return tripPlan
    .map((route, index) => {
      const staySummary =
        route.stays.length > 0
          ? route.stays
              .map((stay) =>
                `${stay.title}${stay.category ? ` (${stay.category})` : ""}`
              )
              .join("; ")
          : "No stays added";

      return `Route ${index + 1}: ${route.journey}${route.journeySlug ? ` [${route.journeySlug}]` : ""} -> ${staySummary}`;
    })
    .join(" | ");
}

function buildRequestFollowUpBrief(request: RequestBoardItem) {
  const contextLines = [
    request.destinationTitle
      ? `Destination: ${request.destinationTitle}${request.destinationRegion ? ` (${request.destinationRegion})` : ""}`
      : "",
    request.travelMomentTitle
      ? `Travel moment: ${request.travelMomentTitle}${request.travelMomentLocation ? ` (${request.travelMomentLocation})` : ""}`
      : "",
    request.tripPlan.length > 0
      ? `Trip plan: ${buildTripPlanCsvSummary(request.tripPlan)}`
      : "",
  ].filter(Boolean);

  return [
    `Reference: ${request.referenceId}`,
    `Traveler: ${request.name}`,
    `Selected request: ${request.selectedRequest}`,
    `Follow-up channel: ${request.followUpChannel}`,
    `Travelers: ${request.travelers}`,
    `Trip length: ${request.tripLength}`,
    `Travel date: ${request.travelDate}`,
    `Budget: ${request.budget}`,
    `Trip style: ${request.tripStyleLabel || "Not specified"}`,
    ...contextLines,
    "",
    "Suggested opening:",
    `Hi ${request.name}, thank you for reaching out to Brilliant Explore Safaris. We received your request for ${request.selectedRequest}. We are checking the best route, timing, and stay options, then we will send you a clear first plan.`,
  ].join("\n");
}

function buildReplyMailtoHref(request: RequestBoardItem) {
  const subject = `Re: ${request.selectedRequest} (${request.referenceId})`;
  const body = [
    `Hi ${request.name},`,
    "",
    `Thank you for reaching out to Brilliant Explore Safaris. We received your request for ${request.selectedRequest}.`,
    "",
    "We are checking the best route, timing, and stay options, then we will send you a clear first plan.",
    "",
    `Reference: ${request.referenceId}`,
  ].join("\n");

  return `mailto:${request.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function AdminRequestsBoard({ requests }: AdminRequestsBoardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedReferenceId, setCopiedReferenceId] = useState("");
  const [leadStatusFilter, setLeadStatusFilter] = useState<
    "All" | ReceivedRequestLeadStatus
  >("All");
  const [followUpFilter, setFollowUpFilter] = useState<
    | "All"
    | "Reminder due"
    | "Overdue"
    | "Needs attention"
    | "WhatsApp"
    | "Email"
    | "Either is fine"
  >("All");
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "pipeline" | "needs_attention" | "reminders"
  >("newest");
  const [pageSize, setPageSize] = useState<10 | 20 | 50>(10);
  const [currentPage, setCurrentPage] = useState(1);

  const requestsWithAttention = requests.map((request) => ({
    ...request,
    attention: getRequestAttentionMeta(request),
    reminder: getRequestReminderMeta(request),
  }));
  const todayKey = getDateKey(new Date());
  const todayCount = requestsWithAttention.filter(
    (request) => getDateKey(new Date(request.submittedAt)) === todayKey
  ).length;
  const newCount = requestsWithAttention.filter(
    (request) => request.leadStatus === "New"
  ).length;
  const quotationInProgressCount = requestsWithAttention.filter(
    (request) => request.leadStatus === "Quotation in progress"
  ).length;
  const waitingCount = requestsWithAttention.filter(
    (request) =>
      request.leadStatus === "Quotation sent" ||
      request.leadStatus === "Awaiting client response"
  ).length;
  const activePipelineCount = requestsWithAttention.filter(
    (request) => !isTerminalLeadStatus(request.leadStatus)
  ).length;
  const reminderDueCount = requestsWithAttention.filter(
    (request) => request.reminder.hasReminder
  ).length;
  const overdueReminderCount = requestsWithAttention.filter(
    (request) => request.reminder.highestSeverity === "overdue"
  ).length;
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const hasActiveFilters =
    normalizedQuery.length > 0 ||
    leadStatusFilter !== "All" ||
    followUpFilter !== "All" ||
    sortBy !== "newest";

  const filteredRequests = requestsWithAttention.filter((request) => {
    const matchesQuery = !normalizedQuery
      ? true
      : [
          request.selectedRequest,
          request.name,
          request.email,
          request.phone,
          request.referenceId,
          request.message,
          request.tripStyleLabel,
          request.destinationTitle,
          request.destinationSlug,
          request.destinationRegion,
          request.travelMomentTitle,
          request.travelMomentSlug,
          request.travelMomentLocation,
          request.leadSourceLabel,
          request.adminNote,
          request.quotation.subject,
          request.quotation.quotedAmount,
          request.quotation.validUntil,
          request.quotation.priceSummary,
          request.quotation.body,
          request.quotation.status,
          ...request.attention.reasons,
          ...request.reminder.reasons,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
    const matchesLeadStatus =
      leadStatusFilter === "All" || request.leadStatus === leadStatusFilter;
    const matchesFollowUp =
      followUpFilter === "All"
        ? true
        : followUpFilter === "Reminder due"
          ? request.reminder.hasReminder
          : followUpFilter === "Overdue"
            ? request.reminder.highestSeverity === "overdue"
            : followUpFilter === "Needs attention"
          ? request.attention.needsAttention
          : request.contactPreference === followUpFilter;

    return matchesQuery && matchesLeadStatus && matchesFollowUp;
  });

  const sortedRequests = [...filteredRequests].sort((left, right) => {
    const leftSubmittedAt = new Date(left.submittedAt).getTime();
    const rightSubmittedAt = new Date(right.submittedAt).getTime();

    if (sortBy === "oldest") {
      return leftSubmittedAt - rightSubmittedAt;
    }

    if (sortBy === "pipeline") {
      const priorityDifference =
        requestLeadStatusPriority[left.leadStatus] -
        requestLeadStatusPriority[right.leadStatus];

      return priorityDifference !== 0
        ? priorityDifference
        : rightSubmittedAt - leftSubmittedAt;
    }

    if (sortBy === "needs_attention") {
      const priorityDifference =
        Number(right.attention.needsAttention) - Number(left.attention.needsAttention);

      if (priorityDifference !== 0) {
        return priorityDifference;
      }

      const reasonDifference =
        right.attention.reasons.length - left.attention.reasons.length;

      return reasonDifference !== 0
        ? reasonDifference
        : rightSubmittedAt - leftSubmittedAt;
    }

    if (sortBy === "reminders") {
      const severityPriority = {
        overdue: 0,
        due: 1,
        soon: 2,
        none: 3,
      } as const;

      const leftPriority =
        severityPriority[left.reminder.highestSeverity ?? "none"];
      const rightPriority =
        severityPriority[right.reminder.highestSeverity ?? "none"];

      if (leftPriority !== rightPriority) {
        return leftPriority - rightPriority;
      }

      const reasonDifference =
        right.reminder.reasons.length - left.reminder.reasons.length;

      return reasonDifference !== 0
        ? reasonDifference
        : rightSubmittedAt - leftSubmittedAt;
    }

    return rightSubmittedAt - leftSubmittedAt;
  });

  const sortLabel =
    sortBy === "oldest"
      ? "Oldest first"
      : sortBy === "pipeline"
        ? "Pipeline order"
        : sortBy === "needs_attention"
          ? "Needs attention first"
          : sortBy === "reminders"
            ? "Reminders first"
          : "Newest first";
  const totalPages = Math.max(1, Math.ceil(sortedRequests.length / pageSize));
  const resolvedCurrentPage = Math.min(currentPage, totalPages);
  const pageStartIndex =
    sortedRequests.length === 0 ? 0 : (resolvedCurrentPage - 1) * pageSize;
  const paginatedRequests = sortedRequests.slice(
    pageStartIndex,
    pageStartIndex + pageSize
  );
  const pageStartNumber =
    sortedRequests.length === 0 ? 0 : pageStartIndex + 1;
  const pageEndNumber = Math.min(pageStartIndex + pageSize, sortedRequests.length);
  const visiblePageNumbers = Array.from(
    {
      length:
        Math.min(totalPages, resolvedCurrentPage + 2) -
        Math.max(1, resolvedCurrentPage - 2) +
        1,
    },
    (_, index) => Math.max(1, resolvedCurrentPage - 2) + index
  );

  const handleExportCsv = () => {
    if (sortedRequests.length === 0) {
      return;
    }

    const headers = [
      "Reference ID",
      "Submitted At",
      "Last Updated At",
      "Lead Type",
      "Selected Request",
      "Trip Plan Summary",
      "Trip Plan Detail",
      "Name",
      "Email",
      "Phone / WhatsApp",
      "Travelers",
      "Expected Trip Length",
      "Trip Style",
      "Budget",
      "Travel Date",
      "Stay Category",
      "Destination",
      "Destination Slug",
      "Destination Region",
      "Travel Moment",
      "Travel Moment Slug",
      "Travel Moment Location",
      "Contact Preference",
      "Follow-up Channel",
      "Lead Source",
      "Lead Status",
      "Delivery Status",
      "Quotation Status",
      "Quoted Amount",
      "Valid Until",
      "Quotation Price Summary",
      "Quotation Sent At",
      "Reminder Status",
      "Reminder Reasons",
      "Needs Attention",
      "Attention Reasons",
      "Traveler Message",
      "Internal Note",
      "Delivery Error",
      "WhatsApp Follow-up Link",
    ];

    const rows = sortedRequests.map((request) => [
      request.referenceId,
      request.submittedAt,
      request.lastUpdatedAt,
      request.leadType,
      request.selectedRequest,
      request.tripPlanSummary,
      buildTripPlanCsvSummary(request.tripPlan),
      request.name,
      request.email,
      request.phone || "Not provided",
      request.travelers,
      request.tripLength,
      request.tripStyleLabel || "Not specified",
      request.budget,
      request.travelDate,
      request.stayCategory || "Not provided",
      request.destinationTitle || "Not provided",
      request.destinationSlug || "Not provided",
      request.destinationRegion || "Not provided",
      request.travelMomentTitle || "Not provided",
      request.travelMomentSlug || "Not provided",
      request.travelMomentLocation || "Not provided",
      request.contactPreference,
      request.followUpChannel,
      request.leadSourceLabel,
      request.leadStatus,
      request.deliveryStatus === "Delivered"
        ? "Previously marked delivered"
        : request.deliveryStatus,
      request.quotation.status,
      request.quotation.quotedAmount,
      request.quotation.validUntil,
      request.quotation.priceSummary,
      request.quotation.sentAt,
      request.reminder.highestSeverity ?? "None",
      request.reminder.reasons.join(" | "),
      request.attention.needsAttention ? "Yes" : "No",
      request.attention.reasons.join(" | "),
      request.message,
      request.adminNote,
      request.deliveryError ?? "",
      request.customerWhatsappFollowUpLink,
    ]);

    const csvContent = [
      headers.map((header) => escapeCsvValue(header)).join(","),
      ...rows.map((row) =>
        row.map((value) => escapeCsvValue(value)).join(",")
      ),
    ].join("\n");

    const csvBlob = new Blob([`\uFEFF${csvContent}`], {
      type: "text/csv;charset=utf-8;",
    });
    const downloadUrl = URL.createObjectURL(csvBlob);
    const downloadLink = document.createElement("a");
    const dateStamp = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Africa/Dar_es_Salaam",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .format(new Date())
      .replaceAll("-", "");

    downloadLink.href = downloadUrl;
    downloadLink.download = `brilliant-explore-safaris-requests-${dateStamp}.csv`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(downloadUrl);
  };

  return (
    <div className="space-y-10">
      <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="rounded-[32px] border border-[var(--border)] bg-[rgba(255,255,255,0.9)] p-8 shadow-[0_24px_80px_-50px_rgba(8,18,15,0.42)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
            Requests inbox
          </p>
          <h2 className="font-display mt-3 text-4xl text-[var(--forest)]">
            Review, manage, and follow up on trip requests.
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-8 text-[color:rgba(19,32,24,0.72)]">
            Every successful trip submission now lands here as well as in email. The inbox now tracks a clearer pipeline too, so you can see which leads are still new, which quotations are moving, and which travelers are waiting for a reply.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
          <div className="rounded-[28px] border border-[var(--border)] bg-[rgba(16,37,28,0.96)] p-6 text-white shadow-[0_24px_80px_-50px_rgba(8,18,15,0.58)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold-soft)]">
              Total requests
            </p>
            <p className="mt-3 text-3xl font-semibold">{requests.length}</p>
            <p className="mt-2 text-sm leading-7 text-white/74">
              Stored in your admin inbox.
            </p>
          </div>
          <div className="rounded-[28px] border border-[var(--border)] bg-[rgba(255,255,255,0.9)] p-6 shadow-[0_24px_80px_-50px_rgba(8,18,15,0.42)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
              Today
            </p>
            <p className="mt-3 text-3xl font-semibold text-[var(--forest)]">{todayCount}</p>
            <p className="mt-2 text-sm leading-7 text-[color:rgba(19,32,24,0.68)]">
              New requests received today.
            </p>
          </div>
          <div className="rounded-[28px] border border-[var(--border)] bg-[rgba(255,255,255,0.9)] p-6 shadow-[0_24px_80px_-50px_rgba(8,18,15,0.42)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
              Reminders due
            </p>
            <p className="mt-3 text-3xl font-semibold text-[var(--forest)]">
              {reminderDueCount}
            </p>
            <p className="mt-2 text-sm leading-7 text-[color:rgba(19,32,24,0.68)]">
              Overdue: {overdueReminderCount}. Active pipeline: {activePipelineCount}. New: {newCount}. Quote work: {quotationInProgressCount}. Waiting: {waitingCount}.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-[var(--border)] bg-[rgba(255,255,255,0.92)] p-6 shadow-[0_24px_80px_-50px_rgba(8,18,15,0.42)]">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.34fr_0.34fr_0.34fr_auto]">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-[var(--forest)]">Search requests</span>
            <input
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by traveler, email, request, phone, message, or note"
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--gold)]"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-[var(--forest)]">Pipeline stage</span>
            <select
              value={leadStatusFilter}
              onChange={(event) =>
                {
                  setLeadStatusFilter(
                    event.target.value as typeof leadStatusFilter
                  );
                  setCurrentPage(1);
                }
              }
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--gold)]"
            >
              <option value="All">All statuses</option>
              {requestLeadStatusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-[var(--forest)]">Follow-up type</span>
            <select
              value={followUpFilter}
              onChange={(event) =>
                {
                  setFollowUpFilter(
                    event.target.value as typeof followUpFilter
                  );
                  setCurrentPage(1);
                }
              }
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--gold)]"
            >
              <option value="All">All follow-up</option>
              <option value="Reminder due">Reminder due</option>
              <option value="Overdue">Overdue</option>
              <option value="Needs attention">Needs attention</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Email">Email</option>
              <option value="Either is fine">Either is fine</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-[var(--forest)]">Sort by</span>
            <select
              value={sortBy}
              onChange={(event) =>
                {
                  setSortBy(event.target.value as typeof sortBy);
                  setCurrentPage(1);
                }
              }
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--gold)]"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="pipeline">Pipeline order</option>
              <option value="reminders">Reminders first</option>
              <option value="needs_attention">Needs attention first</option>
            </select>
          </label>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setLeadStatusFilter("All");
                setFollowUpFilter("All");
                setSortBy("newest");
                setPageSize(10);
                setCurrentPage(1);
              }}
              disabled={!hasActiveFilters}
              className="inline-flex w-full items-center justify-center rounded-full border border-[rgba(16,37,28,0.14)] bg-white px-5 py-3 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Clear filters
            </button>
          </div>
        </div>

        <p className="mt-4 text-sm leading-7 text-[color:rgba(19,32,24,0.68)]">
          {sortedRequests.length === 0
            ? "No requests match the current view."
            : hasActiveFilters
              ? `Showing ${pageStartNumber}-${pageEndNumber} of ${sortedRequests.length} matching requests, sorted by ${sortLabel}.`
              : `Showing ${pageStartNumber}-${pageEndNumber} of ${sortedRequests.length} requests, sorted by ${sortLabel}.`}
        </p>

        <div className="mt-4 flex flex-wrap items-end gap-4">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-[var(--forest)]">Rows per page</span>
            <select
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value) as 10 | 20 | 50);
                setCurrentPage(1);
              }}
              className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--gold)]"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </label>

          <button
            type="button"
            onClick={handleExportCsv}
            disabled={sortedRequests.length === 0}
            className="inline-flex items-center justify-center rounded-full bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--forest-soft)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Export CSV
          </button>
          <p className="text-sm leading-7 text-[color:rgba(19,32,24,0.68)]">
            {sortedRequests.length === 0
              ? "Export becomes available when the current view has matching requests."
              : `Export ${sortedRequests.length} request${sortedRequests.length === 1 ? "" : "s"} from the current filtered view.`}
          </p>
        </div>
      </section>

      {requests.length === 0 ? (
        <section className="rounded-[32px] border border-[var(--border)] bg-[rgba(255,255,255,0.9)] p-8 shadow-[0_24px_80px_-50px_rgba(8,18,15,0.42)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
            No requests yet
          </p>
          <h3 className="font-display mt-3 text-3xl text-[var(--forest)]">
            Your first website inquiry will appear here.
          </h3>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-[color:rgba(19,32,24,0.72)]">
            Once someone submits the trip form, you will see their contact details, message, route and stay choices, and the best follow-up channel in this inbox.
          </p>
        </section>
      ) : sortedRequests.length === 0 ? (
        <section className="rounded-[32px] border border-[var(--border)] bg-[rgba(255,255,255,0.9)] p-8 shadow-[0_24px_80px_-50px_rgba(8,18,15,0.42)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
            No matching requests
          </p>
          <h3 className="font-display mt-3 text-3xl text-[var(--forest)]">
            Try widening the search or clearing the filters.
          </h3>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-[color:rgba(19,32,24,0.72)]">
            The inbox has requests saved, but none match the filters you have applied right now.
          </p>
        </section>
      ) : (
        <section className="space-y-6">
          {paginatedRequests.map((request) => {
            const followUpBrief = buildRequestFollowUpBrief(request);

            return (
            <article
              key={`${request.referenceId}-${request.submittedAt}`}
              className="rounded-[32px] border border-[var(--border)] bg-[rgba(255,255,255,0.92)] p-7 shadow-[0_24px_80px_-50px_rgba(8,18,15,0.42)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-3xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
                    {request.leadType}
                  </p>
                  <h3 className="font-display mt-3 text-3xl text-[var(--forest)]">
                    {request.selectedRequest}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                    Submitted {request.submittedAtLabel} by {request.name}. Last updated {formatUpdatedTime(request.lastUpdatedAt)}.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {request.attention.needsAttention ? (
                    <span className="rounded-full border border-[#d48f7b] bg-[#fff1ec] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#8a3e2a]">
                      Needs attention
                    </span>
                  ) : null}
                  {request.reminder.hasReminder ? (
                    <span
                      className={
                        request.reminder.highestSeverity === "overdue"
                          ? "rounded-full border border-[#d48f7b] bg-[#fff1ec] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#8a3e2a]"
                          : request.reminder.highestSeverity === "due"
                            ? "rounded-full border border-[#efc79c] bg-[#fff6ef] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#8a4d1f]"
                            : "rounded-full border border-[#dfd3b9] bg-[#fffaf1] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#8e6b2f]"
                      }
                    >
                      {request.reminder.highestSeverity === "overdue"
                        ? "Reminder overdue"
                        : request.reminder.highestSeverity === "due"
                          ? "Reminder due"
                          : "Reminder soon"}
                    </span>
                  ) : null}
                  <span className="rounded-full border border-[rgba(16,37,28,0.12)] bg-[var(--forest)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                    {request.leadStatus}
                  </span>
                  <span className="rounded-full border border-[rgba(16,37,28,0.12)] bg-[var(--sand)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--forest)]">
                    {request.deliveryStatus === "Delivered"
                      ? "Previously marked delivered"
                      : request.deliveryStatus}
                  </span>
                  <span className="rounded-full border border-[rgba(16,37,28,0.12)] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gold)]">
                    Quote: {request.quotation.status}
                  </span>
                  {request.quotation.quotedAmount ? (
                    <span className="rounded-full border border-[rgba(16,37,28,0.12)] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[color:rgba(19,32,24,0.68)]">
                      {request.quotation.quotedAmount}
                    </span>
                  ) : null}
                  <span className="rounded-full border border-[rgba(16,37,28,0.12)] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[color:rgba(19,32,24,0.68)]">
                    {request.tripPlanSummary}
                  </span>
                  <span className="rounded-full border border-[rgba(16,37,28,0.12)] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[color:rgba(19,32,24,0.68)]">
                    {request.contactPreference}
                  </span>
                </div>
              </div>

              {request.attention.needsAttention ? (
                <div className="mt-5 rounded-[24px] border border-[#f0d1b8] bg-[#fff6ef] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b86b32]">
                    Attention reasons
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {request.attention.reasons.map((reason) => (
                      <span
                        key={`${request.referenceId}-${reason}`}
                        className="rounded-full border border-[#efc79c] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#8a4d1f]"
                      >
                        {reason}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              {request.reminder.hasReminder ? (
                <div className="mt-5 rounded-[24px] border border-[#efe2be] bg-[#fffaf2] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a77a27]">
                    Follow-up reminders
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {request.reminder.reasons.map((reason) => (
                      <span
                        key={`${request.referenceId}-reminder-${reason}`}
                        className="rounded-full border border-[#ead9ad] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#7c5b1b]"
                      >
                        {reason}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-6 grid gap-6 xl:grid-cols-[0.96fr_1.04fr]">
                <div className="space-y-5">
                  <div className="rounded-[24px] bg-[var(--sand)]/72 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
                      Contact details
                    </p>
                    <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--forest)]">
                      <p><span className="font-semibold">Name:</span> {request.name}</p>
                      <p><span className="font-semibold">Email:</span> {request.email}</p>
                      <p><span className="font-semibold">Phone / WhatsApp:</span> {request.phone || "Not provided"}</p>
                      <p><span className="font-semibold">Follow-up:</span> {request.followUpChannel}</p>
                      <p><span className="font-semibold">Lead source:</span> {request.leadSourceLabel}</p>
                      <p><span className="font-semibold">Reference:</span> {request.referenceId}</p>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-[var(--border)] bg-white p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
                      Trip basics
                    </p>
                    <div className="mt-4 grid gap-3 text-sm leading-7 text-[var(--forest)] sm:grid-cols-2">
                      <p><span className="font-semibold">Travelers:</span> {request.travelers}</p>
                      <p><span className="font-semibold">Expected trip length:</span> {request.tripLength}</p>
                      <p><span className="font-semibold">Trip style:</span> {request.tripStyleLabel || "Not specified"}</p>
                      <p><span className="font-semibold">Budget:</span> {request.budget}</p>
                      <p><span className="font-semibold">Travel date:</span> {request.travelDate}</p>
                      <p><span className="font-semibold">Stay category:</span> {request.stayCategory || "Not provided"}</p>
                      <p><span className="font-semibold">Destination:</span> {request.destinationTitle || "Not provided"}</p>
                      <p><span className="font-semibold">Travel moment:</span> {request.travelMomentTitle || "Not provided"}</p>
                    </div>
                  </div>

                  {(request.destinationTitle || request.travelMomentTitle) && (
                    <div className="rounded-[24px] border border-[var(--border)] bg-white p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
                        Selected context
                      </p>
                      <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--forest)]">
                        {request.destinationTitle ? (
                          <div>
                            <p className="font-semibold">{request.destinationTitle}</p>
                            <p className="text-[color:rgba(19,32,24,0.68)]">
                              Destination{request.destinationRegion ? ` • ${request.destinationRegion}` : ""}
                              {request.destinationSlug ? ` • ${request.destinationSlug}` : ""}
                            </p>
                          </div>
                        ) : null}
                        {request.travelMomentTitle ? (
                          <div>
                            <p className="font-semibold">{request.travelMomentTitle}</p>
                            <p className="text-[color:rgba(19,32,24,0.68)]">
                              Travel moment{request.travelMomentLocation ? ` • ${request.travelMomentLocation}` : ""}
                              {request.travelMomentSlug ? ` • ${request.travelMomentSlug}` : ""}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  )}

                  <div className="rounded-[24px] border border-[var(--border)] bg-white p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
                        Quick follow-up brief
                      </p>
                      <button
                        type="button"
                        onClick={async () => {
                          await navigator.clipboard.writeText(followUpBrief);
                          setCopiedReferenceId(request.referenceId);
                        }}
                        className="inline-flex items-center justify-center rounded-full border border-[rgba(16,37,28,0.12)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
                      >
                        {copiedReferenceId === request.referenceId ? "Copied" : "Copy brief"}
                      </button>
                    </div>
                    <pre className="mt-4 whitespace-pre-wrap rounded-[18px] bg-[var(--sand)]/60 p-4 text-xs leading-6 text-[color:rgba(19,32,24,0.74)]">
                      {followUpBrief}
                    </pre>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <a
                      href={buildReplyMailtoHref(request)}
                      className="inline-flex items-center justify-center rounded-full bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--forest-soft)]"
                    >
                      Reply by email
                    </a>
                    {request.customerWhatsappFollowUpLink ? (
                      <a
                        href={request.customerWhatsappFollowUpLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-full bg-[#128c7e] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f7b70]"
                      >
                        Open WhatsApp follow-up
                      </a>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="rounded-[24px] border border-[var(--border)] bg-white p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
                      Traveler message
                    </p>
                    <p className="mt-4 whitespace-pre-wrap text-sm leading-8 text-[color:rgba(19,32,24,0.76)]">
                      {request.message}
                    </p>
                  </div>

                  {request.tripPlan.length > 0 ? (
                    <div className="rounded-[24px] border border-[var(--border)] bg-white p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
                        Route and stay plan
                      </p>
                      <div className="mt-4 space-y-4">
                        {request.tripPlan.map((route, index) => (
                          <div
                            key={`${route.journeySlug}-${index}`}
                            className="rounded-[20px] border border-[rgba(16,37,28,0.08)] bg-[var(--sand)]/55 p-4"
                          >
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gold)]">
                              Route {index + 1}
                            </p>
                            <h4 className="mt-2 text-xl font-semibold text-[var(--forest)]">
                              {route.journey}
                            </h4>
                            <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[color:rgba(19,32,24,0.56)]">
                              {route.journeySlug || "No journey slug"}
                            </p>
                            {route.stays.length > 0 ? (
                              <div className="mt-4 flex flex-wrap gap-2">
                                {route.stays.map((stay) => (
                                  <span
                                    key={`${route.journeySlug}-${stay.slug || stay.title}`}
                                    className="rounded-full border border-[rgba(16,37,28,0.12)] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--forest)]"
                                  >
                                    {stay.title}{stay.category ? ` • ${stay.category}` : ""}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="mt-3 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                                No stays were added under this route.
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <AdminQuotationComposer
                    referenceId={request.referenceId}
                    travelerName={request.name}
                    travelerPhone={request.phone}
                    contactPreference={request.contactPreference}
                    selectedRequest={request.selectedRequest}
                    travelers={request.travelers}
                    tripLength={request.tripLength}
                    tripStyleLabel={request.tripStyleLabel}
                    budget={request.budget}
                    travelDate={request.travelDate}
                    tripPlanSummary={request.tripPlanSummary}
                    tripPlan={request.tripPlan}
                    initialQuotation={request.quotation}
                  />

                  <AdminRequestControls
                    referenceId={request.referenceId}
                    initialLeadStatus={request.leadStatus}
                    initialAdminNote={request.adminNote}
                  />

                  {request.deliveryError ? (
                    <div className="rounded-[24px] border border-[#d48f7b] bg-[#fff1ec] p-5 text-sm leading-7 text-[#8a3e2a]">
                      <p className="font-semibold">Delivery note</p>
                      <p className="mt-2">{request.deliveryError}</p>
                    </div>
                  ) : null}
                </div>
              </div>
            </article>
            );
          })}

          {totalPages > 1 ? (
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-[var(--border)] bg-[rgba(255,255,255,0.92)] p-5 shadow-[0_18px_50px_-40px_rgba(8,18,15,0.3)]">
              <p className="text-sm leading-7 text-[color:rgba(19,32,24,0.68)]">
                Page {resolvedCurrentPage} of {totalPages}
              </p>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage(resolvedCurrentPage - 1)}
                  disabled={resolvedCurrentPage === 1}
                  className="inline-flex items-center justify-center rounded-full border border-[rgba(16,37,28,0.14)] bg-white px-4 py-2 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Previous
                </button>

                {visiblePageNumbers.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setCurrentPage(pageNumber)}
                    className={
                      pageNumber === resolvedCurrentPage
                        ? "inline-flex items-center justify-center rounded-full bg-[var(--forest)] px-4 py-2 text-sm font-semibold text-white"
                        : "inline-flex items-center justify-center rounded-full border border-[rgba(16,37,28,0.14)] bg-white px-4 py-2 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
                    }
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setCurrentPage(resolvedCurrentPage + 1)}
                  disabled={resolvedCurrentPage === totalPages}
                  className="inline-flex items-center justify-center rounded-full border border-[rgba(16,37,28,0.14)] bg-white px-4 py-2 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Next
                </button>
              </div>
            </div>
          ) : null}
        </section>
      )}

      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin"
          className="inline-flex items-center justify-center rounded-full border border-[rgba(16,37,28,0.14)] bg-white px-5 py-3 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
        >
          Back to dashboard
        </Link>
        <Link
          href="/custom-itinerary"
          className="inline-flex items-center justify-center rounded-full bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--forest-soft)]"
        >
          Open trip form
        </Link>
      </div>
    </div>
  );
}
