"use client";

import { ScheduledEvent, User } from "@/app/lib/definitions";
import { useActionState, useState } from "react";
import { createEvent, EventFormState, updateEvent } from "@/app/lib/actions";
import UserPicker from "../form/controls/user-picker";
import TextField from "../form/controls/text-field";
import NotesField from "../form/controls/notes-field";
import CheckboxField from "../form/controls/checkbox-field";
import TypePicker from "../form/controls/type-picker";

export default function EventAddEditModal({
  eventToEdit,
  users,
  show,
  handleClose,
  client_id,
}: {
  eventToEdit?: ScheduledEvent;
  users: User[];
  show: boolean;
  handleClose: () => void;
  client_id: string;
}) {
  const initialState: EventFormState = { message: null, errors: {} };
  var [state, formAction] = eventToEdit
    ? useActionState(updateEvent.bind(null, eventToEdit.id), initialState)
    : useActionState(createEvent, initialState);
  var [type, setType] = useState(eventToEdit ? eventToEdit.type : "Shoot");

  return (
    show && (
      <form action={formAction}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-70 overflow-y-auto h-screen w-screen flex items-center justify-center">
          <div className="m-1 border w-full shadow-lg rounded-md bg-white max-w-[600px]">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900">
                {eventToEdit ? `Edit ${eventToEdit.type}` : "Add Event"}
              </h3>
              <div className="m-0 p-0">
                <div
                  className={`rounded-md bg-gray-50 md:p-2 placeholder:text-gray-500 text-black`}
                >
                  {/* Save client ID in a hidden field */}
                  <input
                    id="client_id"
                    name="client_id"
                    type="hidden"
                    defaultValue={client_id}
                  />

                  {/* Only show type on add, otherwise it's in a hidden field */}
                  {!eventToEdit && (
                    <div className="mb-1">
                      <TypePicker
                        defaultValue={type}
                        onPick={(t) => setType(t)}
                      />
                    </div>
                  )}
                  {eventToEdit && (
                    <input
                      id="type"
                      name="type"
                      type="hidden"
                      defaultValue={type}
                    />
                  )}

                  {/* Always show date */}
                  <div className="mb-1 w-[150px]">
                    <TextField
                      caption="Date"
                      field="date"
                      type="date"
                      defaultValue={eventToEdit?.date
                        ?.toISOString()
                        .slice(0, 10)}
                      errors={state.errors?.date}
                    />
                  </div>

                  {/* Always show primary photographer */}
                  <div className="mb-1">
                    <UserPicker
                      users={users}
                      errors={state?.errors?.user_id}
                      caption="Primary person"
                      defaultValue={eventToEdit?.user_id}
                    />
                  </div>

                  {/* Wedding-only fields */}
                  {type === "Wedding" && (
                    <>
                      <div className="mb-1">
                        <UserPicker
                          users={users}
                          errors={state?.errors?.seconduser_id}
                          caption="Second photographer"
                          defaultValue={eventToEdit?.seconduser_id}
                        />
                      </div>
                      <div className="mb-1">
                        <UserPicker
                          users={users}
                          errors={state?.errors?.thirduser_id}
                          caption="Third photographer"
                          defaultValue={eventToEdit?.thirduser_id}
                        />
                      </div>
                      <div className="mb-1">
                        <TextField
                          caption="City/Town"
                          field="location"
                          type="text"
                          defaultValue={eventToEdit?.location}
                          errors={state.errors?.location}
                        />
                      </div>
                      <div className="mb-1">
                        <TextField
                          caption="Reception venue"
                          field="location2"
                          type="text"
                          defaultValue={eventToEdit?.location2}
                          errors={state.errors?.location2}
                        />
                      </div>
                      <div className="mb-1">
                        <TextField
                          caption="Addl. location"
                          field="location3"
                          type="text"
                          defaultValue={eventToEdit?.location3}
                          errors={state.errors?.location3}
                        />
                      </div>
                      <div className="mb-1">
                        <TextField
                          caption="Addl. location"
                          field="location4"
                          type="text"
                          defaultValue={eventToEdit?.location4}
                          errors={state.errors?.location4}
                        />
                      </div>
                      <div className="mb-1">
                        <TextField
                          caption="Duration (hours)"
                          field="duration"
                          type="text"
                          defaultValue={eventToEdit?.duration}
                          errors={state.errors?.duration}
                        />
                      </div>
                      <div className="mb-1">
                        <TextField
                          caption="Number of photographers"
                          field="numphotographers"
                          type="text"
                          defaultValue={eventToEdit?.numphotographers}
                          errors={state.errors?.numphotographers}
                        />
                      </div>
                      <div className="mb-1">
                        <CheckboxField
                          caption="Engagement session?"
                          field="engagementsession"
                          defaultValue={eventToEdit?.engagementsession}
                        />
                      </div>
                      <div className="mb-1">
                        <CheckboxField
                          caption="Priority editing?"
                          field="priorityediting"
                          defaultValue={eventToEdit?.priorityediting}
                        />
                      </div>
                    </>
                  )}

                  {/* Weddings don't have a title */}
                  {type !== "Wedding" && (
                    <div className="mb-1">
                      <TextField
                        caption="Title"
                        field="title"
                        type="text"
                        defaultValue={eventToEdit?.title}
                        errors={state.errors?.title}
                      />
                    </div>
                  )}

                  {/* Cost and gallery don't apply to meetings */}
                  {type !== "Meeting" && (
                    <>
                      <div className="mb-1">
                        <TextField
                          caption="Cost ($)"
                          field="cost"
                          type="text"
                          defaultValue={eventToEdit?.cost}
                          errors={state.errors?.cost}
                        />
                      </div>
                      <div className="mb-1">
                        <TextField
                          caption="Gallery"
                          field="pixieseturl"
                          type="text"
                          defaultValue={eventToEdit?.pixieseturl}
                          errors={state.errors?.pixieseturl}
                        />
                      </div>
                    </>
                  )}
                  <div className="mb-1">
                    <NotesField
                      defaultValue={eventToEdit?.notes}
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
