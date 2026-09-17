/**
 * Task State Reducer
 * 
 * Manages task state transitions using the reducer pattern.
 * Provides predictable state updates for task operations and makes debugging easier.
 * 
 * State transitions:
 * - TASKS_LOADING: Set when fetching/syncing tasks
 * - TASKS_LOADED: Tasks successfully loaded from Firestore
 * - TASKS_ERROR: Failed to load or sync tasks
 * - TASK_ADDED: New task created (optimistic update)
 * - TASK_UPDATED: Existing task modified (optimistic update)
 * - TASK_DELETED: Task removed (optimistic update)
 */

import { TaskState, TaskAction, Task } from '../types';

/**
 * Initial task state
 * Used when app first loads and when user logs out
 */
export const initialTaskState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

/**
 * Task state reducer
 * 
 * Takes the current state and an action, returns the new state.
 * Pure function - no side effects, same inputs always produce same output.
 * 
 * @param state - Current task state
 * @param action - Action describing the state change
 * @returns New task state
 */
export const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'TASKS_LOADING':
      // Start of async operation (initial load, refresh)
      return {
        ...state,
        loading: true,
        error: null, // Clear any previous errors
      };
      
    case 'TASKS_LOADED':
      // Tasks successfully loaded from Firestore
      // This replaces the entire task list (from real-time subscription)
      return {
        tasks: action.payload,
        loading: false,
        error: null,
      };
      
    case 'TASKS_ERROR':
      // Failed to load or sync tasks
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
      
    case 'TASK_ADDED':
      // New task created - add to list (optimistic update)
      // Real-time subscription will sync this, but we update immediately for better UX
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
        error: null,
      };
      
    case 'TASK_UPDATED':
      // Existing task modified - update in list (optimistic update)
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
        error: null,
      };
      
    case 'TASK_DELETED':
      // Task removed - remove from list (optimistic update)
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
        error: null,
      };
      
    default:
      // Unknown action type - return state unchanged
      // TypeScript's exhaustive checking ensures this should never happen
      return state;
  }
};
