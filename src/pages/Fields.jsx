// @ts-nocheck
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api"; // Switched to pure Django API bridge
import { Button } from "../components/ui/button";
import { Plus, Sprout } from "lucide-react";
import FormDialog from "../components/common/FormDialog";
import EmptyState from "../components/common/EmptyState";
import FieldForm from "../components/fields/FieldForm";
import FieldCard from "../components/fields/FieldCard";

export default function Fields() {
  const [showForm, setShowForm] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const queryClient = useQueryClient();

  // 🚜 Fetching fields from standard Django endpoint
  const { data: fields = [], isLoading } = useQuery({
    queryKey: ["fields"],
    queryFn: () => api.get("/fields/?ordering=-created_at"),
  });

  // 📝 Create Mutation
  const createMutation = useMutation({
    mutationFn: (data) => api.post("/fields/", data),
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ["fields"] }); 
      closeForm(); 
    },
  });

  // ✏️ Update Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/fields/${id}/`, data),
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ["fields"] }); 
      closeForm(); 
    },
  });

  // 🗑️ Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/fields/${id}/`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["fields"] }),
  });

  const closeForm = () => { 
    setShowForm(false); 
    setEditingField(null); 
  };

  const handleSubmit = (data) => {
    if (editingField) {
      updateMutation.mutate({ id: editingField.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (field) => { 
    setEditingField(field); 
    setShowForm(true); 
  };

  const handleDelete = (field) => { 
    if (confirm("Are you sure you want to delete this field? This action cannot be undone.")) {
      deleteMutation.mutate(field.id); 
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-900 tracking-tight">
            Fields & Plots
          </h1>
          <p className="text-stone-500 mt-1 font-medium">
            Manage your farm land and crop distribution
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-[#1B4332] hover:bg-[#2D6A4F] text-white shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> Add Field
        </Button>
      </div>

      {/* Main Content Area */}
      {fields.length === 0 && !isLoading ? (
        <EmptyState
          icon={Sprout}
          title="No fields yet"
          description="Start by adding your first field or plot to track crops and manage your land."
          actionLabel="Add First Field"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fields.map((field) => (
            <FieldCard 
              key={field.id} 
              field={field} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      )}

      {/* Form Modal */}
      <FormDialog 
        open={showForm} 
        onOpenChange={closeForm} 
        title={editingField ? "Edit Field" : "Add New Field"}
      >
        <FieldForm 
          field={editingField} 
          onSubmit={handleSubmit} 
          onCancel={closeForm} 
        />
      </FormDialog>
    </div>
  );
}