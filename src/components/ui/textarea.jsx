import * as React from "react";
import { cn } from "@/lib/utils";

/** @typedef {React.TextareaHTMLAttributes<HTMLTextAreaElement>} TextareaProps */

const Textarea = React.forwardRef(
  /** @param {TextareaProps & { className?: string }} props */
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-900 shadow-sm transition-all placeholder:text-stone-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332] focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };