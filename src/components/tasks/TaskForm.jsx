// @ts-nocheck
import React, { useState } from "react";
// Adjusted to standard relative paths
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, User, MapPin, AlertCircle, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TaskForm({ task, onSubmit, onCancel }) {
  const [form, setForm] = useState(task || {
    title: "", 
    description: "", 
    category: "other", 
    priority: "medium",
    status: "pending", 
    due_date: "", 
    assigned_to: "", 
    related_field: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ensure empty strings are sent as null for cleaner Django database records
    const payload = {
      ...form,
      due_date: form.due_date || null,
      assigned_to: form.assigned_to || null,
      related_field: form.related_field || null,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-400">
      {/* Title Section */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-[#1B4332]" /> Task Title *
        </Label>
        <Input 
          value={form.title} 
          onChange={(e) => setForm({ ...form, title: e.target.value })} 
          required 
          placeholder="e.g. Vaccinate goats in Section B"
          className="focus:ring-[#1B4332]"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold">Description</Label>
        <Textarea 
          value={form.description} 
          onChange={(e) => setForm({ ...form, description: e.target.value })} 
          rows={2} 
          placeholder="Specific instructions for the worker..."
          className="resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Category */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Category</Label>
          <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
            <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["planting", "irrigation", "fertilizing", "pest_control", "harvesting", "feeding", "veterinary", "maintenance", "other"].map((c) => (
                <SelectItem key={c} value={c}>
                  {c.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <AlertCircle className={cn(
              "w-4 h-4",
              form.priority === 'urgent' ? "text-rose-600 animate-pulse" : "text-gray-400"
            )} /> 
            Priority Level
          </Label>
          <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
            <SelectTrigger className={cn(
              "bg-white",
              form.priority === 'urgent' && "border-rose-200 bg-rose-50 text-rose-700 font-bold",
              form.priority === 'high' && "text-orange-700"
            )}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Due Date */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" /> Deadline
          </Label>
          <Input 
            type="date" 
            value={form.due_date || ""} 
            onChange={(e) => setForm({ ...form, due_date: e.target.value })} 
          />
        </div>

        {/* Assignment */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" /> Assigned To
          </Label>
          <Input 
            value={form.assigned_to || ""} 
            onChange={(e) => setForm({ ...form, assigned_to: e.target.value })} 
            placeholder="Search workers..." 
          />
        </div>
      </div>

      {/* Related Field */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-400" /> Related Location / Field
        </Label>
        <Input 
          value={form.related_field || ""} 
          onChange={(e) => setForm({ ...form, related_field: e.target.value })} 
          placeholder="e.g. Tomato Greenhouse, Paddock 3" 
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button 
          type="button" 
          variant="ghost" 
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          Cancel
        </Button>
        <Button type="submit" className="bg-[#1B4332] hover:bg-[#2D6A4F] text-white px-10">
          {task ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </form>
  );
}