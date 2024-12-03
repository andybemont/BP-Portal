export default function OptionalAttribute({
  className,
  value,
}: {
  className?: string;
  value: any;
}) {
  return <>{value && <p className={className}>{value}</p>}</>;
}
