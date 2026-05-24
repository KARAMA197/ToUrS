import { buildWhatsAppChatUrl } from "@/lib/contact";
import { escapeHtml, formatHtmlWithBreaks } from "@/lib/lead";
import { siteConfig } from "@/lib/site";

export type ReceivedRequestQuotationStatus =
  | "Not prepared"
  | "Draft ready"
  | "Sent";

export type QuotationTripPlanStay = {
  title: string;
  slug: string;
  category: string;
};

export type QuotationTripPlanRoute = {
  journey: string;
  journeySlug: string;
  stays: QuotationTripPlanStay[];
};

export type ReceivedRequestQuotation = {
  status: ReceivedRequestQuotationStatus;
  subject: string;
  quotedAmount: string;
  validUntil: string;
  priceSummary: string;
  body: string;
  includedItems: string;
  excludedItems: string;
  importantNotes: string;
  preparedBy: string;
  lastPreparedAt: string;
  sentAt: string;
};

export type QuotationRequestSource = {
  referenceId: string;
  name: string;
  phone: string;
  selectedRequest: string;
  travelers: string;
  tripLength: string;
  tripStyleLabel: string;
  budget: string;
  travelDate: string;
  contactPreference: string;
  tripPlanSummary: string;
  tripPlan: QuotationTripPlanRoute[];
};

function buildTripPlanSummaryLines(source: QuotationRequestSource) {
  if (source.tripPlan.length === 0) {
    return [
      ...(source.tripStyleLabel
        ? [`Trip style: ${source.tripStyleLabel}`]
        : []),
      `Trip focus: ${source.selectedRequest || source.tripStyleLabel || "Custom Tanzania trip"}`,
    ];
  }

  return source.tripPlan.flatMap((route, routeIndex) => {
    const lines = [`Route ${routeIndex + 1}: ${route.journey}`];

    if (route.stays.length > 0) {
      lines.push(
        `Stays: ${route.stays
          .map((stay) =>
            stay.category ? `${stay.title} (${stay.category})` : stay.title
          )
          .join(", ")}`
      );
    } else {
      lines.push("Stays: To be matched to the route and comfort level.");
    }

    return lines;
  });
}

function buildDefaultPriceSummary(source: QuotationRequestSource) {
  if (source.budget && source.budget !== "Not specified") {
    return `Estimated planning range: ${source.budget}. Final pricing will depend on travel dates, the stay level you confirm, and the exact route flow.`;
  }

  return "Estimated pricing will be shaped around your travel dates, number of travelers, and the stay level you prefer.";
}

function buildQuotationBasisLines(source: QuotationRequestSource) {
  return [
    `- Travelers: ${source.travelers}`,
    `- Expected trip length: ${source.tripLength}`,
    `- Trip style: ${source.tripStyleLabel || "Not specified"}`,
    `- Travel date: ${source.travelDate}`,
    `- Contact preference: ${source.contactPreference}`,
    `- Trip plan summary: ${source.tripPlanSummary || "Not provided"}`,
    ...buildTripPlanSummaryLines(source).map((line) => `- ${line}`),
  ];
}

function buildIncludedLines() {
  return [
    "Trip planning and itinerary shaping",
    "Route and stay matching based on your trip style",
    "Advice on timing, trip flow, and destination pairing",
    "A clear follow-up conversation to refine the quotation",
  ];
}

function buildExcludedLines() {
  return [
    "International flights",
    "Visa, insurance, and personal expenses",
    "Extra items not confirmed in the final itinerary",
    "Optional upgrades not yet selected",
  ];
}

function buildNextStepLines() {
  return [
    "Confirm the route direction you want to keep",
    "Confirm your preferred stay level or budget direction",
    "Share any must-see places, pace changes, or special requests",
    "We then refine this into a clearer final quotation for you",
  ];
}

function buildDefaultQuotedAmount(source: QuotationRequestSource) {
  if (source.budget && source.budget !== "Not specified") {
    return source.budget;
  }

  return "To be confirmed after final route and stay choices";
}

function buildDefaultImportantNotes() {
  return [
    "This is a first quotation sample and not yet a final invoice.",
    "Final pricing can change after route, stay level, or pace adjustments.",
    "We confirm the final quotation once the trip structure is clear.",
  ].join("\n");
}

function formatListLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function buildListText(lines: string[]) {
  return lines.map((line) => `- ${line}`).join("\n");
}

function buildListHtml(lines: string[]) {
  if (lines.length === 0) {
    return `<p style="margin:12px 0 0;color:#5d6a63;line-height:1.7;">To be confirmed.</p>`;
  }

  return `
    <ul style="margin:12px 0 0;padding-left:18px;color:#24342c;line-height:1.8;">
      ${lines
        .map((line) => `<li style="margin:0 0 8px;">${escapeHtml(line)}</li>`)
        .join("")}
    </ul>
  `;
}

function buildTripPlanHtml(source: QuotationRequestSource) {
  if (source.tripPlan.length === 0) {
    return `
      <div style="padding:16px 18px;border-radius:16px;background:#f8f4ec;border:1px solid #e8e1d6;">
        <p style="margin:0;color:#24342c;line-height:1.8;">${escapeHtml(
          source.selectedRequest || "Custom Tanzania trip"
        )}</p>
      </div>
    `;
  }

  return source.tripPlan
    .map(
      (route, routeIndex) => `
        <div style="padding:18px 20px;border-radius:18px;background:#f8f4ec;border:1px solid #e8e1d6;margin-bottom:12px;">
          <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#9b7a3e;font-weight:700;">Route ${routeIndex + 1}</p>
          <h3 style="margin:0;color:#10251c;font-size:20px;line-height:1.4;">${escapeHtml(
            route.journey
          )}</h3>
          ${
            route.stays.length > 0
              ? `<div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:8px;">
                   ${route.stays
                     .map(
                       (stay) => `
                         <span style="display:inline-block;padding:8px 12px;border-radius:999px;background:#ffffff;border:1px solid #e8e1d6;color:#24342c;font-size:12px;font-weight:600;">
                           ${escapeHtml(stay.title)}${stay.category ? ` | ${escapeHtml(stay.category)}` : ""}
                         </span>
                       `
                     )
                     .join("")}
                 </div>`
              : `<p style="margin:12px 0 0;color:#5d6a63;line-height:1.7;">Stays will be matched to this route and comfort level.</p>`
          }
        </div>
      `
    )
    .join("");
}

export function buildDefaultQuotationDraft(
  source: QuotationRequestSource
): ReceivedRequestQuotation {
  const quotedAmount = buildDefaultQuotedAmount(source);
  const priceSummary = buildDefaultPriceSummary(source);
  const includedItems = buildIncludedLines().join("\n");
  const excludedItems = buildExcludedLines().join("\n");
  const importantNotes = buildDefaultImportantNotes();
  const preparedBy = `${siteConfig.name} team`;
  const subject = `Quotation for ${source.selectedRequest || "your Tanzania trip"}`;
  const body = [
    `Hi ${source.name},`,
    "",
    `Thank you for your request with ${siteConfig.name}. Based on the details you shared, here is a first quotation sample for ${source.selectedRequest || "your Tanzania trip"}.`,
    "",
    "QUOTATION BASIS",
    ...buildQuotationBasisLines(source),
    "",
    "INDICATIVE PRICE GUIDE / ESTIMATED RANGE",
    quotedAmount,
    "",
    "PRICE SUMMARY",
    priceSummary,
    "",
    "WHAT IS USUALLY INCLUDED",
    ...buildIncludedLines().map((line) => `- ${line}`),
    "",
    "WHAT IS USUALLY NOT INCLUDED",
    ...buildExcludedLines().map((line) => `- ${line}`),
    "",
    "IMPORTANT NOTE",
    ...formatListLines(importantNotes).map((line) => `- ${line}`),
    "",
    "NEXT STEP",
    ...buildNextStepLines().map((line) => `- ${line}`),
    "",
    "Reply with any changes you want, and we will refine the quotation with you.",
    "",
    "Best regards,",
    preparedBy,
    siteConfig.url,
  ].join("\n");

  return {
    status: "Not prepared",
    subject,
    quotedAmount,
    validUntil: "",
    priceSummary,
    body,
    includedItems,
    excludedItems,
    importantNotes,
    preparedBy,
    lastPreparedAt: "",
    sentAt: "",
  };
}

