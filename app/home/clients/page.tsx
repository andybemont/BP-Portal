import { fetchFilteredClients } from "@/app/lib/data";
import ClientsTable from "@/app/ui/clients/table";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const clients = await fetchFilteredClients(query);
  return (
    <main>
      <ClientsTable clients={clients} />
    </main>
  );
}
