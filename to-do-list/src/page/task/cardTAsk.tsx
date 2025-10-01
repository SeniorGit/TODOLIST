import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FormTask } from "./formtask";
import { Task } from "@/types/task/typeTask";


interface CardTaskProps {
  tasks: Task[];
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, updates: Partial<Task>) => Promise<void>; 
  onRefresh: () => Promise<void>;
}

export function CardTask({tasks, onDelete, onUpdate, onRefresh}: CardTaskProps) {
  const handleDelete = async (taskId: number) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await onDelete(taskId);
      await onRefresh();
    }
  };

  const handleUpdate = async (taskId: number, updates: Partial<Task>) => { 
    await onUpdate(taskId, updates);
    await onRefresh();
  };

  const handleCheckboxChange = async (taskId: number, completed: boolean) => {
    await handleUpdate(taskId, { is_completed: completed });
  };

  // PRIORITY COLOR MAPPING
  const getPriorityColor = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div 
          key={task.id} 
          className={`
            p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between 
            bg-white border border-gray-200 
            rounded-lg shadow-sm hover:shadow-md 
            transition-all duration-200 gap-3 sm:gap-4
            ${task.is_completed ? 'opacity-60' : 'opacity-100'}
          `}
        >
          {/* ✅ RESPONSIVE LEFT SIDE CONTENT */}
          <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 w-full sm:flex-1">
            <input
              type="checkbox"
              checked={task.is_completed}
              onChange={(e) => handleCheckboxChange(task.id, e.target.checked)}
              className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer mt-1 sm:mt-0 flex-shrink-0"
            />
            
            {/* ✅ RESPONSIVE TASK CONTENT */}
            <div className="flex-1 min-w-0 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                <span className={`
                  font-medium break-words text-sm sm:text-base
                  ${task.is_completed ? 'line-through text-gray-500' : 'text-gray-900'}
                `}>
                  {task.title}
                </span>
                
                {/* ✅ RESPONSIVE PRIORITY BADGE */}
                {task.priority && (
                  <span className={`
                    px-2 py-1 text-xs font-medium rounded-full border w-fit
                    ${getPriorityColor(task.priority)}
                  `}>
                    {task.priority}
                  </span>
                )}
              </div>
              
              {/* ✅ RESPONSIVE META INFO */}
              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                {task.category && (
                  <span>📁 {task.category}</span>
                )}
                {task.due_date && (
                  <span>📅 {new Date(task.due_date).toLocaleDateString()}</span>
                )}
              </div>
              
              {/* ✅ RESPONSIVE NOTES */}
              {task.note && (
                <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-1 sm:line-clamp-2">
                  {task.note}
                </p>
              )}
            </div>
          </div>

          {/* ✅ RESPONSIVE RIGHT SIDE ACTIONS */}
          <div className="flex sm:flex-col lg:flex-row gap-2 w-full sm:w-auto justify-end sm:justify-start">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1 sm:flex-none text-blue-600 border-blue-200 hover:bg-blue-50 text-xs sm:text-sm"
                >
                  <span className="sm:hidden">✏️</span>
                  <span className="hidden sm:inline">Edit</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Task</DialogTitle>
                  <DialogDescription>
                    Make changes to your task here.
                  </DialogDescription>
                </DialogHeader>
                <FormTask 
                  task={task}  
                  onTaskUpdated={onRefresh}
                  onUpdateTask={onUpdate} 
                />
              </DialogContent>
            </Dialog>
            
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(task.id)}
              className="flex-1 sm:flex-none text-white bg-red-500 hover:bg-red-600 text-xs sm:text-sm"
            >
              <span className="sm:hidden">🗑️</span>
              <span className="hidden sm:inline">Delete</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}