import React from "react";
import { Card } from "../ui/card"; // Adjusted to relative path
import { cn } from "../../lib/utils"; // Adjusted to relative path
import { TrendingUp, TrendingDown } from "lucide-react";

/**
 * A reusable statistic card for the dashboard overview.
 * @param {Object} props
 * @param {string} props.title - The title of the stat (e.g., "Total Yield")
 * @param {string|number} props.value - The main numeric value to display
 * @param {string} [props.subtitle] - Optional context text below the value
 * @param {React.ElementType} props.icon - The Lucide icon component to render
 * @param {'green'|'amber'|'blue'|'red'|'emerald'} [props.color='green'] - The color theme for the icon
 * @param {string} [props.trend] - The trend text (e.g., "12%")
 * @param {'increase'|'decrease'} [props.trendType] - Determines the trend icon and color
 */
export default function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = "green", // Added default to ensure colorMap always works
  trend, 
  trendType 
}) {
  const colorMap = {
    green: "bg-[#1B4332]/10 text-[#1B4332]",
    amber: "bg-[#D4A373]/20 text-[#6B4226]", // Earthy/Soil tone
    blue: "bg-blue-50 text-blue-700",
    red: "bg-red-50 text-red-700",
    emerald: "bg-emerald-50 text-emerald-700", // For successful harvests
  };

  return (
    <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <p className="text-sm text-gray-500 font-medium tracking-wide uppercase">
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-gray-900 tracking-tight">
                {value}
              </p>
              
              {/* Trend Indicator */}
              {trend && (
                <div className={cn(
                  "flex items-center text-xs font-bold px-1.5 py-0.5 rounded-md",
                  trendType === 'increase' ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
                )}>
                  {trendType === 'increase' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {trend}
                </div>
              )}
            </div>

            {subtitle && (
              <p className="text-xs text-gray-400 font-normal">
                {subtitle}
              </p>
            )}
          </div>

          {/* Icon Container with hover effect */}
          <div className={cn(
            "p-3 rounded-2xl transition-transform group-hover:scale-110 duration-300", 
            colorMap[color] || colorMap.green
          )}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </div>
      
      {/* Subtle bottom accent bar */}
      <div className={cn(
        "h-1 w-full opacity-0 group-hover:opacity-100 transition-opacity",
        color === 'green' ? "bg-[#1B4332]" : "bg-gray-200"
      )} />
    </Card>
  );
}