export function normalizeQuotationDraft(
  source: QuotationRequestSource,
  quotation?: Partial<ReceivedRequestQuotation> | null
): ReceivedRequestQuotation {
  const defaults = buildDefaultQuotationDraft(source);

  return {
    status: quotation?.status ?? defaults.status,
    subject: quotation?.subject?.trim() || defaults.subject,
    quotedAmount: quotation?.quotedAmount?.trim() || defaults.quotedAmount,
    validUntil: quotation?.validUntil?.trim() ?? defaults.validUntil,
    priceSummary: quotation?.priceSummary?.trim() || defaults.priceSummary,
    body: quotation?.body?.trim() || defaults.body,
    includedItems: quotation?.includedItems?.trim() || defaults.includedItems,
    excludedItems: quotation?.excludedItems?.trim() || defaults.excludedItems,
    importantNotes:
      quotation?.importantNotes?.trim() || defaults.importantNotes,
    preparedBy: quotation?.preparedBy?.trim() || defaults.preparedBy,
    lastPreparedAt: quotation?.lastPreparedAt ?? "",
    sentAt: quotation?.sentAt ?? "",
  };
}

export function buildQuotationEmailHtml(
  source: QuotationRequestSource,
  quotation: ReceivedRequestQuotation
) {
  const includedLines = formatListLines(quotation.includedItems);
  const excludedLines = formatListLines(quotation.excludedItems);
  const importantNotesLines = formatListLines(quotation.importantNotes);

  return `
    <div style="font-family:Arial,sans-serif;max-width:720px;margin:0 auto;padding:24px;background:#f8f4ec;color:#10251c;">
      <div style="background:#10251c;color:#ffffff;padding:24px 28px;border-radius:24px 24px 0 0;">
        <p style="margin:0 0 10px;font-size:12px;letter-spacing:0.24em;text-transform:uppercase;color:#d9b26a;">Quotation response</p>
        <h1 style="margin:0;font-size:28px;line-height:1.2;">${escapeHtml(
          source.selectedRequest || "Your Tanzania trip"
        )}</h1>
        <p style="margin:12px 0 0;color:#d8e2db;">Reference ${escapeHtml(
          source.referenceId
        )}</p>
      </div>
      <div style="background:#ffffff;padding:28px;border:1px solid #e8e1d6;border-top:0;border-radius:0 0 24px 24px;">
        <div style="padding:18px 20px;border-radius:18px;background:#f8f4ec;border:1px solid #e8e1d6;margin-bottom:18px;">
          <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#9b7a3e;font-weight:700;">Quoted amount / range</p>
          <p style="margin:0;color:#24342c;line-height:1.8;font-weight:700;">${formatHtmlWithBreaks(
            quotation.quotedAmount
          )}</p>
          ${
            quotation.validUntil
              ? `<p style="margin:10px 0 0;color:#5d6a63;line-height:1.7;">Valid until: ${escapeHtml(
                  quotation.validUntil
                )}</p>`
              : ""
          }
          <p style="margin:10px 0 0;color:#5d6a63;line-height:1.7;">Prepared by: ${escapeHtml(
            quotation.preparedBy
          )}</p>
        </div>

        <div style="padding:18px 20px;border-radius:18px;background:#f8f4ec;border:1px solid #e8e1d6;margin-bottom:18px;">
          <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#9b7a3e;font-weight:700;">Price guide</p>
          <p style="margin:0;color:#24342c;line-height:1.8;">${formatHtmlWithBreaks(
            quotation.priceSummary
          )}</p>
        </div>

        <div style="padding:18px 20px;border-radius:18px;background:#ffffff;border:1px solid #e8e1d6;margin-bottom:18px;">
          <p style="margin:0;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#9b7a3e;font-weight:700;">Quotation overview</p>
          <p style="margin:14px 0 0;color:#24342c;line-height:1.9;">${formatHtmlWithBreaks(
            quotation.body
          )}</p>
        </div>

        <div style="padding:18px 20px;border-radius:18px;background:#ffffff;border:1px solid #e8e1d6;margin-bottom:18px;">
          <p style="margin:0;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#9b7a3e;font-weight:700;">Included</p>
          ${buildListHtml(includedLines)}
        </div>

        <div style="padding:18px 20px;border-radius:18px;background:#ffffff;border:1px solid #e8e1d6;margin-bottom:18px;">
          <p style="margin:0;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#9b7a3e;font-weight:700;">Not included</p>
          ${buildListHtml(excludedLines)}
        </div>

        <div style="padding:18px 20px;border-radius:18px;background:#ffffff;border:1px solid #e8e1d6;margin-bottom:18px;">
          <p style="margin:0;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#9b7a3e;font-weight:700;">Important notes</p>
          ${buildListHtml(importantNotesLines)}
        </div>

        <div style="padding:18px 20px;border-radius:18px;background:#ffffff;border:1px solid #e8e1d6;margin-bottom:18px;">
          <p style="margin:0 0 12px;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#9b7a3e;font-weight:700;">Request recap</p>
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:8px 0;color:#6b756f;font-weight:600;width:180px;vertical-align:top;">Travelers</td>
              <td style="padding:8px 0;color:#10251c;">${escapeHtml(source.travelers)}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#6b756f;font-weight:600;width:180px;vertical-align:top;">Expected trip length</td>
              <td style="padding:8px 0;color:#10251c;">${escapeHtml(source.tripLength)}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#6b756f;font-weight:600;width:180px;vertical-align:top;">Trip style</td>
              <td style="padding:8px 0;color:#10251c;">${escapeHtml(source.tripStyleLabel || "Not specified")}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#6b756f;font-weight:600;width:180px;vertical-align:top;">Travel date</td>
              <td style="padding:8px 0;color:#10251c;">${escapeHtml(source.travelDate)}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#6b756f;font-weight:600;width:180px;vertical-align:top;">Trip plan summary</td>
              <td style="padding:8px 0;color:#10251c;">${escapeHtml(source.tripPlanSummary)}</td>
            </tr>
          </table>
        </div>

        <div style="padding:18px 20px;border-radius:18px;background:#ffffff;border:1px solid #e8e1d6;">
          <p style="margin:0 0 12px;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#9b7a3e;font-weight:700;">Selected route and stay direction</p>
          ${buildTripPlanHtml(source)}
        </div>
      </div>
    </div>
  `;
}

