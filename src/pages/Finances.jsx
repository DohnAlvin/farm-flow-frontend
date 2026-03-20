// @ts-nocheck
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api"; // Pure Django API bridge
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { 
  Plus, Wallet, Pencil, Trash2, Calendar, 
  ArrowUpRight, ArrowDownRight, Loader2 
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { format } from "date-fns";

import FormDialog from "../components/common/FormDialog";
import EmptyState from "../components/common/EmptyState";
import TransactionForm from "../components/finances/TransactionForm";
import FinanceSummary from "../components/finances/FinanceSummary";
import { toast } from "../hooks/use-toast";
import { formatCurrency, cn } from "@/lib/utils";

export default function Finances() {
  const [showForm, setShowForm] = useState(false);
  const [editingTxn, setEditingTxn] = useState(null);
  const [typeFilter, setTypeFilter] = useState("all");
  const queryClient = useQueryClient();

  // 💰 Fetching Transactions from Django via standard API
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => api.get("/transactions/?ordering=-date"), 
  });

  const closeForm = () => {
    setShowForm(false);
    setEditingTxn(null);
  };

  // 📝 Pure Django Mutation Logic
  const createMutation = useMutation({
    mutationFn: (data) => api.post("/transactions/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast({ title: "Entry Recorded", description: "Transaction added to ledger." });
      closeForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/transactions/${id}/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast({ title: "Entry Updated", description: "Ledger has been corrected." });
      closeForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/transactions/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast({ variant: "destructive", title: "Entry Deleted" });
    },
  });

  const handleSubmit = (data) => {
    if (editingTxn) updateMutation.mutate({ id: editingTxn.id, data });
    else createMutation.mutate(data);
  };

  const filtered = typeFilter === "all" 
    ? transactions 
    : transactions.filter((t) => t.type === typeFilter);

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Finances</h1>
          <p className="text-stone-500 mt-1 font-medium">Cash flow and expense tracking</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)} 
          className="bg-[#1B4332] hover:bg-[#143326] text-white py-6 px-6 rounded-xl font-bold shadow-lg shadow-emerald-900/10"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Transaction
        </Button>
      </div>

      <FinanceSummary transactions={transactions} />

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-2">
        <Tabs value={typeFilter} onValueChange={setTypeFilter} className="w-full sm:w-auto">
          <TabsList className="bg-stone-100 p-1 rounded-lg">
            <TabsTrigger value="all" className="rounded-md px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">All</TabsTrigger>
            <TabsTrigger value="income" className="rounded-md px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">Income</TabsTrigger>
            <TabsTrigger value="expense" className="rounded-md px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">Expenses</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Transactions List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-stone-400">
          <Loader2 className="w-10 h-10 animate-spin mb-4" />
          <p className="font-medium">Syncing with ledger...</p>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="No records found"
          description="Start tracking your farm's financial health by adding your first transaction."
          actionLabel="Record Transaction"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((txn) => (
            <Card key={txn.id} className="bg-white border border-stone-100 shadow-sm hover:border-stone-200 transition-all p-5 group rounded-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className={cn(
                    "p-3 rounded-2xl shrink-0",
                    txn.type === "income" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                  )}>
                    {txn.type === "income" ? <ArrowUpRight size={24} /> : <ArrowDownRight size={24} />}
                  </div>
                  
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-stone-900 truncate">
                        {txn.description || txn.category?.replace(/_/g, " ")}
                      </h3>
                      {txn.payment_method === "mpesa" && (
                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px] font-bold shadow-none">M-PESA</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-stone-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {txn.date ? format(new Date(txn.date), "dd MMM yyyy") : "No date"}
                      </span>
                      {txn.mpesa_reference && <span className="uppercase">Ref: {txn.mpesa_reference}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 pl-14 sm:pl-0">
                  <p className={cn(
                    "text-xl font-black tracking-tight",
                    txn.type === "income" ? "text-emerald-600" : "text-rose-600"
                  )}>
                    {txn.type === "income" ? "+" : "-"}{formatCurrency(txn.amount || 0)}
                  </p>
                  
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-stone-400 hover:text-stone-900" onClick={() => { setEditingTxn(txn); setShowForm(true); }}>
                      <Pencil size={16} />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-stone-300 hover:text-rose-600" onClick={() => { if (confirm("Delete this record?")) deleteMutation.mutate(txn.id); }}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <FormDialog open={showForm} onOpenChange={closeForm} title={editingTxn ? "Modify Transaction" : "New Transaction"}>
        <TransactionForm 
          transaction={editingTxn} 
          onSubmit={handleSubmit} 
          onCancel={closeForm} 
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </FormDialog>
    </div>
  );
}