import {
  isTerminalLeadStatus,
  type ReceivedRequestLeadStatus,
} from "@/lib/request-pipeline";
import type { ReceivedRequestQuotationStatus } from "@/lib/request-quotation";

export type ReminderQuotationInput = {
  status: ReceivedRequestQuotationStatus;
  validUntil?: string;
  sentAt?: string;
};

export type RequestReminderInput = {
  submittedAt: string;
  lastUpdatedAt?: string;
  leadStatus: ReceivedRequestLeadStatus;
  quotation: ReminderQuotationInput;
};

export type RequestReminderSeverity = "soon" | "due" | "overdue";

export type RequestReminderMeta = {
  hasReminder: boolean;
  highestSeverity: RequestReminderSeverity | null;
  reasons: string[];
};

const QUOTATION_DRAFT_IDLE_HOURS = 24;
const QUOTATION_SENT_FOLLOW_UP_HOURS = 48;
const CLIENT_RESPONSE_FOLLOW_UP_HOURS = 72;
const QUOTATION_VALIDITY_SOON_HOURS = 48;

function getHoursFrom(dateValue: string | undefined, now: Date) {
  const timestamp = dateValue ? new Date(dateValue).getTime() : Number.NaN;

  if (Number.isNaN(timestamp)) {
    return null;
  }

  return (now.getTime() - timestamp) / (1000 * 60 * 60);
}

function getHoursUntil(dateValue: string | undefined, now: Date) {
  const timestamp = dateValue ? new Date(dateValue).getTime() : Number.NaN;

  if (Number.isNaN(timestamp)) {
    return null;
  }

  return (timestamp - now.getTime()) / (1000 * 60 * 60);
}

function pushReason(
  reasons: string[],
  severities: RequestReminderSeverity[],
  severity: RequestReminderSeverity,
  reason: string
) {
  reasons.push(reason);
  severities.push(severity);
}

export function getRequestReminderMeta(
  request: RequestReminderInput,
  now = new Date()
): RequestReminderMeta {
  const reasons: string[] = [];
  const severities: RequestReminderSeverity[] = [];

  if (isTerminalLeadStatus(request.leadStatus)) {
    return {
      hasReminder: false,
      highestSeverity: null,
      reasons,
    };
  }

  const idleHours = getHoursFrom(
    request.lastUpdatedAt || request.submittedAt,
    now
  );
  const sentHours = getHoursFrom(request.quotation.sentAt, now);
  const hoursUntilValidity = getHoursUntil(request.quotation.validUntil, now);

  if (
    request.leadStatus === "Quotation in progress" &&
    idleHours !== null &&
    idleHours >= QUOTATION_DRAFT_IDLE_HOURS
  ) {
    pushReason(
      reasons,
      severities,
      "due",
      "Quotation draft has been idle for more than 24 hours."
    );
  }

  if (
    request.leadStatus === "Quotation sent" &&
    sentHours !== null &&
    sentHours >= QUOTATION_SENT_FOLLOW_UP_HOURS
  ) {
    pushReason(
      reasons,
      severities,
      sentHours >= CLIENT_RESPONSE_FOLLOW_UP_HOURS ? "overdue" : "due",
      sentHours >= CLIENT_RESPONSE_FOLLOW_UP_HOURS
        ? "Sent quotation is overdue for a follow-up."
        : "Sent quotation should be followed up now."
    );
  }

  if (
    request.leadStatus === "Awaiting client response" &&
    idleHours !== null &&
    idleHours >= CLIENT_RESPONSE_FOLLOW_UP_HOURS
  ) {
    pushReason(
      reasons,
      severities,
      "overdue",
      "Client response follow-up is overdue."
    );
  }

  if (
    request.quotation.status === "Sent" &&
    hoursUntilValidity !== null &&
    hoursUntilValidity < 0
  ) {
    pushReason(
      reasons,
      severities,
      "overdue",
      "Quotation validity has expired."
    );
  } else if (
    request.quotation.status === "Sent" &&
    hoursUntilValidity !== null &&
    hoursUntilValidity <= QUOTATION_VALIDITY_SOON_HOURS
  ) {
    pushReason(
      reasons,
      severities,
      "soon",
      "Quotation validity will expire within 48 hours."
    );
  }

  const highestSeverity = severities.includes("overdue")
    ? "overdue"
    : severities.includes("due")
      ? "due"
      : severities.includes("soon")
        ? "soon"
        : null;

  return {
    hasReminder: reasons.length > 0,
    highestSeverity,
    reasons,
  };
}
