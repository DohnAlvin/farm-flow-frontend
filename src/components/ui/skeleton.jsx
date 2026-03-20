// @ts-nocheck
import { cn } from "../../lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-stone-200/60", className)}
      {...props} 
    />
  )
}

export { Skeleton }