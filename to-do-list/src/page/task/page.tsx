"use client"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"


interface Task {
  id: number;
  title: string;
  is_completed: boolean;
}

export default function Task() {
  const [tasks, setTasks] = useState<Task[]>([]);
  
  useEffect(() => {
    fetchTasks();
  }, []);

  // request to get all requst from api 
  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:3000/tasks"); 
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: Task[] = await response.json();
      setTasks(data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

// add new task
  const addTask = async (title: string) => {
    try {
      const response = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });
      if (response.ok) {
        fetchTasks(); 
      }
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

// update task 
  const updateTask = async (id: number, updates: Partial<Task>) => {
    try {
      const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });
      if (response.ok) {
        fetchTasks();
      }
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };
  
// delete task
  const deleteTask = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchTasks();
      }
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  return (
    <div className="bg-primary-background w-full p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Todo List</h1>
          <Button 
            className="bg-buttonColor"
            onClick={() => {
              const title = prompt("Enter task title:");
              if (title) addTask(title);
            }}
          >
            Add Task
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-[20px] gap-2">
          <div className=" gap-2">
            <div className="divide-y divide-amber-700">
              {tasks.map((task) => (
                <div key={task.id} className="p-4 flex items-center justify-between bg-amber-500 m-2 rounded-[10px]">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={task.is_completed}
                      onChange={(e) => updateTask(task.id, { is_completed: e.target.checked })}
                      className="h-5 w-5 text-blue-600"
                    />
                    <span className={task.is_completed ? "line-through text-gray-500" : "text-gray-900"}>
                      {task.title}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newTitle = prompt("Edit task:", task.title);
                        if (newTitle) updateTask(task.id, { title: newTitle });
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>

          </div>
          
          {tasks.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No tasks yet. Add your first task!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}