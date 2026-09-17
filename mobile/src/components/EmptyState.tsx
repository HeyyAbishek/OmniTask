/**
 * EmptyState Component
 * 
 * Displays a friendly message when there are no tasks to show.
 * Shows different messages based on the active filter.
 * 
 * Props:
 * - filter: Current filter state ('all' | 'active' | 'completed')
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TaskFilter } from '../types';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '../theme';

interface EmptyStateProps {
  filter: TaskFilter;
}

const EmptyState: React.FC<EmptyStateProps> = ({ filter }) => {
  /**
   * Get message and emoji based on current filter
   */
  const getEmptyStateContent = (): { emoji: string; title: string; message: string } => {
    switch (filter) {
      case 'active':
        return {
          emoji: '🎉',
          title: 'All caught up!',
          message: 'You have no active tasks. Great job!',
        };
      case 'completed':
        return {
          emoji: '📝',
          title: 'No completed tasks yet',
          message: 'Complete some tasks to see them here.',
        };
      case 'all':
      default:
        return {
          emoji: '✨',
          title: 'No tasks yet',
          message: 'Tap the + button below to create your first task.',
        };
    }
  };

  const { emoji, title, message } = getEmptyStateContent();

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
    paddingBottom: SPACING.xxl * 2, // Account for FAB button
  },
  emoji: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default EmptyState;
