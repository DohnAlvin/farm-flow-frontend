// @ts-nocheck
import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api"; // Traditional Django API bridge
import { Button } from "../components/ui/button";
import { Plus, Activity, Loader2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";

import FormDialog from "../components/common/FormDialog";
import EmptyState from "../components/common/EmptyState";
import LivestockForm from "../components/livestock/LivestockForm";
import LivestockCard from "../components/livestock/LivestockCard";
import { toast } from "../hooks/use-toast";

export default function Livestock() {
  const [showForm, setShowForm] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const queryClient = useQueryClient();

  // 🐄 Fetching Herd from standard Django endpoint
  const { data: animals = [], isLoading } = useQuery({
    queryKey: ["livestock"],
    queryFn: () => api.get("/livestock/?ordering=-created_at"),
  });

  // 🧠 Memoized Categories for Performance
  const types = useMemo(() => {
    return [...new Set(animals.map((a) => a.animal_type))].filter(Boolean);
  }, [animals]);

  const closeForm = () => {
    setShowForm(false);
    setEditingAnimal(null);
  };

  // 📝 Pure Django Mutation Logic
  const createMutation = useMutation({
    mutationFn: (data) => api.post("/livestock/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["livestock"] });
      toast({ title: "Animal Registered", description: "The new record has been added to your herd." });
      closeForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/livestock/${id}/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["livestock"] });
      toast({ title: "Record Updated", description: "Animal details have been saved." });
      closeForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/livestock/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["livestock"] });
      toast({ variant: "destructive", title: "Record Removed", description: "The animal has been removed from the registry." });
    },
  });

  const handleSubmit = (data) => {
    if (editingAnimal) updateMutation.mutate({ id: editingAnimal.id, data });
    else createMutation.mutate(data);
  };

  const handleEdit = (a) => { 
    setEditingAnimal(a); 
    setShowForm(true); 
  };
  
  const handleDelete = (a) => { 
    if (window.confirm(`Are you sure you want to remove ${a.tag_number || 'this animal'} from the records?`)) {
      deleteMutation.mutate(a.id); 
    }
  };

  const filtered = filterType === "all" 
    ? animals 
    : animals.filter((a) => a.animal_type === filterType);

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Livestock</h1>
          <p className="text-stone-500 mt-1 font-medium">Registry and health tracking for your herd</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)} 
          className="bg-[#1B4332] hover:bg-[#143326] text-white py-6 px-6 rounded-xl font-bold shadow-lg shadow-emerald-900/10"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Animal
        </Button>
      </div>

      {/* Dynamic Category Tabs */}
      {!isLoading && animals.length > 0 && (
        <Tabs value={filterType} onValueChange={setFilterType} className="w-full">
          <TabsList className="bg-stone-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto justify-start shadow-none border-none">
            <TabsTrigger value="all" className="rounded-lg px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold">
              All ({animals.length})
            </TabsTrigger>
            {types.map((t) => (
              <TabsTrigger key={t} value={t} className="capitalize rounded-lg px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold">
                {t} ({animals.filter((a) => a.animal_type === t).length})
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      {/* List State Handling */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-stone-400">
          <Loader2 className="w-10 h-10 animate-spin mb-4" />
          <p className="font-medium">Fetching herd data...</p>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Activity}
          title={filterType === "all" ? "No livestock found" : `No ${filterType} registered`}
          description="Keep track of health, breeding, and production by adding your first animal."
          actionLabel="Register Animal"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((animal) => (
            <LivestockCard 
              key={animal.id} 
              animal={animal} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      )}

      <FormDialog 
        open={showForm} 
        onOpenChange={closeForm} 
        title={editingAnimal ? "Edit Animal Profile" : "Register New Animal"}
      >
        <LivestockForm 
          animal={editingAnimal} 
          onSubmit={handleSubmit} 
          onCancel={closeForm} 
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </FormDialog>
    </div>
  );
}