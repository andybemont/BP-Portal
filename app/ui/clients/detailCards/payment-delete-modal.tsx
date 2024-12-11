"use client";

import { Payment } from "@/app/lib/data-model/definitions";
import { deletePayment } from "@/app/lib/data-model/payment-actions";
import DeleteModal from "../../shared/delete-modal";

export default function PaymentDeleteModal({
  payment,
  show,
  handleClose,
}: {
  payment: Payment;
  show: boolean;
  handleClose: (deleted: boolean) => void;
}) {
  return (
    show && (
      <DeleteModal
        title="Delete Payment?"
        confirmationMessage={`Are you absolutely sure?`}
        onCancel={() => handleClose(false)}
        onDelete={() => {
          deletePayment(payment);
          handleClose(true);
        }}
      />
    )
  );
}
