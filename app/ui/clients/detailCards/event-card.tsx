"use client";

import { Event, User } from "@/app/lib/definitions";
import {
  PencilIcon,
  TrashIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import EventAddEditModal from "./event-add-edit-modal";
import EventDeleteModal from "./event-delete-modal";

const colors = {
  complete: "text-black/70 bg-black/30",
  active: "bg-white/50",
};
export default function EventCard({
  event,
  users,
}: {
  event: Event;
  users: User[];
}) {
  const [expanded, setExpanded] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteEventForm, setShowDeleteEventForm] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const inThePast = event.date && event.date < new Date();
  const delivered = event.pixieseturl;
  var usersForThisEvent = users.filter(
    (u) =>
      u.id === event.user_id ||
      u.id === event.seconduser_id ||
      u.id === event.thirduser_id
  );

  var bgColor = "";
  if (event.type === "Meeting") {
    bgColor = inThePast ? colors.complete : colors.active;
  } else {
    bgColor = delivered ? colors.complete : colors.active;
  }

  return (
    <>
      <EventDeleteModal
        show={showDeleteEventForm}
        event={event}
        handleClose={() => setShowDeleteEventForm(false)}
      />
      <EventAddEditModal
        handleClose={() => setShowEditForm(false)}
        show={showEditForm}
        users={users}
        client_id={event.client_id}
        eventToEdit={event}
      />
      <div
        key={event.id}
        className={`rounded-md ${bgColor} p-1 my-1 border border-black`}
      >
        <div className="block text-md font-medium">
          <div className="flex flex-row">
            <p className="font-bold" onClick={toggleExpanded}>
              {`${event.date?.toLocaleDateString() || "Unscheduled"} - ${
                event.title || event.type
              } (${
                usersForThisEvent.length > 0
                  ? usersForThisEvent.map((u) => u.name).join(", ")
                  : "Unassigned"
              })`}
            </p>
            <PencilIcon
              className="h-5 pl-2 cursor-pointer"
              onClick={() => setShowEditForm(true)}
            />
            <TrashIcon
              className="text-warning h-5 pl-2 cursor-pointer"
              onClick={() => {
                setShowDeleteEventForm(true);
              }}
            />
            <ChevronDownIcon
              className="h-5 pl-2 cursor-pointer"
              onClick={toggleExpanded}
            />
            <div className="grow cursor-pointer" onClick={toggleExpanded} />
          </div>
          {expanded && (
            <>
              {event.pixieseturl && (
                <p>
                  Gallery:{" "}
                  <a href={event.pixieseturl} className="underline">
                    {event.pixieseturl}
                  </a>
                </p>
              )}
              <p className="flex flex-row overflow-wrap">
                {event.cost && `$${event.cost}`}
              </p>
              <p>{event.duration && `${event.duration} Hours`}</p>
              <p>
                {event.engagementsession &&
                  `${event.engagementsession ? "" : "No "} Engagement Session`}
              </p>
              <p>
                {event.priorityediting &&
                  `${event.priorityediting ? "" : "No "} Priority Editing`}
              </p>
              <p>
                {event.numphotographers &&
                  `${event.numphotographers} Photographers`}
              </p>
              <p>{event.location && `City/Town: ${event.location}`}</p>
              <p>{event.location2 && `Reception Venue: ${event.location2}`}</p>
              <p>{event.location3 && `Addl. Location: ${event.location3}`}</p>
              <p>{event.location4 && `Addl. Location: ${event.location4}`}</p>
              {event.notes && (
                <p className="border-t-2 border-slate-600 whitespace-pre text-wrap overflow-y-auto text-sm">
                  {event.notes}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
