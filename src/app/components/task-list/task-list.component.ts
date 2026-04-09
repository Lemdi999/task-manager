import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
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
    TaskFormComponent,
    FilterPanelComponent,
    TaskCardComponent,
    EmptyStateComponent
  ],
  template: `
    <div class="task-list-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">Tasks</h1>
          <p class="task-meta">{{ (tasks$ | async)?.length || 0 }} total tasks</p>
        </div>
        <button mat-button class="saas-btn new-task-btn" (click)="openCreateTaskDialog()">
          <mat-icon>add</mat-icon>
          New Task
        </button>
      </div>

      <!-- Filters -->
      <div class="section-container">
        <app-filter-panel (filtersChanged)="onFiltersChanged($event)"></app-filter-panel>
      </div>

      <!-- Task Grid -->
      <div class="tasks-container section-container">
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
            <div class="saas-card empty-state-wrapper">
              <app-empty-state [message]="'No tasks found. Create your first task!'"></app-empty-state>
            </div>
          </ng-template>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .task-list-container {
      width: 100%;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .page-title {
      font-size: 24px;
      font-weight: 600;
      color: var(--text-main);
      margin: 0 0 4px 0;
      letter-spacing: -0.02em;
    }

    .task-meta {
      font-size: 14px;
      color: var(--text-muted);
      margin: 0;
    }

    .new-task-btn {
      height: 40px !important;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .section-container {
      margin-bottom: 32px;
    }

    .tasks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
    }

    .empty-state-wrapper {
      padding: 64px 24px;
      text-align: center;
    }

    @media (max-width: 768px) {
      .page-header {
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

  ngOnInit(): void {}

  openCreateTaskDialog(): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '500px',
      maxWidth: '90vw',
      panelClass: 'saas-dialog',
      data: { isEditing: false }
    });

    dialogRef.afterClosed().subscribe();
  }

  onEditTask(task: Task): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '500px',
      maxWidth: '90vw',
      panelClass: 'saas-dialog',
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
