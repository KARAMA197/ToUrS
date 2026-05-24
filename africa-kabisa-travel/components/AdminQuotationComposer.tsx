"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  buildQuotationWhatsappLink,
  type QuotationRequestSource,
  type ReceivedRequestQuotation,
} from "@/lib/request-quotation";
import type { ReceivedRequestLeadStatus } from "@/lib/request-pipeline";

type AdminQuotationComposerProps = {
  referenceId: string;
  travelerName: string;
  travelerPhone: string;
  contactPreference: string;
  selectedRequest: string;
  travelers: string;
  tripLength: string;
  tripStyleLabel: string;
  budget: string;
  travelDate: string;
  tripPlanSummary: string;
  tripPlan: QuotationRequestSource["tripPlan"];
  initialQuotation: ReceivedRequestQuotation;
};

type QuotationApiResponse = {
  error?: string;
  request?: {
    quotation?: ReceivedRequestQuotation;
    leadStatus?: ReceivedRequestLeadStatus;
  };
};

function getDefaultComposerMessage(contactPreference: string) {
  return contactPreference === "WhatsApp"
    ? "Prepare the quotation here, then open it in WhatsApp when it looks right."
    : "Save the quotation draft here, then send it when it is ready.";
}

function formatActionTime(dateValue: string) {
  if (!dateValue) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Africa/Dar_es_Salaam",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateValue));
}

