import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterPanelComponent } from './filter-panel.component';
import { TaskPriority, TaskStatus } from '../../models/task.model';

describe('FilterPanelComponent', () => {
  let component: FilterPanelComponent;
  let fixture: ComponentFixture<FilterPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterPanelComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with null filters', () => {
    expect(component.selectedPriority).toBeNull();
    expect(component.selectedStatus).toBeNull();
    expect(component.searchTerm).toBe('');
  });

  it('should emit filters when priority changes', () => {
    spyOn(component.filtersChanged, 'emit');

    component.selectedPriority = TaskPriority.HIGH;
    component.onFilterChange();

    expect(component.filtersChanged.emit).toHaveBeenCalledWith(jasmine.objectContaining({
      priority: TaskPriority.HIGH
    }));
  });

  it('should emit filters when status changes', () => {
    spyOn(component.filtersChanged, 'emit');

    component.selectedStatus = TaskStatus.COMPLETED;
    component.onFilterChange();

    expect(component.filtersChanged.emit).toHaveBeenCalledWith(jasmine.objectContaining({
      status: TaskStatus.COMPLETED
    }));
  });

  it('should emit filters when search term changes', () => {
    spyOn(component.filtersChanged, 'emit');

    component.searchTerm = 'important task';
    component.onFilterChange();

    expect(component.filtersChanged.emit).toHaveBeenCalledWith(jasmine.objectContaining({
      searchTerm: 'important task'
    }));
  });

  it('should emit all filters together', () => {
    spyOn(component.filtersChanged, 'emit');

    component.selectedPriority = TaskPriority.MEDIUM;
    component.selectedStatus = TaskStatus.IN_PROGRESS;
    component.searchTerm = 'test';
    component.onFilterChange();

    expect(component.filtersChanged.emit).toHaveBeenCalledWith({
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.IN_PROGRESS,
      searchTerm: 'test'
    });
  });

  it('should reset filters', () => {
    spyOn(component.filtersChanged, 'emit');

    component.selectedPriority = TaskPriority.HIGH;
    component.selectedStatus = TaskStatus.COMPLETED;
    component.searchTerm = 'test';

    component.resetFilters();

    expect(component.selectedPriority).toBeNull();
    expect(component.selectedStatus).toBeNull();
    expect(component.searchTerm).toBe('');
    expect(component.filtersChanged.emit).toHaveBeenCalledWith({
      priority: null,
      status: null,
      searchTerm: ''
    });
  });

  it('should contain all priority options', () => {
    expect(component.priorities).toEqual(Object.values(TaskPriority));
  });

  it('should contain all status options', () => {
    expect(component.statuses).toEqual(Object.values(TaskStatus));
  });

  it('should format status correctly', () => {
    expect(component.formatStatus(TaskStatus.IN_PROGRESS)).toBe('IN PROGRESS');
    expect(component.formatStatus(TaskStatus.PENDING)).toBe('PENDING');
    expect(component.formatStatus(TaskStatus.COMPLETED)).toBe('COMPLETED');
  });

  it('should handle empty search term', () => {
    spyOn(component.filtersChanged, 'emit');

    component.searchTerm = '';
    component.onFilterChange();

    expect(component.filtersChanged.emit).toHaveBeenCalledWith(jasmine.objectContaining({
      searchTerm: ''
    }));
  });

  it('should handle whitespace-only search term', () => {
    spyOn(component.filtersChanged, 'emit');

    component.searchTerm = '   ';
    component.onFilterChange();

    expect(component.filtersChanged.emit).toHaveBeenCalledWith(jasmine.objectContaining({
      searchTerm: '   '
    }));
  });
});
