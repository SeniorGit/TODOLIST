import { Task, CreateTaskRequest } from "@/types/task/typeTask";
import { useEffect, useState } from "react";

export const useFetchTask = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(true); 
    const [error, setError] = useState<string | null>(null); 
  
    useEffect(() => {
        fetchTasks();
    }, []);
  
    // Req Get All
    const fetchTasks = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch("http://localhost:3000/tasks"); 
            if (!response.ok) {
                throw new Error('Failed to fetch tasks from server');
            }
            const data: Task[] = await response.json();
            setTasks(data);
        } catch (err) {
            console.error("Error fetching tasks:", err);
            setError(err instanceof Error ? err.message : 'Unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    // Add New Task
    const addTask = async (taskData: CreateTaskRequest) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch("http://localhost:3000/tasks", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    title: taskData.title,
                    note: taskData.note,
                    category: taskData.category,
                    priority: taskData.priority,
                    due_date: taskData.due_date,
                    reminder: taskData.reminder,
                    is_completed: taskData.is_completed || false 
                }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to add task');
            }
            
            await fetchTasks();
            return response.json();
            
        } catch (err) {
            console.error("Error adding task:", err);
            setError(err instanceof Error ? err.message : 'Failed to add task');
            throw err; 
        } finally {
            setLoading(false);
        }
    };
  
    // Update Task
    const updateTask = async (id: number, updates: Partial<Task>) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`http://localhost:3000/tasks/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updates),
            });
            
            if (!response.ok) {
                throw new Error('Failed to update task');
            }
            
            await fetchTasks();
            return response.json();
            
        } catch (err) {
            console.error("Error updating task:", err);
            setError(err instanceof Error ? err.message : 'Failed to update task');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Delete Task
    const deleteTask = async (id: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`http://localhost:3000/tasks/${id}`, {
                method: "DELETE",
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete task');
            }
            
            await fetchTasks();
            
        } catch (err) {
            console.error("Error deleting task:", err);
            setError(err instanceof Error ? err.message : 'Failed to delete task');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        tasks,
        loading, 
        error,   
        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
    };
};