import { fetchAllUsers, fetchFilteredClients } from "@/app/lib/data-model/data";
import ClientsTable from "@/app/ui/clients/table";
export const dynamic = "force-dynamic";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const clients = await fetchFilteredClients(query);
  const users = await fetchAllUsers();
  return (
    <main>
      <ClientsTable clients={clients} users={users} />
    </main>
  );
}
