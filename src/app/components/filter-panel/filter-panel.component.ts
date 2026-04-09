import { Component, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TaskPriority, TaskStatus, TaskFilterOptions } from '../../models/task.model';

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="filter-wrapper">
      <div class="search-box">
        <mat-icon class="search-icon">search</mat-icon>
        <input 
          type="text" 
          class="minimal-input" 
          placeholder="Search tasks..." 
          [(ngModel)]="searchTerm" 
          (input)="onFilterChange()">
      </div>
      
      <div class="filter-controls">
        <!-- Custom Priority Dropdown -->
        <div class="custom-select-container">
          <button class="custom-select-trigger" (click)="togglePriority()" [class.active]="isPriorityOpen">
            <span>{{ selectedPriority ? (selectedPriority | titlecase) : 'All Priorities' }}</span>
            <mat-icon class="dropdown-icon" [class.rotated]="isPriorityOpen">expand_more</mat-icon>
          </button>
          
          <div class="custom-select-menu" *ngIf="isPriorityOpen">
            <div class="custom-option" [class.selected]="selectedPriority === null" (click)="selectPriority(null)">
              <span>All Priorities</span>
              <mat-icon *ngIf="selectedPriority === null" class="check-icon">check</mat-icon>
            </div>
            <div class="custom-option" *ngFor="let priority of priorities" 
                 [class.selected]="selectedPriority === priority" 
                 (click)="selectPriority(priority)">
              <span>{{ priority | titlecase }}</span>
              <mat-icon *ngIf="selectedPriority === priority" class="check-icon">check</mat-icon>
            </div>
          </div>
        </div>

        <!-- Custom Status Dropdown -->
        <div class="custom-select-container">
          <button class="custom-select-trigger" (click)="toggleStatus()" [class.active]="isStatusOpen">
            <span>{{ selectedStatus ? formatStatus(selectedStatus) : 'All Statuses' }}</span>
            <mat-icon class="dropdown-icon" [class.rotated]="isStatusOpen">expand_more</mat-icon>
          </button>
          
          <div class="custom-select-menu" *ngIf="isStatusOpen">
            <div class="custom-option" [class.selected]="selectedStatus === null" (click)="selectStatus(null)">
              <span>All Statuses</span>
              <mat-icon *ngIf="selectedStatus === null" class="check-icon">check</mat-icon>
            </div>
            <div class="custom-option" *ngFor="let status of statuses" 
                 [class.selected]="selectedStatus === status" 
                 (click)="selectStatus(status)">
              <span>{{ formatStatus(status) }}</span>
              <mat-icon *ngIf="selectedStatus === status" class="check-icon">check</mat-icon>
            </div>
          </div>
        </div>

        <button *ngIf="hasActiveFilters()" mat-button class="clear-btn" (click)="resetFilters()">
          Clear
        </button>
      </div>
    </div>
  `,
  styles: [`
    .filter-wrapper {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
    }

    .search-box {
      flex: 1;
      min-width: 250px;
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-icon {
      position: absolute;
      left: 12px;
      color: var(--text-muted);
      font-size: 20px;
      width: 20px;
      height: 20px;
      pointer-events: none;
    }

    .minimal-input {
      width: 100%;
      height: 40px;
      padding: 0 16px 0 40px;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      background: #ffffff;
      font-size: 14px;
      color: var(--text-main);
      font-family: inherit;
      transition: all var(--transition);
      box-shadow: var(--shadow-sm);
    }

    .minimal-input:focus {
      outline: none;
      border-color: #94a3b8;
      box-shadow: 0 0 0 2px rgba(100, 116, 139, 0.1);
    }

    .filter-controls {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    /* Custom Select Styles */
    .custom-select-container {
      position: relative;
      min-width: 160px;
    }

    .custom-select-trigger {
      width: 100%;
      height: 40px;
      padding: 0 12px 0 16px;
      background: #ffffff;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-sm);
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      font-family: inherit;
      font-size: 14px;
      font-weight: 500;
      color: var(--text-main);
      transition: all var(--transition);
    }

    .custom-select-trigger:hover, .custom-select-trigger.active {
      border-color: #94a3b8;
    }

    .custom-select-trigger.active {
      box-shadow: 0 0 0 2px rgba(100, 116, 139, 0.1);
    }

    .dropdown-icon {
      color: var(--text-muted);
      font-size: 20px;
      width: 20px;
      height: 20px;
      transition: transform var(--transition);
    }

    .dropdown-icon.rotated {
      transform: rotate(180deg);
    }

    .custom-select-menu {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      width: 100%;
      background: #ffffff;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-md);
      padding: 6px;
      z-index: 50;
      animation: fadeIn 0.15s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .custom-option {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 10px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      color: var(--text-main);
      transition: background var(--transition);
      user-select: none;
    }

    .custom-option:hover {
      background: #f1f5f9;
    }

    .custom-option.selected {
      background: #f8fafc;
      font-weight: 600;
      color: var(--primary-color);
    }

    .check-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: var(--primary-color);
    }

    .clear-btn {
      color: var(--text-muted) !important;
      font-weight: 500 !important;
      height: 40px !important;
    }

    .clear-btn:hover {
      color: var(--text-main) !important;
      background: #f1f5f9 !important;
    }

    @media (max-width: 768px) {
      .filter-wrapper {
        flex-direction: column;
        align-items: stretch;
      }
      .search-box {
        width: 100%;
      }
      .filter-controls {
        flex-wrap: wrap;
      }
      .custom-select-container {
        flex: 1;
        min-width: 140px;
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

  isPriorityOpen = false;
  isStatusOpen = false;

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isPriorityOpen = false;
      this.isStatusOpen = false;
    }
  }

  togglePriority() {
    this.isPriorityOpen = !this.isPriorityOpen;
    this.isStatusOpen = false;
  }

  toggleStatus() {
    this.isStatusOpen = !this.isStatusOpen;
    this.isPriorityOpen = false;
  }

  selectPriority(priority: TaskPriority | null) {
    this.selectedPriority = priority;
    this.isPriorityOpen = false;
    this.onFilterChange();
  }

  selectStatus(status: TaskStatus | null) {
    this.selectedStatus = status;
    this.isStatusOpen = false;
    this.onFilterChange();
  }

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

  hasActiveFilters(): boolean {
    return !!this.selectedPriority || !!this.selectedStatus || !!this.searchTerm;
  }

  formatStatus(status: TaskStatus): string {
    return status.replace('-', ' ').toUpperCase();
  }
}
