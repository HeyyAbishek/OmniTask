/**
 * Root Navigator
 * 
 * Main navigation coordinator that switches between authentication and main app flows.
 * 
 * Navigation structure:
 * - When user is NOT authenticated → AuthStack (Login/Register screens)
 * - When user IS authenticated → AppStack (Task management screens)
 * 
 * Phase 1: Skeleton with hardcoded auth state ✅
 * Phase 2: Integrated with AuthContext for dynamic auth state ✅
 * Phase 5: Added logout button to header ✅
 * 
 * The navigator automatically switches stacks when auth state changes,
 * providing seamless login/logout experience without manual navigation.
 */

import React from 'react';
import { View, ActivityIndicator, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList, AuthStackParamList, AppStackParamList } from './types';
import { useAuth } from '../context/AuthContext';

// Screen imports
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import TaskListScreen from '../screens/TaskListScreen';

import { COLORS, FONT_SIZES } from '../theme';

// Create stack navigators
const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStackNav = createNativeStackNavigator<AuthStackParamList>();
const AppStackNav = createNativeStackNavigator<AppStackParamList>();

/**
 * Authentication Stack
 * Contains login and registration screens
 */
const AuthStack: React.FC = () => {
  return (
    <AuthStackNav.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <AuthStackNav.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: 'Sign In' }}
      />
      <AuthStackNav.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: 'Create Account' }}
      />
    </AuthStackNav.Navigator>
  );
};

/**
 * Main Application Stack
 * Contains authenticated user screens (task management)
 */
const AppStack: React.FC = () => {
  const { logout } = useAuth();

  /**
   * Handle logout button press
   * Shows confirmation alert before signing out
   */
  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              // Navigation handled automatically by RootNavigator
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  return (
    <AppStackNav.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <AppStackNav.Screen
        name="TaskList"
        component={TaskListScreen}
        options={{
          title: 'My Tasks',
          headerRight: () => (
            <TouchableOpacity onPress={handleLogout} style={{ paddingHorizontal: 16 }}>
              <Text style={{ color: '#fff', fontSize: FONT_SIZES.md, fontWeight: '600' }}>
                Sign Out
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
    </AppStackNav.Navigator>
  );
};

/**
 * Root Navigator Component
 * 
 * Renders different navigation stacks based on authentication state.
 * 
 * States:
 * 1. Loading (initial session restore): Shows splash/loading screen
 * 2. Authenticated: Shows AppStack (task management)
 * 3. Not authenticated: Shows AuthStack (login/register)
 */
const RootNavigator: React.FC = () => {
  const { user, loading } = useAuth();
  
  // Show loading indicator while restoring session
  // This prevents flickering between auth/app screens on app startup
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }
  
  const isAuthenticated = user !== null;
  
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          // User is logged in - show main app
          <RootStack.Screen name="App" component={AppStack} />
        ) : (
          // User is not logged in - show auth flow
          <RootStack.Screen name="Auth" component={AuthStack} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});

export default RootNavigator;
