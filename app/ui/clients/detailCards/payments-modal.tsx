"use client";
import { ClientDetails, Payment } from "@/app/lib/data-model/definitions";
import { Button } from "../../shared/button";
import { toNiceDateString } from "@/app/lib/helpers/client-side-helpers";
import { useActionState, useCallback, useState } from "react";
import {
  PencilIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import PaymentDeleteModal from "./payment-delete-modal";
import PaymentAddEditModal from "./payment-add-edit-modal";

export default function PaymentsModel({
  client,
  handleClose,
  show,
}: {
  client: ClientDetails;
  handleClose: () => void;
  show: boolean;
}) {
  const [paymentToDelete, setPaymentToDelete] = useState<Payment | undefined>(
    undefined
  );
  const [activePayments, setActivePayments] = useState(client.payments);
  const [showAddForm, setShowAddForm] = useState(false);
  const [paymentToEdit, setPaymentToEdit] = useState<Payment>();
  const [iteration, setIteration] = useState(0);

  const totalCosts = () => {
    return client.events.reduce((sum, current) => sum + (current.cost || 0), 0);
  };

  const totalPayments = () => {
    return activePayments.reduce(
      (sum, current) => sum + (current.amount || 0),
      0
    );
  };

  return (
    <>
      {paymentToDelete && (
        <PaymentDeleteModal
          show={paymentToDelete !== undefined}
          payment={paymentToDelete}
          handleClose={(deleted: boolean) => {
            if (deleted && paymentToDelete) {
              const index = activePayments.indexOf(paymentToDelete);
              if (index > -1) {
                activePayments.splice(index, 1);
              }
            }
            setPaymentToDelete(undefined);
          }}
        />
      )}
      <PaymentAddEditModal
        client={client}
        show={showAddForm || paymentToEdit !== undefined}
        paymentToEdit={paymentToEdit}
        handleClose={(payment?: Payment) => {
          if (payment) {
            if (showAddForm) {
              activePayments.push(payment);
            } else if (paymentToEdit) {
              paymentToEdit.amount = payment.amount;
              paymentToEdit.date = payment.date;
              paymentToEdit.source = payment.source;
            }
            setIteration(iteration + 1);
          }
          setShowAddForm(false);
          setPaymentToEdit(undefined);
        }}
      />
      {show && (
        <div className="z-0 fixed inset-0 bg-gray/70 h-screen w-screen flex justify-center overflow-y-auto">
          <div className="grow" />
          <div className="flex flex-col min-w-96 w-1/3">
            <div className="grow" />
            <div className="p-2 shrink border border-black w-full overflow-y-auto rounded-md bg-darkblue text-white ">
              <div className="text-center">
                <h3 className="text-2xl font-bold">{`Payments ($${
                  totalCosts() - totalPayments()
                } remaining)`}</h3>
                <hr className="pb-4" />
                <div className="text-left text-pop1">
                  <h2 className="text-xl">{`Services ($${totalCosts()})`}</h2>
                  <ul className="text-lg">
                    {client.events
                      .filter((e) => e.cost)
                      .map((e) => (
                        <li key={e.id}>
                          <span>{`$${e.cost || 0} - ${
                            e.title || e.type
                          } (${toNiceDateString(e.date)})`}</span>
                        </li>
                      ))}
                  </ul>
                </div>
                <div className="pt-4 text-left text-pop2">
                  <h2 className="text-xl flex flex-row">
                    {`Payments ($${totalPayments()})`}
                    <PlusCircleIcon
                      className="text-white h-6 pl-3 pt-1 cursor-pointer"
                      onClick={() => setShowAddForm(true)}
                    />
                  </h2>
                  <ul className="text-lg">
                    {client.payments
                      .filter((p) => p.amount)
                      .map((p) => (
                        <li key={p.id} className="flex flex-row">
                          <span>{`$${p.amount} - ${
                            p.source
                          } (${toNiceDateString(p.date)})`}</span>
                          <PencilIcon
                            className="text-white h-6 pl-3 pt-1 cursor-pointer"
                            onClick={() => setPaymentToEdit(p)}
                          />
                          <TrashIcon
                            className="text-warning h-6 pl-3 pt-1 cursor-pointer"
                            onClick={() => setPaymentToDelete(p)}
                          />
                        </li>
                      ))}
                  </ul>
                </div>
                <div className="flex justify-center my-2">
                  <Button
                    onClick={handleClose}
                    className="hover:border-black hover:bg-pop2/70 hover:text-black border-gray bg-white text-gray"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
            <div className="grow" />
          </div>
          <div className="grow" />
        </div>
      )}
    </>
  );
}
