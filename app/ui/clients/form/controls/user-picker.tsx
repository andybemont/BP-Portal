"use client";

import { User } from "@/app/lib/definitions";
import LabelBox from "./label-box";
import ValidationErrorBox from "./validation-error-box";

export default function UserPicker({
  users,
  errors,
  defaultValue,
  caption,
  showUnassigned,
}: {
  users: User[];
  errors?: string[];
  defaultValue?: string;
  caption: string;
  showUnassigned: boolean;
}) {
  return (
    <>
      <LabelBox field="user" text={caption} />
      <div className="relative">
        <select
          id="user"
          name="user_id"
          className="w-full rounded-md border border-gray-200 py-1 text-sm outline-2"
          defaultValue={defaultValue}
          aria-describedby="customer-error"
        >
          {showUnassigned && <option value="">Unassigned</option>}
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      <ValidationErrorBox errors={errors} />
    </>
  );
}
