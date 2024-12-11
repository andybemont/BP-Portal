"use client";

import { Event, User } from "@/app/lib/data-model/definitions";
import { useActionState, useState } from "react";
import {
  createEvent,
  EventFormState,
  updateEvent,
} from "@/app/lib/data-model/event-actions";
import UserPicker from "../../shared/controls/user-picker";
import TextField from "../../shared/controls/text-field";
import NotesField from "../../shared/controls/notes-field";
import CheckboxField from "../../shared/controls/checkbox-field";
import TypePicker from "../../shared/controls/type-picker";
import FormModal from "../../shared/form-modal";

export default function EventAddEditModal({
  eventToEdit,
  users,
  show,
  handleClose,
  client_id,
}: {
  eventToEdit?: Event;
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
      <FormModal
        formAction={formAction}
        handleClose={handleClose}
        title={eventToEdit ? `Edit ${eventToEdit.type}` : "Add Event"}
        state={state}
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
            <TypePicker defaultValue={type} onPick={(t) => setType(t)} />
          </div>
        )}
        {eventToEdit && (
          <input id="type" name="type" type="hidden" defaultValue={type} />
        )}

        {/* Always show date */}
        <div className="mb-1 w-[150px]">
          <TextField
            caption="Date"
            field="date"
            type="date"
            defaultValue={eventToEdit?.date?.toISOString().slice(0, 10)}
            errors={state.errors?.date}
          />
        </div>

        {/* Always show primary photographer */}
        <div className="mb-1">
          <UserPicker
            field="user_id"
            users={users}
            errors={state?.errors?.user_id}
            caption="Primary person"
            defaultValue={eventToEdit?.user_id}
            showUnassigned
          />
        </div>

        {/* Wedding-only fields */}
        {type === "Wedding" && (
          <>
            <div className="mb-1">
              <UserPicker
                field="seconduser_id"
                users={users}
                errors={state?.errors?.seconduser_id}
                caption="Second photographer"
                defaultValue={eventToEdit?.seconduser_id}
                showUnassigned
              />
            </div>
            <div className="mb-1">
              <UserPicker
                field="thirduser_id"
                users={users}
                errors={state?.errors?.thirduser_id}
                caption="Third photographer"
                defaultValue={eventToEdit?.thirduser_id}
                showUnassigned
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
      </FormModal>
    )
  );
}
