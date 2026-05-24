"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogoutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleLogout = async () => {
    setIsPending(true);

    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });
    } finally {
      router.push("/admin/login");
      router.refresh();
      setIsPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      className="inline-flex items-center justify-center rounded-full border border-[rgba(16,37,28,0.14)] bg-white px-5 py-3 text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isPending ? "Signing out..." : "Sign out"}
    </button>
  );
}
