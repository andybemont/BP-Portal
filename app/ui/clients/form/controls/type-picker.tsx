"use client";

import LabelBox from "./label-box";

export default function TypePicker({
  defaultValue,
  onPick,
}: {
  defaultValue: string;
  onPick: (type: "Wedding" | "Shoot" | "Meeting") => void;
}) {
  return (
    <>
      <LabelBox field="type" text="Event type" />
      <div className="relative">
        <select
          id="type"
          name="type"
          onChange={(e) =>
            onPick(e.target.value as "Wedding" | "Shoot" | "Meeting")
          }
          className="w-full rounded-md border border-gray-200 py-1 text-sm outline-2"
          defaultValue={defaultValue}
          aria-describedby="customer-error"
        >
          <option value="Shoot">Shoot</option>
          <option value="Wedding">Wedding</option>
          <option value="Meeting">Meeting</option>
        </select>
      </div>
    </>
  );
}
