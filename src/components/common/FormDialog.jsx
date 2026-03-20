import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog"; // Adjusted to relative path for consistency
import { cn } from "../../lib/utils";

/**
 * A reusable, branded modal dialog specifically designed for forms.
 * * @param {Object} props
 * @param {boolean} props.open - Controls if the dialog is visible
 * @param {(open: boolean) => void} props.onOpenChange - Callback when dialog opens/closes
 * @param {string} props.title - The main heading of the dialog
 * @param {string} [props.description] - Optional accessible description for screen readers
 * @param {React.ReactNode} props.children - The form components to render inside
 * @param {string} [props.className] - Optional extra Tailwind classes for the content box
 */
export default function FormDialog({ 
  open, 
  onOpenChange, 
  title, 
  description, 
  children, 
  className 
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "max-w-lg w-[95vw] max-h-[90vh] overflow-y-auto rounded-xl border-t-4 border-t-[#1B4332] p-6 shadow-2xl",
        className
      )}>
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            {/* Subtle green dot to match farm branding */}
            <span className="w-2 h-2 rounded-full bg-[#1B4332]" />
            {title}
          </DialogTitle>
          
          {/* Providing a description is good for Screen Readers (Accessibility) */}
          {description && (
            <DialogDescription className="text-gray-500 text-sm mt-1">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="mt-2">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}