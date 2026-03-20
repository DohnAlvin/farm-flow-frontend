// @ts-nocheck
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api"; // Switched to standard API bridge
import { 
  Sprout, 
  Activity, 
  ClipboardList, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle 
} from "lucide-react";

import StatCard from "../components/dashboard/StatCard";
import WeatherWidget from "../components/dashboard/WeatherWidget";
import RecentActivity from "../components/dashboard/RecentActivity";
import { formatCurrency } from "@/lib/utils";

export default function Dashboard() {
  // 🚜 Pure Django Data Fetching via standard GET requests
  const { data: fields = [] } = useQuery({
    queryKey: ["fields"],
    queryFn: () => api.get("/fields/"),
  });

  const { data: livestock = [] } = useQuery({
    queryKey: ["livestock"],
    queryFn: () => api.get("/livestock/"),
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => api.get("/tasks/?ordering=-created_at&limit=20"),
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => api.get("/transactions/?ordering=-created_at&limit=20"),
  });

  // 📈 Derived Analytics Logic
  const totalIncome = Array.isArray(transactions) 
    ? transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + (Number(t.amount) || 0), 0)
    : 0;

  const totalExpenses = Array.isArray(transactions) 
    ? transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + (Number(t.amount) || 0), 0)
    : 0;

  const netProfit = totalIncome - totalExpenses;
  const pendingTasks = tasks.filter((t) => ["pending", "in_progress"].includes(t.status)).length;
  const totalAcres = fields.reduce((sum, f) => sum + (Number(f.size_acres) || 0), 0);
  const urgentTasks = tasks.filter((t) => t.priority === "urgent").length;

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-0">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">
            Farm Dashboard
          </h1>
          <p className="text-stone-500 mt-1 font-medium">
            Operational overview for {new Date().toLocaleDateString('en-KE', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        {urgentTasks > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 border border-rose-100 rounded-lg text-rose-700 text-sm font-bold animate-pulse">
            <AlertCircle size={16} />
            {urgentTasks} Urgent Tasks Need Attention
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Fields"
          value={fields.length}
          subtitle={`${totalAcres.toFixed(1)} Total Acres`}
          icon={Sprout}
          color="green" 
        />
        <StatCard
          title="Livestock"
          value={livestock.length}
          subtitle={`${livestock.filter((l) => l.health_status === "healthy").length} Healthy Heads`}
          icon={Activity}
          color="amber"
        />
        <StatCard
          title="Pending Tasks"
          value={pendingTasks}
          subtitle={`${urgentTasks} Marked Urgent`}
          icon={ClipboardList}
          color="blue"
        />
        <StatCard
          title="Net Profit"
          value={`KES ${netProfit.toLocaleString()}`}
          subtitle={netProfit >= 0 ? "Above budget" : "Below budget"}
          icon={netProfit >= 0 ? TrendingUp : TrendingDown}
          color={netProfit >= 0 ? "green" : "red"}
        />
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Feed takes 2/3 space */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <RecentActivity tasks={tasks} transactions={transactions} />
        </div>

        {/* Sidebar Widgets take 1/3 space */}
        <div className="space-y-8">
          <WeatherWidget />
        </div>
      </div>
    </div>
  );
}