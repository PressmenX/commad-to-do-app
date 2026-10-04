export const TaskPriority = {
  NONE: 'NONE',
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
} as const;

export type TaskPriority = (typeof TaskPriority)[keyof typeof TaskPriority];

export interface ICreateTask {
  name: string;
  details?: string;
  isCompleted?: boolean;
  priority?: TaskPriority;
  category?: string;
}