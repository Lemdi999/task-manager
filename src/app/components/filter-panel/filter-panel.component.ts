import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { TaskPriority, TaskStatus, TaskFilterOptions } from '../../models/task.model';

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatCardModule
  ],
  template: `
    <mat-card class="filter-panel">
      <div class="filter-content">
        <div class="filter-group">
          <mat-form-field appearance="fill">
            <mat-label>Priority</mat-label>
            <mat-select [(value)]="selectedPriority" (selectionChange)="onFilterChange()">
              <mat-option [value]="null">All Priorities</mat-option>
              <mat-option *ngFor="let priority of priorities" [value]="priority">
                {{ priority | titlecase }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="filter-group">
          <mat-form-field appearance="fill">
            <mat-label>Status</mat-label>
            <mat-select [(value)]="selectedStatus" (selectionChange)="onFilterChange()">
              <mat-option [value]="null">All Statuses</mat-option>
              <mat-option *ngFor="let status of statuses" [value]="status">
                {{ formatStatus(status) }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="filter-group">
          <mat-form-field appearance="fill">
            <mat-label>Search</mat-label>
            <input matInput placeholder="Search tasks..." [(ngModel)]="searchTerm" (input)="onFilterChange()">
            <mat-icon matPrefix>search</mat-icon>
          </mat-form-field>
        </div>

        <button mat-stroked-button (click)="resetFilters()" class="reset-btn">
          <mat-icon>clear</mat-icon>
          Clear Filters
        </button>
      </div>
    </mat-card>
  `,
  styles: [`
    .filter-panel {
      background-color: #fafafa;
      padding: 16px;
      margin-bottom: 16px;
    }

    .filter-content {
      display: flex;
      gap: 16px;
      align-items: flex-end;
      flex-wrap: wrap;
    }

    .filter-group {
      flex: 1;
      min-width: 200px;
    }

    .reset-btn {
      height: 56px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    @media (max-width: 768px) {
      .filter-content {
        flex-direction: column;
        gap: 12px;
      }

      .filter-group {
        width: 100%;
        min-width: unset;
      }

      .reset-btn {
        width: 100%;
      }
    }
  `]
})
export class FilterPanelComponent {
  @Output() filtersChanged = new EventEmitter<TaskFilterOptions>();

  priorities = Object.values(TaskPriority);
  statuses = Object.values(TaskStatus);

  selectedPriority: TaskPriority | null = null;
  selectedStatus: TaskStatus | null = null;
  searchTerm: string = '';

  onFilterChange(): void {
    const filters: TaskFilterOptions = {
      priority: this.selectedPriority,
      status: this.selectedStatus,
      searchTerm: this.searchTerm
    };
    this.filtersChanged.emit(filters);
  }

  resetFilters(): void {
    this.selectedPriority = null;
    this.selectedStatus = null;
    this.searchTerm = '';
    this.onFilterChange();
  }

  formatStatus(status: TaskStatus): string {
    return status.replace('-', ' ').toUpperCase();
  }
}
