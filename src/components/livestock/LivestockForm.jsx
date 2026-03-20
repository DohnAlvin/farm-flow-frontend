// @ts-nocheck
import React, { useState } from "react";
// Adjusted to standard relative paths
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tag, Clipboard, Activity, Scale, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Form for creating or editing Livestock records.
 */
export default function LivestockForm({ animal, onSubmit, onCancel }) {
  const [form, setForm] = useState(animal || {
    animal_type: "cattle", 
    tag_id: "", 
    name: "", 
    breed: "",
    gender: "male", 
    date_of_birth: "", 
    health_status: "healthy",
    weight_kg: "", 
    notes: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Data cleaning for Django: ensure weights are numbers and empty dates are null
    const payload = {
      ...form,
      weight_kg: parseFloat(form.weight_kg) || 0,
      date_of_birth: form.date_of_birth || null,
      name: form.name || null,
    };
    
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-400">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Animal Type */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Animal Species *</Label>
          <Select value={form.animal_type} onValueChange={(v) => setForm({ ...form, animal_type: v })}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select species" />
            </SelectTrigger>
            <SelectContent>
              {["cattle", "goats", "sheep", "poultry", "pigs", "rabbits", "donkeys", "other"].map((t) => (
                <SelectItem key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tag ID */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#1B4332]" /> Tag ID / Ear Tag *
          </Label>
          <Input 
            value={form.tag_id} 
            onChange={(e) => setForm({ ...form, tag_id: e.target.value.toUpperCase() })} 
            required 
            placeholder="e.g. L-102"
            className="font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <Clipboard className="w-4 h-4 text-gray-400" /> Animal Name
          </Label>
          <Input 
            value={form.name || ""} 
            onChange={(e) => setForm({ ...form, name: e.target.value })} 
            placeholder="e.g. Bessie (Optional)" 
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Breed / Variety</Label>
          <Input 
            value={form.breed || ""} 
            onChange={(e) => setForm({ ...form, breed: e.target.value })} 
            placeholder="e.g. Holstein-Friesian" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Gender</Label>
          <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
            <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#D4A373]" /> Weight (kg)
          </Label>
          <Input 
            type="number" 
            step="0.1"
            value={form.weight_kg} 
            onChange={(e) => setForm({ ...form, weight_kg: e.target.value })} 
            placeholder="0.0"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" /> Health Status
          </Label>
          <Select value={form.health_status} onValueChange={(v) => setForm({ ...form, health_status: v })}>
            <SelectTrigger className={cn(
              "bg-white",
              form.health_status === 'sick' && "border-rose-300 text-rose-600"
            )}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="healthy">Healthy</SelectItem>
              <SelectItem value="sick">Sick</SelectItem>
              <SelectItem value="under_treatment">Under Treatment</SelectItem>
              <SelectItem value="quarantined">Quarantined</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" /> Date of Birth
        </Label>
        <Input 
          type="date" 
          value={form.date_of_birth || ""} 
          onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} 
        />
        <p className="text-[10px] text-gray-400 italic">Approximate if exact date is unknown</p>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold">Medical Notes & History</Label>
        <Textarea 
          value={form.notes || ""} 
          onChange={(e) => setForm({ ...form, notes: e.target.value })} 
          rows={3} 
          placeholder="Vaccinations, past illnesses, etc."
          className="resize-none"
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
          {animal ? "Save Changes" : "Register Animal"}
        </Button>
      </div>
    </form>
  );
}