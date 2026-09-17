import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { authReducer, initialAuthState } from './authReducer';
import { AuthState } from '../types';

// Android Emulator must use 10.0.2.2 instead of localhost
const API_URL = 'http://10.0.2.2:5000/api';

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  useEffect(() => {
    const loadSession = async () => {
      dispatch({ type: 'AUTH_LOADING' });
      try {
        const token = await AsyncStorage.getItem('userToken');
        const uid = await AsyncStorage.getItem('userId');
        
        if (token && uid) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          dispatch({ type: 'AUTH_SUCCESS', payload: { uid, email: 'user@omnitask.com', token } });
        } else {
          dispatch({ type: 'AUTH_LOGOUT' });
        }
      } catch (error) {
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    };

    loadSession();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_LOADING' });
      
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      
      const { token, user } = response.data;
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userId', user._id); 
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      dispatch({ type: 'AUTH_SUCCESS', payload: { uid: user._id, email, token } });
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  const register = async (email: string, password: string): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_LOADING' });
      
      // 1. Create the account on the backend
      await axios.post(`${API_URL}/auth/register`, { email, password });
      
      // 2. Instantly log the user in with those exact credentials
      await login(email, password);
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userId');
      delete axios.defaults.headers.common['Authorization'];
      dispatch({ type: 'AUTH_LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  const value: AuthContextValue = {
    ...state,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};