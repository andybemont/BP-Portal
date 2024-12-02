export default function ValidationErrorBox({
  errors,
}: {
  errors: string[] | null | undefined;
}) {
  return (
    <div id="customer-error" aria-live="polite" aria-atomic="true">
      {errors &&
        errors.map((error: string) => (
          <p className="mt-2 text-sm text-warning" key={error}>
            {error}
          </p>
        ))}
    </div>
  );
}
