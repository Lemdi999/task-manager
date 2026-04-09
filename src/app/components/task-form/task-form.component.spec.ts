import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskFormComponent } from './task-form.component';
import { TaskService } from '../../services/task.service';
import { Task, TaskPriority, TaskStatus } from '../../models/task.model';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;
  let taskService: jasmine.SpyObj<TaskService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<TaskFormComponent>>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

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
      'createTask',
      'updateTask'
    ]);

    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [TaskFormComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();

    taskService = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<TaskFormComponent>>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.taskForm.get('title')?.value).toBe('');
    expect(component.taskForm.get('description')?.value).toBe('');
    expect(component.taskForm.get('priority')?.value).toBe(TaskPriority.MEDIUM);
    expect(component.taskForm.get('status')?.value).toBe(TaskStatus.PENDING);
  });

  it('should initialize form with task data when editing', () => {
    TestBed.resetTestingModule();
    const taskServiceSpy = jasmine.createSpyObj('TaskService', [
      'createTask',
      'updateTask'
    ]);
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      imports: [TaskFormComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: MAT_DIALOG_DATA, useValue: { task: mockTask, isEditing: true } }
      ]
    }).compileComponents();

    const newFixture = TestBed.createComponent(TaskFormComponent);
    const newComponent = newFixture.componentInstance;
    newFixture.detectChanges();

    expect(newComponent.taskForm.get('title')?.value).toBe('Test Task');
    expect(newComponent.taskForm.get('description')?.value).toBe('Test Description');
    expect(newComponent.isEditing).toBe(true);
  });

  it('should create task on submit when not editing', () => {
    component.taskForm.patchValue({
      title: 'New Task',
      description: 'New Task Description',
      dueDate: new Date(),
      priority: TaskPriority.LOW,
      status: TaskStatus.PENDING
    });

    component.onSubmit();

    expect(taskService.createTask).toHaveBeenCalled();
    expect(snackBar.open).toHaveBeenCalledWith('Task created successfully!', 'Close', { duration: 3000 });
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should update task on submit when editing', () => {
    TestBed.resetTestingModule();
    const taskServiceSpy = jasmine.createSpyObj('TaskService', [
      'createTask',
      'updateTask'
    ]);
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      imports: [TaskFormComponent],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: MAT_DIALOG_DATA, useValue: { task: mockTask, isEditing: true } }
      ]
    }).compileComponents();

    const newFixture = TestBed.createComponent(TaskFormComponent);
    const newComponent = newFixture.componentInstance;
    newFixture.detectChanges();

    newComponent.taskForm.patchValue({
      title: 'Updated Task',
      status: TaskStatus.COMPLETED
    });

    newComponent.onSubmit();

    expect(taskServiceSpy.updateTask).toHaveBeenCalled();
  });

  it('should not submit form if invalid', () => {
    component.taskForm.patchValue({
      title: 'A', // Too short
      description: 'B' // Too short
    });

    component.onSubmit();

    expect(taskService.createTask).not.toHaveBeenCalled();
    expect(taskService.updateTask).not.toHaveBeenCalled();
  });

  it('should close dialog on cancel', () => {
    component.onCancel();

    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should validate title field', () => {
    const titleControl = component.taskForm.get('title');

    titleControl?.setValue('');
    expect(titleControl?.hasError('required')).toBeTruthy();

    titleControl?.setValue('A');
    expect(titleControl?.hasError('minlength')).toBeTruthy();

    titleControl?.setValue('Valid Title');
    expect(titleControl?.valid).toBeTruthy();
  });

  it('should validate description field', () => {
    const descriptionControl = component.taskForm.get('description');

    descriptionControl?.setValue('');
    expect(descriptionControl?.hasError('required')).toBeTruthy();

    descriptionControl?.setValue('Short');
    expect(descriptionControl?.hasError('minlength')).toBeTruthy();

    descriptionControl?.setValue('Valid description text');
    expect(descriptionControl?.valid).toBeTruthy();
  });

  it('should format status correctly', () => {
    expect(component.formatStatus(TaskStatus.IN_PROGRESS)).toBe('IN PROGRESS');
    expect(component.formatStatus(TaskStatus.PENDING)).toBe('PENDING');
    expect(component.formatStatus(TaskStatus.COMPLETED)).toBe('COMPLETED');
  });
});
