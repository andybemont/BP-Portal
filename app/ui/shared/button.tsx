import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        "flex h-10 border-2 items-center rounded-lg px-4 mr-2 text-sm font-medium transition-colors",
        className
      )}
    >
      {children}
    </button>
  );
}
