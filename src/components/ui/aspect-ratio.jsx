import * as React from "react"
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"

import { cn } from "../../lib/utils" // Adjusted to standard relative path

/**
 * AspectRatio component ensures images (like livestock photos or field maps)
 * maintain a consistent shape regardless of the screen size.
 */
const AspectRatio = React.forwardRef(
  /**
   * @param {any} props
   * @param {any} ref
   */
  ({ className, ratio = 16 / 9, ...props }, ref) => (
  <AspectRatioPrimitive.Root
    ref={ref}
    ratio={ratio}
    // Added overflow-hidden and a subtle background for a professional "loading" look
    className={cn("relative overflow-hidden rounded-xl bg-slate-50 shadow-inner", className)}
    {...props}
  />
))

AspectRatio.displayName = "AspectRatio"

export { AspectRatio }