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
          className="peer min-h-48 block w-full cursor-pointer rounded-md border-top border-black m-0 p-0 text-sm focus:outline-transparent focus:ring-transparent focus:border-black p-1 bg-white/50"
          defaultValue={defaultValue}
          placeholder="Enter notes"
        />
      </div>
      <ValidationErrorBox errors={errors} />
    </>
  );
}
