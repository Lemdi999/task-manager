import { Component, OnInit, Inject, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Task, TaskPriority, TaskStatus } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  template: `
    <div mat-dialog-title class="dialog-title">
      {{ isEditing ? 'Edit Task' : 'Create New Task' }}
    </div>

    <div mat-dialog-content class="dialog-content">
      <form [formGroup]="taskForm">
        <!-- Title -->
        <mat-form-field appearance="fill" class="full-width mb-2">
          <mat-label>Title *</mat-label>
          <input matInput formControlName="title" placeholder="Enter task title">
          <mat-error *ngIf="taskForm.get('title')?.hasError('required')">
            Title is required
          </mat-error>
          <mat-error *ngIf="taskForm.get('title')?.hasError('minlength')">
            Title must be at least 3 characters
          </mat-error>
        </mat-form-field>

        <!-- Description -->
        <mat-form-field appearance="fill" class="full-width mb-2">
          <mat-label>Description *</mat-label>
          <textarea matInput formControlName="description" rows="4" placeholder="Enter task description"></textarea>
          <mat-error *ngIf="taskForm.get('description')?.hasError('required')">
            Description is required
          </mat-error>
          <mat-error *ngIf="taskForm.get('description')?.hasError('minlength')">
            Description must be at least 10 characters
          </mat-error>
        </mat-form-field>

        <!-- Due Date -->
        <mat-form-field appearance="fill" class="full-width mb-2">
          <mat-label>Due Date *</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="dueDate" placeholder="Select due date">
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
          <mat-error *ngIf="taskForm.get('dueDate')?.hasError('required')">
            Due date is required
          </mat-error>
        </mat-form-field>

        <!-- Priority -->
        <mat-form-field appearance="fill" class="full-width mb-2">
          <mat-label>Priority *</mat-label>
          <mat-select formControlName="priority">
            <mat-option *ngFor="let priority of priorities" [value]="priority">
              {{ priority | titlecase }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="taskForm.get('priority')?.hasError('required')">
            Priority is required
          </mat-error>
        </mat-form-field>

        <!-- Status -->
        <mat-form-field appearance="fill" class="full-width mb-2">
          <mat-label>Status *</mat-label>
          <mat-select formControlName="status">
            <mat-option *ngFor="let status of statuses" [value]="status">
              {{ formatStatus(status) }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="taskForm.get('status')?.hasError('required')">
            Status is required
          </mat-error>
        </mat-form-field>
      </form>
    </div>

    <div mat-dialog-actions class="dialog-actions">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="!taskForm.valid">
        {{ isEditing ? 'Update' : 'Create' }}
      </button>
    </div>
  `,
  styles: [`
    .dialog-title {
      font-size: 20px;
      font-weight: 500;
      margin-bottom: 16px;
    }

    .dialog-content {
      padding: 16px 0;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 16px;
      border-top: 1px solid rgba(0, 0, 0, 0.12);
    }

    textarea {
      resize: none;
    }
  `]
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  isEditing = false;
  priorities = Object.values(TaskPriority);
  statuses = Object.values(TaskStatus);

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<TaskFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      dueDate: ['', Validators.required],
      priority: [TaskPriority.MEDIUM, Validators.required],
      status: [TaskStatus.PENDING, Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data?.task) {
      this.isEditing = true;
      const task = this.data.task;
      this.taskForm.patchValue({
        title: task.title,
        description: task.description,
        dueDate: new Date(task.dueDate),
        priority: task.priority,
        status: task.status
      });
    }
  }

  onSubmit(): void {
    if (!this.taskForm.valid) {
      return;
    }

    const formValue = this.taskForm.value;

    if (this.isEditing && this.data?.task) {
      this.taskService.updateTask({
        id: this.data.task.id,
        ...formValue
      });
      this.snackBar.open('Task updated successfully!', 'Close', { duration: 3000 });
    } else {
      this.taskService.createTask(formValue);
      this.snackBar.open('Task created successfully!', 'Close', { duration: 3000 });
    }

    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  formatStatus(status: TaskStatus): string {
    return status.replace('-', ' ').toUpperCase();
  }
}
