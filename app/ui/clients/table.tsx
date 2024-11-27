"use client";

import { lusitana } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import { Client, User } from "@/app/lib/definitions";
import Link from "next/link";
import { useState } from "react";
import ClientAddEditModal from "./detailCards/client-add-edit-modal";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

export default function ClientsTable({
  clients,
  users,
}: {
  clients: Client[];
  users: User[];
}) {
  const [showAddClientForm, setShowAddClientForm] = useState(false);
  return (
    <>
      <ClientAddEditModal
        show={showAddClientForm}
        users={users}
        handleClose={() => setShowAddClientForm(false)}
      />
      <div className="w-full">
        <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
          Clients
        </h1>
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8 w-96">
          <Search placeholder="Search anything..." />
          <PlusCircleIcon
            className="text-blue-600 h-5 px-2 cursor-pointer"
            onClick={() => {
              setShowAddClientForm(true);
            }}
          />
        </div>
        <div className="mt-6 flow-root">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
                <div>
                  {clients?.map((client) => (
                    <Link
                      href={`/home/clients/${client.id}/view`}
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
    </>
  );
}
