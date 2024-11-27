"use client";

import { ScheduledEvent, User } from "@/app/lib/definitions";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import EventAddEditModal from "./event-add-edit-modal";
import EventDeleteModal from "./event-delete-modal";

const colors = {
  complete: "text-slate-600/70 bg-neutral-950/10",
  active: "bg-white/50",
};
export default function EventCard({
  scheduledEvent,
  users,
}: {
  scheduledEvent: ScheduledEvent;
  users: User[];
}) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteEventForm, setShowDeleteEventForm] = useState(false);

  const inThePast = scheduledEvent.date && scheduledEvent.date < new Date();
  const delivered = scheduledEvent.pixieseturl;

  var bgColor = "";
  if (scheduledEvent.type === "Meeting") {
    bgColor = inThePast ? colors.complete : colors.active;
  } else {
    bgColor = delivered ? colors.complete : colors.active;
  }

  return (
    <>
      <EventDeleteModal
        show={showDeleteEventForm}
        event={scheduledEvent}
        handleClose={() => setShowDeleteEventForm(false)}
      />
      <EventAddEditModal
        handleClose={() => setShowEditForm(false)}
        show={showEditForm}
        users={users}
        client_id={scheduledEvent.client_id}
        eventToEdit={scheduledEvent}
      />
      <div key={scheduledEvent.id} className={`rounded-md ${bgColor} p-1 my-1`}>
        <div className="block text-md font-medium">
          <div className="flex flex-row">
            <p className="font-bold">
              {`${
                scheduledEvent.date?.toLocaleDateString() || "Unscheduled"
              } - ${scheduledEvent.title || scheduledEvent.type} (${
                users.length > 0
                  ? users.map((u) => u.name).join(", ")
                  : "Unassigned"
              })`}
            </p>
            <PencilIcon
              className="h-5 pl-2 cursor-pointer"
              onClick={() => setShowEditForm(true)}
            />
            <TrashIcon
              className="text-red-600 h-5 pl-2 cursor-pointer"
              onClick={() => {
                setShowDeleteEventForm(true);
              }}
            />
          </div>
          {scheduledEvent.pixieseturl && (
            <p>
              Gallery:{" "}
              <a href={scheduledEvent.pixieseturl} className="underline">
                {scheduledEvent.pixieseturl}
              </a>
            </p>
          )}
          <p className="flex flex-row overflow-wrap">
            {scheduledEvent.cost && `$${scheduledEvent.cost}`}
          </p>
          <p>{scheduledEvent.duration && `${scheduledEvent.duration} Hours`}</p>
          <p>
            {scheduledEvent.engagementsession &&
              `${
                scheduledEvent.engagementsession ? "" : "No "
              } Engagement Session`}
          </p>
          <p>
            {scheduledEvent.priorityediting &&
              `${scheduledEvent.priorityediting ? "" : "No "} Priority Editing`}
          </p>
          <p>
            {scheduledEvent.numphotographers &&
              `${scheduledEvent.numphotographers} Photographers`}
          </p>
          <p>
            {scheduledEvent.location && `City/Town: ${scheduledEvent.location}`}
          </p>
          <p>
            {scheduledEvent.location2 &&
              `Reception Venue: ${scheduledEvent.location2}`}
          </p>
          <p>
            {scheduledEvent.location3 &&
              `Addl. Location: ${scheduledEvent.location3}`}
          </p>
          <p>
            {scheduledEvent.location4 &&
              `Addl. Location: ${scheduledEvent.location4}`}
          </p>
          {scheduledEvent.notes && (
            <p className="border-t-2 border-slate-600 whitespace-pre text-wrap overflow-y-auto text-sm">
              {scheduledEvent.notes}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
