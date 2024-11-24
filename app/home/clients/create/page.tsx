import { fetchAllUsers } from "@/app/lib/data";
import ClientAddForm from "@/app/ui/clients/form/add-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Client",
};

export default async function Page() {
  const users = await fetchAllUsers();

  return (
    <main>
      <ClientAddForm users={users} />
    </main>
  );
}
