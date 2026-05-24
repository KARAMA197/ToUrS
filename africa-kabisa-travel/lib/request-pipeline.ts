export const requestLeadStatusOptions = [
  {
    value: "New",
    label: "New",
  },
  {
    value: "Quotation in progress",
    label: "Quotation in progress",
  },
  {
    value: "Quotation sent",
    label: "Quotation sent",
  },
  {
    value: "Awaiting client response",
    label: "Awaiting client response",
  },
  {
    value: "Won / Confirmed",
    label: "Won / Confirmed",
  },
  {
    value: "Lost / Not proceeding",
    label: "Lost / Not proceeding",
  },
] as const;

export type ReceivedRequestLeadStatus =
  (typeof requestLeadStatusOptions)[number]["value"];

const requestLeadStatusSet = new Set<ReceivedRequestLeadStatus>(
  requestLeadStatusOptions.map((status) => status.value)
);

export const terminalLeadStatuses: ReceivedRequestLeadStatus[] = [
  "Won / Confirmed",
  "Lost / Not proceeding",
];

export const requestLeadStatusPriority: Record<
  ReceivedRequestLeadStatus,
  number
> = {
  New: 0,
  "Quotation in progress": 1,
  "Quotation sent": 2,
  "Awaiting client response": 3,
  "Won / Confirmed": 4,
  "Lost / Not proceeding": 5,
};

export function isReceivedRequestLeadStatus(
  value: string | undefined | null
): value is ReceivedRequestLeadStatus {
  return Boolean(value) && requestLeadStatusSet.has(value as ReceivedRequestLeadStatus);
}

export function isTerminalLeadStatus(
  value: ReceivedRequestLeadStatus | string | undefined | null
) {
  return (
    value === "Won / Confirmed" || value === "Lost / Not proceeding"
  );
}

export function normalizeReceivedRequestLeadStatus(
  value: string | undefined | null,
  quotationStatus?: string
): ReceivedRequestLeadStatus {
  if (value === "New") {
    if (quotationStatus === "Sent") {
      return "Quotation sent";
    }

    if (quotationStatus === "Draft ready") {
      return "Quotation in progress";
    }

    return "New";
  }

  if (isReceivedRequestLeadStatus(value)) {
    return value;
  }

  if (value === "Contacted") {
    return quotationStatus === "Sent"
      ? "Quotation sent"
      : "Awaiting client response";
  }

  if (value === "Archived") {
    return "Lost / Not proceeding";
  }

  if (quotationStatus === "Sent") {
    return "Quotation sent";
  }

  if (quotationStatus === "Draft ready") {
    return "Quotation in progress";
  }

  return "New";
}
