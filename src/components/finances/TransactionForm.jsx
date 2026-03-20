// @ts-nocheck
import React, { useState } from "react";
// Adjusted to standard relative paths
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wallet, Landmark, Phone, ReceiptText } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = {
  expense: ["seeds", "fertilizer", "pesticides", "labor", "equipment", "veterinary", "feed", "transport", "other"],
  income: ["crop_sale", "livestock_sale", "milk_sale", "other"],
};

export default function TransactionForm({ transaction, onSubmit, onCancel }) {
  const [form, setForm] = useState(transaction || {
    type: "expense", 
    category: "other", 
    amount: "",
    description: "", 
    payment_method: "cash", 
    mpesa_reference: "",
    date: new Date().toISOString().split("T")[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Safety: ensure amount is a valid number for Django's DecimalField
    const finalAmount = parseFloat(form.amount);
    if (isNaN(finalAmount) || finalAmount <= 0) {
        alert("Please enter a valid amount greater than 0");
        return;
    }
    
    onSubmit({ 
      ...form, 
      amount: finalAmount,
      // Ensure reference is null if not mpesa to keep Django data clean
      mpesa_reference: form.payment_method === "mpesa" ? form.mpesa_reference : null 
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Transaction Type with Color Feedback */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Transaction Type *</Label>
          <Select 
            value={form.type} 
            onValueChange={(v) => setForm({ ...form, type: v, category: "other" })}
          >
            <SelectTrigger className={cn(
              "font-medium",
              form.type === "income" ? "text-emerald-600 border-emerald-100 bg-emerald-50/30" : "text-rose-600 border-rose-100 bg-rose-50/30"
            )}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income" className="text-emerald-600">Income (+)</SelectItem>
              <SelectItem value="expense" className="text-rose-600">Expense (-)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Amount (KES) *</Label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-400 text-sm font-medium">KES</span>
            <Input 
              type="number" 
              step="0.01"
              className="pl-12 font-bold text-lg"
              value={form.amount} 
              onChange={(e) => setForm({ ...form, amount: e.target.value })} 
              required 
              placeholder="0.00" 
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Category */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Category</Label>
          <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {(categories[form.type] || categories.expense).map((c) => (
                <SelectItem key={c} value={c}>
                  {c.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Date</Label>
          <Input 
            type="date" 
            value={form.date} 
            onChange={(e) => setForm({ ...form, date: e.target.value })} 
            className="cursor-pointer"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Payment Method */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Payment Method</Label>
          <Select value={form.payment_method} onValueChange={(v) => setForm({ ...form, payment_method: v })}>
            <SelectTrigger>
              <div className="flex items-center gap-2">
                {form.payment_method === "mpesa" && <Phone className="w-3.5 h-3.5 text-emerald-600" />}
                {form.payment_method === "cash" && <Wallet className="w-3.5 h-3.5 text-amber-600" />}
                {form.payment_method === "bank_transfer" && <Landmark className="w-3.5 h-3.5 text-blue-600" />}
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="mpesa">M-Pesa</SelectItem>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              <SelectItem value="cheque">Cheque</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Conditional M-Pesa Reference */}
        {form.payment_method === "mpesa" && (
          <div className="space-y-2 animate-in slide-in-from-left-2 duration-300">
            <Label className="text-sm font-semibold text-emerald-700">M-Pesa Reference Number</Label>
            <Input 
              value={form.mpesa_reference} 
              onChange={(e) => setForm({ ...form, mpesa_reference: e.target.value.toUpperCase() })} 
              placeholder="e.g. RHL123XYZ" 
              className="border-emerald-200 focus:ring-emerald-500 uppercase"
              required
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold flex items-center gap-2">
          <ReceiptText className="w-4 h-4 text-gray-400" /> Description
        </Label>
        <Textarea 
          value={form.description} 
          onChange={(e) => setForm({ ...form, description: e.target.value })} 
          rows={3} 
          placeholder="e.g. Bought 5 bags of CAN fertilizer" 
          className="resize-none"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button 
          type="button" 
          variant="ghost" 
          onClick={onCancel}
          className="text-gray-500 hover:bg-gray-50"
        >
          Cancel
        </Button>
        <Button type="submit" className="bg-[#1B4332] hover:bg-[#2D6A4F] text-white px-10">
          {transaction ? "Update Record" : "Save Transaction"}
        </Button>
      </div>
    </form>
  );
}