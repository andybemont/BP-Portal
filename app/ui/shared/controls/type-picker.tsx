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
          className="w-full rounded-md border border-white py-1 text-sm outline-2 focus:outline-transparent focus:ring-transparent focus:border-black p-1 bg-white/50"
          defaultValue={defaultValue}
          aria-describedby="customer-error"
        >
          <option value="Shoot" className="bg-white text-black">
            Shoot
          </option>
          <option value="Wedding" className="bg-white text-black">
            Wedding
          </option>
          <option value="Meeting" className="bg-white text-black">
            Meeting
          </option>
        </select>
      </div>
    </>
  );
}
