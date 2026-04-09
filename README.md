# Task Manager Application

A comprehensive Task Manager web application built with Angular, featuring task creation, editing, deletion, and intelligent filtering capabilities.

## Features

### Task Management
- **Create Tasks**: Add new tasks with title, description, due date, priority, and status
- **View Tasks**: Display all tasks in a responsive card-based grid layout
- **Edit Tasks**: Update existing task details through an intuitive dialog form
- **Delete Tasks**: Remove tasks with confirmation dialog
- **Task Display**: Each task shows title, description, due date, priority badge, and status badge

### Filtering & Search
- **Filter by Priority**: Low, Medium, High priority levels
- **Filter by Status**: Pending, In Progress, Completed status
- **Search**: Full-text search across task titles and descriptions
- **Combined Filters**: Apply multiple filters simultaneously
- **Clear Filters**: Reset all filters with one click

### Data Persistence
- **Local Storage**: Tasks are automatically saved to browser LocalStorage
- **Persistent Sessions**: Tasks persist between browser sessions
- **Automatic Sync**: Real-time synchronization with storage

### User Interface
- **Material Design**: Built with Angular Material components
- **Responsive Layout**: Fully responsive design for desktop, tablet, and mobile
- **Material Icons**: Professional icon set for intuitive navigation
- **Material Theme**: Customizable color scheme with indigo primary and pink accent colors
- **Dialog Forms**: Modal dialogs for creating and editing tasks
- **Empty State**: User-friendly message when no tasks exist
- **Task Cards**: Visually distinctive cards with priority-based left border colors

### Testing
- **Unit Tests**: Comprehensive test coverage for all services and components
- **Service Tests**: CRUD operations, filtering, and storage persistence
- **Component Tests**: Form validation, UI interactions, and event emissions
- **Test Coverage**: Aim for 80%+ code coverage

## Project Structure

```
src/
├── app/
│   ├── models/
│   │   └── task.model.ts           # Task interfaces and enums
│   ├── services/
│   │   ├── task.service.ts         # Task management service
│   │   └── task.service.spec.ts    # Service tests
│   ├── components/
│   │   ├── task-list/
│   │   │   ├── task-list.component.ts
│   │   │   └── task-list.component.spec.ts
│   │   ├── task-form/
│   │   │   ├── task-form.component.ts
│   │   │   └── task-form.component.spec.ts
│   │   ├── task-card/
│   │   │   ├── task-card.component.ts
│   │   │   └── task-card.component.spec.ts
│   │   ├── filter-panel/
│   │   │   ├── filter-panel.component.ts
│   │   │   └── filter-panel.component.spec.ts
│   │   └── empty-state/
│   │       └── empty-state.component.ts
│   └── app.component.ts            # Root component
├── main.ts                         # Application entry point
├── index.html                      # HTML template
└── styles.scss                     # Global styles
```

## Installation

### Prerequisites
- Node.js 18+ and npm

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

The application will run on `http://localhost:4200/`

## Usage

### Creating a Task
1. Click the "New Task" button in the header
2. Fill in the task details:
   - **Title**: Brief task name (minimum 3 characters)
   - **Description**: Detailed task description (minimum 10 characters)
   - **Due Date**: Select a date using the date picker
   - **Priority**: Choose Low, Medium, or High
   - **Status**: Select Pending, In Progress, or Completed
3. Click "Create" to save the task

### Editing a Task
1. Click the edit icon on any task card
2. Modify the task details in the dialog
3. Click "Update" to save changes

### Deleting a Task
1. Click the delete icon on any task card
2. Confirm the deletion in the popup dialog

### Filtering Tasks
1. Use the filter panel at the top:
   - **Priority dropdown**: Filter by task priority
   - **Status dropdown**: Filter by task status
   - **Search input**: Search by title or description
2. Filters apply in real-time as you select options
3. Click "Clear Filters" to reset all filters

## Task Model

### TaskPriority
- `low`: Low priority
- `medium`: Medium priority
- `high`: High priority

### TaskStatus
- `pending`: Task not yet started
- `in-progress`: Task currently being worked on
- `completed`: Task finished

### Task Interface
```typescript
interface Task {
  id: string;                    // Unique identifier
  title: string;                 // Task title
  description: string;           // Task description
  dueDate: Date | string;       // Due date
  priority: TaskPriority;       // Task priority level
  status: TaskStatus;           // Task status
  createdAt: Date | string;     // Creation timestamp
  updatedAt: Date | string;     // Last update timestamp
}
```

## Technologies Used

### Frontend Framework
- **Angular 18**: Modern web application framework
- **TypeScript**: Type-safe JavaScript
- **Angular Material 18**: Professional UI component library
- **RxJS**: Reactive programming library

### Styling
- **SCSS**: Advanced CSS preprocessor
- **Material Theme**: Customizable Material Design theme

### Testing
- **Jasmine**: JavaScript testing framework
- **Karma**: Test runner
- **Angular Testing Utilities**: Testing components and services

### Storage
- **LocalStorage API**: Client-side data persistence

## Component Details

### AppComponent
Root component that sets up the toolbar and contains the task list.

### TaskListComponent
Main container component that:
- Displays all tasks
- Handles task creation dialog
- Manages task editing
- Handles task deletion with confirmation

### TaskFormComponent
Modal dialog component for:
- Creating new tasks
- Editing existing tasks
- Form validation
- Input constraints

### TaskCardComponent
Presentational component that displays:
- Task title and description
- Priority badge with color coding
- Status badge with color coding
- Due date
- Edit and delete actions

### FilterPanelComponent
Filter control component providing:
- Priority dropdown selector
- Status dropdown selector
- Search input field
- Clear filters button

### EmptyStateComponent
Placeholder component shown when no tasks match current filters.

## CSS Styling

### Task Card Priority Colors
- **Low**: Green border (#4caf50)
- **Medium**: Orange border (#ff9800)
- **High**: Red border (#f44336)

### Status Badge Colors
- **Pending**: Blue background
- **In Progress**: Orange background
- **Completed**: Green background

### Responsive Design
- **Desktop**: Grid layout with multiple columns
- **Tablet**: 2-column grid
- **Mobile**: Single column layout

## Testing

### Running Tests
```bash
npm test
```

### Test Files
- `task.service.spec.ts` (333 lines): Service logic tests
- `task-list.component.spec.ts` (116 lines): List component tests
- `task-form.component.spec.ts` (192 lines): Form component tests
- `task-card.component.spec.ts` (137 lines): Card component tests
- `filter-panel.component.spec.ts` (132 lines): Filter panel tests

### Test Coverage
- CRUD operations (Create, Read, Update, Delete)
- Filtering and search functionality
- Form validation
- Component interactions
- LocalStorage persistence

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimizations

- **Standalone Components**: Reduced bundle size
- **OnPush Change Detection**: Optimized rendering
- **RxJS Operators**: Efficient data transformation
- **Lazy Loading**: Components loaded on demand

## Future Enhancements

- Task categories/tags
- Task duplication
- Recurring tasks
- Task notes/comments
- Dark mode support
- Export to CSV/PDF
- Cloud synchronization
- Collaborative task management
- Task reminders/notifications
- Analytics dashboard

## License

MIT

## Support

For issues or questions, please check the test files or review the component implementations for detailed usage examples.
