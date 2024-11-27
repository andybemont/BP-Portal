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
      className="m-0 block text-left text-sm font-medium text-black"
    >
      {text}
    </label>
  );
}