export default function AdminQuotationComposer({
  referenceId,
  travelerName,
  travelerPhone,
  contactPreference,
  selectedRequest,
  travelers,
  tripLength,
  tripStyleLabel,
  budget,
  travelDate,
  tripPlanSummary,
  tripPlan,
  initialQuotation,
}: AdminQuotationComposerProps) {
  const router = useRouter();
  const [subject, setSubject] = useState(initialQuotation.subject);
  const [quotedAmount, setQuotedAmount] = useState(initialQuotation.quotedAmount);
  const [validUntil, setValidUntil] = useState(initialQuotation.validUntil);
  const [priceSummary, setPriceSummary] = useState(initialQuotation.priceSummary);
  const [body, setBody] = useState(initialQuotation.body);
  const [includedItems, setIncludedItems] = useState(initialQuotation.includedItems);
  const [excludedItems, setExcludedItems] = useState(initialQuotation.excludedItems);
  const [importantNotes, setImportantNotes] = useState(
    initialQuotation.importantNotes
  );
  const [preparedBy, setPreparedBy] = useState(initialQuotation.preparedBy);
  const [quotationStatus, setQuotationStatus] = useState(initialQuotation.status);
  const [lastPreparedAt, setLastPreparedAt] = useState(
    initialQuotation.lastPreparedAt
  );
  const [sentAt, setSentAt] = useState(initialQuotation.sentAt);
  const [message, setMessage] = useState(
    getDefaultComposerMessage(contactPreference)
  );
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const quotationSource = useMemo<QuotationRequestSource>(
    () => ({
      referenceId,
      name: travelerName,
      phone: travelerPhone,
      selectedRequest,
      travelers,
      tripLength,
      tripStyleLabel,
      budget,
      travelDate,
      contactPreference,
      tripPlanSummary,
      tripPlan,
    }),
    [
      budget,
      contactPreference,
      referenceId,
      selectedRequest,
      tripLength,
      tripStyleLabel,
      travelerName,
      travelerPhone,
      travelDate,
      travelers,
      tripPlan,
      tripPlanSummary,
    ]
  );

  const whatsappLink = useMemo(
    () =>
      buildQuotationWhatsappLink(quotationSource, {
        status: quotationStatus,
        subject,
        quotedAmount,
        validUntil,
        priceSummary,
        body,
        includedItems,
        excludedItems,
        importantNotes,
        preparedBy,
        lastPreparedAt,
        sentAt,
      }),
    [
      body,
      excludedItems,
      importantNotes,
      includedItems,
      lastPreparedAt,
      priceSummary,
      preparedBy,
      quotedAmount,
      quotationSource,
      quotationStatus,
      sentAt,
      subject,
      validUntil,
    ]
  );
  const emailAllowed = contactPreference !== "WhatsApp";

  const syncFromResponse = (
    quotation: ReceivedRequestQuotation | undefined,
    nextMessage: string
  ) => {
    if (!quotation) {
      setMessage(nextMessage);
      return;
    }

    setSubject(quotation.subject);
    setQuotedAmount(quotation.quotedAmount);
    setValidUntil(quotation.validUntil);
    setPriceSummary(quotation.priceSummary);
    setBody(quotation.body);
    setIncludedItems(quotation.includedItems);
    setExcludedItems(quotation.excludedItems);
    setImportantNotes(quotation.importantNotes);
    setPreparedBy(quotation.preparedBy);
    setQuotationStatus(quotation.status);
    setLastPreparedAt(quotation.lastPreparedAt);
    setSentAt(quotation.sentAt);
    setMessage(nextMessage);
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    setError("");
    setMessage("Saving quotation draft...");

    try {
      const response = await fetch(
        `/api/admin/requests/${encodeURIComponent(referenceId)}/quotation`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subject,
            quotedAmount,
            validUntil,
            priceSummary,
            body,
            includedItems,
            excludedItems,
            importantNotes,
            preparedBy,
          }),
        }
      );

      const payload = (await response.json().catch(() => null)) as
        | QuotationApiResponse
        | null;

      if (!response.ok) {
        setError(payload?.error ?? "Could not save the quotation draft.");
        setMessage("Save failed.");
        return;
      }

      syncFromResponse(payload?.request?.quotation, "Quotation draft saved.");
      router.refresh();
    } catch {
      setError("Could not save the quotation draft.");
      setMessage("Save failed.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendEmail = async () => {
    setIsSending(true);
    setError("");
    setMessage("Sending quotation email...");

    try {
      const response = await fetch(
        `/api/admin/requests/${encodeURIComponent(referenceId)}/quotation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subject,
            quotedAmount,
            validUntil,
            priceSummary,
            body,
            includedItems,
            excludedItems,
            importantNotes,
            preparedBy,
          }),
        }
      );

      const payload = (await response.json().catch(() => null)) as
        | QuotationApiResponse
        | null;

      if (!response.ok) {
        setError(payload?.error ?? "Could not send the quotation email.");
        setMessage("Send failed.");
        return;
      }

      syncFromResponse(
        payload?.request?.quotation,
        "Quotation sent to the traveler by email."
      );
      router.refresh();
    } catch {
      setError("Could not send the quotation email.");
      setMessage("Send failed.");
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyText = async () => {
    setIsCopying(true);
    setError("");

    try {
      await navigator.clipboard.writeText(
        [
          subject,
          "",
          "Quoted amount / range:",
          quotedAmount,
          validUntil ? `Valid until: ${validUntil}` : "",
          preparedBy ? `Prepared by: ${preparedBy}` : "",
          "",
          "Price summary:",
          priceSummary,
          "",
          "Included:",
          includedItems,
          "",
          "Not included:",
          excludedItems,
          "",
          "Important notes:",
          importantNotes,
          "",
          body,
        ]
          .filter(Boolean)
          .join("\n")
      );
      setMessage("Quotation text copied.");
    } catch {
      setError("Could not copy the quotation text.");
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <div className="rounded-[24px] border border-[var(--border)] bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
            Quotation response
          </p>
          <p className="mt-2 text-sm leading-7 text-[color:rgba(19,32,24,0.68)]">
            {message}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-[rgba(16,37,28,0.12)] bg-[var(--sand)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--forest)]">
            {quotationStatus}
          </span>
          {sentAt ? (
            <span className="rounded-full border border-[rgba(16,37,28,0.12)] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[color:rgba(19,32,24,0.68)]">
              Sent {formatActionTime(sentAt)}
            </span>
          ) : null}
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-[20px] border border-[#d48f7b] bg-[#fff1ec] px-4 py-3 text-sm text-[#8a3e2a]">
          {error}
        </div>
      ) : null}

      <div className="mt-5 rounded-[20px] border border-[rgba(16,37,28,0.08)] bg-[var(--sand)]/55 px-4 py-3 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
        <p>
          <span className="font-semibold text-[var(--forest)]">Preferred contact:</span>{" "}
          {contactPreference}
        </p>
        {lastPreparedAt ? (
          <p>
            <span className="font-semibold text-[var(--forest)]">Last prepared:</span>{" "}
            {formatActionTime(lastPreparedAt)}
          </p>
        ) : null}
      </div>

      <div className="mt-5 grid gap-4">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-[var(--forest)]">
            Email subject
          </span>
          <input
            value={subject}
            onChange={(event) => {
              setSubject(event.target.value);
              setMessage(getDefaultComposerMessage(contactPreference));
              setError("");
            }}
            className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--gold)]"
          />
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-[var(--forest)]">
              Quoted amount / range
            </span>
            <input
              value={quotedAmount}
              onChange={(event) => {
                setQuotedAmount(event.target.value);
                setMessage(getDefaultComposerMessage(contactPreference));
                setError("");
              }}
              placeholder="Example: $3,000 - $4,500 per person"
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--gold)]"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-[var(--forest)]">
              Valid until
            </span>
            <input
              type="date"
              value={validUntil}
              onChange={(event) => {
                setValidUntil(event.target.value);
                setMessage(getDefaultComposerMessage(contactPreference));
                setError("");
              }}
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--gold)]"
            />
          </label>
        </div>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-[var(--forest)]">
            Price guide summary
          </span>
          <textarea
            value={priceSummary}
            onChange={(event) => {
              setPriceSummary(event.target.value);
              setMessage(getDefaultComposerMessage(contactPreference));
              setError("");
            }}
            rows={3}
            className="w-full rounded-[20px] border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--gold)]"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-[var(--forest)]">
            Prepared by
          </span>
          <input
            value={preparedBy}
            onChange={(event) => {
              setPreparedBy(event.target.value);
              setMessage(getDefaultComposerMessage(contactPreference));
              setError("");
            }}
            placeholder="Example: Brilliant Explore Safaris team"
            className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--gold)]"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-[var(--forest)]">
            Quotation overview
          </span>
          <textarea
            value={body}
            onChange={(event) => {
              setBody(event.target.value);
              setMessage(getDefaultComposerMessage(contactPreference));
              setError("");
            }}
            rows={12}
            className="w-full rounded-[20px] border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--gold)]"
          />
        </label>

        <div className="grid gap-4 lg:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-[var(--forest)]">
              Included items
            </span>
            <textarea
              value={includedItems}
              onChange={(event) => {
                setIncludedItems(event.target.value);
                setMessage(getDefaultComposerMessage(contactPreference));
                setError("");
              }}
              rows={6}
              placeholder="One item per line"
              className="w-full rounded-[20px] border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--gold)]"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-semibold text-[var(--forest)]">
              Not included
            </span>
            <textarea
              value={excludedItems}
              onChange={(event) => {
                setExcludedItems(event.target.value);
                setMessage(getDefaultComposerMessage(contactPreference));
                setError("");
              }}
              rows={6}
              placeholder="One item per line"
              className="w-full rounded-[20px] border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--gold)]"
            />
          </label>
        </div>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-[var(--forest)]">
            Important notes
          </span>
          <textarea
            value={importantNotes}
            onChange={(event) => {
              setImportantNotes(event.target.value);
              setMessage(getDefaultComposerMessage(contactPreference));
              setError("");
            }}
            rows={5}
            placeholder="One note per line"
            className="w-full rounded-[20px] border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--gold)]"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleSaveDraft}
          disabled={isSaving || isSending}
          className="inline-flex items-center justify-center rounded-full bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--forest-soft)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save quotation draft"}
        </button>

        {emailAllowed ? (
          <button
            type="button"
            onClick={handleSendEmail}
            disabled={isSaving || isSending}
            className="inline-flex items-center justify-center rounded-full border border-[rgba(16,37,28,0.14)] bg-white px-5 py-3 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSending ? "Sending..." : "Send quotation by email"}
          </button>
        ) : null}

        {whatsappLink ? (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-[#128c7e] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f7b70]"
          >
            Open quotation in WhatsApp
          </a>
        ) : null}

        <a
          href={`/quotation-print/${encodeURIComponent(referenceId)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full border border-[rgba(16,37,28,0.14)] bg-white px-5 py-3 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
        >
          Open print view
        </a>

        <button
          type="button"
          onClick={handleCopyText}
          disabled={isCopying}
          className="inline-flex items-center justify-center rounded-full border border-[rgba(16,37,28,0.14)] bg-white px-5 py-3 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isCopying ? "Copying..." : "Copy quotation text"}
        </button>
      </div>
    </div>
  );
}
