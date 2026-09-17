/**
 * Task Context
 * 
 * Provides task state and operations throughout the app.
 * Uses useReducer for predictable state management and MongoDB REST API for persistence.
 */

import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { taskReducer, initialTaskState } from './taskReducer';
import { useAuth } from './AuthContext';
import {
  addTask as addTaskService,
  updateTask as updateTaskService,
  deleteTask as deleteTaskService,
  toggleTaskCompletion as toggleTaskCompletionService,
  getUserTasks, 
} from '../api/taskService';
import { TaskState, Task, CreateTaskPayload } from '../types';

interface TaskContextValue extends TaskState {
  addTask: (taskData: CreateTaskPayload) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  toggleTaskCompletion: (taskId: string, completed: boolean) => Promise<void>;
  refreshTasks: () => Promise<void>; // Updated to Promise for Pull-to-Refresh
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialTaskState);
  
  // Safely extract the user ID whether it's stored as `uid` or `user.uid`
  const auth = useAuth() as any;
  const currentUserId = auth.uid || auth.user?.uid;

  /**
   * Fetch tasks from MongoDB
   * Wipes the list immediately if nobody is logged in (Ghost Data Fix)
   */
  const fetchTasks = useCallback(async () => {
    if (!currentUserId) {
      dispatch({ type: 'TASKS_LOADED', payload: [] });
      return;
    }

    dispatch({ type: 'TASKS_LOADING' });
    try {
      const tasks = await getUserTasks(currentUserId);
      dispatch({ type: 'TASKS_LOADED', payload: tasks });
    } catch (error: any) {
      console.error('Task fetch error:', error);
      dispatch({ type: 'TASKS_ERROR', payload: error.message });
    }
  }, [currentUserId]);

  /**
   * Run fetch automatically when user logs in or switches accounts
   */
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  /**
   * Manually refresh tasks (Hooked up to your Pull-to-Refresh UI)
   */
  const refreshTasks = async (): Promise<void> => {
    await fetchTasks();
  };

  const addTask = async (taskData: CreateTaskPayload): Promise<void> => {
    if (!currentUserId) throw new Error('You must be logged in to add tasks');

    try {
      const newTask = await addTaskService(taskData, currentUserId);
      // Optimistic update for instant UI feedback
      dispatch({ type: 'TASK_ADDED', payload: newTask });
    } catch (error: any) {
      dispatch({ type: 'TASKS_ERROR', payload: error.message });
      throw error; 
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>): Promise<void> => {
    if (!currentUserId) throw new Error('You must be logged in to update tasks');

    try {
      await updateTaskService(taskId, updates);
      
      const existingTask = state.tasks.find((t) => t.id === taskId);
      if (existingTask) {
        const updatedTask = { ...existingTask, ...updates };
        dispatch({ type: 'TASK_UPDATED', payload: updatedTask });
      }
    } catch (error: any) {
      dispatch({ type: 'TASKS_ERROR', payload: error.message });
      throw error; 
    }
  };

  const deleteTask = async (taskId: string): Promise<void> => {
    if (!currentUserId) throw new Error('You must be logged in to delete tasks');

    try {
      await deleteTaskService(taskId);
      dispatch({ type: 'TASK_DELETED', payload: taskId });
    } catch (error: any) {
      dispatch({ type: 'TASKS_ERROR', payload: error.message });
      throw error;
    }
  };

  const toggleTaskCompletion = async (taskId: string, completed: boolean): Promise<void> => {
    if (!currentUserId) throw new Error('You must be logged in to update tasks');

    try {
      await toggleTaskCompletionService(taskId, completed);
      
      const existingTask = state.tasks.find((t) => t.id === taskId);
      if (existingTask) {
        const updatedTask = { ...existingTask, completed };
        dispatch({ type: 'TASK_UPDATED', payload: updatedTask });
      }
    } catch (error: any) {
      dispatch({ type: 'TASKS_ERROR', payload: error.message });
      throw error; 
    }
  };

  const value: TaskContextValue = {
    ...state,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    refreshTasks,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTasks = (): TaskContextValue => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};