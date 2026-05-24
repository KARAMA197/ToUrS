import { redirect } from "next/navigation";

type ContentStudioSectionPageProps = {
  params: Promise<{ section: string }>;
};

export default async function ContentStudioSectionPage({
  params,
}: ContentStudioSectionPageProps) {
  const { section } = await params;
  redirect(`/admin/${section}`);
}
