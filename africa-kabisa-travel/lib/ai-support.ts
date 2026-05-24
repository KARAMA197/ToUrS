import { getGuideBySlug, type TravelGuide } from "@/guides-data";
import { getJourneyBySlug } from "@/journeys-data";
import { siteConfig } from "@/lib/site";

export type AISupportMessage = {
  role: "user" | "assistant";
  content: string;
};

export const AI_SUPPORT_MODEL =
  process.env.OPENAI_GUIDE_SUPPORT_MODEL || "gpt-5.4-mini";

export function getGuideSupportContext(guideSlug?: string | null) {
  if (!guideSlug) {
    return {
      guide: null,
      relatedJourney: null,
    };
  }

  const guide = getGuideBySlug(guideSlug);
  const relatedJourney = guide
    ? getJourneyBySlug(guide.relatedJourneySlug)
    : null;

  return {
    guide,
    relatedJourney,
  };
}

export function buildAISupportInstructions(
  guide: TravelGuide | null,
  relatedJourneyTitle?: string | null
) {
  const guideContext = guide
    ? [
        `Current guide: ${guide.title}`,
        `Category: ${guide.category}`,
        `Summary: ${guide.summary}`,
        `Best time: ${guide.bestTime}`,
        `Ideal length: ${guide.idealLength}`,
        `Good for: ${guide.goodFor}`,
        `Highlights: ${guide.highlights.join(", ")}`,
        `Guide sections: ${guide.sections
          .map((section) => `${section.title}: ${section.body}`)
          .join(" | ")}`,
        `Quick tips: ${guide.tips.join(" | ")}`,
        `FAQs: ${guide.faqs
          .map((faq) => `${faq.question} - ${faq.answer}`)
          .join(" | ")}`,
        relatedJourneyTitle
          ? `Related sample journey on the site: ${relatedJourneyTitle}`
          : null,
      ]
        .filter(Boolean)
        .join("\n")
    : "No specific guide is selected. Help the traveler compare safari, Kilimanjaro, Zanzibar, family, honeymoon, and combined Tanzania travel ideas.";

  return [
    `You are the instant AI trip-planning assistant for ${siteConfig.name}.`,
    "Your job is to help travelers understand routes, pace, trip shape, timing, stay logic, and which Tanzania travel style fits them best.",
    "Stay practical, warm, and concise. Use simple English and short paragraphs or bullets when helpful.",
    "Use the guide context below when a guide is selected. Keep the answer tied to that guide unless the traveler clearly asks to compare wider options.",
    "Do not invent live prices, exact lodge availability, current visa or vaccine rules, or guaranteed wildlife outcomes.",
    "If the traveler asks for a live quote, final booking step, or exact current regulation, say a human planner should confirm it next.",
    "When useful, end with one helpful next-step question.",
    "",
    "Guide context:",
    guideContext,
  ].join("\n");
}

export function getInitialAISupportMessage(guide: TravelGuide | null) {
  if (guide) {
    return `Hello. I can help you think through the ${guide.title} guide, compare route ideas, estimate the right trip length, and explain what would fit best before you speak to a human planner.`;
  }

  return `Hello. I can help you compare safari, Kilimanjaro, Zanzibar, and combined Tanzania trip ideas so you can choose the right direction faster.`;
}

export function getAISupportQuickPrompts(
  guide: TravelGuide | null,
  relatedJourneyTitle?: string | null
) {
  if (guide) {
    return [
      `What route usually fits the ${guide.title} best?`,
      `How many days should I allow for a trip like this?`,
      relatedJourneyTitle
        ? `Would this work well with the ${relatedJourneyTitle} journey?`
        : "Can this be combined with another Tanzania experience?",
    ];
  }

  return [
    "Help me choose between safari, Kilimanjaro, and Zanzibar.",
    "How many days do I need for a first Tanzania trip?",
    "What kind of Tanzania trip usually fits a mid-range budget?",
  ];
}

