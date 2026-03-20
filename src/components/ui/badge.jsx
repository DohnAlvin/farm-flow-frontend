import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "../../lib/utils"; // Adjusted to standard relative path

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-stone-900 text-stone-50 shadow hover:bg-stone-800",
        secondary:
          "border-transparent bg-stone-100 text-stone-900 hover:bg-stone-200",
        destructive:
          "border-transparent bg-rose-100 text-rose-700 hover:bg-rose-200",
        success:
          "border-transparent bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
        warning:
          "border-transparent bg-amber-100 text-amber-700 hover:bg-amber-200",
        outline: "text-stone-600 border-stone-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * @param {Object} props
 * @param {string} [props.className]
 * @param {"default" | "secondary" | "destructive" | "success" | "warning" | "outline"} [props.variant]
 */
function Badge({
  className,
  variant = "default",
  ...props
}) {
  return (<div className={cn(badgeVariants({ variant }), className)} {...props} />);
}

export { Badge, badgeVariants };