import { Task, Priority, TaskFilter } from '../types';
import { hoursUntilDeadline, parseSafeDate } from './dateUtils'; // <-- Imported safe parser

const PRIORITY_WEIGHTS: Record<Priority, number> = {
  [Priority.HIGH]: 100,
  [Priority.MEDIUM]: 50,
  [Priority.LOW]: 10,
};

export const calculateTaskScore = (task: Task): number => {
  if (task.completed) return -1000;
  
  let score = PRIORITY_WEIGHTS[task.priority];
  const hoursRemaining = hoursUntilDeadline(task.deadline);
  
  if (hoursRemaining < 0) {
    score += 1000;
  } else if (hoursRemaining < 24) {
    score += 500;
  } else if (hoursRemaining < 48) {
    score += 200;
  } else if (hoursRemaining < 168) {
    score += 50;
  }
  
  score -= Math.min(hoursRemaining, 1000);
  return score;
};

export const sortTasksByPriority = (tasks: Task[]): Task[] => {
  return [...tasks].sort((a, b) => {
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    
    const scoreA = calculateTaskScore(a);
    const scoreB = calculateTaskScore(b);
    
    if (scoreA !== scoreB) {
      return scoreB - scoreA;
    }
    
    // UPDATED: Uses parseSafeDate instead of raw new Date() to prevent crashes
    const deadlineA = parseSafeDate(a.deadline).getTime();
    const deadlineB = parseSafeDate(b.deadline).getTime();
    return deadlineA - deadlineB;
  });
};

export const filterTasks = (tasks: Task[], filter: TaskFilter): Task[] => {
  switch (filter) {
    case 'active':
      return tasks.filter((task) => !task.completed);
    case 'completed':
      return tasks.filter((task) => task.completed);
    case 'all':
    default:
      return tasks;
  }
};

export const sortAndFilterTasks = (tasks: Task[], filter: TaskFilter): Task[] => {
  const filtered = filterTasks(tasks, filter);
  return sortTasksByPriority(filtered);
};

export const getTaskCounts = (tasks: Task[]): Record<TaskFilter, number> => {
  return {
    all: tasks.length,
    active: tasks.filter((task) => !task.completed).length,
    completed: tasks.filter((task) => task.completed).length,
  };
};