export function buildQuotationEmailText(
  source: QuotationRequestSource,
  quotation: ReceivedRequestQuotation
) {
  const validUntilLine = quotation.validUntil
    ? `Valid until: ${quotation.validUntil}`
    : "Valid until: Not set";

  return [
    quotation.subject,
    "",
    `Reference: ${source.referenceId}`,
    `Selected request: ${source.selectedRequest || "Custom Tanzania trip"}`,
    `Trip style: ${source.tripStyleLabel || "Not specified"}`,
    "",
    "Quoted amount / range:",
    quotation.quotedAmount,
    validUntilLine,
    `Prepared by: ${quotation.preparedBy}`,
    "",
    "Price guide:",
    quotation.priceSummary,
    "",
    "Included:",
    buildListText(formatListLines(quotation.includedItems)),
    "",
    "Not included:",
    buildListText(formatListLines(quotation.excludedItems)),
    "",
    "Important notes:",
    buildListText(formatListLines(quotation.importantNotes)),
    "",
    quotation.body,
  ].join("\n");
}

export function buildQuotationWhatsappText(
  source: QuotationRequestSource,
  quotation: ReceivedRequestQuotation
) {
  const validUntilLine = quotation.validUntil
    ? `Valid until: ${quotation.validUntil}`
    : "";

  return [
    `Hello ${source.name},`,
    "",
    `${quotation.subject}`,
    "",
    `Selected request: ${source.selectedRequest || "Custom Tanzania trip"}`,
    `Trip style: ${source.tripStyleLabel || "Not specified"}`,
    `Quoted amount / range: ${quotation.quotedAmount}`,
    validUntilLine,
    `Price guide: ${quotation.priceSummary}`,
    "",
    "Included:",
    buildListText(formatListLines(quotation.includedItems)),
    "",
    "Not included:",
    buildListText(formatListLines(quotation.excludedItems)),
    "",
    "Important notes:",
    buildListText(formatListLines(quotation.importantNotes)),
    "",
    quotation.body,
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildQuotationWhatsappLink(
  source: QuotationRequestSource,
  quotation: ReceivedRequestQuotation
) {
  if (!source.phone) {
    return "";
  }

  return buildWhatsAppChatUrl(
    source.phone,
    buildQuotationWhatsappText(source, quotation)
  );
}
