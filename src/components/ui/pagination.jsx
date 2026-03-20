import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "../../lib/utils"
import { buttonVariants } from "./button"

const Pagination = (
  /** @type {any} */
  { className, ...props }
) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props} />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef(
  /**
   * @param {any} props
   * @param {any} ref
   */
  ({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-2", className)}
    {...props} />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef(
  /**
   * @param {any} props
   * @param {any} ref
   */
  ({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

const PaginationLink = (
  /** @type {any} */
  { className, isActive, size = "icon", ...props }
) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      isActive && "border-[#1B4332] text-[#1B4332] bg-emerald-50 font-bold hover:bg-emerald-100 hover:text-[#1B4332]",
      !isActive && "text-stone-600 hover:bg-stone-100 hover:text-stone-900",
      "rounded-xl transition-all",
      className
    )}
    {...props} />
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = (
  /** @type {any} */
  { className, ...props }
) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1 pl-2.5 font-semibold", className)}
    {...props}>
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = (
  /** @type {any} */
  { className, ...props }
) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1 pr-2.5 font-semibold", className)}
    {...props}>
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = (
  /** @type {any} */
  { className, ...props }
) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center text-stone-400", className)}
    {...props}>
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}