import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { CreateTaskRequest, Task } from "@/types/task/typeTask";

interface FormTaskProps {
  onTaskAdded?: () => void;
  onTaskUpdated?: () => void;
  task?: Task;
  onAddTask?: (taskData: Omit<CreateTaskRequest, 'id'>) => Promise<void>;
  onUpdateTask?: (id: number, taskData: Partial<Task>) => Promise<void>;
}

export function FormTask({ 
    onTaskAdded, 
    onTaskUpdated, 
    task, 
    onAddTask, 
    onUpdateTask 
}: FormTaskProps) {

    const [formData, setFormData] = useState({
        title: "",
        category: "",
        priority: "medium",
        note: "", 
        due_date: "",
        reminder: ""
    })

    //to show data for update
    useEffect(() => {
    if (task) {
        
        const convertISODateToHTMLDate = (isoString: string | undefined): string => {
        if (!isoString) return "";
        try {
            const date = new Date(isoString);
            if (isNaN(date.getTime())) return "";
            return date.toISOString().split('T')[0];
        } catch {
            return "";
        }
        };

        const convertISODateToHTMLDateTime = (isoString: string | undefined): string => {
        if (!isoString) return "";
        try {
            const date = new Date(isoString);
            if (isNaN(date.getTime())) return "";
            return date.toISOString().slice(0, 16);
        } catch {
            return "";
        }
        };

        setFormData({
        title: task.title || "",
        category: task.category || "",
        priority: task.priority || "medium", 
        note: task.note || "",
        due_date: convertISODateToHTMLDate(task.due_date),     
        reminder: convertISODateToHTMLDateTime(task.reminder)  
        });
        
        
    } else {
        setFormData({
        title: "",
        category: "",
        priority: "medium",
        note: "", 
        due_date: "",
        reminder: ""
        });
    }
    }, [task]);
    
    const [isLoading, setIsLoading] = useState(false);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>{
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
    
    try {
        
        if (task?.id && onUpdateTask) {   
            
            await onUpdateTask(task.id, formData);
            if (onTaskUpdated) onTaskUpdated();
        } else if (onAddTask) {
            const createData: CreateTaskRequest = {
                ...formData,
                is_completed: false 
            };
            
            await onAddTask(createData);
            if (onTaskAdded) onTaskAdded();
        }
        
        // Reset form
        setFormData({
            title: "", 
            category: "", 
            priority: "medium", 
            note: "", 
            due_date: "", 
            reminder: ""
        });
        
        } catch (error) {
            console.error("Failed to save task:", error);
            alert("Failed to save task! Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="grid gap-3 sm:gap-4">
                <div className="grid gap-2 sm:gap-3">
                    <Label htmlFor="title" className="text-sm sm:text-base">Task Title</Label>
                    <Input 
                        id="title" 
                        name="title" 
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="Input task title"
                        className="text-sm sm:text-base"
                    />
                </div>
                <div className="grid gap-2 sm:gap-3">
                    <Label htmlFor="note" className="text-sm sm:text-base">Note</Label>
                    <Textarea
                        id="note" 
                        name="note" 
                        value={formData.note}
                        onChange={handleChange}
                        className="text-sm sm:text-base min-h-[80px] sm:min-h-[100px]"
                        placeholder="Add your notes here..."
                    />
                </div>
                <div className="grid gap-2 sm:gap-3">
                    <Label htmlFor="category" className="text-sm sm:text-base">Category</Label>
                    <Input 
                        id="category" 
                        name="category" 
                        value={formData.category}
                        onChange={handleChange}
                        className="text-sm sm:text-base"
                        placeholder="e.g., Work, Personal"
                    />
                </div>
                <div className="grid gap-2 sm:gap-3">
                    <Label htmlFor="priority" className="text-sm sm:text-base">Priority</Label>
                    <Input 
                        id="priority" 
                        name="priority" 
                        value={formData.priority}
                        onChange={handleChange}
                        className="text-sm sm:text-base"
                        placeholder="high, medium, low"
                    />
                </div>
                <div className="grid gap-2 sm:gap-3">
                    <Label htmlFor="due_date" className="text-sm sm:text-base">Due Date</Label>
                    <Input 
                        type="date"
                        id="due_date" 
                        name="due_date" 
                        value={formData.due_date}
                        onChange={handleChange} 
                        className="text-sm sm:text-base"
                    />
                </div>
                <div className="grid gap-2 sm:gap-3">
                    <Label htmlFor="reminder" className="text-sm sm:text-base">Reminder</Label>
                    <Input 
                        type="datetime-local"
                        id="reminder" 
                        name="reminder" 
                        value={formData.reminder}
                        onChange={handleChange}
                        className="text-sm sm:text-base"
                    />
                </div>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full text-sm sm:text-base">
                {isLoading ? "Saving..." : (task?.id ? "Update Task" : "Add Task")}
            </Button>
        </form>
    )
}