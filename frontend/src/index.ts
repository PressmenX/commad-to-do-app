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

export interface ITask {
  id: string;
  taskKey: string;
  name: string;
  details: string | null;
  isCompleted: boolean;
  priority: TaskPriority;
  category: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskProps {
  tasks: ITask[];
  isBulkMode?: boolean;
  selectedIds?: string[];
  onToggleSelect?: (id: string) => void;
  onSelectAll?: () => void;
  isAllSelected?: boolean;
}