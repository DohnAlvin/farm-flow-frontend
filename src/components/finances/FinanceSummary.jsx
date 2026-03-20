import React from "react";
// Adjusted to standard relative paths
import { Card } from "../ui/card";
import { TrendingUp, TrendingDown, Wallet, Percent } from "lucide-react";
import { cn } from "../../lib/utils";

/**
 * @typedef {Object} Transaction
 * @property {string|number} id
 * @property {string} type - "income" or "expense"
 * @property {number|string} amount
 * @property {string} [date]
 * @property {string} [category]
 * @property {string} [description]
 */

/**
 * Displays a high-level summary of income, expenses, and net profit.
 * @param {Object} props
 * @param {Transaction[]} props.transactions - Array of transaction objects
 */
export default function FinanceSummary({ transactions = [] }) {
  // Calculate totals with safety for undefined data
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + (Number(t.amount) || 0), 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + (Number(t.amount) || 0), 0);

  const net = totalIncome - totalExpense;
  const profitMargin = totalIncome > 0 ? ((net / totalIncome) * 100).toFixed(1) : 0;

  const stats = [
    { 
      label: "Total Income", 
      value: totalIncome, 
      icon: TrendingUp, 
      color: "text-emerald-600", 
      bg: "bg-emerald-50",
      border: "border-emerald-100" 
    },
    { 
      label: "Total Expenses", 
      value: totalExpense, 
      icon: TrendingDown, 
      color: "text-rose-600", 
      bg: "bg-rose-50",
      border: "border-rose-100" 
    },
    { 
      label: net >= 0 ? "Net Profit" : "Net Loss", 
      value: Math.abs(net), 
      icon: Wallet, 
      color: net >= 0 ? "text-[#1B4332]" : "text-amber-700", 
      bg: net >= 0 ? "bg-[#1B4332]/5" : "bg-amber-50",
      border: net >= 0 ? "border-[#1B4332]/10" : "border-amber-100"
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className={cn("bg-white border shadow-sm p-6 transition-all hover:shadow-md", s.border)}>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{s.label}</p>
                <p className={cn("text-2xl font-bold tracking-tight", s.color)}>
                  <span className="text-sm mr-1 font-medium opacity-70">KES</span>
                  {s.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className={cn("p-3 rounded-2xl", s.bg)}>
                <s.icon className={cn("w-6 h-6", s.color)} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Optional: Profit Margin Ribbon */}
      {totalIncome > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg w-fit">
          <Percent className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs text-gray-500 font-medium">
            Profit Margin: <span className={cn("font-bold", net >= 0 ? "text-emerald-600" : "text-rose-600")}>{profitMargin}%</span>
          </span>
        </div>
      )}
    </div>
  );
}