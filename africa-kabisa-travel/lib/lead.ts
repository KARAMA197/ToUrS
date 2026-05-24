export type LeadSource = "custom_itinerary_page" | "journey_detail";
export type ContactPreference = "Email" | "WhatsApp" | "Either is fine";

export function buildLeadReference(date = new Date()) {
  const datePart = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Dar_es_Salaam",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(date)
    .replaceAll("-", "");

  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();

  return `BES-${datePart}-${randomPart}`;
}

export function formatLeadSubmittedAt(date = new Date()) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Africa/Dar_es_Salaam",
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

export function getLeadType(journey: string) {
  return journey ? "Journey inquiry" : "Custom trip inquiry";
}

export function getLeadSourceLabel(source?: string) {
  if (source === "journey_detail") {
    return "Journey detail page";
  }

  return "Custom itinerary page";
}

export function getFollowUpChannel(
  contactPreference: string,
  phone: string
) {
  if (contactPreference === "WhatsApp" && phone) {
    return "WhatsApp first";
  }

  if (contactPreference === "Either is fine" && phone) {
    return "Email or WhatsApp";
  }

  return "Email";
}

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function formatHtmlWithBreaks(value: string) {
  return escapeHtml(value).replace(/\n/g, "<br />");
}
