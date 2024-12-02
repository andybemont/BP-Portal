import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        "flex h-10 border-2 border-accent2 items-center rounded-lg bg-white px-4 text-sm font-medium text-accent2 transition-colors hover:bg-accent2/30 hover:text-black",
        className
      )}
    >
      {children}
    </button>
  );
}
