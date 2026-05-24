"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { buildWhatsAppUrl } from "@/lib/contact";

export default function WhatsAppFloat() {
  const whatsappUrl = buildWhatsAppUrl();

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.5 }}
      whileHover={{ y: -2 }}
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-3 rounded-full bg-[var(--forest)] px-4 py-3 text-sm font-semibold text-white shadow-[0_24px_60px_-26px_rgba(8,18,15,0.8)] ring-1 ring-white/10 transition hover:bg-[var(--forest-soft)]"
      aria-label="Chat on WhatsApp"
      onClick={() => {
        trackEvent("whatsapp_click", {
          section: "floating_button",
          action: "open_chat",
        });
      }}
    >
      <MessageCircle size={18} />
      <span className="hidden sm:inline">Talk to an expert</span>
    </motion.a>
  );
}
