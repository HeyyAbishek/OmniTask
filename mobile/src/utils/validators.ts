/**
 * Form validation utilities
 * 
 * Provides reusable validation functions for user input across the app.
 * Each validator returns an error message string if validation fails, or null if valid.
 */

/**
 * Validates email format using a standard email regex
 * 
 * @param email - Email address to validate
 * @returns Error message if invalid, null if valid
 */
export const validateEmail = (email: string): string | null => {
  if (!email || email.trim().length === 0) {
    return 'Email is required';
  }
  
  // Standard email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address';
  }
  
  return null;
};

/**
 * Validates password strength
 * 
 * Requirements:
 * - Minimum 6 characters (Firebase requirement)
 * - Can add more rules as needed
 * 
 * @param password - Password to validate
 * @returns Error message if invalid, null if valid
 */
export const validatePassword = (password: string): string | null => {
  if (!password || password.length === 0) {
    return 'Password is required';
  }
  
  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  
  return null;
};

/**
 * Validates that two passwords match (for registration)
 * 
 * @param password - Original password
 * @param confirmPassword - Confirmation password
 * @returns Error message if passwords don't match, null if valid
 */
export const validatePasswordMatch = (
  password: string,
  confirmPassword: string
): string | null => {
  if (!confirmPassword || confirmPassword.length === 0) {
    return 'Please confirm your password';
  }
  
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  
  return null;
};

/**
 * Validates task title
 * 
 * @param title - Task title to validate
 * @returns Error message if invalid, null if valid
 */
export const validateTaskTitle = (title: string): string | null => {
  if (!title || title.trim().length === 0) {
    return 'Title is required';
  }
  
  if (title.trim().length > 100) {
    return 'Title must be 100 characters or less';
  }
  
  return null;
};

/**
 * Validates task description (optional field)
 * 
 * @param description - Task description to validate
 * @returns Error message if invalid, null if valid
 */
export const validateTaskDescription = (description: string): string | null => {
  if (description && description.length > 500) {
    return 'Description must be 500 characters or less';
  }
  
  return null;
};

/**
 * Validates that a date is not in the past
 * 
 * @param dateString - ISO date string to validate
 * @returns Error message if invalid, null if valid
 */
export const validateFutureDate = (dateString: string): string | null => {
  if (!dateString) {
    return 'Date is required';
  }
  
  const date = new Date(dateString);
  const now = new Date();
  
  if (date < now) {
    return 'Date cannot be in the past';
  }
  
  return null;
};

/**
 * Validates that deadline is after start date
 * 
 * @param startDate - Task start date (ISO string)
 * @param deadline - Task deadline (ISO string)
 * @returns Error message if invalid, null if valid
 */
export const validateDeadlineAfterStart = (
  startDate: string,
  deadline: string
): string | null => {
  if (!deadline) {
    return 'Deadline is required';
  }
  
  const start = new Date(startDate);
  const end = new Date(deadline);
  
  if (end <= start) {
    return 'Deadline must be after start date';
  }
  
  return null;
};
