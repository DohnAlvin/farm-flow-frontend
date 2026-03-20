// @ts-nocheck
import React from "react"
// Adjusted to relative paths based on our standard UI structure
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Sprout, Calendar, Info } from "lucide-react" 
import { format, parseISO, isValid } from "date-fns"
import { cn } from "@/lib/utils"

const statusColors = {
  planted: "bg-green-100 text-green-800 border-green-200",
  growing: "bg-emerald-100 text-emerald-800 border-emerald-200",
  harvesting: "bg-amber-100 text-amber-800 border-amber-200",
  fallow: "bg-slate-100 text-slate-600 border-slate-200",
  preparing: "bg-blue-100 text-blue-800 border-blue-200",
}

/**
 * @typedef {Object} FieldData
 * @property {number|string} id
 * @property {string} name
 * @property {number} size_acres
 * @property {string} soil_type
 * @property {string} status
 * @property {string} [crop]
 * @property {string} [expected_harvest_date]
 * @property {string} [notes]
 */

/**
 * Displays an individual field's status, crop, and details.
 * @param {Object} props
 * @param {FieldData} props.field - The field data object from Django
 * @param {Function} props.onEdit - Callback when the edit button is clicked
 * @param {Function} props.onDelete - Callback when the delete button is clicked
 */
export default function FieldCard({ field, onEdit, onDelete }) {
  // Safety check for date formatting
  const formatDate = (dateStr) => {
    if (!dateStr) return null
    const date = parseISO(dateStr)
    return isValid(date) ? format(date, "MMM d, yyyy") : null
  }

  const harvestDate = formatDate(field.expected_harvest_date)

  return (
    <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group flex flex-col h-full">
      {/* Visual Header Accent */}
      <div className="h-1.5 bg-gradient-to-r from-[#1B4332] to-[#2D6A4F]" />
      
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-1">
            <h3 className="font-bold text-gray-900 text-lg tracking-tight group-hover:text-[#1B4332] transition-colors">
              {field.name}
            </h3>
            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <span>{field.size_acres} Acres</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span>{field.soil_type} Soil</span>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={cn("capitalize px-2 py-0 text-[10px]", statusColors[field.status] || statusColors.fallow)}
          >
            {field.status?.replace(/_/g, " ")}
          </Badge>
        </div>

        {/* Crop Info Section */}
        <div className="space-y-2.5 mb-4">
          {field.crop ? (
            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-gray-50 border border-gray-100">
              <div className="p-1.5 bg-white rounded-md shadow-sm">
                <Sprout className="w-3.5 h-3.5 text-[#2D6A4F]" />
              </div>
              <div className="text-sm">
                <span className="text-gray-400 text-xs block leading-none mb-0.5">Current Crop</span>
                <span className="font-semibold text-gray-700">{field.crop}</span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-gray-400 italic flex items-center gap-2">
              <span className="p-1 bg-gray-100 rounded">
                <Info className="w-3 h-3" />
              </span>
              No crop planted
            </div>
          )}

          {harvestDate && (
            <div className="flex items-center gap-2 text-sm text-gray-500 px-1">
              <Calendar className="w-3.5 h-3.5 text-[#D4A373]" />
              <span className="text-xs">Harvest: <strong>{harvestDate}</strong></span>
            </div>
          )}
        </div>

        {/* Notes Preview */}
        {field.notes && (
          <p className="text-xs text-gray-400 line-clamp-2 italic mb-6 border-l-2 border-gray-100 pl-3">
            "{field.notes}"
          </p>
        )}

        {/* Action Buttons */}
        <div className="mt-auto flex items-center justify-end gap-2 pt-4 border-t border-gray-50 md:opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => onEdit(field)} 
            className="h-8 text-xs font-medium text-gray-600 hover:text-[#1B4332] hover:bg-green-50"
          >
            <Pencil className="w-3 h-3 mr-1.5" /> Edit
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => onDelete(field)} 
            className="h-8 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-3 h-3 mr-1.5" /> Delete
          </Button>
        </div>
      </div>
    </Card>
  )
}