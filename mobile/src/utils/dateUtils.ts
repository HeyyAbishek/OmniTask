export const parseSafeDate = (dateVal: any): Date => {
  if (!dateVal) return new Date();
  
  // If it's already a JS Date object
  if (dateVal instanceof Date) return dateVal;
  
  // If it's a Firebase Timestamp (leftover logic fallback)
  if (dateVal.toDate && typeof dateVal.toDate === 'function') {
    return dateVal.toDate();
  }
  if (dateVal.seconds) {
    return new Date(dateVal.seconds * 1000);
  }
  
  // MongoDB sends ISO strings
  const parsed = new Date(dateVal);
  if (isNaN(parsed.getTime())) return new Date(); 
  return parsed;
};

export const formatDateTime = (dateVal: any): string => {
  if (!dateVal) return '';
  const date = parseSafeDate(dateVal);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const isOverdue = (dateVal: any, completed?: boolean): boolean => {
  if (completed || !dateVal) return false;
  const date = parseSafeDate(dateVal);
  return date.getTime() < Date.now();
};

export const getTimeRemainingText = (dateVal: any): string => {
  if (!dateVal) return '';
  const date = parseSafeDate(dateVal);
  const diffMs = date.getTime() - Date.now();
  
  if (diffMs < 0) return 'Overdue';
  
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (diffDays > 0) return `${diffDays}d left`;
  if (diffHours > 0) return `${diffHours}h left`;
  return 'Due soon';
};

// ADDED: The missing function your sorting algorithm needs
export const hoursUntilDeadline = (dateVal: any): number => {
  if (!dateVal) return 0;
  const date = parseSafeDate(dateVal);
  const diffMs = date.getTime() - Date.now();
  return diffMs / (1000 * 60 * 60);
};