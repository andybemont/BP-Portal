"use client";

import { EmailTemplate, User } from "@/app/lib/definitions";
import { useState } from "react";
import LabelBox from "../clients/form/controls/label-box";
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
    <>
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
      <div className="flex flex-row">
        <div className="w-1/2 max-w-48">
          <LabelBox field="user_id" text="User" />
          <select
            id="user_id"
            name="user_id"
            className="w-full rounded-md border border-gray-200 py-1 text-sm outline-2"
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
        </div>
        <div className="w-1/2 max-w-48">
          <LabelBox field="id" text="Template" />
          <div className="relative">
            <select
              id="id"
              name="id"
              className="w-full rounded-md border border-gray-200 py-1 text-sm outline-2"
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
          </div>
        </div>
      </div>
      <div
        className="flex flex-row my-4 cursor-pointer"
        onClick={() =>
          navigator.clipboard.writeText(selectedTemplate?.text || "")
        }
      >
        <PencilIcon
          className="text-blue-600 h-6 pl-3 cursor-pointer"
          onClick={() => setShowEditTemplateForm(true)}
        />
        <PlusCircleIcon
          className="text-blue-600 h-6 pl-3 cursor-pointer"
          onClick={() => {
            setShowAddTemplateForm(true);
          }}
        />
        <TrashIcon
          className="text-red-600 h-6 pl-3 cursor-pointer"
          onClick={() => {
            setShowDeleteTemplateForm(true);
          }}
        />
        <ClipboardDocumentCheckIcon className="text-blue-600 pl-3 h-6" />
      </div>
      <textarea
        id="notes"
        name="notes"
        value={selectedTemplate?.text}
        className="h-96 peer block w-full cursor-pointer rounded-md border border-gray-200 m-0 p-0 text-sm outline-2 "
        readOnly
      />
    </>
  );
}
