import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskFilterOptions, TaskPriority, TaskStatus } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly STORAGE_KEY = 'tasks';
  private tasksSubject = new BehaviorSubject<Task[]>(this.loadTasksFromStorage());
  public tasks$: Observable<Task[]> = this.tasksSubject.asObservable();
  
  private filteredTasksSubject = new BehaviorSubject<Task[]>(this.loadTasksFromStorage());
  public filteredTasks$: Observable<Task[]> = this.filteredTasksSubject.asObservable();

  private filterSubject = new BehaviorSubject<TaskFilterOptions>({});
  public filter$: Observable<TaskFilterOptions> = this.filterSubject.asObservable();

  constructor() {
    this.tasks$.subscribe(() => this.applyFilters());
  }

  /**
   * Create a new task
   */
  createTask(request: CreateTaskRequest): Task {
    const newTask: Task = {
      id: this.generateId(),
      ...request,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const tasks = this.tasksSubject.value;
    const updatedTasks = [...tasks, newTask];
    this.tasksSubject.next(updatedTasks);
    this.saveTasksToStorage(updatedTasks);
    return newTask;
  }

  /**
   * Get all tasks
   */
  getTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  /**
   * Get filtered tasks
   */
  getFilteredTasks(): Observable<Task[]> {
    return this.filteredTasks$;
  }

  /**
   * Get a single task by ID
   */
  getTaskById(id: string): Task | undefined {
    return this.tasksSubject.value.find(task => task.id === id);
  }

  /**
   * Update an existing task
   */
  updateTask(request: UpdateTaskRequest): Task | null {
    const tasks = this.tasksSubject.value;
    const taskIndex = tasks.findIndex(t => t.id === request.id);

    if (taskIndex === -1) {
      return null;
    }

    const updatedTask: Task = {
      ...tasks[taskIndex],
      ...request,
      id: request.id,
      updatedAt: new Date()
    };

    const updatedTasks = [...tasks];
    updatedTasks[taskIndex] = updatedTask;
    this.tasksSubject.next(updatedTasks);
    this.saveTasksToStorage(updatedTasks);
    return updatedTask;
  }

  /**
   * Delete a task
   */
  deleteTask(id: string): boolean {
    const tasks = this.tasksSubject.value;
    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
      return false;
    }

    const updatedTasks = tasks.filter(t => t.id !== id);
    this.tasksSubject.next(updatedTasks);
    this.saveTasksToStorage(updatedTasks);
    return true;
  }

  /**
   * Apply filters to tasks
   */
  setFilters(filters: TaskFilterOptions): void {
    this.filterSubject.next(filters);
    this.applyFilters();
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.filterSubject.next({});
    this.applyFilters();
  }

  /**
   * Get current filter options
   */
  getFilters(): TaskFilterOptions {
    return this.filterSubject.value;
  }

  /**
   * Delete all tasks
   */
  deleteAllTasks(): void {
    this.tasksSubject.next([]);
    this.saveTasksToStorage([]);
  }

  /**
   * Get tasks count by status
   */
  getTasksCountByStatus(): { [key in TaskStatus]: number } {
    const tasks = this.tasksSubject.value;
    return {
      [TaskStatus.PENDING]: tasks.filter(t => t.status === TaskStatus.PENDING).length,
      [TaskStatus.IN_PROGRESS]: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
      [TaskStatus.COMPLETED]: tasks.filter(t => t.status === TaskStatus.COMPLETED).length
    };
  }

  /**
   * Private helper methods
   */
  private applyFilters(): void {
    const filters = this.filterSubject.value;
    const tasks = this.tasksSubject.value;

    let filtered = [...tasks];

    if (filters.priority) {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    if (filters.status) {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    if (filters.searchTerm && filters.searchTerm.trim()) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower)
      );
    }

    // Sort by due date
    filtered.sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return dateA - dateB;
    });

    this.filteredTasksSubject.next(filtered);
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadTasksFromStorage(): Task[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading tasks from storage:', error);
      return [];
    }
  }

  private saveTasksToStorage(tasks: Task[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks to storage:', error);
    }
  }
}
