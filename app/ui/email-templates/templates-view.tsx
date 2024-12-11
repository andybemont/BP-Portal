"use client";

import { EmailTemplate, User } from "@/app/lib/data-model/definitions";
import { useState } from "react";
import LabelBox from "../shared/controls/label-box";
import {
  PencilIcon,
  PlusCircleIcon,
  TrashIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";
import TemplateDeleteModal from "./template-delete-modal";
import TemplateAddEditModal from "./template-add-edit-modal";

export default function TemplatesView({
  allUsers,
  allTemplates,
}: {
  allTemplates: EmailTemplate[];
  allUsers: User[];
}) {
  const [selectedUser, setSelectedUser] = useState(
    allUsers.find((u) => allTemplates.find((t) => t.user_id === u.id))
  );
  const [selectedTemplate, setSelectedTemplate] = useState(
    allTemplates.find((t) => t.user_id === selectedUser?.id)
  );
  const [showEditTemplateForm, setShowEditTemplateForm] = useState(false);
  const [showAddTemplateForm, setShowAddTemplateForm] = useState(false);
  const [showDeleteTemplateForm, setShowDeleteTemplateForm] = useState(false);

  return (
    <div className="overflow-hidden rounded-md bg-green/20 m-1 p-2 pb-0">
      <TemplateDeleteModal
        user={selectedUser}
        template={selectedTemplate}
        show={showDeleteTemplateForm}
        handleClose={() => {
          setShowDeleteTemplateForm(false);
        }}
      />
      <TemplateAddEditModal
        allUsers={allUsers}
        templateToEdit={showEditTemplateForm ? selectedTemplate : undefined}
        show={showEditTemplateForm || showAddTemplateForm}
        handleClose={() => {
          setShowEditTemplateForm(false);
          setShowAddTemplateForm(false);
        }}
      />
      <div className="flex flex-row flex-wrap space-x-2 mb-4">
        <select
          id="user_id"
          name="user_id"
          className="w-full rounded-md bg-white/50 border-black/50 py-1 text-sm outline-2 h-8 max-w-[100px]"
          defaultValue={selectedUser?.id}
          onChange={(e) => {
            setSelectedUser(
              allUsers.find((u) => u.id === e.target.value) || allUsers[0]
            );
            setSelectedTemplate(
              allTemplates.find((t) => t.user_id === e.target.value)
            );
          }}
        >
          {allUsers
            .filter((user) => allTemplates.find((t) => t.user_id === user.id))
            .map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
        </select>
        <select
          id="id"
          name="id"
          className="w-full bg-white/50 rounded-md border-black/50 py-1 text-sm outline-2 h-8 max-w-[200px]"
          defaultValue={selectedTemplate?.id}
          onChange={(e) => {
            setSelectedTemplate(
              allTemplates.find((t) => t.id === e.target.value)
            );
          }}
        >
          {allTemplates
            .filter((t) => t.user_id === selectedUser?.id)
            .map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
        </select>
        <PencilIcon
          className="cursor-pointer h-6 mt-1"
          onClick={() => setShowEditTemplateForm(true)}
        />
        <PlusCircleIcon
          className="cursor-pointer h-6 mt-1"
          onClick={() => {
            setShowAddTemplateForm(true);
          }}
        />
        <TrashIcon
          className="text-warning cursor-pointer h-6 mt-1"
          onClick={() => {
            setShowDeleteTemplateForm(true);
          }}
        />
        <div
          className="cursor-pointer"
          onClick={() =>
            navigator.clipboard.writeText(selectedTemplate?.text || "")
          }
        >
          <ClipboardDocumentCheckIcon className="h-6 mt-1" />
        </div>
      </div>
      <p className="whitespace-pre text-wrap overflow-y-auto h-96 peer block w-full cursor-pointer rounded-md border border-black/50 m-0 p-1 text-sm outline-2 ">
        {selectedTemplate?.text}
      </p>
    </div>
  );
}
