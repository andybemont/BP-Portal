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
  field,
}: {
  users: User[];
  errors?: string[];
  defaultValue?: string;
  caption: string;
  showUnassigned: boolean;
  field: string;
}) {
  return (
    <>
      <LabelBox field="user" text={caption} />
      <div className="relative">
        <select
          id={field}
          name={field}
          className="w-full rounded-md border border-accent2 py-1 text-sm outline-2 focus:outline-transparent focus:ring-transparent focus:border-black p-1 bg-white/50"
          defaultValue={defaultValue}
          aria-describedby="customer-error"
        >
          {showUnassigned && (
            <option value="" className="bg-white text-black">
              Unassigned
            </option>
          )}
          {users.map((user) => (
            <option
              key={user.id}
              className="bg-white text-black"
              value={user.id}
            >
              {user.name}
            </option>
          ))}
        </select>
      </div>

      <ValidationErrorBox errors={errors} />
    </>
  );
}
