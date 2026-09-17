/**
 * Authentication Reducer
 * 
 * Manages authentication state transitions using the reducer pattern.
 * This provides predictable state updates and makes the auth flow easier to debug.
 * 
 * State transitions:
 * - AUTH_LOADING: Set when async auth operation starts
 * - AUTH_SUCCESS: User successfully logged in/registered
 * - AUTH_ERROR: Auth operation failed (invalid credentials, network error, etc.)
 * - AUTH_LOGOUT: User logged out, clear user data
 */

import { AuthState, AuthAction } from '../types';

/**
 * Initial authentication state
 * Used when app first loads and when user logs out
 */
export const initialAuthState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

/**
 * Authentication state reducer
 * 
 * Takes the current state and an action, returns the new state.
 * Pure function - no side effects, same inputs always produce same output.
 * 
 * @param state - Current auth state
 * @param action - Action describing the state change
 * @returns New auth state
 */
export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_LOADING':
      // Start of async operation (login, register, session restore)
      return {
        ...state,
        loading: true,
        error: null, // Clear any previous errors
      };
      
    case 'AUTH_SUCCESS':
      // User successfully authenticated
      return {
        user: action.payload,
        loading: false,
        error: null,
      };
      
    case 'AUTH_ERROR':
      // Authentication failed
      return {
        ...state,
        user: null,
        loading: false,
        error: action.payload,
      };
      
    case 'AUTH_LOGOUT':
      // User logged out - reset to initial state
      return initialAuthState;
      
    default:
      // Unknown action type - return state unchanged
      // TypeScript's exhaustive checking ensures this should never happen
      return state;
  }
};
