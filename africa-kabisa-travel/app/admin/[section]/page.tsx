import { notFound } from "next/navigation";
import ContentStudioEditor from "@/components/ContentStudioEditor";
import {
  getContentStudioSection,
  isContentStudioEnabled,
  isContentStudioSectionKey,
} from "@/content-studio";
import { requireAdminAuth } from "@/lib/admin-auth";

type AdminSectionPageProps = {
  params: Promise<{ section: string }>;
};

export default async function AdminSectionPage({
  params,
}: AdminSectionPageProps) {
  if (!isContentStudioEnabled()) {
    notFound();
  }

  const { section } = await params;

  await requireAdminAuth(`/admin/${section}`);

  if (!isContentStudioSectionKey(section)) {
    notFound();
  }

  const currentSection = getContentStudioSection(section);
  const content = await currentSection.read();

  return (
    <ContentStudioEditor
      title={currentSection.title}
      description={currentSection.description}
      filePath={currentSection.filePath}
      initialContent={content}
      saveUrl={`/api/content-studio/${currentSection.key}`}
      previewHref={currentSection.previewHref}
      previewLabel={currentSection.previewLabel}
      dashboardHref="/admin"
    />
  );
}
