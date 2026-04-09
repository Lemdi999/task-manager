export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date | string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  dueDate: Date | string;
  priority: TaskPriority;
  status: TaskStatus;
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {
  id: string;
}

export interface TaskFilterOptions {
  priority?: TaskPriority | null;
  status?: TaskStatus | null;
  searchTerm?: string;
}
