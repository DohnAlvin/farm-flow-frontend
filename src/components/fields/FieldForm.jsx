// @ts-nocheck
import React, { useState } from "react";
// Adjusted to standard relative paths
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sprout, Map, Calendar, Info } from "lucide-react";

/**
 * Form for creating or editing a Field.
 * @param {Object} props
 * @param {Object} [props.field] - The existing field data if editing, null if creating new
 * @param {Function} props.onSubmit - Callback fired with the cleaned form payload
 * @param {Function} props.onCancel - Callback fired to close or cancel the form
 */
export default function FieldForm({ field, onSubmit, onCancel }) {
  // Ensure we handle potential null values from the API for dates
  const [form, setForm] = useState(field || {
    name: "", 
    size_acres: "", 
    crop: "", 
    status: "fallow",
    planting_date: "", 
    expected_harvest_date: "", 
    soil_type: "loam", 
    notes: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Cleaning data for Django: 
    // Convert empty date strings to null so the backend doesn't reject them
    const payload = {
      ...form,
      size_acres: parseFloat(form.size_acres) || 0,
      planting_date: form.planting_date || null,
      expected_harvest_date: form.expected_harvest_date || null,
      crop: form.crop || null,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Field Name */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <Map className="w-4 h-4 text-[#1B4332]" /> Field Name *
          </Label>
          <Input 
            placeholder="e.g., North Hill Section"
            value={form.name} 
            onChange={(e) => setForm({ ...form, name: e.target.value })} 
            required 
            className="focus:ring-[#1B4332]"
          />
        </div>

        {/* Size */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Size (Acres) *</Label>
          <Input 
            type="number" 
            step="0.01" 
            min="0"
            placeholder="0.00"
            value={form.size_acres} 
            onChange={(e) => setForm({ ...form, size_acres: e.target.value })} 
            required 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Crop */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <Sprout className="w-4 h-4 text-[#1B4332]" /> Current Crop
          </Label>
          <Input 
            value={form.crop || ""} 
            onChange={(e) => setForm({ ...form, crop: e.target.value })} 
            placeholder="Leave blank if fallow" 
          />
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Status</Label>
          <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
            <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="planted">Planted</SelectItem>
              <SelectItem value="growing">Growing</SelectItem>
              <SelectItem value="harvesting">Harvesting</SelectItem>
              <SelectItem value="fallow">Fallow</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Planting Date */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" /> Planting Date
          </Label>
          <Input 
            type="date" 
            value={form.planting_date || ""} 
            onChange={(e) => setForm({ ...form, planting_date: e.target.value })} 
          />
        </div>

        {/* Expected Harvest */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" /> Expected Harvest
          </Label>
          <Input 
            type="date" 
            value={form.expected_harvest_date || ""} 
            onChange={(e) => setForm({ ...form, expected_harvest_date: e.target.value })} 
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold">Soil Type</Label>
        <Select value={form.soil_type} onValueChange={(v) => setForm({ ...form, soil_type: v })}>
          <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="clay">Clay</SelectItem>
            <SelectItem value="sandy">Sandy</SelectItem>
            <SelectItem value="loam">Loam</SelectItem>
            <SelectItem value="silt">Silt</SelectItem>
            <SelectItem value="peat">Peat</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold flex items-center gap-2">
          <Info className="w-4 h-4 text-gray-400" /> Notes
        </Label>
        <Textarea 
          placeholder="Specific details about soil health, fertilizer history, etc."
          value={form.notes || ""} 
          onChange={(e) => setForm({ ...form, notes: e.target.value })} 
          rows={3} 
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
        <Button type="submit" className="bg-[#1B4332] hover:bg-[#2D6A4F] text-white px-8">
          {field ? "Save Changes" : "Register Field"}
        </Button>
      </div>
    </form>
  );
}