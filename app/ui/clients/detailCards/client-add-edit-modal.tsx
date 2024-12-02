"use client";

import { Client, User } from "@/app/lib/definitions";
import { useActionState } from "react";
import {
  ClientFormState,
  createClient,
  updateClient,
} from "@/app/lib/client-actions";
import UserPicker from "../../shared/controls/user-picker";
import TextField from "../../shared/controls/text-field";
import NotesField from "../../shared/controls/notes-field";
import FormModal from "../../shared/form-modal";

export default function ClientAddEditModal({
  clientToEdit,
  users,
  show,
  handleClose,
}: {
  clientToEdit?: Client;
  users: User[];
  show: boolean;
  handleClose: () => void;
}) {
  const initialState: ClientFormState = { message: null, errors: {} };
  var [state, formAction] = clientToEdit
    ? useActionState(updateClient.bind(null, clientToEdit.id), initialState)
    : useActionState(createClient, initialState);

  return (
    show && (
      <FormModal
        formAction={formAction}
        handleClose={handleClose}
        title={clientToEdit ? `Edit Client` : "Add Client"}
        state={state}
      >
        {/* User */}
        <div className="mb-1">
          <UserPicker
            field="user_id"
            users={users}
            errors={state?.errors?.user_id}
            caption="Main contact"
            defaultValue={clientToEdit?.user_id}
            showUnassigned
          />
        </div>

        {/* Contact */}
        <div className="mb-1 w-full">
          <div className="grow">
            <TextField
              caption="Name"
              field="primarypersonname"
              type="text"
              defaultValue={clientToEdit?.primarypersonname}
              errors={state.errors?.primarypersonname}
            />
          </div>
          <div className="grow">
            <TextField
              caption="Email"
              field="primarypersonemail"
              type="email"
              defaultValue={clientToEdit?.primarypersonemail}
              errors={state.errors?.primarypersonemail}
            />
          </div>
          <div className="grow">
            <TextField
              caption="Phone"
              field="primarypersonphone"
              type="text"
              defaultValue={clientToEdit?.primarypersonphone}
              errors={state.errors?.primarypersonphone}
            />
          </div>
          <div className="mb-1">
            <NotesField
              defaultValue={clientToEdit?.notes}
              errors={state.errors?.notes}
            />
          </div>
        </div>
      </FormModal>
    )
  );
}
