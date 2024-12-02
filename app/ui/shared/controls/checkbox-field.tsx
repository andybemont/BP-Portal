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
        className="rounded-md ml-2 w-4 h-4 text-black bg-white/50 border-black rounded focus:ring-black dark:focus:ring-black dark:ring-offset-black focus:ring-2"
      />
    </div>
  );
}
