"use client";

import LabelBox from "./label-box";
import ValidationErrorBox from "./validation-error-box";

export default function NotesField({
  errors,
  defaultValue,
}: {
  errors?: string[];
  defaultValue?: any;
}) {
  return (
    <>
      <LabelBox field="notes" text="Notes" />
      <div className="relative">
        <textarea
          id="notes"
          name="notes"
          className="peer block w-full cursor-pointer rounded-md border border-gray-200 m-0 p-0 text-sm outline-2 "
          defaultValue={defaultValue}
          placeholder="Enter notes"
        />
      </div>
      <ValidationErrorBox errors={errors} />
    </>
  );
}
