"use client";

import { EmailTemplate, User } from "@/app/lib/definitions";
import { useActionState } from "react";
import {
  createTemplate,
  TemplateFormState,
  updateTemplate,
} from "@/app/lib/template-actions";
import UserPicker from "../clients/form/controls/user-picker";
import TextField from "../clients/form/controls/text-field";
import NotesField from "../clients/form/controls/notes-field";

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
      <form action={formAction}>
        <div className="z-10 fixed inset-0 bg-gray-600 bg-opacity-70 overflow-y-auto h-screen w-screen flex items-center justify-center">
          <div className="m-1 border w-full shadow-lg rounded-md bg-white max-w-[600px]">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900">
                {templateToEdit ? `Edit Template` : "Add Template"}
              </h3>
              <div className="m-0 p-0">
                <div
                  className={`rounded-md bg-gray-50 md:p-2 placeholder:text-gray-500 text-black`}
                >
                  {/* User */}
                  <div className="mb-1">
                    <UserPicker
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
