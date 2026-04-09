import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../../services/task.service';
import { Task, TaskPriority, TaskStatus } from '../../models/task.model';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskService: jasmine.SpyObj<TaskService>;
  let dialog: jasmine.SpyObj<MatDialog>;

  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    dueDate: new Date(),
    priority: TaskPriority.HIGH,
    status: TaskStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(async () => {
    const taskServiceSpy = jasmine.createSpyObj('TaskService', [
      'getTasks',
      'getFilteredTasks',
      'createTask',
      'updateTask',
      'deleteTask',
      'setFilters'
    ]);
    taskServiceSpy.getTasks.and.returnValue(of([mockTask]));
    taskServiceSpy.getFilteredTasks.and.returnValue(of([mockTask]));

    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [TaskListComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    taskService = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tasks on init', () => {
    expect(taskService.getTasks).toHaveBeenCalled();
    expect(taskService.getFilteredTasks).toHaveBeenCalled();
  });

  it('should open create task dialog', () => {
    const dialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRef.afterClosed.and.returnValue(of(undefined));
    dialog.open.and.returnValue(dialogRef);

    component.openCreateTaskDialog();

    expect(dialog.open).toHaveBeenCalled();
  });

  it('should open edit task dialog with task data', () => {
    const dialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRef.afterClosed.and.returnValue(of(undefined));
    dialog.open.and.returnValue(dialogRef);

    component.onEditTask(mockTask);

    expect(dialog.open).toHaveBeenCalledWith(jasmine.anything(), jasmine.objectContaining({
      data: jasmine.objectContaining({
        task: mockTask,
        isEditing: true
      })
    }));
  });

  it('should delete task with confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(true);

    component.onDeleteTask(mockTask.id);

    expect(taskService.deleteTask).toHaveBeenCalledWith(mockTask.id);
  });

  it('should not delete task without confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.onDeleteTask(mockTask.id);

    expect(taskService.deleteTask).not.toHaveBeenCalled();
  });

  it('should apply filters when filtersChanged is emitted', () => {
    const filters = {
      priority: TaskPriority.HIGH,
      status: TaskStatus.PENDING
    };

    component.onFiltersChanged(filters);

    expect(taskService.setFilters).toHaveBeenCalledWith(filters);
  });
});
