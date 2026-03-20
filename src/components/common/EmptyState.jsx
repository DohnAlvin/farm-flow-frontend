// @ts-nocheck
import React from "react"
import { Button } from "@/components/ui/button" 
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * EmptyState component for lists or tables with no data.
 * @param {Object} props
 * @param {React.ElementType} props.icon - Lucide icon component
 * @param {string} props.title - Main heading
 * @param {string} props.description - Subtitle text
 * @param {string} [props.actionLabel] - Text for the button (optional)
 * @param {function} [props.onAction] - Click handler for the button (optional)
 * @param {string} [props.className] - Additional Tailwind classes (optional)
 */
export default function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction,
  className 
}) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-16 px-4 text-center animate-in fade-in zoom-in duration-300",
      className
    )}>
      {/* Icon Container */}
      <div className="w-16 h-16 bg-[#1B4332]/10 rounded-2xl flex items-center justify-center mb-4">
        {Icon && <Icon className="w-8 h-8 text-[#1B4332]/60" />}
      </div>

      {/* Text */}
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-xs mb-6 leading-relaxed">
        {description}
      </p>

      {/* Action Button */}
      {actionLabel && onAction && (
        <Button 
          onClick={onAction} 
          className="bg-[#1B4332] hover:bg-[#2D6A4F] text-white shadow-sm transition-all active:scale-95 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          <span>{actionLabel}</span>
        </Button>
      )}
    </div>
  )
}