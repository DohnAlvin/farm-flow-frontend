import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "../../lib/utils" // Adjusted to standard relative path

const alertVariants = cva(
  "relative w-full rounded-xl border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-9",
  {
    variants: {
      variant: {
        default: "bg-white text-slate-900 border-slate-200 shadow-sm",
        destructive:
          "border-rose-200 bg-rose-50 text-rose-800 [&>svg]:text-rose-600",
        success: 
          "border-emerald-200 bg-emerald-50 text-emerald-900 [&>svg]:text-emerald-600",
        warning: 
          "border-amber-200 bg-amber-50 text-amber-900 [&>svg]:text-amber-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef(
  /**
   * @param {any} props
   * @param {any} ref
   */
  ({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props} />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef(
  /**
   * @param {any} props
   * @param {any} ref
   */
  ({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-bold leading-none tracking-tight capitalize", className)}
    {...props} />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef(
  /**
   * @param {any} props
   * @param {any} ref
   */
  ({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm opacity-90 [&_p]:leading-relaxed", className)}
    {...props} />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }