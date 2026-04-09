import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskCardComponent } from './task-card.component';
import { Task, TaskPriority, TaskStatus } from '../../models/task.model';

describe('TaskCardComponent', () => {
  let component: TaskCardComponent;
  let fixture: ComponentFixture<TaskCardComponent>;

  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    dueDate: new Date('2024-12-31'),
    priority: TaskPriority.HIGH,
    status: TaskStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskCardComponent);
    component = fixture.componentInstance;
    component.task = mockTask;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display task title', () => {
    const compiled = fixture.nativeElement;
    const titleElement = compiled.querySelector('.task-title');
    expect(titleElement.textContent).toContain('Test Task');
  });

  it('should display task description', () => {
    const compiled = fixture.nativeElement;
    const descriptionElement = compiled.querySelector('.task-description');
    expect(descriptionElement.textContent).toContain('Test Description');
  });

  it('should display priority badge', () => {
    const compiled = fixture.nativeElement;
    const priorityBadge = compiled.querySelector('.priority-chip-high');
    expect(priorityBadge).toBeTruthy();
    expect(priorityBadge.textContent).toContain('High');
  });

  it('should display status badge', () => {
    const compiled = fixture.nativeElement;
    const statusBadge = compiled.querySelector('.status-pending');
    expect(statusBadge).toBeTruthy();
    expect(statusBadge.textContent).toContain('PENDING');
  });

  it('should display due date', () => {
    const compiled = fixture.nativeElement;
    const dueDateElement = compiled.querySelector('.due-date');
    expect(dueDateElement).toBeTruthy();
    // Date should be formatted, exact format depends on locale
    expect(dueDateElement.textContent).toContain('2024');
  });

  it('should emit edit event when edit button is clicked', () => {
    spyOn(component.edit, 'emit');

    component.onEdit();

    expect(component.edit.emit).toHaveBeenCalledWith(mockTask);
  });

  it('should emit delete event when delete button is clicked', () => {
    spyOn(component.delete, 'emit');

    component.onDelete();

    expect(component.delete.emit).toHaveBeenCalledWith(mockTask.id);
  });

  it('should apply correct priority class', () => {
    const compiled = fixture.nativeElement;
    const card = compiled.querySelector('.task-card');

    expect(card.classList.contains('priority-high')).toBeTruthy();
  });

  it('should update when task input changes', () => {
    const newTask: Task = {
      ...mockTask,
      title: 'Updated Task',
      priority: TaskPriority.LOW,
      status: TaskStatus.COMPLETED
    };

    component.task = newTask;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const titleElement = compiled.querySelector('.task-title');
    expect(titleElement.textContent).toContain('Updated Task');

    const card = compiled.querySelector('.task-card');
    expect(card.classList.contains('priority-low')).toBeTruthy();
  });

  it('should format status correctly', () => {
    expect(component.formatStatus(TaskStatus.IN_PROGRESS)).toBe('IN PROGRESS');
    expect(component.formatStatus(TaskStatus.PENDING)).toBe('PENDING');
    expect(component.formatStatus(TaskStatus.COMPLETED)).toBe('COMPLETED');
  });

  it('should have correct priority styles for different priorities', () => {
    // Test LOW priority
    component.task = { ...mockTask, priority: TaskPriority.LOW };
    fixture.detectChanges();
    let card = fixture.nativeElement.querySelector('.task-card');
    expect(card.classList.contains('priority-low')).toBeTruthy();

    // Test MEDIUM priority
    component.task = { ...mockTask, priority: TaskPriority.MEDIUM };
    fixture.detectChanges();
    card = fixture.nativeElement.querySelector('.task-card');
    expect(card.classList.contains('priority-medium')).toBeTruthy();

    // Test HIGH priority
    component.task = { ...mockTask, priority: TaskPriority.HIGH };
    fixture.detectChanges();
    card = fixture.nativeElement.querySelector('.task-card');
    expect(card.classList.contains('priority-high')).toBeTruthy();
  });
});
