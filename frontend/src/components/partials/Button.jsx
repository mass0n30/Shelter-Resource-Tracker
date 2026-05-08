


import * as React from "react";
import { cn } from "@/lib/utils";

const Button = React.forwardRef(function Button(
  { className, children, type = "button", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-md bg-primary border border-border px-4 py-2 text-[12px] md:text-sm font-medium text-white transition-colors hover:opacity-90 disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

export { Button };