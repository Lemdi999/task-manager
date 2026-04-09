import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { Observable } from 'rxjs';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { TaskFormComponent } from '../task-form/task-form.component';
import { FilterPanelComponent } from '../filter-panel/filter-panel.component';
import { TaskCardComponent } from '../task-card/task-card.component';
import { EmptyStateComponent } from '../empty-state/empty-state.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule,
    MatDividerModule,
    TaskFormComponent,
    FilterPanelComponent,
    TaskCardComponent,
    EmptyStateComponent
  ],
  template: `
    <div class="task-list-container">
      <!-- Header with Create Task Button -->
      <div class="header flex-between mb-3">
        <div>
          <h1>Tasks</h1>
          <p class="task-count">{{ (tasks$ | async)?.length || 0 }} total tasks</p>
        </div>
        <button mat-raised-button color="primary" (click)="openCreateTaskDialog()">
          <mat-icon>add</mat-icon>
          New Task
        </button>
      </div>

      <!-- Filter Panel -->
      <app-filter-panel (filtersChanged)="onFiltersChanged($event)"></app-filter-panel>

      <mat-divider class="mb-3"></mat-divider>

      <!-- Task List -->
      <div class="tasks-container">
        <ng-container *ngIf="(filteredTasks$ | async) as tasks">
          <ng-container *ngIf="tasks.length > 0; else emptyState">
            <div class="tasks-grid">
              <app-task-card
                *ngFor="let task of tasks"
                [task]="task"
                (edit)="onEditTask($event)"
                (delete)="onDeleteTask($event)">
              </app-task-card>
            </div>
          </ng-container>
          <ng-template #emptyState>
            <app-empty-state [message]="'No tasks found. Create your first task!'"></app-empty-state>
          </ng-template>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .task-list-container {
      width: 100%;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .header h1 {
      font-size: 28px;
      font-weight: 500;
      margin: 0;
      margin-bottom: 4px;
    }

    .task-count {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.6);
      margin: 0;
    }

    .tasks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .tasks-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TaskListComponent implements OnInit {
  tasks$: Observable<Task[]>;
  filteredTasks$: Observable<Task[]>;

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog
  ) {
    this.tasks$ = this.taskService.getTasks();
    this.filteredTasks$ = this.taskService.getFilteredTasks();
  }

  ngOnInit(): void {
    // Load tasks on component initialization
  }

  openCreateTaskDialog(): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: { isEditing: false }
    });

    dialogRef.afterClosed().subscribe();
  }

  onEditTask(task: Task): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: { task, isEditing: true }
    });

    dialogRef.afterClosed().subscribe();
  }

  onDeleteTask(taskId: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(taskId);
    }
  }

  onFiltersChanged(filters: any): void {
    this.taskService.setFilters(filters);
  }
}
