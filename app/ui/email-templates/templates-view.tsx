"use client";

import { EmailTemplate, User } from "@/app/lib/definitions";
import { useState } from "react";
import LabelBox from "../clients/form/controls/label-box";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";
import { text } from "stream/consumers";

export default function TemplatesView({
  allUsers,
  allTemplates,
}: {
  allTemplates: EmailTemplate[];
  allUsers: User[];
}) {
  const [selectedUser, setSelectedUser] = useState(allUsers[0]);
  const [selectedTemplate, setSelectedTemplate] = useState(
    allTemplates.find((t) => t.user_id === selectedUser.id)
  );

  return (
    <>
      <div className="flex flex-row">
        <div className="w-1/2 max-w-48">
          <LabelBox field="user" text="User" />
          <select
            id="user_id"
            name="user_id"
            className="w-full rounded-md border border-gray-200 py-1 text-sm outline-2"
            defaultValue={selectedUser.id}
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
          <LabelBox field="user" text="Template" />
          <div className="relative">
            <select
              id="user_id"
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
                .filter((t) => t.user_id === selectedUser.id)
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
        className="flex flex-row my-4"
        onClick={() =>
          navigator.clipboard.writeText(selectedTemplate?.text || "")
        }
      >
        <p className="text-lg">Copy to clipboard</p>
        <ClipboardDocumentCheckIcon className="ml-2 h-6" />
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
