"use client";

import { Task, User } from "@/app/lib/data-model/definitions";
import { useActionState, useEffect } from "react";
import UserPicker from "../../shared/controls/user-picker";
import FormModal from "../../shared/form-modal";
import { assignTask } from "@/app/lib/data-model/task-actions";

export default function TaskAssignModal({
  task,
  users,
  show,
  handleClose,
}: {
  task: { id: string; user_id?: string };
  users: User[];
  show: boolean;
  handleClose: (userId?: string) => void;
}) {
  var [state, formAction] = useActionState(assignTask.bind(null, task), {
    updated: false,
    new_user_id: undefined,
  });

  useEffect(() => {
    if (state.updated) {
      const new_user_id = state.new_user_id;
      state.updated = false;
      handleClose(new_user_id);
    }
  });

  return (
    show && (
      <FormModal
        formAction={formAction}
        handleClose={() => handleClose(task.user_id)}
        title="Assign Task"
        state={state}
      >
        {/* User */}
        <div className="mb-1">
          <UserPicker
            field="user_id"
            users={users}
            caption="Person"
            defaultValue={task.user_id}
            showUnassigned
          />
        </div>
      </FormModal>
    )
  );
}
