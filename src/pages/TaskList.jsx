// @ts-nocheck
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api'; // Switched to pure Django API bridge
import { ClipboardList, Loader2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

const TaskList = () => {
  // 🚜 Pure Django Data Fetching via React Query
  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => api.get('/tasks/?ordering=-due_date'),
  });

  // Priority styling helper
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'urgent': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'high': return 'text-amber-600 bg-amber-50 border-amber-100';
      default: return 'text-stone-600 bg-stone-50 border-stone-100';
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-stone-400">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p className="font-medium font-mono text-sm uppercase tracking-widest">Syncing Tasks...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-0">
      <div className="flex items-center justify-between border-b border-stone-200 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">🚜 Farm Tasks</h1>
          <p className="text-stone-500 font-medium">Daily operations and field maintenance</p>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="bg-stone-50 border-2 border-dashed border-stone-200 rounded-2xl p-12 text-center">
          <div className="bg-white w-12 h-12 rounded-xl shadow-sm flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="text-stone-300" />
          </div>
          <p className="text-stone-500 font-medium">No tasks found. Add one in the Django Admin!</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {tasks.map(task => (
            <li 
              key={task.id} 
              className="group bg-white border border-stone-200 p-4 rounded-xl flex items-center justify-between hover:shadow-md hover:border-emerald-200 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                  task.status === 'completed' ? "bg-emerald-50 text-emerald-600" : "bg-stone-100 text-stone-400"
                )}>
                  {task.status === 'completed' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                </div>
                
                <div>
                  <h3 className={cn(
                    "font-bold text-stone-900",
                    task.status === 'completed' && "line-through text-stone-400"
                  )}>
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-medium text-stone-400 uppercase tracking-tighter">
                      {task.category?.replace(/_/g, ' ') || 'General'}
                    </span>
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase",
                      getPriorityColor(task.priority)
                    )}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right shrink-0">
                 <p className="text-[10px] font-black text-stone-400 uppercase">Due Date</p>
                 <p className="text-sm font-bold text-stone-600">
                   {task.due_date || 'No Date'}
                 </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;