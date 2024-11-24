import { lusitana } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import { Client } from "@/app/lib/definitions";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";

export default async function ClientsTable({ clients }: { clients: Client[] }) {
  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
        Clients
      </h1>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search anything..." />
        <Link
          href="/home/clients/create"
          className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <PlusIcon className="h-5" />
        </Link>
      </div>
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              <div>
                {clients?.map((client) => (
                  <Link
                    href={`/home/clients/${client.id}/edit`}
                    key={client.id}
                  >
                    <p className="mb-2 w-full rounded-md bg-white p-4 hover:underline hover:bg-orange-600">
                      {client.primarypersonname}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
