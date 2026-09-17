/**
 * Core type definitions for the TodoApp
 * 
 * This file contains all TypeScript interfaces and enums used throughout the application.
 * Centralizing types ensures consistency and makes refactoring easier.
 */

import { FirebaseAuthTypes } from '@react-native-firebase/auth';

/**
 * Priority levels for tasks
 * Used for visual indicators and sorting algorithm weight calculation
 */
export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

/**
 * Task categories for organization
 * Allows users to group tasks by context (work, personal, study, etc.)
 */
export enum Category {
  WORK = 'work',
  PERSONAL = 'personal',
  STUDY = 'study',
  OTHER = 'other',
}

/**
 * Task model - represents a single todo item
 * 
 * All dates are stored as ISO 8601 strings for consistent serialization to Firestore
 * and easier date manipulation with JavaScript Date objects
 */
export interface Task {
  /** Firestore document ID */
  id: string;
  
  /** User ID this task belongs to (Firebase Auth UID) */
  userId: string;
  
  /** Task title (required, max 100 chars) */
  title: string;
  
  /** Detailed description (optional, max 500 chars) */
  description: string;
  
  /** When the task is scheduled/starts (ISO 8601 string) */
  dateTime: string;
  
  /** When the task must be completed by (ISO 8601 string) */
  deadline: string;
  
  /** Task priority level - affects sorting and visual display */
  priority: Priority;
  
  /** Task category - used for filtering and organization */
  category: Category;
  
  /** Whether the task has been marked as complete */
  completed: boolean;
  
  /** Timestamp when task was created (ISO 8601 string) */
  createdAt: string;
  
  /** Timestamp of last update (ISO 8601 string) */
  updatedAt: string;
}

/**
 * Task creation payload - excludes auto-generated fields
 * Used when adding a new task via the AddTaskModal
 */
export type CreateTaskPayload = Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

/**
 * Task update payload - all fields optional except id
 * Used for partial updates (e.g., toggling completed status)
 */
export type UpdateTaskPayload = Partial<Omit<Task, 'id' | 'userId' | 'createdAt'>> & {
  id: string;
};

// ============================================================
// Authentication State Types
// ============================================================

/**
 * Authentication state managed by AuthContext
 */
export interface AuthState {
  /** Currently authenticated user (null if not logged in) */
  user: FirebaseAuthTypes.User | null;
  
  /** Loading state for async operations (login, register, session restore) */
  loading: boolean;
  
  /** Error message from last failed operation (null if no error) */
  error: string | null;
}

/**
 * Authentication context actions
 * Defines all possible state transitions for the auth reducer
 */
export type AuthAction =
  | { type: 'AUTH_LOADING' }
  | { type: 'AUTH_SUCCESS'; payload: FirebaseAuthTypes.User }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' };

// ============================================================
// Task State Types
// ============================================================

/**
 * Task state managed by TaskContext
 */
export interface TaskState {
  /** All tasks for the current user */
  tasks: Task[];
  
  /** Loading state for initial fetch or refresh */
  loading: boolean;
  
  /** Error message from last failed operation (null if no error) */
  error: string | null;
}

/**
 * Task context actions
 * Defines all possible state transitions for the task reducer
 */
export type TaskAction =
  | { type: 'TASKS_LOADING' }
  | { type: 'TASKS_LOADED'; payload: Task[] }
  | { type: 'TASKS_ERROR'; payload: string }
  | { type: 'TASK_ADDED'; payload: Task }
  | { type: 'TASK_UPDATED'; payload: Task }
  | { type: 'TASK_DELETED'; payload: string };

/**
 * Filter options for task list
 * Used by FilterBar component to show active/completed/all tasks
 */
export type TaskFilter = 'all' | 'active' | 'completed';
