// @/lib/types.ts
export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  category?: Category;
  subtasks: Subtask[];
}
