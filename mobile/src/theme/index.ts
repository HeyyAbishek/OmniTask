/**
 * Design system and theme constants
 * 
 * Centralizing visual styles ensures consistency across the app
 * and makes it easy to implement future theme switching or branding changes.
 */

/**
 * Application color palette
 * 
 * Design rationale:
 * - Primary: Blue for trust and professionalism
 * - Priority colors: Traffic light system (red=high, orange=medium, green=low)
 * - Neutral grays for text and backgrounds minimize visual fatigue
 * - Overdue red draws immediate attention to time-sensitive tasks
 */
export const COLORS = {
  // Brand colors
  primary: '#2196F3',        // Blue - primary actions, headers
  primaryDark: '#1976D2',    // Darker blue - pressed states
  secondary: '#64B5F6',      // Light blue - accents
  
  // Background colors
  background: '#F5F5F5',     // Light gray - main background
  surface: '#FFFFFF',        // White - card backgrounds
  surfaceDark: '#FAFAFA',    // Off-white - alternate sections
  
  // Text colors
  text: '#212121',           // Almost black - primary text
  textSecondary: '#757575',  // Medium gray - secondary text
  textTertiary: '#9E9E9E',   // Light gray - hints and placeholders
  
  // Semantic colors
  error: '#F44336',          // Red - errors and destructive actions
  success: '#4CAF50',        // Green - success states
  warning: '#FF9800',        // Orange - warnings
  
  // Border colors
  border: '#E0E0E0',         // Light gray - dividers and borders
  borderDark: '#BDBDBD',     // Medium gray - focused borders
  
  // Priority-based colors (used in TaskCard priority indicator)
  priorityHigh: '#E53935',   // Red - high priority tasks
  priorityMedium: '#FB8C00', // Orange - medium priority tasks
  priorityLow: '#43A047',    // Green - low priority tasks
  
  // Status colors
  overdue: '#D32F2F',        // Dark red - overdue tasks
  completed: '#9E9E9E',      // Gray - completed tasks (de-emphasized)
  
  // UI element colors
  disabled: '#BDBDBD',       // Gray - disabled buttons
  backdrop: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black - modal backdrops
};

/**
 * Spacing scale based on 4px grid
 * Ensures consistent spacing throughout the app
 */
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

/**
 * Typography scale
 * Font sizes follow a modular scale for visual hierarchy
 */
export const FONT_SIZES = {
  xs: 11,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 28,
};

/**
 * Font weights
 * Limited set for consistency
 */
export const FONT_WEIGHTS = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

/**
 * Border radius scale
 * Consistent rounding for cards, buttons, and inputs
 */
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 999, // Fully rounded (pills)
};

/**
 * Shadow styles for elevation
 * Used for cards and modals to create depth
 */
export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

/**
 * Animation durations (in milliseconds)
 * Keep animations snappy for better perceived performance
 */
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 250,
  slow: 350,
};
