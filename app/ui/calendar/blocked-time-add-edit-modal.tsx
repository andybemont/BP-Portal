"use client";

import { CalendarEntry } from "@/app/lib/definitions";
import { useActionState, useEffect } from "react";
import {
  BlockedTimeFormState,
  insertBlockedTime,
  updateBlockedTime,
} from "@/app/lib/blocked-time-actions";
import TextField from "../shared/controls/text-field";
import FormModal from "../shared/form-modal";
import CheckboxField from "../shared/controls/checkbox-field";

export default function BlockedTimeAddEditModal({
  blockedTimeToEdit,
  show,
  handleClose,
}: {
  blockedTimeToEdit?: CalendarEntry;
  show: boolean;
  handleClose: (updated: boolean) => void;
}) {
  const initialState: BlockedTimeFormState = { message: null, errors: {} };
  var [state, formAction] = blockedTimeToEdit?.blockedtime_id
    ? useActionState(
        updateBlockedTime.bind(null, blockedTimeToEdit.blockedtime_id),
        initialState
      )
    : useActionState(insertBlockedTime, initialState);

  useEffect(() => {
    if (state.success) {
      state.success = false;
      handleClose(true);
    }
  }, [state]);

  return (
    show && (
      <FormModal
        formAction={formAction}
        handleClose={() => handleClose(false)}
        title={blockedTimeToEdit ? `Edit Blocked Time` : "Add Blocked Time"}
        state={state}
      >
        <div className="mb-1">
          <TextField
            caption="Title"
            field="text"
            type="text"
            defaultValue={blockedTimeToEdit?.text}
            errors={state.errors?.text}
          />
        </div>
        <div className="flex flex-row">
          <div className="mr-1 grow">
            <TextField
              caption="Start Date"
              field="start_date"
              type="date"
              defaultValue={blockedTimeToEdit?.date?.toISOString().slice(0, 10)}
              errors={state.errors?.start_date}
            />
          </div>
          <div className="ml-1 grow">
            <TextField
              caption="End Date"
              field="end_date"
              type="date"
              defaultValue={blockedTimeToEdit?.end_date
                ?.toISOString()
                .slice(0, 10)}
              errors={state.errors?.end_date}
            />
          </div>
        </div>
        <div className="flex flex-row">
          <div className="mr-2">
            <CheckboxField
              caption="Andy"
              field="andy"
              defaultValue={blockedTimeToEdit?.user_id}
            />
          </div>
          <div className="mx-2">
            <CheckboxField
              caption="Gillian"
              field="gillian"
              defaultValue={blockedTimeToEdit?.thirduser_id}
            />
          </div>
          <div className="ml-2">
            <CheckboxField
              caption="Carly"
              field="carly"
              defaultValue={blockedTimeToEdit?.seconduser_id}
            />
          </div>
        </div>
      </FormModal>
    )
  );
}
