import { promises as fs } from "node:fs";
import Link from "next/link";
import { contentStudioSections, getContentStudioSection } from "@/content-studio";
import { requireAdminAuth } from "@/lib/admin-auth";
import { getRequestAttentionMeta } from "@/lib/request-attention";
import { readReceivedRequests } from "@/lib/request-inbox";
import { isTerminalLeadStatus } from "@/lib/request-pipeline";
import { getRequestReminderMeta } from "@/lib/request-reminders";

function formatContentSize(content: unknown) {
  if (Array.isArray(content)) {
    return `${content.length} item${content.length === 1 ? "" : "s"}`;
  }

  if (content && typeof content === "object") {
    const groupCount = Object.keys(content).length;
    return `${groupCount} group${groupCount === 1 ? "" : "s"}`;
  }

  return "1 file";
}

function formatUpdatedTime(date?: Date) {
  if (!date) {
    return "Update time unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Africa/Dar_es_Salaam",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getDateKey(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Dar_es_Salaam",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export default async function AdminDashboardPage() {
  await requireAdminAuth("/admin");

  const requests = await readReceivedRequests();
  const requestsWithAttention = requests.map((request) => ({
    ...request,
    attention: getRequestAttentionMeta(request),
    reminder: getRequestReminderMeta(request),
  }));
  const todayKey = getDateKey(new Date());
  const todayRequests = requestsWithAttention.filter(
    (request) => getDateKey(new Date(request.submittedAt)) === todayKey
  );
  const attentionCount = requestsWithAttention.filter(
    (request) => request.attention.needsAttention
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
  const reminderCount = requestsWithAttention.filter(
    (request) => request.reminder.hasReminder
  ).length;
  const overdueReminderCount = requestsWithAttention.filter(
    (request) => request.reminder.highestSeverity === "overdue"
  ).length;
  const latestRequest = requestsWithAttention[0];
  const latestReminderRequest = requestsWithAttention.find(
    (request) => request.reminder.hasReminder
  );

  const sectionCards = await Promise.all(
    contentStudioSections.map(async (section) => {
      const currentSection = getContentStudioSection(section.key);
      const content = await currentSection.read();

      let updatedAt: Date | undefined;

      try {
        const stats = await fs.stat(currentSection.filePath);
        updatedAt = stats.mtime;
      } catch {
        updatedAt = undefined;
      }

      return {
        ...section,
        contentSize: formatContentSize(content),
        updatedAt: formatUpdatedTime(updatedAt),
      };
    })
  );

  const workflowSteps = [
    "Check the requests inbox for new traveler submissions.",
    "Open the content section you want to update.",
    "Save your changes, then preview the public page right away.",
  ];

  return (
    <div className="space-y-10">
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[32px] border border-[var(--border)] bg-[rgba(255,255,255,0.9)] p-8 shadow-[0_24px_80px_-50px_rgba(8,18,15,0.42)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
            Dashboard
          </p>
          <h2 className="font-display mt-3 text-4xl text-[var(--forest)]">
            Manage trip requests and website content from one place.
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-8 text-[color:rgba(19,32,24,0.72)]">
            Your admin system now covers both sides of the business: incoming traveler requests and the website content that supports them. Review the inbox first, then update journeys, guides, or brand pages when needed.
          </p>
        </div>

        <div className="rounded-[32px] border border-[var(--border)] bg-[rgba(16,37,28,0.96)] p-8 text-white shadow-[0_24px_80px_-50px_rgba(8,18,15,0.58)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold-soft)]">
            Workflow
          </p>
          <div className="mt-6 space-y-4">
            {workflowSteps.map((step, index) => (
              <div key={step} className="flex gap-4">
                <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
                  {index + 1}
                </div>
                <p className="text-sm leading-7 text-white/78">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-[var(--border)] bg-[rgba(255,255,255,0.9)] p-8 shadow-[0_24px_80px_-50px_rgba(8,18,15,0.42)]">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              Requests inbox
            </p>
            <h3 className="font-display mt-3 text-3xl text-[var(--forest)]">
              Keep an eye on the newest traveler requests.
            </h3>
            <p className="mt-4 text-sm leading-8 text-[color:rgba(19,32,24,0.72)]">
              Every successful trip request is now stored in the admin area as well as sent by email, so you have a simple inbox even when you are reviewing the site from one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/requests"
              className="inline-flex items-center justify-center rounded-full bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--forest-soft)]"
            >
              Open requests inbox
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-[24px] bg-[var(--sand)]/72 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
              Total requests
            </p>
            <p className="mt-3 text-3xl font-semibold text-[var(--forest)]">{requestsWithAttention.length}</p>
            <p className="mt-2 text-sm leading-7 text-[color:rgba(19,32,24,0.68)]">
              Saved in your admin inbox.
            </p>
          </div>
          <div className="rounded-[24px] bg-[var(--sand)]/72 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
              Today
            </p>
            <p className="mt-3 text-3xl font-semibold text-[var(--forest)]">{todayRequests.length}</p>
            <p className="mt-2 text-sm leading-7 text-[color:rgba(19,32,24,0.68)]">
              New requests received today.
            </p>
          </div>
          <div className="rounded-[24px] bg-[var(--sand)]/72 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
              Active pipeline
            </p>
            <p className="mt-3 text-3xl font-semibold text-[var(--forest)]">{activePipelineCount}</p>
            <p className="mt-2 text-sm leading-7 text-[color:rgba(19,32,24,0.68)]">
              New: {newCount}. Quote work: {quotationInProgressCount}. Waiting: {waitingCount}.
            </p>
          </div>
          <div className="rounded-[24px] bg-[var(--sand)]/72 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
              Reminders due
            </p>
            <p className="mt-3 text-3xl font-semibold text-[var(--forest)]">{reminderCount}</p>
            <p className="mt-2 text-sm leading-7 text-[color:rgba(19,32,24,0.68)]">
              {latestReminderRequest?.reminder.reasons[0]
                ? latestReminderRequest.reminder.reasons[0]
                : `Overdue: ${overdueReminderCount}.`}
            </p>
          </div>
          <div className="rounded-[24px] bg-[var(--sand)]/72 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
              Needs attention
            </p>
            <p className="mt-3 text-3xl font-semibold text-[var(--forest)]">{attentionCount}</p>
            <p className="mt-2 text-sm leading-7 text-[color:rgba(19,32,24,0.68)]">
              {latestRequest?.attention.needsAttention && latestRequest.attention.reasons[0]
                ? latestRequest.attention.reasons[0]
                : latestRequest
                  ? `Latest request: ${latestRequest.selectedRequest}`
                  : "No requests received yet."}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
        {sectionCards.map((section) => (
          <article
            key={section.key}
            className="rounded-[32px] border border-[var(--border)] bg-[rgba(255,255,255,0.88)] p-7 shadow-[0_24px_70px_-48px_rgba(8,18,15,0.42)]"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              {section.label}
            </p>
            <h2 className="font-display mt-4 text-3xl text-[var(--forest)]">
              {section.title}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
              {section.description}
            </p>

            <div className="mt-6 rounded-[22px] bg-[var(--sand)]/65 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
                Section status
              </p>
              <p className="mt-3 text-sm font-semibold text-[var(--forest)]">
                {section.contentSize}
              </p>
              <p className="mt-2 text-xs leading-6 text-[color:rgba(19,32,24,0.6)]">
                Last updated: {section.updatedAt}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={section.href}
                className="inline-flex items-center justify-center rounded-full bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--forest-soft)]"
              >
                Open admin
              </Link>
              <Link
                href={section.previewHref}
                className="inline-flex items-center justify-center rounded-full border border-[rgba(16,37,28,0.14)] bg-white px-5 py-3 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
              >
                {section.previewLabel}
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
