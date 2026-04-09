import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Task, TaskPriority, TaskStatus } from '../../models/task.model';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="saas-card task-card">
      <div class="card-header">
        <div class="badges">
          <span class="badge priority-badge" [ngClass]="task.priority">
            <span class="dot"></span>
            {{ task.priority | titlecase }}
          </span>
          <span class="badge status-badge" [ngClass]="task.status">
            {{ formatStatus(task.status) }}
          </span>
        </div>
        <div class="actions">
          <button mat-icon-button class="sm-icon-btn" (click)="edit.emit(task)" aria-label="Edit task">
            <mat-icon style="font-size: 18px; width: 18px; height: 18px;">edit</mat-icon>
          </button>
          <button mat-icon-button class="sm-icon-btn delete-btn" (click)="delete.emit(task.id)" aria-label="Delete task">
            <mat-icon style="font-size: 18px; width: 18px; height: 18px;">delete_outline</mat-icon>
          </button>
        </div>
      </div>

      <div class="card-content">
        <h3 class="task-title">{{ task.title }}</h3>
        <p class="task-desc">{{ task.description }}</p>
      </div>

      <div class="card-footer">
        <div class="due-date" [class.overdue]="isOverdue(task.dueDate) && task.status !== 'completed'">
          <mat-icon style="font-size: 16px; width: 16px; height: 16px;">calendar_today</mat-icon>
          <span>{{ task.dueDate | date:'MMM d, y' }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .task-card {
      display: flex;
      flex-direction: column;
      padding: 20px;
      height: 100%;
      background: #ffffff;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }

    .badges {
      display: flex;
      gap: 8px;
    }

    .badge {
      font-size: 12px;
      font-weight: 500;
      padding: 4px 10px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    /* Priority Styles */
    .badge.low { background: var(--priority-low); color: var(--priority-low-text); }
    .badge.low .dot { background: #94a3b8; }
    
    .badge.medium { background: var(--priority-medium); color: var(--priority-medium-text); }
    .badge.medium .dot { background: #f97316; }
    
    .badge.high { background: var(--priority-high); color: var(--priority-high-text); }
    .badge.high .dot { background: #ef4444; }

    /* Status Styles */
    .status-badge {
      border: 1px solid var(--border-color);
      background: #ffffff;
      color: var(--text-muted);
    }
    
    .status-badge.in-progress {
      border-color: #bfdbfe;
      color: #1d4ed8;
      background: #eff6ff;
    }
    
    .status-badge.completed {
      border-color: #bbf7d0;
      color: #15803d;
      background: #f0fdf4;
    }

    .actions {
      display: flex;
      opacity: 0;
      transition: opacity var(--transition);
      gap: 4px;
    }

    .task-card:hover .actions {
      opacity: 1;
    }

    .sm-icon-btn {
      width: 32px !important;
      height: 32px !important;
      padding: 0 !important;
      display: flex !important;
      align-items: center;
      justify-content: center;
      color: var(--text-muted) !important;
    }

    .sm-icon-btn.delete-btn:hover {
      color: #ef4444 !important;
      background: #fef2f2;
    }

    .card-content {
      flex: 1;
      margin-bottom: 20px;
    }

    .task-title {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--text-main);
      line-height: 1.4;
    }

    .task-desc {
      margin: 0;
      font-size: 14px;
      color: var(--text-muted);
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 16px;
      border-top: 1px solid var(--border-color);
    }

    .due-date {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      font-weight: 500;
      color: var(--text-muted);
    }

    .due-date.overdue {
      color: #ef4444;
    }
  `]
})
export class TaskCardComponent {
  @Input() task!: Task;
  @Output() edit = new EventEmitter<Task>();
  @Output() delete = new EventEmitter<string>();

  formatStatus(status: TaskStatus): string {
    return status.replace('-', ' ').toUpperCase();
  }

  isOverdue(date: Date | string): boolean {
    const dueDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
  }
}
