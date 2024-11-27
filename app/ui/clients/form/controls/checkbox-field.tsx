"use client";
import LabelBox from "./label-box";

export default function CheckboxField({
  defaultValue,
  caption,
  field,
}: {
  defaultValue?: boolean;
  caption: string;
  field: string;
}) {
  return (
    <div className="flex flex-row py-1">
      <LabelBox field={field} text={caption} />
      <input
        id={field}
        name={field}
        type="checkbox"
        defaultChecked={defaultValue}
        className="rounded-md border border-black ml-2 h-5 w-5"
      />
    </div>
  );
}
