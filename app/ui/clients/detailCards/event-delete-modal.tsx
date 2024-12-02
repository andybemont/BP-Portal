"use client";

import { Event } from "@/app/lib/definitions";
import { deleteEvent } from "@/app/lib/event-actions";
import DeleteModal from "../../shared/delete-modal";

export default function EventDeleteModal({
  event,
  show,
  handleClose,
}: {
  event: Event;
  show: boolean;
  handleClose: () => void;
}) {
  return (
    show && (
      <DeleteModal
        title="Delete Event?"
        confirmationMessage={`Are you absolutely sure you want to delete ${
          event.title ? `'${event.title}'` : `this ${event.type}`
        } along with its tasks?`}
        onCancel={handleClose}
        onDelete={() => deleteEvent(event)}
      />
    )
  );
}
