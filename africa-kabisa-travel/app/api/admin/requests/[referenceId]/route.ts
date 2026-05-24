import { NextResponse } from "next/server";
import { isAdminRequestAuthenticated } from "@/lib/admin-auth";
import {
  updateReceivedRequest,
  type ReceivedRequestLeadStatus,
} from "@/lib/request-inbox";
import {
  isReceivedRequestLeadStatus,
  requestLeadStatusOptions,
} from "@/lib/request-pipeline";

type AdminRequestUpdateRouteProps = {
  params: Promise<{ referenceId: string }>;
};

type AdminRequestUpdatePayload = {
  leadStatus?: ReceivedRequestLeadStatus;
  adminNote?: string;
};

const allowedStatuses = new Set<ReceivedRequestLeadStatus>(
  requestLeadStatusOptions.map((status) => status.value)
);

function ensureAdminApiAccess(request: Request) {
  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json(
      { error: "Admin sign in is required." },
      { status: 401 }
    );
  }

  return null;
}

export async function PATCH(
  request: Request,
  { params }: AdminRequestUpdateRouteProps
) {
  const unauthorizedResponse = ensureAdminApiAccess(request);

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  const payload = (await request.json().catch(() => null)) as
    | AdminRequestUpdatePayload
    | null;
  const leadStatus = payload?.leadStatus;
  const adminNote = payload?.adminNote?.trim() ?? "";

  if (
    leadStatus &&
    (!isReceivedRequestLeadStatus(leadStatus) ||
      !allowedStatuses.has(leadStatus))
  ) {
    return NextResponse.json(
      { error: "Lead status is not valid." },
      { status: 400 }
    );
  }

  if (adminNote.length > 4000) {
    return NextResponse.json(
      { error: "Admin note is too long." },
      { status: 400 }
    );
  }

  const { referenceId } = await params;
  const updatedRequest = await updateReceivedRequest(referenceId, {
    leadStatus,
    adminNote,
  });

  if (!updatedRequest) {
    return NextResponse.json(
      { error: "Request not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({ request: updatedRequest });
}
