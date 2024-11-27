"use client";

import { ClientDetails, User } from "@/app/lib/definitions";
import { useState } from "react";
import EventCard from "./detailCards/event-card";
import EventAddEditModal from "./detailCards/event-add-edit-modal";
import ClientAddEditModal from "./detailCards/client-add-edit-modal";
import ClientDeleteModal from "./detailCards/client-delete-modal";
import {
  PencilIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

export default function ClientDetailForm({
  client,
  users,
}: {
  client: ClientDetails;
  users: User[];
}) {
  const user = users.find((u) => u.id === client.user_id);
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [showEditClientForm, setShowEditClientForm] = useState(false);
  const [showDeleteClientForm, setShowDeleteClientForm] = useState(false);

  var count = 0;
  return (
    <div key={++count}>
      <div key={client.id + "_details"}>
        <EventAddEditModal
          handleClose={() => setShowAddEventForm(false)}
          show={showAddEventForm}
          users={users}
          client_id={client.id}
        />
        <ClientAddEditModal
          show={showEditClientForm}
          users={users}
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
          className={`rounded-md bg-amber-100 md:p-2 mb-1 text-red-950`}
        >
          <div className="mb-2 block text-md font-medium flex flex-row">
            <h1>
              <span className="font-bold text-2xl">{`${client?.primarypersonname}`}</span>
              {` (${user?.name}'s client)`}
            </h1>
            <PencilIcon
              className="text-red-950 h-5 pl-3 cursor-pointer"
              onClick={() => setShowEditClientForm(true)}
            />
            <PlusCircleIcon
              className="text-red-950 h-5 pl-3 cursor-pointer"
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
          {client.scheduledEvents.map((scheduledEvent) => {
            var usersForThisEvent = users.filter(
              (u) =>
                u.id === scheduledEvent.user_id ||
                u.id === scheduledEvent.seconduser_id ||
                u.id === scheduledEvent.thirduser_id
            );

            return (
              <EventCard
                key={++count}
                scheduledEvent={scheduledEvent}
                users={usersForThisEvent}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
