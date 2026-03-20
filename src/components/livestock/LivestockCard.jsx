// @ts-nocheck
import React from "react";
// Adjusted to standard relative paths
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Heart, Tag, Scale } from "lucide-react";
import { cn } from "@/lib/utils";

const healthColors = {
  healthy: "bg-emerald-100 text-emerald-800 border-emerald-200",
  sick: "bg-rose-100 text-rose-800 border-rose-200 animate-pulse",
  under_treatment: "bg-amber-100 text-amber-800 border-amber-200",
  quarantined: "bg-slate-100 text-slate-800 border-slate-300",
};

const animalEmojis = {
  cattle: "🐄", goats: "🐐", sheep: "🐑", poultry: "🐔",
  pigs: "🐷", rabbits: "🐰", donkeys: "🫏", other: "🐾",
};

export default function LivestockCard({ animal, onEdit, onDelete }) {
  const isSick = animal.health_status === "sick";

  return (
    <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden h-full flex flex-col font-sans">
      {/* Visual Health Indicator Bar */}
      <div className={cn(
        "h-1 w-full transition-colors",
        isSick ? "bg-rose-500" : "bg-transparent"
      )} />

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-stone-50 border border-stone-100 rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform">
              {animalEmojis[animal.animal_type] || "🐾"}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg leading-tight">
                {animal.name || `Tag: ${animal.tag_id}`}
              </h3>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mt-0.5">
                {animal.breed || animal.animal_type}
              </p>
            </div>
          </div>
          
          <Badge className={cn(
            "capitalize border text-[10px] px-2 py-0.5 shadow-none font-bold", 
            healthColors[animal.health_status] || healthColors.healthy
          )}>
            <Heart className={cn("w-3 h-3 mr-1", isSick && "fill-rose-500")} />
            {animal.health_status?.replace(/_/g, " ")}
          </Badge>
        </div>

        {/* Vital Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 px-2 py-1.5 bg-stone-50 rounded-lg border border-stone-100">
            <Tag className="w-3.5 h-3.5 text-[#1B4332]/60" />
            <span className="text-xs font-bold text-stone-700">{animal.tag_id}</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-1.5 bg-stone-50 rounded-lg border border-stone-100">
            <Scale className="w-3.5 h-3.5 text-[#D4A373]" />
            <span className="text-xs font-bold text-stone-700">
              {animal.weight_kg > 0 ? `${animal.weight_kg} kg` : "N/A"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-stone-500 mb-4 px-1">
          <span className="flex items-center gap-1 font-bold capitalize text-stone-700">
            {animal.gender}
          </span>
          <span className="w-1 h-1 rounded-full bg-stone-300" />
          <span className="italic truncate">
            {animal.notes || "No special notes"}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto flex gap-2 pt-4 border-t border-stone-50 md:opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => onEdit(animal)} 
            className="flex-1 h-8 text-xs font-bold hover:bg-emerald-50 hover:text-[#1B4332]"
          >
            <Pencil className="w-3 h-3 mr-1.5" /> Edit
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => onDelete(animal)} 
            className="h-8 text-xs font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </Card>
  );
}