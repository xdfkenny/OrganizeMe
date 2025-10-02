'use client';

import type { Task, Category, Subtask } from '@/lib/types';
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';

// --- STATE AND ACTION TYPES ---

interface AppState {
  tasks: Task[];
  categories: Category[];
  isInitialized: boolean;
}

type Action =
  | { type: 'INITIALIZE_STATE'; payload: Omit<AppState, 'isInitialized'> }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'TOGGLE_TASK_COMPLETED'; payload: { taskId: string } }
  | { type: 'TOGGLE_SUBTASK_COMPLETED'; payload: { taskId: string; subtaskId: string } };

// --- DEFAULT DATA ---

const defaultCategories: Category[] = [
  { id: 'cat-1', name: 'Work', color: 'bg-blue-500' },
  { id: 'cat-2', name: 'Personal', color: 'bg-green-500' },
  { id: 'cat-3', name: 'Shopping', color: 'bg-yellow-500' },
];

const defaultTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Finalize Q3 report',
    description: 'Review data and complete the final report for the third quarter.',
    completed: false,
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    category: defaultCategories[0],
    subtasks: [
      { id: 'sub-1-1', title: 'Gather sales data', completed: true },
      { id: 'sub-1-2', title: 'Draft executive summary', completed: false },
    ],
  },
  {
    id: 'task-2',
    title: 'Book dentist appointment',
    description: 'Annual check-up.',
    completed: false,
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    category: defaultCategories[1],
    subtasks: [],
  },
  {
    id: 'task-3',
    title: 'Buy groceries',
    completed: true,
    category: defaultCategories[2],
    subtasks: [
      { id: 'sub-3-1', title: 'Milk', completed: true },
      { id: 'sub-3-2', title: 'Bread', completed: true },
    ],
  },
];


// --- REDUCER ---

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'INITIALIZE_STATE':
      return { ...action.payload, isInitialized: true };
    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.payload.id ? action.payload : t)),
      };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.payload) };
    case 'TOGGLE_TASK_COMPLETED':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.taskId ? { ...task, completed: !task.completed } : task
        ),
      };
    case 'TOGGLE_SUBTASK_COMPLETED': {
      return {
        ...state,
        tasks: state.tasks.map((task) => {
          if (task.id === action.payload.taskId) {
            const newSubtasks = task.subtasks.map((sub) =>
              sub.id === action.payload.subtaskId ? { ...sub, completed: !sub.completed } : sub
            );
            return { ...task, subtasks: newSubtasks };
          }
          return task;
        }),
      };
    }
    case 'ADD_CATEGORY':
      if (state.categories.some(c => c.name.toLowerCase() === action.payload.name.toLowerCase())) {
        return state;
      }
      return { ...state, categories: [...state.categories, action.payload] };
    default:
      return state;
  }
};

// --- CONTEXT ---

interface AppContextType extends AppState {
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  addCategory: (category: Category) => void;
  toggleTaskCompleted: (taskId: string) => void;
  toggleSubtaskCompleted: (taskId: string, subtaskId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// --- PROVIDER ---

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, {
    tasks: [],
    categories: [],
    isInitialized: false,
  });

  useEffect(() => {
    try {
      const storedTasks = Cookies.get('organizeMe_tasks');
      const storedCategories = Cookies.get('organizeMe_categories');
      
      const tasks = storedTasks ? JSON.parse(storedTasks) : defaultTasks;
      const categories = storedCategories ? JSON.parse(storedCategories) : defaultCategories;

      dispatch({ type: 'INITIALIZE_STATE', payload: { tasks, categories } });
    } catch (error) {
      console.error("Failed to load state from cookies, using defaults.", error);
      dispatch({ type: 'INITIALIZE_STATE', payload: { tasks: defaultTasks, categories: defaultCategories } });
    }
  }, []);

  useEffect(() => {
    if (state.isInitialized) {
      try {
        Cookies.set('organizeMe_tasks', JSON.stringify(state.tasks), { expires: 7 });
        Cookies.set('organizeMe_categories', JSON.stringify(state.categories), { expires: 7 });
      } catch (error) {
        console.error("Failed to save state to cookies.", error);
      }
    }
  }, [state]);

  const value = {
    ...state,
    addTask: (task: Task) => dispatch({ type: 'ADD_TASK', payload: task }),
    updateTask: (task: Task) => dispatch({ type: 'UPDATE_TASK', payload: task }),
    deleteTask: (id: string) => dispatch({ type: 'DELETE_TASK', payload: id }),
    addCategory: (category: Category) => dispatch({ type: 'ADD_CATEGORY', payload: category }),
    toggleTaskCompleted: (taskId: string) => dispatch({ type: 'TOGGLE_TASK_COMPLETED', payload: { taskId } }),
    toggleSubtaskCompleted: (taskId: string, subtaskId: string) =>
      dispatch({ type: 'TOGGLE_SUBTASK_COMPLETED', payload: { taskId, subtaskId } }),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// --- HOOK ---

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
