"use client";
import { CalendarEntry } from "@/app/lib/definitions";
import Link from "next/link";
import { CheckIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { markTaskComplete, markTaskNotComplete } from "@/app/lib/data";

export default function TaskEntry({ e }: { e: CalendarEntry }) {
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

  var count = 0;
  return (
    <div
      className={`w-full text-sm rounded-md mb-2 p-1 font-medium border border-black/50 flex flex-row
        ${
          wasMarkedComplete
            ? "bg-gray/30 text-gray/70"
            : "hover:bg-pop1/80 bg-pop1/30"
        }`}
    >
      <Link key={++count} href={`./home/clients/${e.client_id}/view`}>
        <p className="">{`${e.user_name}: ${e.text} (${e.client_name})`} </p>
      </Link>
      <>
        {!wasMarkedComplete && (
          <CheckIcon
            onClick={(e) => {
              handleMarkComplete();
            }}
            className="ml-2 h-4 bg-green text-white cursor-pointer"
          ></CheckIcon>
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
              className="ml-2 cursor-pointer text-black underline"
            >
              Confirm
            </Link>
          </>
        )}
      </>
    </div>
  );
}
