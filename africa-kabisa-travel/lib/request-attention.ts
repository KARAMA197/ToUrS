import {
  isTerminalLeadStatus,
  type ReceivedRequestLeadStatus,
} from "@/lib/request-pipeline";

export type AttentionDeliveryStatus =
  import("@/lib/request-inbox").ReceivedRequestDeliveryStatus;

export type AttentionLeadStatus = ReceivedRequestLeadStatus;

export type RequestAttentionInput = {
  submittedAt: string;
  lastUpdatedAt?: string;
  deliveryStatus: AttentionDeliveryStatus;
  leadStatus: AttentionLeadStatus;
  adminNote?: string;
};

const NEW_LEAD_THRESHOLD_HOURS = 24;
const QUOTATION_IN_PROGRESS_THRESHOLD_HOURS = 24;
const QUOTATION_SENT_THRESHOLD_HOURS = 48;
const AWAITING_CLIENT_RESPONSE_THRESHOLD_HOURS = 72;

function getAgeInHours(dateValue: string | undefined, now: Date) {
  const timestamp = dateValue ? new Date(dateValue).getTime() : Number.NaN;

  if (Number.isNaN(timestamp)) {
    return 0;
  }

  return (now.getTime() - timestamp) / (1000 * 60 * 60);
}

export function getRequestAttentionMeta(
  request: RequestAttentionInput,
  now = new Date()
) {
  const reasons: string[] = [];
  const ageInHours = getAgeInHours(
    request.lastUpdatedAt || request.submittedAt,
    now
  );
  const isClosedStage = isTerminalLeadStatus(request.leadStatus);
  const hasAdminNote = Boolean(request.adminNote?.trim());

  if (request.deliveryStatus === "Needs attention") {
    reasons.push("Delivery issue needs manual follow-up.");
  }

  if (!isClosedStage) {
    if (
      request.leadStatus === "New" &&
      ageInHours >= NEW_LEAD_THRESHOLD_HOURS
    ) {
      reasons.push("Still marked new after 24 hours.");
    }

    if (
      request.leadStatus === "Quotation in progress" &&
      ageInHours >= QUOTATION_IN_PROGRESS_THRESHOLD_HOURS
    ) {
      reasons.push("Quotation is still in progress after 24 hours.");
    }

    if (
      request.leadStatus === "Quotation sent" &&
      ageInHours >= QUOTATION_SENT_THRESHOLD_HOURS
    ) {
      reasons.push("Quotation was sent more than 48 hours ago.");
    }

    if (
      request.leadStatus === "Awaiting client response" &&
      ageInHours >= AWAITING_CLIENT_RESPONSE_THRESHOLD_HOURS
    ) {
      reasons.push("Still waiting for the client response after 72 hours.");
    }

    if (ageInHours >= NEW_LEAD_THRESHOLD_HOURS && !hasAdminNote) {
      reasons.push("No internal note added yet.");
    }
  }

  return {
    needsAttention: reasons.length > 0,
    reasons,
    ageInHours,
  };
}
