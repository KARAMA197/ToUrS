import { NextResponse } from "next/server";
import { Resend } from "resend";
import { requireEmailAccepted } from "@/lib/email-delivery";
import { isAdminRequestAuthenticated } from "@/lib/admin-auth";
import {
  buildQuotationEmailHtml,
  buildQuotationEmailText,
  normalizeQuotationDraft,
  type QuotationRequestSource,
} from "@/lib/request-quotation";
import {
  findReceivedRequest,
  type ReceivedRequest,
  updateReceivedRequest,
} from "@/lib/request-inbox";
import { isTerminalLeadStatus } from "@/lib/request-pipeline";
import { siteConfig } from "@/lib/site";

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
const businessEmail =
  process.env.CONTACT_EMAIL ?? process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "";

type AdminRequestQuotationRouteProps = {
  params: Promise<{ referenceId: string }>;
};

type AdminRequestQuotationPayload = {
  subject?: string;
  quotedAmount?: string;
  validUntil?: string;
  priceSummary?: string;
  body?: string;
  includedItems?: string;
  excludedItems?: string;
  importantNotes?: string;
  preparedBy?: string;
};

function ensureAdminApiAccess(request: Request) {
  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Admin sign in is required." }, { status: 401 });
  }

  return null;
}

function validateQuotationPayload(payload: AdminRequestQuotationPayload | null) {
  const subject = payload?.subject?.trim();
  const quotedAmount = payload?.quotedAmount?.trim();
  const validUntil = payload?.validUntil?.trim();
  const priceSummary = payload?.priceSummary?.trim();
  const body = payload?.body?.trim();
  const includedItems = payload?.includedItems?.trim();
  const excludedItems = payload?.excludedItems?.trim();
  const importantNotes = payload?.importantNotes?.trim();
  const preparedBy = payload?.preparedBy?.trim();

  if (subject && subject.length > 160) {
    return "Quotation subject is too long.";
  }

  if (quotedAmount && quotedAmount.length > 240) {
    return "Quoted amount is too long.";
  }

  if (validUntil && validUntil.length > 40) {
    return "Valid until is too long.";
  }

  if (priceSummary && priceSummary.length > 400) {
    return "Price summary is too long.";
  }

  if (body && body.length > 8000) {
    return "Quotation note is too long.";
  }

  if (includedItems && includedItems.length > 4000) {
    return "Included items are too long.";
  }

  if (excludedItems && excludedItems.length > 4000) {
    return "Excluded items are too long.";
  }

  if (importantNotes && importantNotes.length > 4000) {
    return "Important notes are too long.";
  }

  if (preparedBy && preparedBy.length > 120) {
    return "Prepared by is too long.";
  }

  return null;
}

function buildQuotationSource(
  referenceId: string,
  request: ReceivedRequest
): QuotationRequestSource {
  return {
    referenceId,
    name: request.name,
    phone: request.phone,
    selectedRequest: request.selectedRequest,
    travelers: request.travelers,
    tripLength: request.tripLength ?? "Not specified",
    tripStyleLabel: request.tripStyleLabel ?? "",
    budget: request.budget,
    travelDate: request.travelDate,
    contactPreference: request.contactPreference,
    tripPlanSummary: request.tripPlanSummary,
    tripPlan: request.tripPlan,
  };
}

