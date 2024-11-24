export default function LabelBox({
  field,
  text,
}: {
  field: string;
  text?: string;
}) {
  return (
    <label
      htmlFor={field}
      className="mb-2 block text-sm font-medium text-black"
    >
      {text}
    </label>
  );
}
