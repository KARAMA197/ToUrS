import AdminRequestsBoard from "@/components/AdminRequestsBoard";
import { requireAdminAuth } from "@/lib/admin-auth";
import { readReceivedRequests } from "@/lib/request-inbox";

export const dynamic = "force-dynamic";

export default async function AdminRequestsPage() {
  await requireAdminAuth("/admin/requests");

  const requests = await readReceivedRequests();

  return <AdminRequestsBoard requests={requests} />;
}