export async function PATCH(
  request: Request,
  { params }: AdminRequestQuotationRouteProps
) {
  const unauthorizedResponse = ensureAdminApiAccess(request);

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  const payload = (await request.json().catch(() => null)) as
    | AdminRequestQuotationPayload
    | null;
  const payloadError = validateQuotationPayload(payload);

  if (payloadError) {
    return NextResponse.json({ error: payloadError }, { status: 400 });
  }

  const { referenceId } = await params;
  const requestRecord = await findReceivedRequest(referenceId);

  if (!requestRecord) {
    return NextResponse.json({ error: "Request not found." }, { status: 404 });
  }

  const now = new Date().toISOString();
  const source = buildQuotationSource(referenceId, requestRecord);
  const quotation = normalizeQuotationDraft(source, {
    ...requestRecord.quotation,
    subject: payload?.subject,
    quotedAmount: payload?.quotedAmount,
    validUntil: payload?.validUntil,
    priceSummary: payload?.priceSummary,
    body: payload?.body,
    includedItems: payload?.includedItems,
    excludedItems: payload?.excludedItems,
    importantNotes: payload?.importantNotes,
    preparedBy: payload?.preparedBy,
    status: "Draft ready",
    lastPreparedAt: now,
    sentAt: requestRecord.quotation.sentAt,
  });

  const updatedRequest = await updateReceivedRequest(referenceId, {
    leadStatus: isTerminalLeadStatus(requestRecord.leadStatus)
      ? requestRecord.leadStatus
      : "Quotation in progress",
    quotation,
  });

  if (!updatedRequest) {
    return NextResponse.json({ error: "Request not found." }, { status: 404 });
  }

  return NextResponse.json({ request: updatedRequest });
}

export async function POST(
  request: Request,
  { params }: AdminRequestQuotationRouteProps
) {
  const unauthorizedResponse = ensureAdminApiAccess(request);

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  const payload = (await request.json().catch(() => null)) as
    | AdminRequestQuotationPayload
    | null;
  const payloadError = validateQuotationPayload(payload);

  if (payloadError) {
    return NextResponse.json({ error: payloadError }, { status: 400 });
  }

  const { referenceId } = await params;
  const requestRecord = await findReceivedRequest(referenceId);

  if (!requestRecord) {
    return NextResponse.json({ error: "Request not found." }, { status: 404 });
  }

  if (requestRecord.contactPreference === "WhatsApp") {
    return NextResponse.json(
      {
        error:
          "This traveler asked for WhatsApp first. Open the quotation in WhatsApp instead of sending it by email.",
      },
      { status: 400 }
    );
  }

  if (!resendApiKey) {
    return NextResponse.json(
      { error: "Quotation email delivery is not configured yet." },
      { status: 500 }
    );
  }

  if (!businessEmail) {
    return NextResponse.json(
      { error: "Business reply email is not configured yet." },
      { status: 500 }
    );
  }

  const resend = new Resend(resendApiKey);
  const now = new Date().toISOString();
  const source = buildQuotationSource(referenceId, requestRecord);
  const quotation = normalizeQuotationDraft(source, {
    ...requestRecord.quotation,
    subject: payload?.subject,
    quotedAmount: payload?.quotedAmount,
    validUntil: payload?.validUntil,
    priceSummary: payload?.priceSummary,
    body: payload?.body,
    includedItems: payload?.includedItems,
    excludedItems: payload?.excludedItems,
    importantNotes: payload?.importantNotes,
    preparedBy: payload?.preparedBy,
    status: "Sent",
    lastPreparedAt: now,
    sentAt: now,
  });

  let emailId: string;
  try {
    const result = await resend.emails.send({
      from: `${siteConfig.name} <${fromEmail}>`,
      to: requestRecord.email,
      replyTo: businessEmail,
      subject: quotation.subject,
      html: buildQuotationEmailHtml(source, quotation),
      text: buildQuotationEmailText(source, quotation),
    });
    emailId = requireEmailAccepted(result);
  } catch (error) {
    console.error("Quotation email submission was not confirmed", error);
    return NextResponse.json(
      { error: "The email service did not confirm acceptance. The quotation status has not changed. Check the email service before retrying." },
      { status: 502 }
    );
  }

  try {
    const updatedRequest = await updateReceivedRequest(referenceId, {
      leadStatus: isTerminalLeadStatus(requestRecord.leadStatus)
        ? requestRecord.leadStatus
        : "Quotation sent",
      quotation,
    });

    if (!updatedRequest) {
      throw new Error("Request was no longer available when saving quotation status.");
    }

    return NextResponse.json({ request: updatedRequest, sent: true, emailAccepted: true, emailId });
  } catch (error) {
    console.error("Quotation email accepted but status could not be saved", error);
    return NextResponse.json(
      {
        emailAccepted: true,
        emailId,
        error: "The email service accepted this quotation, but its status could not be saved. Do not resend it; check the email service and resolve the inbox storage issue first.",
      },
      { status: 503 }
    );
  }
}
