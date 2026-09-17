/**
 * TodoApp - Main Application Entry Point
 * 
 * Phase 1: Skeleton app with navigation structure and theme ✅
 * Phase 2: AuthContext added to provide authentication state ✅
 * Phase 4: TaskContext added to provide task management state ✅
 * 
 * Architecture:
 * - SafeAreaProvider: Ensures content respects device notches and system UI
 * - AuthProvider: Wraps app to provide authentication state and operations
 * - TaskProvider: Provides task state and CRUD operations (nested inside AuthProvider)
 * - RootNavigator: Handles navigation between Auth and App stacks based on auth state
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { TaskProvider } from './src/context/TaskContext';
import RootNavigator from './src/navigation/RootNavigator';
import { COLORS } from './src/theme';

/**
 * Main App Component
 * 
 * Context hierarchy:
 * 1. SafeAreaProvider (handles device safe areas)
 * 2. AuthProvider (authentication state - Phase 2) ✅
 * 3. TaskProvider (task management state - Phase 4) ✅
 * 4. RootNavigator (navigation logic)
 * 
 * TaskProvider is nested inside AuthProvider because tasks require
 * an authenticated user. The TaskContext accesses user.uid from AuthContext.
 */
function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      {/* Status bar configuration for consistent look across platforms */}
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.primary}
      />
      
      {/* Authentication context - provides login, register, logout, user state */}
      <AuthProvider>
        {/* Task management context - provides tasks, CRUD operations, real-time sync */}
        <TaskProvider>
          <RootNavigator />
        </TaskProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;
