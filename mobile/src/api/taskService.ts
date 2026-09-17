import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, CreateTaskPayload, UpdateTaskPayload } from '../types';

const API_URL = 'http://10.0.2.2:5000/api';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// INTERCEPTOR: Attaches the stored JWT token to every request automatically
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Tries common token key names in case your AuthContext uses a specific one
      const token = 
        (await AsyncStorage.getItem('token')) || 
        (await AsyncStorage.getItem('userToken')) || 
        (await AsyncStorage.getItem('jwt'));

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error fetching token from AsyncStorage:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// MULTIPURPOSE FIX: Maps MongoDB's `_id` to the frontend's expected `id`
const mapTask = (task: any): Task => ({
  ...task,
  id: task._id || task.id,
});

export const addTask = async (
  taskData: CreateTaskPayload,
  userId: string
): Promise<Task> => {
  try {
    const response = await apiClient.post('/tasks', { ...taskData, userId });
    return mapTask(response.data); // Map on creation
  } catch (error) {
    console.error('Error adding task via API:', error);
    throw error;
  }
};

export const updateTask = async (
  taskId: string,
  updates: Partial<Omit<Task, 'id' | 'userId' | 'createdAt'>>
): Promise<void> => {
  try {
    await apiClient.patch(`/tasks/${taskId}`, updates);
  } catch (error) {
    console.error('Error updating task via API:', error);
    throw error;
  }
};

export const deleteTask = async (taskId: string): Promise<void> => {
  try {
    await apiClient.delete(`/tasks/${taskId}`);
  } catch (error) {
    console.error('Error deleting task via API:', error);
    throw error;
  }
};

export const getUserTasks = async (userId: string): Promise<Task[]> => {
  try {
    const response = await apiClient.get(`/tasks/user/${userId}`);
    return response.data.map(mapTask); // Map on fetch
  } catch (error) {
    console.error('Error fetching tasks via API:', error);
    throw error;
  }
};

export const subscribeToUserTasks = (
  userId: string,
  onTasksUpdate: (tasks: Task[]) => void,
  onError?: (error: Error) => void
): (() => void) => {
  
  getUserTasks(userId)
    .then((tasks) => onTasksUpdate(tasks))
    .catch((error) => {
      if (onError) onError(error);
    });

  // Return a dummy unsubscribe function so the React components don't break
  return () => {
    console.log('Unsubscribed from task polling');
  };
};

export const toggleTaskCompletion = async (
  taskId: string,
  completed: boolean
): Promise<void> => {
  return updateTask(taskId, { completed });
};