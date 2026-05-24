"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  LoaderCircle,
  MessageCircle,
  Sparkles,
  User,
} from "lucide-react";
import TrackedLink from "@/components/TrackedLink";
import { trackEvent } from "@/lib/analytics";
import { buildWhatsAppUrl } from "@/lib/contact";
import type { AISupportMessage } from "@/lib/ai-support";

type AISupportGuide = {
  slug: string;
  category: string;
  title: string;
  summary: string;
  bestTime: string;
  idealLength: string;
  goodFor: string;
  highlights: string[];
} | null;

type AISupportExperienceProps = {
  guide: AISupportGuide;
  initialMessage: string;
  quickPrompts: string[];
  relatedJourneyTitle?: string | null;
  isConfigured: boolean;
};

type ChatMessage = AISupportMessage & {
  id: string;
};

function createMessage(role: ChatMessage["role"], content: string): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
  };
}

export default function AISupportExperience({
  guide,
  initialMessage,
  quickPrompts,
  relatedJourneyTitle,
  isConfigured,
}: AISupportExperienceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage("assistant", initialMessage),
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    trackEvent("ai_support_open", {
      section: "ai_support_page",
      guide_slug: guide?.slug,
      guide_title: guide?.title,
      configured: isConfigured,
    });
  }, [guide?.slug, guide?.title, isConfigured]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (question: string) => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || loading) {
      return;
    }

    const nextUserMessage = createMessage("user", trimmedQuestion);
    const nextMessages = [...messages, nextUserMessage];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);

    trackEvent("ai_support_message_sent", {
      section: "ai_support_page",
      guide_slug: guide?.slug,
      guide_title: guide?.title,
    });

    try {
      const response = await fetch("/api/ai-support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guideSlug: guide?.slug,
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
        }),
      });

      const result = (await response.json().catch(() => null)) as
        | { answer?: string; error?: string }
        | null;

      if (!response.ok || !result?.answer) {
        throw new Error(
          result?.error ??
            "The AI guide could not reply right now. Please try again."
        );
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        createMessage("assistant", result.answer ?? ""),
      ]);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "The AI guide could not reply right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await sendMessage(input);
  };

  const whatsappFallbackUrl = buildWhatsAppUrl(
    guide
      ? `Hello, I need human help with the ${guide.title} guide.`
      : "Hello, I need human help planning a Tanzania trip."
  );

  return (
    <section className="px-6 py-14">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[32px] border border-[var(--border)] bg-[rgba(255,255,255,0.82)] p-7 shadow-[0_24px_70px_-48px_rgba(8,18,15,0.42)] backdrop-blur">
              <div className="inline-flex items-center gap-3 rounded-full border border-[rgba(16,37,28,0.12)] bg-[var(--sand)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--forest)]">
                <Sparkles size={15} />
                AI support
              </div>
              <h1 className="font-display mt-5 text-4xl text-[var(--forest)] sm:text-5xl">
                {guide ? "Ask AI about this guide" : "Instant Tanzania trip guidance"}
              </h1>
              <p className="mt-4 text-base leading-8 text-[color:rgba(19,32,24,0.72)]">
                {guide
                  ? "Get immediate help understanding this guide, choosing the right route, and thinking through the kind of trip that fits you best."
                  : "Ask quick planning questions and get immediate help choosing the right Tanzania travel direction before you move to a human planner."}
              </p>

              {guide && (
                <div className="mt-6 rounded-[26px] border border-[rgba(16,37,28,0.1)] bg-white p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
                    Current guide
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-[var(--forest)]">
                    {guide.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[color:rgba(19,32,24,0.72)]">
                    {guide.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-[var(--sand)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--forest)]">
                      {guide.category}
                    </span>
                    <span className="rounded-full bg-[var(--sand)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--forest)]">
                      {guide.bestTime}
                    </span>
                    <span className="rounded-full bg-[var(--sand)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--forest)]">
                      {guide.idealLength}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[color:rgba(19,32,24,0.66)]">
                    Good for: <span className="font-semibold text-[var(--forest)]">{guide.goodFor}</span>
                  </p>
                  {relatedJourneyTitle && (
                    <p className="mt-2 text-sm leading-7 text-[color:rgba(19,32,24,0.66)]">
                      Related route on the site:{" "}
                      <span className="font-semibold text-[var(--forest)]">
                        {relatedJourneyTitle}
                      </span>
                    </p>
                  )}
                </div>
              )}

              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gold)]">
                  Quick prompts
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => void sendMessage(prompt)}
                      disabled={!isConfigured || loading}
                      className="rounded-full border border-[rgba(16,37,28,0.12)] bg-white px-4 py-3 text-left text-sm font-semibold text-[var(--forest)] transition hover:border-[var(--gold)] hover:text-[var(--gold)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[30px] bg-[var(--forest)] p-7 text-white shadow-[0_28px_70px_-42px_rgba(8,18,15,0.8)]">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--gold-soft)]">
                Human backup
              </p>
              <p className="mt-4 text-sm leading-7 text-white/78">
                AI is good for instant route guidance. If you need a live quote, final booking
                help, or a more personal planning conversation, we can hand you over to a human
                planner next.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <TrackedLink
                  href="/custom-itinerary"
                  eventName="cta_click"
                  eventParams={{
                    section: "ai_support_page",
                    action: "handoff_form",
                    guide_slug: guide?.slug,
                  }}
                  className="inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[var(--forest)] transition hover:bg-[var(--sand)]"
                >
                  Use the trip form
                  <ArrowRight size={16} />
                </TrackedLink>
                <TrackedLink
                  href={whatsappFallbackUrl}
                  eventName="cta_click"
                  eventParams={{
                    section: "ai_support_page",
                    action: "handoff_whatsapp",
                    guide_slug: guide?.slug,
                  }}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 rounded-full border border-white/16 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/32 hover:bg-white/8"
                >
                  Message on WhatsApp
                  <MessageCircle size={16} />
                </TrackedLink>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-[var(--border)] bg-[rgba(255,255,255,0.84)] p-6 shadow-[0_28px_80px_-48px_rgba(8,18,15,0.48)] backdrop-blur sm:p-7">
            {!isConfigured && (
              <div className="mb-5 rounded-[24px] border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-7 text-amber-900">
                AI support is not configured in this environment yet. Add an
                <span className="font-semibold"> OPENAI_API_KEY </span>
                on the server to turn this on, or use the human support options for now.
              </div>
            )}

            <div className="flex items-center justify-between gap-4 border-b border-[rgba(16,37,28,0.08)] pb-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
                  Live AI planning help
                </p>
                <p className="mt-2 text-sm leading-7 text-[color:rgba(19,32,24,0.68)]">
                  Ask short questions and get immediate route guidance.
                </p>
              </div>
            </div>

            <div className="mt-5 h-[32rem] overflow-y-auto rounded-[28px] bg-[rgba(255,250,243,0.68)] p-4 sm:p-5">
              <div className="space-y-4">
                {messages.map((message) => {
                  const isAssistant = message.role === "assistant";

                  return (
                    <div
                      key={message.id}
                      className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-[24px] px-5 py-4 shadow-[0_16px_30px_-24px_rgba(8,18,15,0.2)] ${
                          isAssistant
                            ? "border border-[rgba(16,37,28,0.08)] bg-white text-[var(--forest)]"
                            : "bg-[var(--forest)] text-white"
                        }`}
                      >
                        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] opacity-75">
                          {isAssistant ? <Bot size={14} /> : <User size={14} />}
                          {isAssistant ? "AI guide" : "You"}
                        </div>
                        <p className="whitespace-pre-wrap text-sm leading-7">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {loading && (
                  <div className="flex justify-start">
                    <div className="inline-flex items-center gap-3 rounded-[24px] border border-[rgba(16,37,28,0.08)] bg-white px-5 py-4 text-sm text-[var(--forest)] shadow-[0_16px_30px_-24px_rgba(8,18,15,0.2)]">
                      <LoaderCircle className="animate-spin" size={16} />
                      Thinking through your guide...
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {error && (
              <p className="mt-4 rounded-[20px] bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="mt-5">
              <label className="block">
                <span className="sr-only">Ask a question</span>
                <textarea
                  value={input}
                  onChange={(event) => {
                    setInput(event.target.value);
                    setError(null);
                  }}
                  placeholder={
                    guide
                      ? `Ask something about ${guide.title.toLowerCase()}...`
                      : "Ask about safari, Kilimanjaro, Zanzibar, timing, budget, or route ideas..."
                  }
                  rows={4}
                  disabled={!isConfigured || loading}
                  className="w-full rounded-[24px] border border-[var(--border)] bg-white px-4 py-4 text-sm leading-7 text-[var(--forest)] outline-none transition focus:border-[var(--gold)] disabled:cursor-not-allowed disabled:bg-[rgba(255,250,243,0.68)]"
                />
              </label>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm leading-7 text-[color:rgba(19,32,24,0.62)]">
                  Use AI for instant direction, then move to a human planner when you are ready for
                  the real trip setup.
                </p>
                <button
                  type="submit"
                  disabled={!isConfigured || loading || !input.trim()}
                  className="inline-flex items-center gap-3 rounded-full bg-[var(--forest)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--forest-soft)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Ask AI now
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>

            <div className="mt-6 border-t border-[rgba(16,37,28,0.08)] pt-5">
              <Link
                href={guide ? `/travel-guides/${guide.slug}` : "/travel-guides"}
                className="text-sm font-semibold text-[var(--forest)] transition hover:text-[var(--gold)]"
              >
                {guide ? "Back to this guide" : "Back to travel guides"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

