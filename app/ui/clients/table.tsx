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
      <div className="w-full flow-root overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-md bg-blue/20 m-1 p-2 pb-0">
            <h1 className={`mb-2 text-xl md:text-2xl`}>Clients</h1>
            <div className="flex items-center gap-2">
              <Search placeholder="Search anything..." />
              <PlusCircleIcon
                className="h-6 px-2 cursor-pointer"
                onClick={() => {
                  setShowAddClientForm(true);
                }}
              />
            </div>
            <div className="mt-2 inline-block w-full align-middle">
              <div className="overflow-hidden py-2 md:pt-0">
                {clients?.map((client) => (
                  <Link
                    href={`/home/clients/${client.id}/view`}
                    key={client.id}
                  >
                    <p className="w-full rounded-md mb-2 p-1 hover:bg-white/50 font-medium border-black/50 border bg-transparent">
                      {client.primarypersonname}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
