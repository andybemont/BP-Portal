"use client";

import { ClientDetails, User } from "@/app/lib/definitions";
import {
  PencilIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import EventAddEditModal from "./event-add-edit-modal";
import ClientAddEditModal from "./client-add-edit-modal";
import ClientDeleteModal from "./client-delete-modal";

export default function ClientDetailCard({
  client,
  user,
  allUsers,
}: {
  client: ClientDetails;
  user?: User;
  allUsers: User[];
}) {
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [showEditClientForm, setShowEditClientForm] = useState(false);
  const [showDeleteClientForm, setShowDeleteClientForm] = useState(false);

  return (
    <div key={client.id + "_details"}>
      <EventAddEditModal
        handleClose={() => setShowAddEventForm(false)}
        show={showAddEventForm}
        users={allUsers}
        client_id={client.id}
      />
      <ClientAddEditModal
        show={showEditClientForm}
        users={allUsers}
        clientToEdit={client}
        handleClose={() => setShowEditClientForm(false)}
      />
      <ClientDeleteModal
        show={showDeleteClientForm}
        client={client}
        handleClose={() => setShowDeleteClientForm(false)}
      />
      <div
        key={"client"}
        className={`rounded-md bg-slate-200 md:p-2 mb-1 placeholder:text-gray-500 text-black`}
      >
        <div className="mb-2 block text-md font-medium flex flex-row">
          <p>
            <span className="font-bold">{`${client?.primarypersonname}`}</span>
            {` (${user?.name}'s client)`}
          </p>
          <PencilIcon
            className="text-blue-600 h-5 pl-3 cursor-pointer"
            onClick={() => setShowEditClientForm(true)}
          />
          <PlusCircleIcon
            className="text-blue-600 h-5 pl-3 cursor-pointer"
            onClick={() => {
              setShowAddEventForm(true);
            }}
          />
          <TrashIcon
            className="text-red-600 h-5 pl-3 cursor-pointer"
            onClick={() => {
              setShowDeleteClientForm(true);
            }}
          />
        </div>
        {client?.primarypersonemail && (
          <p>
            <span className="font-bold">Email:</span>{" "}
            {client?.primarypersonemail}
          </p>
        )}
        {client?.primarypersonphone && (
          <p>
            <span className="font-bold">Phone:</span>{" "}
            {client?.primarypersonphone}
          </p>
        )}
        {client?.notes && (
          <p className="border-t-2 border-slate-600 whitespace-pre text-wrap overflow-y-auto text-sm">
            <span className="font-bold">Notes:</span> {client?.notes}
          </p>
        )}
      </div>
    </div>
  );
}
