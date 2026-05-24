"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type AdminLoginFormProps = {
  isConfigured: boolean;
};

export default function AdminLoginForm({ isConfigured }: AdminLoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(
    isConfigured
      ? "Enter the admin password to continue."
      : "Add ADMIN_PASSWORD and ADMIN_SESSION_SECRET to .env.local first."
  );
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isConfigured) {
      setError("Admin login is not configured yet.");
      return;
    }

    setIsPending(true);
    setError("");
    setMessage("Signing in...");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          next: searchParams.get("next") ?? "/admin",
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { error?: string; next?: string }
        | null;

      if (!response.ok) {
        setError(payload?.error ?? "Could not sign in.");
        setMessage("Sign-in failed.");
        return;
      }

      router.push(payload?.next ?? "/admin");
      router.refresh();
    } catch {
      setError("Could not sign in right now.");
      setMessage("Sign-in failed.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="rounded-[32px] border border-[var(--border)] bg-[rgba(255,255,255,0.92)] p-8 shadow-[0_30px_90px_-48px_rgba(8,18,15,0.35)]">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold)]">
        Admin sign in
      </p>
      <h1 className="font-display mt-3 text-4xl text-[var(--forest)] sm:text-5xl">
        Private admin access
      </h1>
      <p className="mt-5 text-sm leading-8 text-[color:rgba(19,32,24,0.72)]">
        Sign in to manage homepage content, journeys, travel guides, and brand pages.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="text-sm font-semibold text-[var(--forest)]" htmlFor="admin-password">
            Admin password
          </label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError("");
              setMessage(
                isConfigured
                  ? "Enter the admin password to continue."
                  : "Add ADMIN_PASSWORD and ADMIN_SESSION_SECRET to .env.local first."
              );
            }}
            className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--gold)]"
            placeholder="Enter password"
            disabled={!isConfigured || isPending}
            required
          />
        </div>

        <button
          type="submit"
          disabled={!isConfigured || isPending}
          className="inline-flex w-full items-center justify-center rounded-full bg-[var(--forest)] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[var(--forest-soft)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Signing in..." : "Sign in to admin"}
        </button>
      </form>

      <p className="mt-4 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">{message}</p>

      {error ? (
        <div className="mt-4 rounded-[20px] border border-[#d48f7b] bg-[#fff1ec] px-4 py-3 text-sm text-[#8a3e2a]">
          {error}
        </div>
      ) : null}
    </div>
  );
}
