import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';
import { Task, TaskPriority, TaskStatus, CreateTaskRequest } from '../models/task.model';

describe('TaskService', () => {
  let service: TaskService;
  let store = {} as { [key: string]: string };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskService);

    // Mock localStorage
    const mockLocalStorage = {
      getItem: (key: string): string | null => {
        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      }
    };

    spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem);
    spyOn(localStorage, 'clear').and.callFake(mockLocalStorage.clear);

    // Clear store before each test
    store = {};
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Task Creation', () => {
    it('should create a new task', () => {
      const taskRequest: CreateTaskRequest = {
        title: 'Test Task',
        description: 'This is a test task',
        dueDate: new Date(),
        priority: TaskPriority.HIGH,
        status: TaskStatus.PENDING
      };

      const task = service.createTask(taskRequest);

      expect(task.id).toBeTruthy();
      expect(task.title).toBe('Test Task');
      expect(task.description).toBe('This is a test task');
      expect(task.priority).toBe(TaskPriority.HIGH);
      expect(task.status).toBe(TaskStatus.PENDING);
    });

    it('should persist task to localStorage', (done) => {
      const taskRequest: CreateTaskRequest = {
        title: 'Persistent Task',
        description: 'This task should be saved',
        dueDate: new Date(),
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.IN_PROGRESS
      };

      service.createTask(taskRequest);

      service.getTasks().subscribe(tasks => {
        expect(tasks.length).toBe(1);
        expect(localStorage.setItem).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('Task Retrieval', () => {
    it('should get all tasks', (done) => {
      const task1: CreateTaskRequest = {
        title: 'Task 1',
        description: 'Description 1',
        dueDate: new Date(),
        priority: TaskPriority.LOW,
        status: TaskStatus.PENDING
      };

      const task2: CreateTaskRequest = {
        title: 'Task 2',
        description: 'Description 2',
        dueDate: new Date(),
        priority: TaskPriority.HIGH,
        status: TaskStatus.IN_PROGRESS
      };

      service.createTask(task1);
      service.createTask(task2);

      service.getTasks().subscribe(tasks => {
        expect(tasks.length).toBe(2);
        done();
      });
    });

    it('should get task by id', () => {
      const taskRequest: CreateTaskRequest = {
        title: 'Test Task',
        description: 'Find me by ID',
        dueDate: new Date(),
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.PENDING
      };

      const createdTask = service.createTask(taskRequest);
      const foundTask = service.getTaskById(createdTask.id);

      expect(foundTask).toBeTruthy();
      expect(foundTask?.id).toBe(createdTask.id);
      expect(foundTask?.title).toBe('Test Task');
    });
  });

  describe('Task Update', () => {
    it('should update an existing task', () => {
      const taskRequest: CreateTaskRequest = {
        title: 'Original Title',
        description: 'Original Description',
        dueDate: new Date(),
        priority: TaskPriority.LOW,
        status: TaskStatus.PENDING
      };

      const createdTask = service.createTask(taskRequest);
      const updatedTask = service.updateTask({
        id: createdTask.id,
        title: 'Updated Title',
        status: TaskStatus.COMPLETED
      });

      expect(updatedTask).toBeTruthy();
      expect(updatedTask?.title).toBe('Updated Title');
      expect(updatedTask?.status).toBe(TaskStatus.COMPLETED);
      expect(updatedTask?.description).toBe('Original Description');
    });

    it('should return null when updating non-existent task', () => {
      const result = service.updateTask({
        id: 'non-existent-id',
        title: 'Updated'
      });

      expect(result).toBeNull();
    });
  });

  describe('Task Deletion', () => {
    it('should delete a task', () => {
      const taskRequest: CreateTaskRequest = {
        title: 'Task to Delete',
        description: 'This will be deleted',
        dueDate: new Date(),
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.PENDING
      };

      const createdTask = service.createTask(taskRequest);
      const deleted = service.deleteTask(createdTask.id);

      expect(deleted).toBe(true);
      expect(service.getTaskById(createdTask.id)).toBeUndefined();
    });

    it('should return false when deleting non-existent task', () => {
      const result = service.deleteTask('non-existent-id');
      expect(result).toBe(false);
    });

    it('should delete all tasks', (done) => {
      service.createTask({
        title: 'Task 1',
        description: 'Description 1',
        dueDate: new Date(),
        priority: TaskPriority.LOW,
        status: TaskStatus.PENDING
      });

      service.createTask({
        title: 'Task 2',
        description: 'Description 2',
        dueDate: new Date(),
        priority: TaskPriority.HIGH,
        status: TaskStatus.PENDING
      });

      service.deleteAllTasks();

      service.getTasks().subscribe(tasks => {
        expect(tasks.length).toBe(0);
        done();
      });
    });
  });

  describe('Filtering', () => {
    beforeEach(() => {
      // Create multiple tasks for filtering tests
      service.createTask({
        title: 'Low Priority Task',
        description: 'This is a low priority task',
        dueDate: new Date(),
        priority: TaskPriority.LOW,
        status: TaskStatus.PENDING
      });

      service.createTask({
        title: 'High Priority In Progress',
        description: 'This is a high priority task in progress',
        dueDate: new Date(),
        priority: TaskPriority.HIGH,
        status: TaskStatus.IN_PROGRESS
      });

      service.createTask({
        title: 'Medium Priority Completed',
        description: 'This is a completed task',
        dueDate: new Date(),
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.COMPLETED
      });
    });

    it('should filter tasks by priority', (done) => {
      service.setFilters({ priority: TaskPriority.HIGH });

      service.getFilteredTasks().subscribe(tasks => {
        expect(tasks.length).toBe(1);
        expect(tasks[0].priority).toBe(TaskPriority.HIGH);
        done();
      });
    });

    it('should filter tasks by status', (done) => {
      service.setFilters({ status: TaskStatus.PENDING });

      service.getFilteredTasks().subscribe(tasks => {
        expect(tasks.length).toBe(1);
        expect(tasks[0].status).toBe(TaskStatus.PENDING);
        done();
      });
    });

    it('should filter tasks by both priority and status', (done) => {
      service.setFilters({
        priority: TaskPriority.HIGH,
        status: TaskStatus.IN_PROGRESS
      });

      service.getFilteredTasks().subscribe(tasks => {
        expect(tasks.length).toBe(1);
        expect(tasks[0].priority).toBe(TaskPriority.HIGH);
        expect(tasks[0].status).toBe(TaskStatus.IN_PROGRESS);
        done();
      });
    });

    it('should filter tasks by search term', (done) => {
      service.setFilters({ searchTerm: 'completed' });

      service.getFilteredTasks().subscribe(tasks => {
        expect(tasks.length).toBe(1);
        expect(tasks[0].title).toContain('Completed');
        done();
      });
    });

    it('should clear filters', (done) => {
      service.setFilters({ priority: TaskPriority.HIGH });
      service.clearFilters();

      service.getFilteredTasks().subscribe(tasks => {
        expect(tasks.length).toBe(3);
        done();
      });
    });
  });

  describe('Task Count by Status', () => {
    beforeEach(() => {
      service.createTask({
        title: 'Pending Task 1',
        description: 'Pending',
        dueDate: new Date(),
        priority: TaskPriority.LOW,
        status: TaskStatus.PENDING
      });

      service.createTask({
        title: 'Pending Task 2',
        description: 'Pending',
        dueDate: new Date(),
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.PENDING
      });

      service.createTask({
        title: 'In Progress Task',
        description: 'In Progress',
        dueDate: new Date(),
        priority: TaskPriority.HIGH,
        status: TaskStatus.IN_PROGRESS
      });

      service.createTask({
        title: 'Completed Task',
        description: 'Completed',
        dueDate: new Date(),
        priority: TaskPriority.LOW,
        status: TaskStatus.COMPLETED
      });
    });

    it('should return correct task count by status', () => {
      const counts = service.getTasksCountByStatus();

      expect(counts[TaskStatus.PENDING]).toBe(2);
      expect(counts[TaskStatus.IN_PROGRESS]).toBe(1);
      expect(counts[TaskStatus.COMPLETED]).toBe(1);
    });
  });
});
