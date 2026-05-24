import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminCookieOptions,
  getSafeAdminRedirectPath,
  isAdminAuthConfigured,
  validateAdminPassword,
} from "@/lib/admin-auth";

type AdminLoginPayload = {
  password?: string;
  next?: string;
};

export async function POST(request: Request) {
  if (!isAdminAuthConfigured()) {
    return NextResponse.json(
      { error: "Admin login is not configured yet." },
      { status: 503 }
    );
  }

  const body = (await request.json().catch(() => null)) as AdminLoginPayload | null;
  const password = body?.password?.trim() ?? "";
  const nextPath = getSafeAdminRedirectPath(body?.next);

  if (!validateAdminPassword(password)) {
    return NextResponse.json(
      { error: "The admin password is not correct." },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ success: true, next: nextPath });
  response.cookies.set(
    ADMIN_SESSION_COOKIE,
    createAdminSessionToken(),
    getAdminCookieOptions()
  );

  return response;
}
