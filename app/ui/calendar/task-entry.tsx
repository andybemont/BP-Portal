"use client";
import { CalendarEntry, User } from "@/app/lib/definitions";
import Link from "next/link";
import { CheckIcon, UserIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { markTaskComplete, markTaskNotComplete } from "@/app/lib/data";
import TaskAssignModal from "../clients/detailCards/task-assign-modal";
import { userNameById } from "@/app/lib/client-helpers";

export default function TaskEntry({
  e,
  allUsers,
}: {
  e: CalendarEntry;
  allUsers: User[];
}) {
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [wasMarkedComplete, setWasMarkedComplete] = useState(false);
  const handleMarkComplete = async () => {
    if (!e.task_id) {
      return;
    }
    await markTaskComplete(e.task_id, e.event_id);
    setWasMarkedComplete(true);
  };
  const handleUndoComplete = async () => {
    if (!e.task_id) {
      return;
    }
    await markTaskNotComplete(e.task_id, e.event_id);
    setWasMarkedComplete(false);
  };

  return (
    <>
      <TaskAssignModal
        task={{ id: e.task_id || "", user_id: e.user_id }}
        show={showReassignModal}
        users={allUsers}
        handleClose={(new_user_id?: string) => {
          e.user_id = new_user_id;
          setShowReassignModal(false);
        }}
      />
      <div
        key={e.task_id}
        className={`w-full text-sm rounded-md mb-2 p-1 font-medium border border-black/50 flex flex-row
        ${
          wasMarkedComplete
            ? "bg-gray/30 text-gray/70"
            : "hover:bg-pop1/80 bg-pop1/30"
        }`}
      >
        <Link href={`./home/clients/${e.client_id}/view`}>
          <p className="">
            {`${userNameById(e.user_id)}: ${e.text} (${e.client_name})`}{" "}
          </p>
        </Link>
        <>
          {!wasMarkedComplete && (
            <>
              <CheckIcon
                onClick={() => {
                  handleMarkComplete();
                }}
                className="ml-2 h-4 bg-green text-white cursor-pointer"
              ></CheckIcon>
              <UserIcon
                onClick={() => {
                  setShowReassignModal(true);
                }}
                className="ml-2 h-4 bg-darkblue text-white cursor-pointer"
              />
            </>
          )}
          {wasMarkedComplete && (
            <>
              <span
                className="ml-2 cursor-pointer text-black underline"
                onClick={(e) => {
                  handleUndoComplete();
                }}
              >
                Undo
              </span>
              <Link
                href={`./home`}
                replace
                className="ml-2 cursor-pointer text-black underline"
              >
                Confirm
              </Link>
            </>
          )}
        </>
      </div>
    </>
  );
}
