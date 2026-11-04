import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import {
  normalizeQuotationDraft,
  type QuotationRequestSource,
  type ReceivedRequestQuotation,
  type ReceivedRequestQuotationStatus,
} from "@/lib/request-quotation";
import {
  normalizeReceivedRequestLeadStatus,
  type ReceivedRequestLeadStatus,
} from "@/lib/request-pipeline";
export type { ReceivedRequestLeadStatus } from "@/lib/request-pipeline";

export type ReceivedRequestStay = {
  title: string;
  slug: string;
  category: string;
};

export type ReceivedRequestRoute = {
  journey: string;
  journeySlug: string;
  stays: ReceivedRequestStay[];
};

export type ReceivedRequestDeliveryStatus =
  | "Delivered"
  | "Email accepted"
  | "Awaiting WhatsApp follow-up"
  | "Needs attention";

export type ReceivedRequest = {
  referenceId: string;
  submittedAt: string;
  submittedAtLabel: string;
  lastUpdatedAt: string;
  leadType: string;
  selectedRequest: string;
  tripPlanSummary: string;
  routeCount: number;
  stayCount: number;
  tripStyle: string;
  tripStyleLabel: string;
  name: string;
  email: string;
  phone: string;
  travelers: string;
  tripLength: string;
  budget: string;
  travelDate: string;
  message: string;
  journey: string;
  journeySlug: string;
  stay: string;
  staySlug: string;
  stayCategory: string;
  destinationTitle: string;
  destinationSlug: string;
  destinationRegion: string;
  travelMomentTitle: string;
  travelMomentSlug: string;
  travelMomentLocation: string;
  contactPreference: string;
  followUpChannel: string;
  leadSource: string;
  leadSourceLabel: string;
  customerWhatsappFollowUpLink: string;
  deliveryStatus: ReceivedRequestDeliveryStatus;
  leadStatus: ReceivedRequestLeadStatus;
  adminNote: string;
  deliveryError?: string;
  tripPlan: ReceivedRequestRoute[];
  quotation: ReceivedRequestQuotation;
};

const configuredRequestsFilePath = process.env.RECEIVED_REQUESTS_FILE_PATH?.trim();
export const receivedRequestsFilePath = configuredRequestsFilePath
  ? path.resolve(configuredRequestsFilePath)
  : path.join(process.cwd(), ".local-data", "received-requests.json");
const dataDirectory = path.dirname(receivedRequestsFilePath);

function normalizeReceivedRequest(request: ReceivedRequest) {
  const quotationSource: QuotationRequestSource = {
    referenceId: request.referenceId,
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

  return {
    ...request,
    lastUpdatedAt: request.lastUpdatedAt || request.submittedAt,
    leadStatus: normalizeReceivedRequestLeadStatus(
      request.leadStatus,
      request.quotation?.status
    ),
    adminNote: request.adminNote ?? "",
    tripLength: request.tripLength ?? "Not specified",
    tripStyle: request.tripStyle ?? "",
    tripStyleLabel: request.tripStyleLabel ?? "",
    destinationTitle: request.destinationTitle ?? "",
    destinationSlug: request.destinationSlug ?? "",
    destinationRegion: request.destinationRegion ?? "",
    travelMomentTitle: request.travelMomentTitle ?? "",
    travelMomentSlug: request.travelMomentSlug ?? "",
    travelMomentLocation: request.travelMomentLocation ?? "",
    quotation: normalizeQuotationDraft(quotationSource, request.quotation),
  };
}

export async function readReceivedRequests() {
  try {
    const file = await fs.readFile(receivedRequestsFilePath, "utf8");
    const parsed = JSON.parse(file) as ReceivedRequest[];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map((request) => normalizeReceivedRequest(request));
  } catch {
    return [];
  }
}

async function writeReceivedRequests(requests: ReceivedRequest[]) {
  await fs.mkdir(dataDirectory, { recursive: true });
  await fs.writeFile(
    receivedRequestsFilePath,
    `${JSON.stringify(requests, null, 2)}\n`,
    "utf8"
  );
}

export async function saveReceivedRequest(request: ReceivedRequest) {
  const existingRequests = await readReceivedRequests();
  const nextRequests = [normalizeReceivedRequest(request), ...existingRequests].slice(
    0,
    300
  );

  await writeReceivedRequests(nextRequests);

  return request;
}

export async function findReceivedRequest(referenceId: string) {
  const requests = await readReceivedRequests();

  return requests.find((request) => request.referenceId === referenceId) ?? null;
}

export async function updateReceivedRequest(
  referenceId: string,
  updates: {
    leadStatus?: ReceivedRequestLeadStatus;
    adminNote?: string;
    quotation?: Partial<ReceivedRequestQuotation> & {
      status?: ReceivedRequestQuotationStatus;
    };
  }
) {
  const existingRequests = await readReceivedRequests();
  let updatedRequest: ReceivedRequest | null = null;

  const nextRequests = existingRequests.map((request) => {
    if (request.referenceId !== referenceId) {
      return request;
    }

    const quotationSource: QuotationRequestSource = {
      referenceId: request.referenceId,
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

    updatedRequest = normalizeReceivedRequest({
      ...request,
      leadStatus: updates.leadStatus ?? request.leadStatus,
      adminNote: updates.adminNote ?? request.adminNote,
      quotation: updates.quotation
        ? normalizeQuotationDraft(quotationSource, {
            ...request.quotation,
            ...updates.quotation,
          })
        : request.quotation,
      lastUpdatedAt: new Date().toISOString(),
    });

    return updatedRequest;
  });

  if (!updatedRequest) {
    return null;
  }

  await writeReceivedRequests(nextRequests);

  return updatedRequest;
}
