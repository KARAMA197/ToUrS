import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import {
  getContentStudioSection,
  isContentStudioEnabled,
  isContentStudioSectionKey,
} from "@/content-studio";
import { isAdminRequestAuthenticated } from "@/lib/admin-auth";

type ContentStudioApiRouteProps = {
  params: Promise<{ section: string }>;
};

function ensureAdminApiAccess(request: Request) {
  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Admin sign in is required." }, { status: 401 });
  }

  return null;
}

function revalidateSection(section: string) {
  revalidatePath("/admin");
  revalidatePath(`/admin/${section}`);
  revalidatePath("/content-studio");
  revalidatePath(`/content-studio/${section}`);

  if (section === "homepage") {
    revalidatePath("/");
    return;
  }

  if (section === "journeys") {
    revalidatePath("/");
    revalidatePath("/journeys");
    revalidatePath("/custom-itinerary");
    revalidatePath("/sitemap.xml");
    return;
  }

  if (section === "travel-guides") {
    revalidatePath("/travel-guides");
    revalidatePath("/sitemap.xml");
    return;
  }

  if (section === "brand-pages") {
    revalidatePath("/", "layout");
    revalidatePath("/about");
    revalidatePath("/contact");
    revalidatePath("/before-you-book");
    revalidatePath("/sitemap.xml");
    revalidatePath("/traveler-proof");
    return;
  }

  if (section === "traveler-proofs") {
    revalidatePath("/traveler-proof");
    revalidatePath("/sitemap.xml");
  }
}

export async function GET(
  request: Request,
  { params }: ContentStudioApiRouteProps
) {
  if (!isContentStudioEnabled()) {
    return NextResponse.json({ error: "Content studio is not enabled." }, { status: 403 });
  }

  const unauthorizedResponse = ensureAdminApiAccess(request);

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  const { section } = await params;

  if (!isContentStudioSectionKey(section)) {
    return NextResponse.json({ error: "Content section not found." }, { status: 404 });
  }

  const currentSection = getContentStudioSection(section);
  const content = await currentSection.read();

  return NextResponse.json({ content });
}

export async function PUT(
  request: Request,
  { params }: ContentStudioApiRouteProps
) {
  if (!isContentStudioEnabled()) {
    return NextResponse.json({ error: "Content studio is not enabled." }, { status: 403 });
  }

  const unauthorizedResponse = ensureAdminApiAccess(request);

  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  const { section } = await params;

  if (!isContentStudioSectionKey(section)) {
    return NextResponse.json({ error: "Content section not found." }, { status: 404 });
  }

  try {
    const payload = await request.json();
    const currentSection = getContentStudioSection(section);
    const content = await currentSection.write(payload);

    revalidateSection(section);

    return NextResponse.json({ content });
  } catch {
    return NextResponse.json(
      { error: "The content payload could not be saved." },
      { status: 400 }
    );
  }
}
