/**
 * TaskCard Component
 * 
 * Displays a single task with all its information.
 * 
 * Features:
 * - Priority indicator (left border color)
 * - Category badge
 * - Title and description
 * - Deadline with time remaining text
 * - Overdue highlighting
 * - Completion checkbox with animation
 * - Delete button
 * - Tap to edit
 * 
 * Props:
 * - task: Task object to display
 * - onPress: Callback when card is tapped (for editing)
 * - onToggleComplete: Callback when checkbox is toggled
 * - onDelete: Callback when delete button is pressed
 */

import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Animated } from 'react-native';
import { Task, Priority, Category } from '../types';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS, FONT_WEIGHTS, ANIMATION_DURATION } from '../theme';
import { formatDateTime, isOverdue, getTimeRemainingText } from '../utils/dateUtils';

interface TaskCardProps {
  task: Task;
  onPress: (task: Task) => void;
  onToggleComplete: (taskId: string, completed: boolean) => void;
  onDelete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onPress,
  onToggleComplete,
  onDelete,
}) => {
  // Animation value for completion toggle
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  /**
   * Animate card when completion status changes
   */
  useEffect(() => {
    if (task.completed) {
      // Fade out and scale down slightly when completed
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 0.6,
          duration: ANIMATION_DURATION.normal,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 0.98,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Restore to normal when uncompleted
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: ANIMATION_DURATION.normal,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [task.completed, scaleAnim, opacityAnim]);

  /**
   * Get priority color for left border
   */
  const getPriorityColor = (priority: Priority): string => {
    switch (priority) {
      case Priority.HIGH:
        return COLORS.priorityHigh;
      case Priority.MEDIUM:
        return COLORS.priorityMedium;
      case Priority.LOW:
        return COLORS.priorityLow;
      default:
        return COLORS.border;
    }
  };

  /**
   * Get category display name
   */
  const getCategoryLabel = (category: Category): string => {
    switch (category) {
      case Category.WORK:
        return 'Work';
      case Category.PERSONAL:
        return 'Personal';
      case Category.STUDY:
        return 'Study';
      case Category.OTHER:
        return 'Other';
      default:
        return category;
    }
  };

  /**
   * Get priority display name
   */
  const getPriorityLabel = (priority: Priority): string => {
    switch (priority) {
      case Priority.HIGH:
        return 'High';
      case Priority.MEDIUM:
        return 'Medium';
      case Priority.LOW:
        return 'Low';
      default:
        return priority;
    }
  };

  /**
   * Handle delete button press with confirmation
   */
  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${task.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          // UPDATED: Check for standard id or MongoDB _id
          onPress: () => onDelete(task.id || (task as any)._id),
        },
      ]
    );
  };

  /**
   * Handle checkbox toggle
   */
  const handleToggleComplete = () => {
    // UPDATED: Check for standard id or MongoDB _id
    onToggleComplete(task.id || (task as any)._id, !task.completed);
  };

  const priorityColor = getPriorityColor(task.priority);
  const isTaskOverdue = isOverdue(task.deadline, task.completed);
  const timeRemaining = getTimeRemainingText(task.deadline);

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
        opacity: opacityAnim,
      }}
    >
      <TouchableOpacity
        style={[
          styles.container,
          { borderLeftColor: priorityColor },
          isTaskOverdue && styles.overdueContainer,
          task.completed && styles.completedContainer,
        ]}
        onPress={() => onPress(task)}
        activeOpacity={0.7}
      >
        {/* Checkbox */}
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={handleToggleComplete}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <View style={[styles.checkbox, task.completed && styles.checkboxChecked]}>
            {task.completed && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>

        {/* Content */}
        <View style={styles.content}>
          {/* Header: Category and Priority */}
          <View style={styles.header}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{getCategoryLabel(task.category)}</Text>
            </View>
            <Text style={styles.priorityText}>{getPriorityLabel(task.priority)}</Text>
          </View>

          {/* Title */}
          <Text
            style={[styles.title, task.completed && styles.titleCompleted]}
            numberOfLines={2}
          >
            {task.title}
          </Text>

          {/* Description */}
          {task.description && task.description.trim().length > 0 && (
            <Text
              style={[styles.description, task.completed && styles.descriptionCompleted]}
              numberOfLines={2}
            >
              {task.description}
            </Text>
          )}

          {/* Footer: Deadline and Time Remaining */}
          <View style={styles.footer}>
            <View style={styles.deadlineContainer}>
              <Text style={styles.deadlineLabel}>Due: </Text>
              <Text style={[styles.deadlineText, isTaskOverdue && styles.overdueText]}>
                {formatDateTime(task.deadline)}
              </Text>
            </View>
            {!task.completed && (
              <View
                style={[
                  styles.timeRemainingBadge,
                  isTaskOverdue && styles.timeRemainingBadgeOverdue,
                ]}
              >
                <Text
                  style={[
                    styles.timeRemainingText,
                    isTaskOverdue && styles.timeRemainingTextOverdue,
                  ]}
                >
                  {timeRemaining}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Delete Button */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.deleteIcon}>🗑️</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'flex-start',
    ...SHADOWS.small,
  },
  overdueContainer: {
    backgroundColor: '#FFEBEE',
    borderColor: COLORS.overdue,
  },
  completedContainer: {
    opacity: 0.7,
    backgroundColor: COLORS.surfaceDark,
  },
  checkboxContainer: {
    paddingTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  checkboxChecked: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  checkmark: {
    color: '#fff',
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
  },
  content: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  categoryBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  categoryText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semibold,
    color: '#fff',
    textTransform: 'uppercase',
  },
  priorityText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.textSecondary,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
    lineHeight: 22,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.textSecondary,
  },
  description: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    lineHeight: 18,
  },
  descriptionCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.textTertiary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deadlineLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textTertiary,
  },
  deadlineText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHTS.medium,
  },
  overdueText: {
    color: COLORS.overdue,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  timeRemainingBadge: {
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  timeRemainingBadgeOverdue: {
    backgroundColor: COLORS.overdue,
  },
  timeRemainingText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.textSecondary,
  },
  timeRemainingTextOverdue: {
    color: '#fff',
  },
  deleteButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.sm,
  },
  deleteIcon: {
    fontSize: 20,
  },
});

export default TaskCard;