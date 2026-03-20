import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-[#1B4332] text-white shadow-sm hover:bg-[#2D6A4F] hover:shadow-md",
        destructive: "bg-rose-600 text-white shadow-sm hover:bg-rose-700",
        outline: "border border-stone-200 bg-white shadow-sm hover:bg-stone-50 hover:text-[#1B4332] hover:border-[#1B4332]/30",
        secondary: "bg-stone-100 text-stone-900 shadow-sm hover:bg-stone-200",
        ghost: "text-stone-600 hover:bg-emerald-50 hover:text-[#1B4332]",
        link: "text-[#1B4332] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-2xl px-10 text-base",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * This JSDoc comment tells VS Code to accept standard button props (like children and onClick)
 * @type {React.ForwardRefRenderFunction<HTMLButtonElement, any>}
 */
const Button = React.forwardRef(({ className, variant, size, asChild = false, children, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    >
      {children} 
    </Comp>
  );
});

Button.displayName = "Button";

export { Button, buttonVariants };