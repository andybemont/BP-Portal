"use client";

import { ClientDetails, Payment } from "@/app/lib/data-model/definitions";
import { useActionState, useEffect } from "react";
import {
  PaymentFormState,
  insertPayment,
  updatePayment,
} from "@/app/lib/data-model/payment-actions";
import TextField from "../../shared/controls/text-field";
import FormModal from "../../shared/form-modal";

export default function PaymentAddEditModal({
  client,
  paymentToEdit,
  show,
  handleClose,
}: {
  client: ClientDetails;
  paymentToEdit?: Payment;
  show: boolean;
  handleClose: (payment?: Payment) => void;
}) {
  const initialState: PaymentFormState = { payment: undefined, errors: {} };
  var [state, formAction] = paymentToEdit
    ? useActionState(updatePayment.bind(null, paymentToEdit.id), initialState)
    : useActionState(insertPayment, initialState);

  useEffect(() => {
    if (state.payment) {
      const payment = state.payment;
      state.payment = undefined;
      handleClose(payment);
    }
  });

  return (
    show && (
      <FormModal
        formAction={formAction}
        handleClose={handleClose}
        title={paymentToEdit ? `Edit Payment` : "Add Payment"}
        state={state}
      >
        <input
          id="client_id"
          name="client_id"
          type="hidden"
          defaultValue={client.id}
        />

        {/* Always show date */}
        <div className="mb-1">
          <TextField
            caption="Date"
            field="date"
            type="date"
            defaultValue={paymentToEdit?.date.toISOString().slice(0, 10)}
            errors={state.errors?.date}
          />
        </div>
        <div className="mb-1">
          <TextField
            caption="Amount ($)"
            field="amount"
            type="number"
            defaultValue={paymentToEdit?.amount}
            errors={state.errors?.amount}
          />
        </div>

        <div className="mb-1">
          <div className="grow">
            <TextField
              caption="Source"
              field="source"
              type="text"
              defaultValue={paymentToEdit?.source}
              errors={state.errors?.source}
            />
          </div>
        </div>
      </FormModal>
    )
  );
}
