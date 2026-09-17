/**
 * FilterBar Component
 * 
 * Displays three filter tabs (All, Active, Completed) with task counts.
 * Allows users to switch between different views of their tasks.
 * 
 * Props:
 * - activeFilter: Currently selected filter
 * - onFilterChange: Callback when filter is changed
 * - counts: Object with task counts for each filter
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TaskFilter } from '../types';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, FONT_WEIGHTS } from '../theme';

interface FilterBarProps {
  activeFilter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  counts: Record<TaskFilter, number>;
}

const FilterBar: React.FC<FilterBarProps> = ({
  activeFilter,
  onFilterChange,
  counts,
}) => {
  /**
   * Filter options configuration
   */
  const filters: Array<{ key: TaskFilter; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.filtersRow}>
        {filters.map((filter) => {
          const isActive = activeFilter === filter.key;
          const count = counts[filter.key];

          return (
            <TouchableOpacity
              key={filter.key}
              style={[styles.filterButton, isActive && styles.filterButtonActive]}
              onPress={() => onFilterChange(filter.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterLabel, isActive && styles.filterLabelActive]}>
                {filter.label}
              </Text>
              {count > 0 && (
                <View style={[styles.badge, isActive && styles.badgeActive]}>
                  <Text style={[styles.badgeText, isActive && styles.badgeTextActive]}>
                    {count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background,
    gap: SPACING.xs,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.text,
  },
  filterLabelActive: {
    color: '#fff',
  },
  badge: {
    backgroundColor: COLORS.border,
    borderRadius: BORDER_RADIUS.round,
    minWidth: 20,
    height: 20,
    paddingHorizontal: SPACING.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  badgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text,
  },
  badgeTextActive: {
    color: '#fff',
  },
});

export default FilterBar;
