import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="empty-state-container">
      <mat-icon class="empty-icon">tasks</mat-icon>
      <h2>{{ message }}</h2>
      <p>Create a new task to get started with your task management.</p>
    </div>
  `,
  styles: [`
    .empty-state-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
      color: #999;
    }

    .empty-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
      color: #ccc;
    }

    h2 {
      font-size: 20px;
      font-weight: 500;
      color: #666;
      margin: 0 0 8px 0;
    }

    p {
      font-size: 14px;
      color: #999;
      margin: 0;
    }
  `]
})
export class EmptyStateComponent {
  @Input() message = 'No tasks found';
}
