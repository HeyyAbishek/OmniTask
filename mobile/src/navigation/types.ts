/**
 * Navigation type definitions
 * 
 * Defines the screen names and their parameter types for type-safe navigation.
 * TypeScript will enforce correct parameter passing when navigating between screens.
 * 
 * See: https://reactnavigation.org/docs/typescript/
 */

/**
 * Authentication stack screens
 * Shown when user is not logged in
 */
export type AuthStackParamList = {
  Login: undefined;      // No parameters required
  Register: undefined;   // No parameters required
};

/**
 * Main application stack screens
 * Shown after successful authentication
 */
export type AppStackParamList = {
  TaskList: undefined;   // Main task list screen (no parameters)
};

/**
 * Root navigator that switches between Auth and App stacks
 */
export type RootStackParamList = {
  Auth: undefined;       // Auth stack (login/register flow)
  App: undefined;        // Main app stack (task management)
};
