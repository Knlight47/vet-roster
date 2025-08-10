import * as React from "react";
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode };
export function Button({ className = "", children, ...rest }: Props) {
  return (
    <button
      className={
        "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium shadow-sm bg-black text-white hover:opacity-90 " +
        className
      }
      {...rest}
    >
      {children}
    </button>
  );
}
