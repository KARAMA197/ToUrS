import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import {
  isContentStudioEnabled,
  readHomepageContent,
  writeHomepageContent,
} from "@/homepage-content";
import { isAdminRequestAuthenticated } from "@/lib/admin-auth";

function ensureAdminApiAccess(request: Request) {
  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Admin sign in is required." }, { status: 401 });
  }

  return null;
}

export async function GET(request: Request) {
  if (!isContentStudioEnabled()) {
    return NextResponse.json({ error: "Content studio is not enabled." }, { status: 403 });
  }

  const unauthorizedResponse = ensureAdminApiAccess(request);

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  const content = await readHomepageContent();
  return NextResponse.json({ content });
}

export async function PUT(request: Request) {
  if (!isContentStudioEnabled()) {
    return NextResponse.json({ error: "Content studio is not enabled." }, { status: 403 });
  }

  const unauthorizedResponse = ensureAdminApiAccess(request);

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const payload = await request.json();
    const content = await writeHomepageContent(payload);

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/homepage");
    revalidatePath("/content-studio");

    return NextResponse.json({ content });
  } catch {
    return NextResponse.json(
      { error: "The content payload could not be saved." },
      { status: 400 }
    );
  }
}
