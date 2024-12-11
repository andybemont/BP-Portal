"use client";

import { CalendarEntry, User } from "@/app/lib/data-model/definitions";
import TaskEntry from "./task-entry";
import EventEntry from "./event-entry";
import { DocumentPlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import BlockedTimeAddEditModal from "./blocked-time-add-edit-modal";
import BlockedTimeEntry from "./blocked-time-entry";
import { useRouter } from "next/navigation";

export default function EventTable({
  calendarEntries,
  allUsers,
}: {
  calendarEntries: CalendarEntry[];
  allUsers: User[];
}) {
  const [showBlockedTimeModal, setShowBlockedTimeModal] = useState(false);
  const router = useRouter();
  const onClose = (changeMade: boolean) => {
    setShowBlockedTimeModal(false);
    if (changeMade) {
      router.replace("/home");
    }
  };

  var count = 0;
  return (
    <>
      <BlockedTimeAddEditModal
        show={showBlockedTimeModal}
        handleClose={onClose}
      />
      <div className="w-full flow-root overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-md bg-green/20 m-1 p-2 pb-0">
            <div className="flex flex-row">
              <h1 className={`mb-2 text-xl md:text-2xl`}>Calendar</h1>
              <DocumentPlusIcon
                className="h-5 mt-1 px-2 cursor-pointer"
                onClick={() => {
                  setShowBlockedTimeModal(true);
                }}
              />
            </div>
            <div className="">
              {calendarEntries?.map((e) => (
                <div key={++count}>
                  {e.blockedtime_id && <BlockedTimeEntry e={e} />}
                  {e.task_id && <TaskEntry allUsers={allUsers} e={e} />}
                  {!e.task_id && !e.blockedtime_id && <EventEntry e={e} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
