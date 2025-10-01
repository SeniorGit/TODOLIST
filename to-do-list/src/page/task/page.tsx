"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { FormTask } from "./formtask"
import { useFetchTask } from "@/lib/action/task/actionTask"
import { CardTask } from "./cardTAsk"

export default function Task() {
  const { tasks, fetchTasks, deleteTask, updateTask, addTask, loading, error } = useFetchTask(); 
  
  // Skeleton
  const TaskSkeleton = () => (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 flex items-center justify-between bg-white border border-gray-200 rounded-lg animate-pulse">
          <div className="flex items-center space-x-4 flex-1">
            <div className="h-5 w-5 bg-gray-200 rounded"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="flex space-x-2">
            <div className="h-8 w-16 bg-gray-200 rounded"></div>
            <div className="h-8 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-primary-background w-full p-4 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Todo List</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold">
                + Add New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
                <DialogDescription>
                  Create a new task to organize your work and personal life.
                </DialogDescription>
              </DialogHeader>
              <FormTask 
                onTaskAdded={fetchTasks} 
                onAddTask={addTask}
              />
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Error */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <span className="text-red-500 mr-2">⚠️</span>
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}

          {/* Loading*/}
          {loading && tasks.length === 0 ? (
            <div>
              <div className="flex items-center justify-center mb-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-600">Loading your tasks...</span>
              </div>
              <TaskSkeleton />
            </div>
          ) : (
            <>
              {/* Task Complate & On Going Counter */}
              {tasks.length > 0 && (
                <div className="mb-4 text-sm text-gray-500">
                  {tasks.filter(t => t.is_completed).length} of {tasks.length} tasks completed
                </div>
              )}
              
              <div className="space-y-3">
                <CardTask 
                  tasks={tasks} 
                  onDelete={deleteTask}
                  onUpdate={updateTask}
                  onRefresh={fetchTasks}
                />
              </div>
              
              {/* No Task */}
              {tasks.length === 0 && !loading && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📭</div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No tasks yet</h3>
                  <p className="text-gray-500 mb-4">Get started by creating your first task!</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-500 hover:bg-blue-600">
                        Create Your First Task
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Your First Task</DialogTitle>
                        <DialogDescription>
                          Start organizing your life with your very first task!
                        </DialogDescription>
                      </DialogHeader>
                      <FormTask 
                        onTaskAdded={fetchTasks} 
                        onAddTask={addTask}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}