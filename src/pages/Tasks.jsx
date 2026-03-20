// @ts-nocheck
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api"; // Traditional Django API bridge
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { 
  Plus, ClipboardList, Pencil, Trash2, Calendar, 
  CheckCircle2, Circle, AlertTriangle, Clock, Loader2 
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { format, parseISO, isValid } from "date-fns";

import FormDialog from "../components/common/FormDialog";
import EmptyState from "../components/common/EmptyState";
import TaskForm from "../components/tasks/TaskForm";
import { toast } from "../hooks/use-toast";
import { cn } from "@/lib/utils";

const priorityConfig = {
  low: { color: "bg-slate-100 text-slate-600 border-slate-200", label: "Low" },
  medium: { color: "bg-blue-50 text-blue-700 border-blue-100", label: "Medium" },
  high: { color: "bg-amber-50 text-amber-700 border-amber-100", label: "High" },
  urgent: { color: "bg-rose-50 text-rose-700 border-rose-100 animate-pulse", label: "Urgent" },
};

const statusIcons = {
  pending: <Circle className="w-5 h-5 text-stone-300" />,
  in_progress: <Clock className="w-5 h-5 text-blue-500" />,
  completed: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
  cancelled: <AlertTriangle className="w-5 h-5 text-stone-400" />,
};

export default function Tasks() {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const queryClient = useQueryClient();

  // 📝 Fetching Tasks from standard Django endpoint
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => api.get("/tasks/?ordering=-created_at"),
  });

  const closeForm = () => { setShowForm(false); setEditingTask(null); };

  // 🔄 Pure Django Mutation Logic
  const createMutation = useMutation({
    mutationFn: (data) => api.post("/tasks/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({ title: "Task Created", description: "Your schedule has been updated." });
      closeForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/tasks/${id}/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({ title: "Task Updated" });
      closeForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/tasks/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({ variant: "destructive", title: "Task Deleted" });
    },
  });

  const handleStatusToggle = (task) => {
    const nextStatus = task.status === "completed" ? "pending" : "completed";
    // Using PATCH here because we only want to update the status field
    updateMutation.mutate({ id: task.id, data: { ...task, status: nextStatus } });
  };

  const filtered = statusFilter === "all" ? tasks : tasks.filter((t) => t.status === statusFilter);

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Farm Tasks</h1>
          <p className="text-stone-500 mt-1 font-medium italic">Your daily fieldwork checklist</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)} 
          className="bg-[#1B4332] hover:bg-[#143326] text-white py-6 px-6 rounded-xl font-bold shadow-lg shadow-emerald-900/10 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Task
        </Button>
      </div>

      {/* Filter Tabs */}
      <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full">
        <TabsList className="bg-stone-100 p-1 rounded-xl">
          <TabsTrigger value="all" className="rounded-lg px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">All</TabsTrigger>
          <TabsTrigger value="pending" className="rounded-lg px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">Pending</TabsTrigger>
          <TabsTrigger value="in_progress" className="rounded-lg px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">In Progress</TabsTrigger>
          <TabsTrigger value="completed" className="rounded-lg px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Task List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-stone-400">
          <Loader2 className="w-10 h-10 animate-spin mb-4" />
          <p className="font-medium tracking-wide uppercase text-xs">Syncing Tasks...</p>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="Clear schedule"
          description="All tasks for this view are caught up. Time to plan the next phase?"
          actionLabel="Add New Task"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((task) => (
            <Card key={task.id} className="bg-white border border-stone-100 shadow-sm hover:border-stone-200 transition-all p-5 group rounded-2xl">
              <div className="flex items-start gap-4">
                <button 
                  onClick={() => handleStatusToggle(task)} 
                  className="mt-1 transition-all active:scale-90 hover:opacity-80"
                >
                  {statusIcons[task.status] || statusIcons.pending}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className={cn(
                      "text-lg font-bold transition-all",
                      task.status === "completed" ? "line-through text-stone-300" : "text-stone-900"
                    )}>
                      {task.title}
                    </h3>
                    <Badge variant="outline" className={cn("text-[10px] font-bold uppercase tracking-wider px-2 shadow-none", priorityConfig[task.priority]?.color)}>
                      {priorityConfig[task.priority]?.label || "Normal"}
                    </Badge>
                    <Badge variant="secondary" className="bg-stone-100 text-stone-500 text-[10px] uppercase font-bold border-none">
                      {task.category?.replace(/_/g, " ")}
                    </Badge>
                  </div>

                  {task.description && (
                    <p className="text-sm text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 mt-3 text-[11px] font-bold text-stone-400 uppercase tracking-tight">
                    {task.due_date && (
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {isValid(parseISO(task.due_date)) ? format(parseISO(task.due_date), "dd MMM yyyy") : task.due_date}
                      </span>
                    )}
                    {task.assigned_to && <span>• {task.assigned_to}</span>}
                    {task.related_field && <span>• {task.related_field}</span>}
                  </div>
                </div>

                <div className="flex gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-stone-400" onClick={() => { setEditingTask(task); setShowForm(true); }}>
                    <Pencil size={16} />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-stone-300 hover:text-rose-600" onClick={() => { if (confirm("Delete task?")) deleteMutation.mutate(task.id); }}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <FormDialog open={showForm} onOpenChange={closeForm} title={editingTask ? "Update Activity" : "New Farm Task"}>
        <TaskForm 
          task={editingTask} 
          onSubmit={(data) => {
            if (editingTask) updateMutation.mutate({ id: editingTask.id, data });
            else createMutation.mutate(data);
          }} 
          onCancel={closeForm} 
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </FormDialog>
    </div>
  );
}