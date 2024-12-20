import {
  fetchAllEmailTemplates,
  fetchAllUsers,
} from "@/app/lib/data-model/data";
import TemplatesView from "@/app/ui/email-templates/templates-view";
export const dynamic = "force-dynamic";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const allUsers = await fetchAllUsers();
  const allTemplates = await fetchAllEmailTemplates();
  return (
    <main>
      <TemplatesView allUsers={allUsers} allTemplates={allTemplates} />
    </main>
  );
}
