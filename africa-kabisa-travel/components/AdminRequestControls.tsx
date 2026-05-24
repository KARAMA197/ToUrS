"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  requestLeadStatusOptions,
  type ReceivedRequestLeadStatus,
} from "@/lib/request-pipeline";

type AdminRequestControlsProps = {
  referenceId: string;
  initialLeadStatus: ReceivedRequestLeadStatus;
  initialAdminNote: string;
};

export default function AdminRequestControls({
  referenceId,
  initialLeadStatus,
  initialAdminNote,
}: AdminRequestControlsProps) {
  const router = useRouter();
  const [leadStatus, setLeadStatus] = useState(initialLeadStatus);
  const [adminNote, setAdminNote] = useState(initialAdminNote);
  const [message, setMessage] = useState(
    "Save internal notes or update the pipeline stage."
  );
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSave = async () => {
    setIsPending(true);
    setError("");
    setMessage("Saving request update...");

    try {
      const response = await fetch(
        `/api/admin/requests/${encodeURIComponent(referenceId)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            leadStatus,
            adminNote,
          }),
        }
      );

      const payload = (await response.json().catch(() => null)) as
        | {
            error?: string;
            request?: {
              leadStatus?: typeof leadStatus;
              adminNote?: string;
            };
          }
        | null;

      if (!response.ok) {
        setError(payload?.error ?? "Could not update the request right now.");
        setMessage("Save failed.");
        return;
      }

      setLeadStatus(payload?.request?.leadStatus ?? leadStatus);
      setAdminNote(payload?.request?.adminNote ?? adminNote);
      setMessage("Request updated.");
      router.refresh();
    } catch {
      setError("Could not update the request right now.");
      setMessage("Save failed.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="rounded-[24px] border border-[var(--border)] bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
            Lead management
          </p>
          <p className="mt-2 text-sm leading-7 text-[color:rgba(19,32,24,0.68)]">
            {message}
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="inline-flex items-center justify-center rounded-full bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--forest-soft)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Save changes"}
        </button>
      </div>

      {error ? (
        <div className="mt-4 rounded-[20px] border border-[#d48f7b] bg-[#fff1ec] px-4 py-3 text-sm text-[#8a3e2a]">
          {error}
        </div>
      ) : null}

      <div className="mt-5 grid gap-4 md:grid-cols-[0.34fr_0.66fr]">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-[var(--forest)]">
            Pipeline stage
          </span>
          <select
            value={leadStatus}
            onChange={(event) => {
              setLeadStatus(event.target.value as typeof leadStatus);
              setMessage("Save internal notes or update the pipeline stage.");
              setError("");
            }}
            className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--gold)]"
          >
            {requestLeadStatusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-[var(--forest)]">
            Internal note
          </span>
          <textarea
            value={adminNote}
            onChange={(event) => {
              setAdminNote(event.target.value);
              setMessage("Save internal notes or update the pipeline stage.");
              setError("");
            }}
            rows={4}
            placeholder="Add a quick follow-up note for yourself or the team."
            className="w-full rounded-[20px] border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--gold)]"
          />
        </label>
      </div>
    </div>
  );
}
