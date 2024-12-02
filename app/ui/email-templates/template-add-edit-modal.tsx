"use client";

import { EmailTemplate, User } from "@/app/lib/definitions";
import { useActionState } from "react";
import {
  createTemplate,
  TemplateFormState,
  updateTemplate,
} from "@/app/lib/template-actions";
import UserPicker from "../shared/controls/user-picker";
import TextField from "../shared/controls/text-field";
import NotesField from "../shared/controls/notes-field";
import FormModal from "../shared/form-modal";

export default function TemplateAddEditModal({
  templateToEdit,
  allUsers,
  show,
  handleClose,
}: {
  templateToEdit?: EmailTemplate;
  allUsers: User[];
  show: boolean;
  handleClose: () => void;
}) {
  const initialState: TemplateFormState = { message: null, errors: {} };
  var [state, formAction] = templateToEdit
    ? useActionState(updateTemplate.bind(null, templateToEdit.id), initialState)
    : useActionState(createTemplate, initialState);

  return (
    show && (
      <FormModal
        formAction={formAction}
        handleClose={handleClose}
        title={templateToEdit ? `Edit Template` : "Add Template"}
        state={state}
      >
        {/* User */}
        <div className="mb-1">
          <UserPicker
            field="user_id"
            users={allUsers}
            errors={state?.errors?.user_id}
            caption="User"
            defaultValue={templateToEdit?.user_id}
            showUnassigned={false}
          />
        </div>

        {/* Title */}
        <div className="mb-1">
          <TextField
            caption="Title"
            field="title"
            type="text"
            defaultValue={templateToEdit?.title}
            errors={state.errors?.title}
          />
        </div>

        {/* Text */}
        <div className="mb-1">
          <NotesField
            defaultValue={templateToEdit?.text}
            errors={state.errors?.notes}
          />
        </div>

        <div aria-live="polite" aria-atomic="true">
          {state.message && state.errors && (
            <p className="my-2 text-sm text-warning">{state.message}</p>
          )}
        </div>
      </FormModal>
    )
  );
}
