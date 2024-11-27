"use client";

import { Client, User } from "@/app/lib/definitions";
import { useActionState } from "react";
import { ClientFormState, createClient, updateClient } from "@/app/lib/actions";
import UserPicker from "../form/controls/user-picker";
import TextField from "../form/controls/text-field";
import NotesField from "../form/controls/notes-field";

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
      <form action={formAction}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-70 overflow-y-auto h-screen w-screen flex items-center justify-center">
          <div className="m-1 border w-full shadow-lg rounded-md bg-white max-w-[600px]">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900">
                {clientToEdit ? `Edit Client` : "Add Client"}
              </h3>
              <div className="m-0 p-0">
                <div
                  className={`rounded-md bg-gray-50 md:p-2 placeholder:text-gray-500 text-black`}
                >
                  {/* User */}
                  <div className="mb-1">
                    <UserPicker
                      users={users}
                      errors={state?.errors?.userId}
                      caption="Main contact"
                      defaultValue={clientToEdit?.user_id}
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
                  </div>

                  {/* Notes */}
                  <div className="mb-1">
                    <NotesField
                      defaultValue={clientToEdit?.notes}
                      errors={state.errors?.notes}
                    />
                  </div>

                  <div aria-live="polite" aria-atomic="true">
                    {state.message && state.errors && (
                      <p className="my-2 text-sm text-red-500">
                        {state.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-center my-2">
                {/* Using useRouter to dismiss modal*/}
                <button
                  onClick={handleClose}
                  className="px-4 mx-1 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    )
  );
}
