/**
 * Task List Screen
 * 
 * Main screen for viewing and managing tasks.
 * 
 * Features:
 * - Task list with smart sorting (priority + urgency algorithm)
 * - Filter bar (All / Active / Completed)
 * - Pull-to-refresh
 * - Empty state when no tasks
 * - Task cards with complete/delete actions
 * - Floating action button to add tasks
 * - Edit task on tap
 * - Logout button in header (via navigation options)
 * 
 * Integration:
 * - Uses useTasks hook for task state and CRUD operations
 * - Uses useAuth hook for logout functionality
 * - Real-time synchronization via TaskContext
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { Task, TaskFilter, CreateTaskPayload } from '../types';
import { sortAndFilterTasks, getTaskCounts } from '../utils/taskUtils';
import FilterBar from '../components/FilterBar';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';
import AddTaskModal from '../components/AddTaskModal';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, FONT_SIZES, FONT_WEIGHTS } from '../theme';

const TaskListScreen: React.FC = () => {
  const { tasks, loading, addTask, updateTask, deleteTask, toggleTaskCompletion } = useTasks();
  const { logout } = useAuth();
  const navigation = useNavigation();

  // Filter state
  const [activeFilter, setActiveFilter] = useState<TaskFilter>('all');

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Refreshing state
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Calculate task counts for filter badges
   */
  const taskCounts = useMemo(() => getTaskCounts(tasks), [tasks]);

  /**
   * Get sorted and filtered tasks for display
   * Uses smart sorting algorithm (priority + urgency)
   */
  const displayTasks = useMemo(
    () => sortAndFilterTasks(tasks, activeFilter),
    [tasks, activeFilter]
  );

  /**
   * Handle pull-to-refresh
   * Tasks are already synced in real-time, so this is mostly for user feedback
   */
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate refresh (real-time sync handles actual updates)
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  /**
   * Handle filter change
   */
  const handleFilterChange = useCallback((filter: TaskFilter) => {
    setActiveFilter(filter);
  }, []);

  /**
   * Handle add task FAB press
   */
  const handleAddTask = useCallback(() => {
    setEditingTask(null);
    setModalVisible(true);
  }, []);

  /**
   * Handle task card press (edit task)
   */
  const handleTaskPress = useCallback((task: Task) => {
    setEditingTask(task);
    setModalVisible(true);
  }, []);

  /**
   * Handle task save (create or update)
   */
  const handleTaskSave = useCallback(
    async (taskData: CreateTaskPayload) => {
      try {
        if (editingTask) {
          // Update existing task
          await updateTask(editingTask.id, taskData);
        } else {
          // Create new task
          await addTask(taskData);
        }
      } catch (error: any) {
        // Error already handled in TaskContext and shown in modal
        throw error;
      }
    },
    [editingTask, addTask, updateTask]
  );

  /**
   * Handle modal close
   */
  const handleModalClose = useCallback(() => {
    setModalVisible(false);
    setEditingTask(null);
  }, []);

  /**
   * Handle task completion toggle
   */
  const handleToggleComplete = useCallback(
    async (taskId: string, completed: boolean) => {
      try {
        await toggleTaskCompletion(taskId, completed);
      } catch (error: any) {
        Alert.alert('Error', error.message || 'Failed to update task');
      }
    },
    [toggleTaskCompletion]
  );

  /**
   * Handle task delete
   */
  const handleDeleteTask = useCallback(
    async (taskId: string) => {
      try {
        await deleteTask(taskId);
      } catch (error: any) {
        Alert.alert('Error', error.message || 'Failed to delete task');
      }
    },
    [deleteTask]
  );

  /**
   * Render task item
   */
  const renderTask = useCallback(
    ({ item }: { item: Task }) => (
      <TaskCard
        task={item}
        onPress={handleTaskPress}
        onToggleComplete={handleToggleComplete}
        onDelete={handleDeleteTask}
      />
    ),
    [handleTaskPress, handleToggleComplete, handleDeleteTask]
  );

  /**
   * Render empty state
   */
  const renderEmptyState = useCallback(() => {
    if (loading) {
      return null; // Show nothing while loading (refresh control handles this)
    }
    return <EmptyState filter={activeFilter} />;
  }, [loading, activeFilter]);

  /**
   * Task item key extractor
   * UPDATED: Checks for standard ID, MongoDB _id, or generates a fallback
   */
  const keyExtractor = useCallback((item: any) => item.id || item._id || Math.random().toString(), []);

  return (
    <View style={styles.container}>
      {/* Filter Bar */}
      <FilterBar
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        counts={taskCounts}
      />

      {/* Task List */}
      <FlatList
        data={displayTasks}
        renderItem={renderTask}
        keyExtractor={keyExtractor}
        contentContainerStyle={[
          styles.listContent,
          displayTasks.length === 0 && styles.listContentEmpty,
        ]}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddTask} activeOpacity={0.8}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* Add/Edit Task Modal */}
      <AddTaskModal
        visible={modalVisible}
        onClose={handleModalClose}
        onSave={handleTaskSave}
        editTask={editingTask}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xxl * 2, // Extra padding for FAB
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  fab: {
    position: 'absolute',
    right: SPACING.lg,
    bottom: SPACING.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.large,
  },
  fabIcon: {
    fontSize: 32,
    color: '#fff',
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: 32,
  },
});

export default TaskListScreen;