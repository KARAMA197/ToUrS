import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/AdminLoginForm";
import {
  getSafeAdminRedirectPath,
  isAdminAuthConfigured,
  isAdminAuthenticated,
} from "@/lib/admin-auth";

type AdminLoginPageProps = {
  searchParams: Promise<{ next?: string | string[] }>;
};

function getSearchParamValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const resolvedSearchParams = await searchParams;
  const nextPath = getSafeAdminRedirectPath(
    getSearchParamValue(resolvedSearchParams.next)
  );

  if (await isAdminAuthenticated()) {
    redirect(nextPath);
  }

  return <AdminLoginForm isConfigured={isAdminAuthConfigured()} />;
}
