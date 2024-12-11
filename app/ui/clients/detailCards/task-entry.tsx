"use client";
import { Task, User } from "@/app/lib/data-model/definitions";
import { CheckIcon, UserIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import {
  markTaskComplete,
  markTaskNotComplete,
} from "@/app/lib/data-model/task-actions";
import {
  toNiceDateString,
  userNameById,
} from "@/app/lib/helpers/client-side-helpers";
import TaskAssignModal from "./task-assign-modal";

export default function TaskEntry({
  task,
  hideIfUnavailable,
  allUsers,
}: {
  task: Task;
  hideIfUnavailable: boolean;
  allUsers: User[];
}) {
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [wasMarkedComplete, setWasMarkedComplete] = useState(false);
  const handleMarkComplete = async () => {
    if (task.event_id) {
      await markTaskComplete(task.id, task.event_id);
      setWasMarkedComplete(true);
    }
  };
  const handleUndoComplete = async () => {
    if (task.event_id) {
      await markTaskNotComplete(task.id, task.event_id);
      setWasMarkedComplete(false);
    }
  };

  const isAvailable = () => {
    return (
      task &&
      !task.completed_date &&
      !wasMarkedComplete &&
      task.available_date &&
      task.available_date <= new Date()
    );
  };

  return (
    <>
      <TaskAssignModal
        task={task}
        show={showReassignModal}
        users={allUsers}
        handleClose={(new_user_id?: string) => {
          task.user_id = new_user_id;
          setShowReassignModal(false);
        }}
      />
      <div
        key={task.id}
        className={`w-full text-sm rounded-md mb-2 p-1 font-medium border border-black/50 flex flex-row
        ${
          isAvailable()
            ? "hover:bg-pop1/80 bg-pop1/30"
            : "bg-gray/30 text-gray/70"
        }
        ${hideIfUnavailable && !isAvailable() ? " hidden" : ""}`}
      >
        <p>
          {`${userNameById(task.user_id)}: ${task.name}`}
          {task.completed_date
            ? " (Completed " + toNiceDateString(task.completed_date) + ")"
            : task.available_date && !isAvailable()
            ? " (Available " + toNiceDateString(task.available_date) + ")"
            : ""}{" "}
        </p>
        {isAvailable() && (
          <>
            <CheckIcon
              onClick={(e) => {
                handleMarkComplete();
              }}
              className="ml-2 h-4 bg-green text-white cursor-pointer"
            />
            <UserIcon
              onClick={(e) => {
                setShowReassignModal(true);
              }}
              className="ml-2 h-4 bg-darkblue text-white cursor-pointer"
            />
          </>
        )}
        {wasMarkedComplete && (
          <span
            className="ml-2 cursor-pointer text-black underline"
            onClick={(e) => {
              handleUndoComplete();
            }}
          >
            Undo
          </span>
        )}
      </div>
    </>
  );
}
