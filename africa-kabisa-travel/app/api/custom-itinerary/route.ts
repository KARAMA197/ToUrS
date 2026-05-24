import { NextResponse } from "next/server";
import { Resend } from "resend";
import { buildWhatsAppChatUrl, buildWhatsAppUrl } from "@/lib/contact";
import {
  buildLeadReference,
  escapeHtml,
  formatHtmlWithBreaks,
  formatLeadSubmittedAt,
  getFollowUpChannel,
  type ContactPreference,
} from "@/lib/lead";
import { buildDefaultQuotationDraft } from "@/lib/request-quotation";
import { saveReceivedRequest, type ReceivedRequest } from "@/lib/request-inbox";
import { siteConfig } from "@/lib/site";
import {
  getTripStyleByValue,
  isTripStyleValue,
} from "@/lib/trip-styles";

const resendApiKey = process.env.RESEND_API_KEY;
const businessEmail = process.env.CONTACT_EMAIL ?? "mrkarama2@gmail.com";
const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

const allowedContactPreferences = new Set<ContactPreference>([
  "Email",
  "WhatsApp",
  "Either is fine",
]);

type TripPlanStayRequest = {
  title?: string;
  slug?: string;
  category?: string;
};

type TripPlanRouteRequest = {
  journey?: string;
  journeySlug?: string;
  stays?: TripPlanStayRequest[];
};

type ItineraryRequest = {
  name?: string;
  email?: string;
  phone?: string;
  travelers?: string;
  tripLength?: string;
  tripStyle?: string;
  budget?: string;
  travelDate?: string;
  message?: string;
  journey?: string;
  journeySlug?: string;
  stay?: string;
  staySlug?: string;
  stayCategory?: string;
  contactPreference?: ContactPreference;
  leadSource?: string;
  tripPlan?: TripPlanRouteRequest[];
};

function isValidEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}

