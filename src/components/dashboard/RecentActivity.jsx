// @ts-nocheck
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, parseISO, isValid } from "date-fns"; 
import { ClipboardList, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { cn } from "@/lib/utils"; 

/**
 * RecentActivity feed combining Tasks and Transactions.
 */
export default function RecentActivity({ tasks = [], transactions = [] }) {
  // 1. Combine and normalize the data to match our Django models
  const combinedData = [
    ...tasks.slice(0, 5).map((t) => ({
      id: `task-${t.id}`,
      type: "task",
      title: t.title,
      subtitle: t.category?.replace(/_/g, " "),
      date: t.due_date, 
      status: t.status,
      icon: ClipboardList,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
    })),
    ...transactions.slice(0, 5).map((t) => ({
      id: `trans-${t.id}`,
      type: "transaction",
      title: t.description || t.category?.replace(/_/g, " "),
      subtitle: `KES ${Number(t.amount).toLocaleString()}`,
      date: t.date, 
      status: t.type, // 'income' or 'expense'
      icon: t.type === "income" ? ArrowUpRight : ArrowDownLeft,
      iconColor: t.type === "income" ? "text-green-600" : "text-red-600",
      bgColor: t.type === "income" ? "bg-green-50" : "bg-red-50",
    })),
  ];

  // 2. Sort by date (Newest first) and limit to top 6
  const activities = combinedData
    .sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 6);

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    in_progress: "bg-blue-100 text-blue-800 border-blue-200",
    completed: "bg-green-100 text-green-800 border-green-200",
    income: "bg-emerald-100 text-emerald-800 border-emerald-200",
    expense: "bg-rose-100 text-rose-800 border-rose-200",
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "No date";
    const date = parseISO(dateStr);
    return isValid(date) ? format(date, "MMM d, yyyy") : "No date";
  };

  return (
    <Card className="bg-white border-0 shadow-sm overflow-hidden">
      <CardHeader className="pb-4 border-b border-stone-50">
        <CardTitle className="text-lg font-bold text-stone-900">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-sm text-stone-400 font-medium">No recent farm activity found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div 
                key={activity.id} 
                className="flex items-center gap-4 group transition-all"
              >
                {/* Icon with Dynamic Background */}
                <div className={cn(
                  "p-2.5 rounded-xl transition-colors", 
                  activity.bgColor
                )}>
                  <activity.icon className={cn("w-4 h-4", activity.iconColor)} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-stone-900 truncate">
                      {activity.title}
                    </p>
                    <span className="text-[10px] font-medium text-stone-400 whitespace-nowrap">
                      {formatDate(activity.date)}
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-stone-500 capitalize leading-none mt-0.5">
                    {activity.subtitle}
                  </p>
                </div>

                {/* Status Badge */}
                <Badge 
                  variant="outline"
                  className={cn(
                    "text-[10px] px-2 py-0 border capitalize font-bold shadow-none", 
                    statusColors[activity.status] || "bg-stone-100 text-stone-600 border-stone-200"
                  )}
                >
                  {activity.status?.replace(/_/g, " ")}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}