import { fetchAllUsers, fetchClientDetailsById } from "@/app/lib/data";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ClientDetailForm from "@/app/ui/clients/details";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Client",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const client = await fetchClientDetailsById(id);
  const users = await fetchAllUsers();

  if (!client) {
    notFound();
  }

  return (
    <main>
      <ClientDetailForm client={client} users={users} />
    </main>
  );
}
