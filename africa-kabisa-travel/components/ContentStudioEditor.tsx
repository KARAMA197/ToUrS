"use client";

import Link from "next/link";
import { useState } from "react";
type ContentStudioEditorProps = {
  title: string;
  description: string;
  filePath: string;
  initialContent: unknown;
  saveUrl: string;
  previewHref: string;
  previewLabel: string;
  dashboardHref?: string;
};

const instructions = [
  "Edit the JSON on the left and keep the same structure.",
  "Use plain text only. The studio keeps the current section order for you.",
  "Save changes, then refresh the matching site page to review the result.",
];

export default function ContentStudioEditor({
  title,
  description,
  filePath,
  initialContent,
  saveUrl,
  previewHref,
  previewLabel,
  dashboardHref = "/admin",
}: ContentStudioEditorProps) {
  const [draft, setDraft] = useState(JSON.stringify(initialContent, null, 2));
  const [message, setMessage] = useState("Changes save into the project content file.");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(draft);
      setDraft(JSON.stringify(parsed, null, 2));
      setError("");
      setMessage("JSON formatted and ready to save.");
    } catch {
      setError("The JSON is not valid yet. Please fix the syntax before formatting.");
    }
  };

  const handleReset = () => {
    setDraft(JSON.stringify(initialContent, null, 2));
    setError("");
    setMessage("Editor reset to the last loaded content.");
  };

  const handleSave = async () => {
    let parsed: unknown;

    try {
      parsed = JSON.parse(draft);
    } catch {
      setError("The JSON is not valid yet. Please fix the syntax before saving.");
      return;
    }

    setIsPending(true);
    setError("");
    setMessage("Saving content...");

    try {
      const response = await fetch(saveUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed),
      });

      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error ?? "Could not save the content.");
        setMessage("Save failed.");
        return;
      }

      setDraft(JSON.stringify(payload.content, null, 2));
      setMessage("Content saved. Refresh the matching page to review the update.");
    } catch {
      setError("Could not save the content right now.");
      setMessage("Save failed.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <aside className="space-y-6 rounded-[28px] border border-[var(--border)] bg-[rgba(255,250,243,0.85)] p-6 shadow-[0_24px_80px_-50px_rgba(8,18,15,0.42)]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
            Studio notes
          </p>
          <h2 className="font-display mt-3 text-3xl text-[var(--forest)]">
            {title}
          </h2>
          <p className="mt-4 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
            {description}
          </p>
        </div>

        <div className="space-y-3">
          {instructions.map((item) => (
            <div
              key={item}
              className="rounded-[20px] border border-[var(--border)] bg-white p-4 text-sm leading-7 text-[var(--forest)]"
            >
              {item}
            </div>
          ))}
        </div>

        <div className="rounded-[22px] bg-[var(--forest)] p-5 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--gold-soft)]">
            Content file
          </p>
          <p className="mt-3 break-all text-sm leading-7 text-white/78">{filePath}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleFormat}
            className="inline-flex items-center justify-center rounded-full border border-[rgba(16,37,28,0.14)] bg-white px-5 py-3 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
          >
            Format JSON
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center rounded-full border border-[rgba(16,37,28,0.14)] bg-white px-5 py-3 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
          >
            Reset
          </button>
          <Link
            href={dashboardHref}
            className="inline-flex items-center justify-center rounded-full border border-[rgba(16,37,28,0.14)] bg-white px-5 py-3 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
          >
            Back to admin
          </Link>
          <Link
            href={previewHref}
            className="inline-flex items-center justify-center rounded-full bg-[var(--forest)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--forest-soft)]"
          >
            {previewLabel}
          </Link>
        </div>
      </aside>

      <section className="rounded-[28px] border border-[var(--border)] bg-[rgba(255,255,255,0.9)] p-6 shadow-[0_24px_80px_-50px_rgba(8,18,15,0.42)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
              JSON editor
            </p>
            <p className="mt-2 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">{message}</p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="inline-flex items-center justify-center rounded-full bg-[var(--gold)] px-6 py-3 text-sm font-semibold text-[var(--forest)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Saving..." : "Save content"}
          </button>
        </div>

        {error ? (
          <div className="mt-4 rounded-[20px] border border-[#d48f7b] bg-[#fff1ec] px-4 py-3 text-sm text-[#8a3e2a]">
            {error}
          </div>
        ) : null}

        <label className="mt-6 block">
          <span className="sr-only">Content JSON</span>
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            spellCheck={false}
            className="min-h-[44rem] w-full rounded-[24px] border border-[var(--border)] bg-[#09130f] p-5 font-mono text-sm leading-7 text-[#edf0ea] outline-none transition focus:border-[var(--gold)]"
          />
        </label>
      </section>
    </div>
  );
}
