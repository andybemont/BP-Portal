"use client";

import LabelBox from "./label-box";
import ValidationErrorBox from "./validation-error-box";

export default function TextField({
  errors,
  defaultValue,
  caption,
  field,
  type,
}: {
  errors?: string[];
  defaultValue?: any;
  caption: string;
  field: string;
  type: string;
}) {
  return (
    <>
      <LabelBox field={field} text={caption} />
      <div className="relative m-0 p-0 rounded-md">
        <div className="relative">
          <input
            id={field}
            name={field}
            type={type}
            defaultValue={defaultValue}
            placeholder={`Enter ${caption}`}
            className=" m-0 p-0 peer block w-full rounded-md border border-gray-200 text-sm outline-2 "
          />
        </div>
      </div>
      <ValidationErrorBox errors={errors} />
    </>
  );
}
