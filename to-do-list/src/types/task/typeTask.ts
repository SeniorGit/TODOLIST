export interface Task {
  id: number;
  title: string;
  is_completed: boolean;
  category?: string;
  priority?: string;
  note?: string; 
  due_date?: string;  
  reminder?: string;  
}

export interface CreateTaskRequest {
  title: string;
  category?: string;
  priority?: string;
  note?: string;
  due_date?: string;
  reminder?: string;
  is_completed?: boolean; 
}