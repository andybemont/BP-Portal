"use client";

import { EmailTemplate, User } from "@/app/lib/definitions";
import { deleteTemplate } from "@/app/lib/template-actions";
import DeleteModal from "../shared/delete-modal";

export default function TemplateDeleteModal({
  user,
  template,
  show,
  handleClose,
}: {
  user?: User;
  template?: EmailTemplate;
  show: boolean;
  handleClose: () => void;
}) {
  return (
    show &&
    template && (
      <DeleteModal
        title="Delete Template?"
        confirmationMessage={`Are you absolutely sure you want to delete ${user?.name}'s '${template.title}' template?`}
        onCancel={handleClose}
        onDelete={() => deleteTemplate(template)}
      />
    )
  );
}