export async function POST(req: Request) {
  let requestRecord: ReceivedRequest | null = null;
  let requestSaved = false;

  try {
    const body = (await req.json()) as ItineraryRequest;
    const name = body.name?.trim() ?? "";
    const email = body.email?.trim() ?? "";
    const phone = body.phone?.trim() ?? "";
    const travelers = body.travelers?.trim() ?? "Not specified";
    const tripLength = body.tripLength?.trim() ?? "Not specified";
    const tripStyle = body.tripStyle?.trim() ?? "";
    const budget = body.budget?.trim() ?? "Not specified";
    const travelDate = body.travelDate?.trim() ?? "Not specified";
    const message = body.message?.trim() ?? "No additional details provided.";
    const journey = body.journey?.trim() ?? "";
    const journeySlug = body.journeySlug?.trim() ?? "";
    const stay = body.stay?.trim() ?? "";
    const staySlug = body.staySlug?.trim() ?? "";
    const stayCategory = body.stayCategory?.trim() ?? "";
    const contactPreference = body.contactPreference?.trim() as ContactPreference | undefined;
    const leadSource = body.leadSource?.trim();
    const tripPlan = Array.isArray(body.tripPlan)
      ? body.tripPlan
          .map((route) => ({
            journey: route.journey?.trim() ?? "",
            journeySlug: route.journeySlug?.trim() ?? "",
            stays: Array.isArray(route.stays)
              ? route.stays
                  .map((selectedStay) => ({
                    title: selectedStay.title?.trim() ?? "",
                    slug: selectedStay.slug?.trim() ?? "",
                    category: selectedStay.category?.trim() ?? "",
                  }))
                  .filter((selectedStay) => selectedStay.title || selectedStay.slug)
              : [],
          }))
          .filter((route) => route.journey)
      : [];

    if (!name || !email) {
      return NextResponse.json(
        {
          success: false,
          error: "Please add your name and email so we can reply.",
        },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          error: "Please add a valid email address.",
        },
        { status: 400 }
      );
    }

    if (!contactPreference || !allowedContactPreferences.has(contactPreference)) {
      return NextResponse.json(
        {
          success: false,
          error: "Please choose how you want us to contact you.",
        },
        { status: 400 }
      );
    }

    if (tripStyle && !isTripStyleValue(tripStyle)) {
      return NextResponse.json(
        {
          success: false,
          error: "Please choose a valid trip style.",
        },
        { status: 400 }
      );
    }

    if (contactPreference === "WhatsApp" && !phone) {
      return NextResponse.json(
        {
          success: false,
          error: "Please add a phone or WhatsApp number if you want us to reply there.",
        },
        { status: 400 }
      );
    }

    const resend = resendApiKey ? new Resend(resendApiKey) : null;
    const referenceId = buildLeadReference();
    const submittedAtDate = new Date();
    const submittedAtIso = submittedAtDate.toISOString();
    const submittedAt = formatLeadSubmittedAt(submittedAtDate);
    const selectedTripStyle = getTripStyleByValue(tripStyle);
    const tripStyleLabel = selectedTripStyle?.label ?? "";
    const routeCount = tripPlan.length;
    const stayCount = tripPlan.reduce(
      (total, route) => total + route.stays.length,
      0
    );
    const hasStructuredTripPlan = routeCount > 0;
    const hasJourneyAndStay = Boolean(journey && stay);
    const leadType = hasStructuredTripPlan
      ? routeCount > 1 || stayCount > 1
        ? "Trip plan inquiry"
        : stayCount === 1
          ? "Journey and accommodation inquiry"
          : "Journey inquiry"
      : hasJourneyAndStay
        ? "Journey and accommodation inquiry"
        : journey
          ? "Journey inquiry"
          : stay
            ? "Accommodation inquiry"
            : tripStyleLabel
              ? "Travel style inquiry"
            : "Custom trip inquiry";
    const leadSourceLabel =
      leadSource === "trip_plan_builder"
        ? "Trip plan builder"
        : leadSource === "journey_and_stay_flow"
          ? "Journey and stay flow"
          : leadSource === "journey_detail"
            ? "Journey detail page"
            : leadSource === "accommodation_page"
              ? "Accommodation page"
              : "Custom itinerary page";
    const followUpChannel = getFollowUpChannel(contactPreference, phone);
    const selectedRequest = hasStructuredTripPlan
      ? routeCount === 1 && stayCount === 1
        ? `${tripPlan[0].journey} + ${tripPlan[0].stays[0].title}`
        : routeCount === 1 && stayCount === 0
          ? tripPlan[0].journey
          : `${routeCount} routes / ${stayCount} stays`
      : hasJourneyAndStay
        ? `${journey} + ${stay}`
        : journey || stay || tripStyleLabel || "Custom Tanzania trip";
    const whatsappLink = buildWhatsAppUrl(
      "Hello, I just sent a trip request and would like a faster follow-up."
    );
    const customerWhatsappFollowUpLink = phone
      ? buildWhatsAppChatUrl(
          phone,
          `Hello ${name}, thank you for reaching out to ${siteConfig.name}. We received your trip request and will get back to you shortly.`
        )
      : "";
    const shouldSendTravelerEmail = contactPreference !== "WhatsApp";
    const travelerSubject = hasStructuredTripPlan
      ? "We got your Tanzania trip plan"
      : hasJourneyAndStay
        ? `We got your ${journey} and ${stay} request`
        : journey
          ? `We got your ${journey} request`
          : stay
            ? `We got your ${stay} stay request`
            : "We got your trip request";
    const travelerStepTwo = hasStructuredTripPlan || hasJourneyAndStay
      ? "2. We send a clear first route and stay plan."
      : stay
        ? "2. We send a clear stay and route suggestion."
        : "2. We send a clear first route idea.";
    const tripPlanSummary = hasStructuredTripPlan
      ? `${routeCount} route${routeCount === 1 ? "" : "s"} / ${stayCount} stay${stayCount === 1 ? "" : "s"}`
      : "Not provided";
    const tripPlanText = hasStructuredTripPlan
      ? tripPlan
          .map((route, index) => {
            const routeLines = [
              `Route ${index + 1}: ${route.journey}`,
              route.journeySlug ? `Journey slug: ${route.journeySlug}` : "Journey slug: Not provided",
            ];
            const stayLines = route.stays.length > 0
              ? route.stays.map(
                  (selectedStay, stayIndex) =>
                    `Stay ${stayIndex + 1}: ${selectedStay.title}${selectedStay.category ? ` (${selectedStay.category})` : ""}${selectedStay.slug ? ` [${selectedStay.slug}]` : ""}`
                )
              : ["No stays added to this route."];

            return [...routeLines, ...stayLines].join("\n");
          })
          .join("\n\n")
      : "";
    const tripPlanHtml = hasStructuredTripPlan
      ? tripPlan
          .map(
            (route, index) => `
              <div style="padding:18px 20px;border-radius:18px;background:#ffffff;border:1px solid #e8e1d6;margin-bottom:14px;">
                <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#9b7a3e;font-weight:700;">Route ${index + 1}</p>
                <h3 style="margin:0;color:#10251c;font-size:20px;line-height:1.4;">${escapeHtml(route.journey)}</h3>
                <p style="margin:8px 0 0;color:#6b756f;font-size:13px;">Journey slug: ${escapeHtml(route.journeySlug || "Not provided")}</p>
                <div style="margin-top:14px;">
                  ${
                    route.stays.length > 0
                      ? route.stays
                          .map(
                            (selectedStay) => `
                              <div style="padding:12px 14px;border-radius:14px;background:#f8f4ec;border:1px solid #e8e1d6;margin-top:10px;">
                                <p style="margin:0;color:#10251c;font-weight:600;">${escapeHtml(selectedStay.title)}</p>
                                <p style="margin:6px 0 0;color:#6b756f;font-size:13px;">Category: ${escapeHtml(selectedStay.category || "Not provided")} • Slug: ${escapeHtml(selectedStay.slug || "Not provided")}</p>
                              </div>
                            `
                          )
                          .join("")
                      : '<p style="margin:12px 0 0;color:#6b756f;">No stays added to this route.</p>'
                  }
                </div>
              </div>
            `
          )
          .join("")
      : "";

    const businessRows = [
      ["Reference", referenceId],
      ["Lead type", leadType],
      ["Selected request", selectedRequest],
      ["Trip style", tripStyleLabel || "Not specified"],
      ["Trip plan summary", tripPlanSummary],
      ["Submitted", submittedAt],
      ["Name", name],
      ["Email", email],
      ["Phone / WhatsApp", phone || "Not provided"],
      ["Contact preference", contactPreference],
      ["Suggested follow-up", followUpChannel],
      ["Quick WhatsApp follow-up", customerWhatsappFollowUpLink || "Not available"],
      ["Travelers", travelers],
      ["Expected trip length", tripLength],
      ["Budget", budget],
      ["Travel date", travelDate],
      ["Lead source", leadSourceLabel],
      ["Journey slug", journeySlug || "Not provided"],
      ["Stay category", stayCategory || "Not provided"],
      ["Stay slug", staySlug || "Not provided"],
    ];

    const businessTableRows = businessRows
      .map(
        ([label, value]) => `
          <tr>
            <td style="padding:10px 12px;border-bottom:1px solid #e8e1d6;font-weight:600;color:#10251c;width:220px;vertical-align:top;">${escapeHtml(label)}</td>
            <td style="padding:10px 12px;border-bottom:1px solid #e8e1d6;color:#2b3d34;">${escapeHtml(value)}</td>
          </tr>
        `
      )
      .join("");

    const businessText = [
      `New lead received`,
      `Reference: ${referenceId}`,
      `Lead type: ${leadType}`,
      `Selected request: ${selectedRequest}`,
      `Trip style: ${tripStyleLabel || "Not specified"}`,
      `Trip plan summary: ${tripPlanSummary}`,
      `Submitted: ${submittedAt}`,
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone / WhatsApp: ${phone || "Not provided"}`,
      `Contact preference: ${contactPreference}`,
      `Suggested follow-up: ${followUpChannel}`,
      `Quick WhatsApp follow-up: ${customerWhatsappFollowUpLink || "Not available"}`,
      `Travelers: ${travelers}`,
      `Expected trip length: ${tripLength}`,
      `Budget: ${budget}`,
      `Travel date: ${travelDate}`,
      `Lead source: ${leadSourceLabel}`,
      `Journey slug: ${journeySlug || "Not provided"}`,
      `Stay category: ${stayCategory || "Not provided"}`,
      `Stay slug: ${staySlug || "Not provided"}`,
      ...(hasStructuredTripPlan ? ["", "Trip plan:", tripPlanText] : []),
      "",
      "Message:",
      message,
    ].join("\n");

    const travelerSummary = [
      ["Selected request", selectedRequest],
      ["Trip style", tripStyleLabel || "Not specified"],
      ["Trip plan summary", tripPlanSummary],
      ["Contact preference", contactPreference],
      ["Travelers", travelers],
      ["Expected trip length", tripLength],
      ["Budget", budget],
      ["Travel date", travelDate],
    ];

    const travelerSummaryHtml = travelerSummary
      .map(
        ([label, value]) => `
          <tr>
            <td style="padding:8px 0;color:#6b756f;font-weight:600;width:180px;vertical-align:top;">${escapeHtml(label)}</td>
            <td style="padding:8px 0;color:#10251c;">${escapeHtml(value)}</td>
          </tr>
        `
      )
      .join("");

    const travelerText = [
      `Hi ${name},`,
      "",
      `Thank you for reaching out to ${siteConfig.name}. We received your request and will reply within 24 hours.`,
      "",
      `Selected request: ${selectedRequest}`,
      `Trip plan summary: ${tripPlanSummary}`,
      `Contact preference: ${contactPreference}`,
      `Travelers: ${travelers}`,
      `Expected trip length: ${tripLength}`,
      `Budget: ${budget}`,
      `Travel date: ${travelDate}`,
      ...(hasStructuredTripPlan ? ["", "Your trip plan:", tripPlanText] : []),
      "",
      "What happens next:",
      "1. We review your dates, travel style, and budget.",
      travelerStepTwo,
      "3. We shape it with you until it feels right.",
      "",
      `If you want to add more details, reply to this email or message us on WhatsApp: ${whatsappLink}`,
      "",
      `${siteConfig.name}`,
      siteConfig.url,
    ].join("\n");

    requestRecord = {
      referenceId,
      submittedAt: submittedAtIso,
      submittedAtLabel: submittedAt,
      leadType,
      selectedRequest,
      tripPlanSummary,
      routeCount,
      stayCount,
      tripStyle,
      tripStyleLabel,
      name,
      email,
      phone,
      travelers,
      tripLength,
      budget,
      travelDate,
      message,
      journey,
      journeySlug,
      stay,
      staySlug,
      stayCategory,
      contactPreference,
      followUpChannel,
      leadSource: leadSource ?? "custom_itinerary_page",
      leadSourceLabel,
      customerWhatsappFollowUpLink,
      deliveryStatus: shouldSendTravelerEmail
        ? "Delivered"
        : "Awaiting WhatsApp follow-up",
      leadStatus: "New",
      adminNote: "",
      lastUpdatedAt: submittedAtIso,
      tripPlan,
      quotation: buildDefaultQuotationDraft({
        referenceId,
        name,
        phone,
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
    };

    if (!resend) {
      throw new Error("Missing RESEND_API_KEY");
    }

    await resend.emails.send({
      from: `${siteConfig.name} <${fromEmail}>`,
      to: businessEmail,
      replyTo: email,
      subject: `${leadType} ${referenceId}${selectedRequest ? ` - ${selectedRequest}` : ""}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:720px;margin:0 auto;padding:24px;background:#f8f4ec;color:#10251c;">
          <div style="background:#10251c;color:#ffffff;padding:24px 28px;border-radius:24px 24px 0 0;">
            <p style="margin:0 0 10px;font-size:12px;letter-spacing:0.24em;text-transform:uppercase;color:#d9b26a;">New lead received</p>
            <h1 style="margin:0;font-size:28px;line-height:1.2;">${escapeHtml(selectedRequest)}</h1>
            <p style="margin:12px 0 0;color:#d8e2db;">Reference ${escapeHtml(referenceId)} • ${escapeHtml(leadType)}</p>
          </div>
          <div style="background:#ffffff;padding:28px;border:1px solid #e8e1d6;border-top:0;border-radius:0 0 24px 24px;">
            <p style="margin:0 0 18px;color:#4f5e56;line-height:1.7;">Reply to this email to reach the traveler directly. The lead asked for <strong>${escapeHtml(followUpChannel)}</strong>.</p>
            ${
              customerWhatsappFollowUpLink
                ? `<p style="margin:0 0 18px;"><a href="${customerWhatsappFollowUpLink}" style="display:inline-flex;padding:12px 18px;border-radius:999px;background:#128c7e;color:#ffffff;font-weight:700;text-decoration:none;">Open WhatsApp follow-up</a></p>`
                : ""
            }
            <table style="width:100%;border-collapse:collapse;margin:0 0 24px;">
              ${businessTableRows}
            </table>
            ${
              hasStructuredTripPlan
                ? `<div style="padding:20px;border-radius:18px;background:#f8f4ec;border:1px solid #e8e1d6;margin-bottom:24px;">
                    <p style="margin:0 0 14px;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#9b7a3e;font-weight:700;">Trip plan</p>
                    ${tripPlanHtml}
                  </div>`
                : ""
            }
            <div style="padding:20px;border-radius:18px;background:#f8f4ec;border:1px solid #e8e1d6;">
              <p style="margin:0 0 10px;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#9b7a3e;font-weight:700;">Message</p>
              <p style="margin:0;line-height:1.8;color:#24342c;">${formatHtmlWithBreaks(message)}</p>
            </div>
          </div>
        </div>
      `,
      text: businessText,
    });

    if (shouldSendTravelerEmail) {
      await resend.emails.send({
        from: `${siteConfig.name} <${fromEmail}>`,
        to: email,
        subject: travelerSubject,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:720px;margin:0 auto;padding:24px;background:#f8f4ec;color:#10251c;">
            <div style="background:#10251c;color:#ffffff;padding:24px 28px;border-radius:24px;">
              <p style="margin:0 0 10px;font-size:12px;letter-spacing:0.24em;text-transform:uppercase;color:#d9b26a;">Request received</p>
              <h1 style="margin:0;font-size:28px;line-height:1.2;">Hi ${escapeHtml(name)}, we got your request.</h1>
              <p style="margin:12px 0 0;color:#d8e2db;line-height:1.7;">We will review your request and get back to you shortly with a clear next step.</p>
            </div>

            <div style="background:#ffffff;padding:28px;margin-top:18px;border-radius:24px;border:1px solid #e8e1d6;">
              <p style="margin:0 0 18px;line-height:1.8;color:#24342c;">Thank you for reaching out to ${escapeHtml(siteConfig.name)}. We will review your trip details and send a clear first idea that fits your travel style.</p>
              <table style="width:100%;border-collapse:collapse;margin:0 0 24px;">
                ${travelerSummaryHtml}
              </table>

              ${
                hasStructuredTripPlan
                  ? `<div style="padding:20px;border-radius:18px;background:#f8f4ec;border:1px solid #e8e1d6;margin-bottom:24px;">
                      <p style="margin:0 0 14px;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#9b7a3e;font-weight:700;">Your trip plan</p>
                      ${tripPlanHtml}
                    </div>`
                  : ""
              }

              <div style="padding:20px;border-radius:18px;background:#f8f4ec;border:1px solid #e8e1d6;">
                <p style="margin:0 0 10px;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#9b7a3e;font-weight:700;">What happens next</p>
                <p style="margin:0 0 10px;line-height:1.8;color:#24342c;">1. We review your dates, budget, and trip style.</p>
                <p style="margin:0 0 10px;line-height:1.8;color:#24342c;">${escapeHtml(travelerStepTwo)}</p>
                <p style="margin:0;line-height:1.8;color:#24342c;">3. We shape the plan with you until it feels right.</p>
              </div>

              <p style="margin:22px 0 0;line-height:1.8;color:#24342c;">If you want to add more details, reply to this email or <a href="${whatsappLink}" style="color:#0f6d55;font-weight:600;">send us a WhatsApp message</a>.</p>
              <p style="margin:18px 0 0;line-height:1.8;color:#4f5e56;">Website: <a href="${siteConfig.url}" style="color:#0f6d55;">${siteConfig.url}</a></p>
            </div>
          </div>
        `,
        text: travelerText,
      });
    }

    if (requestRecord) {
      await saveReceivedRequest(requestRecord);
      requestSaved = true;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);

    if (requestRecord && !requestSaved) {
      try {
        await saveReceivedRequest({
          ...requestRecord,
          deliveryStatus: "Needs attention",
          deliveryError:
            error instanceof Error ? error.message : "Unknown delivery error",
        });
        requestSaved = true;
      } catch (saveError) {
        console.error(saveError);
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "We could not send your request right now. Please try again soon.",
      },
      { status: 500 }
    );
  }
}






