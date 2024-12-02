"use client";

import { Client } from "@/app/lib/definitions";
import { deleteClient } from "@/app/lib/client-actions";
import DeleteModal from "../../shared/delete-modal";

export default function ClientDeleteModal({
  client,
  show,
  handleClose,
}: {
  client: Client;
  show: boolean;
  handleClose: () => void;
}) {
  return (
    show && (
      <DeleteModal
        title="Delete Client?"
        confirmationMessage={`Are you absolutely sure you want to delete ${
          client.primarypersonname || "this client"
        } along with all their events and tasks?`}
        onCancel={handleClose}
        onDelete={() => deleteClient(client)}
      />
    )
  );
}
