# Task Flow Pro - Modern Task Manager

A premium, minimalist Task Management application built with Angular 18. This application focuses on a clean "SaaS-style" aesthetic, providing an intuitive and high-performance user experience for managing daily tasks.

## ✨ Key Features

### 📋 Professional Task Management
- **Full CRUD Operations**: Create, view, update, and delete tasks with ease.
- **Rich Task Metadata**: Every task tracks title, detailed description, due date, priority, and status.
- **Interactive UI**: Modal-based creation and editing for a focused workflow.
- **Automatic Persistence**: Real-time synchronization with Browser Local Storage ensures your data persists across sessions.

### 🔍 Advanced Filtering & Search
- **Full-Text Search**: Instantly find tasks by searching through titles and descriptions.
- **Custom SaaS Dropdowns**: High-performance, custom-built select menus for Priority and Status filtering (replacing standard browser selects).
- **Multi-Filter Logic**: Combine priority, status, and search terms to find exactly what you need.
- **One-Click Reset**: Quickly clear all filters to return to your full task list.

### 🎨 Clean SaaS Aesthetic
- **Minimalist Design**: Inspired by modern tools like Linear and Vercel. 
- **Premium Typography**: Uses the **Inter** font family for maximum legibility and a sharp professional feel.
- **Monochromatic Palette**: A refined grayscale color system with strategic use of subtle pastel accents.
- **Crisp UI Components**: 1px borders, subtle drop shadows, and plenty of whitespace for a non-cluttered workspace.
- **Fully Responsive**: Identical premium experience across mobile, tablet, and desktop devices.

## 🏗 Project Architecture

```
src/
├── app/
│   ├── models/
│   │   └── task.model.ts           # Type-safe interfaces and enums
│   ├── services/
│   │   ├── task.service.ts         # Centralized state & storage logic
│   │   └── task.service.spec.ts    # Service logic tests
│   ├── components/
│   │   ├── task-list/              # Main dashboard container
│   │   ├── task-form/              # Creation/Edit modal dialog
│   │   ├── task-card/              # Individual task presentation
│   │   ├── filter-panel/           # Custom filter controls & dropdowns
│   │   └── empty-state/            # Null-data placeholder
│   └── app.component.ts            # Layout shell & navigation
├── main.ts                         # App entry point
└── styles.css                      # Modern SaaS CSS Design System
```

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **Package Manager**: npm or pnpm

### Installation & Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd task-manager-application
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm start
   ```
   Open [http://localhost:4200](http://localhost:4200) in your browser.

3. **Run Unit Tests**
   ```bash
   npm test
   ```

## 🛠 Tech Stack

- **Framework**: Angular 18 (Standalone Components)
- **Language**: TypeScript
- **Styling**: Vanilla CSS (Custom SaaS Design Tokens)
- **UI Components**: Angular Material (Base) + Custom Custom Components
- **State Management**: Reactive RxJS Observables
- **Data Store**: LocalStorage API
- **Testing**: Jasmine & Karma

## 📝 Usage Guide

### Task Statuses
- `PENDING`: Not yet started.
- `IN PROGRESS`: Currently being addressed.
- `COMPLETED`: Successfully finished.

### Priority Levels
- `LOW`: Standard tasks (Slate dot indicator).
- `MEDIUM`: Important tasks (Orange dot indicator).
- `HIGH`: Critical tasks (Red dot indicator).

### Overdue Alerts
Tasks that pass their due date without being marked as `COMPLETED` will automatically display their date in **red** to capture your attention.

## 🧪 Testing Overview

The project maintains high test coverage for core business logic:
- **TaskService**: Validates LocalStorage sync, CRUD math, and filtering logic.
- **FilterPanel**: Ensures custom dropdowns and search inputs trigger correct filtering events.
- **TaskForm**: Validates user inputs (minimum lengths for title/description) and date selection.
- **TaskCard**: Verifies correct status/priority badge rendering.

## 📜 License
This project is licensed under the MIT License.
