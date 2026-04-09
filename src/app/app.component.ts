import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TaskListComponent } from './components/task-list/task-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    TaskListComponent
  ],
  template: `
    <div class="main-wrapper">
      <header class="app-header">
        <div class="header-container">
          <div class="logo-group">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" stroke-width="2"/>
              <path d="M8 12L11 15L16 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="brand-text">Task Manager</span>
          </div>
        </div>
      </header>

      <main class="app-main">
        <app-task-list></app-task-list>
      </main>
    </div>
  `,
  styles: [`
    .main-wrapper {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .app-header {
      background-color: #ffffff;
      border-bottom: 1px solid var(--border-color);
      height: 64px;
      position: sticky;
      top: 0;
      z-index: 50;
    }

    .header-container {
      max-width: 1200px;
      margin: 0 auto;
      height: 100%;
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }

    .logo-group {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--text-main);
    }

    .brand-text {
      font-weight: 600;
      font-size: 16px;
      letter-spacing: -0.01em;
    }

    .app-main {
      flex: 1;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      padding: 32px 24px;
    }

    @media (max-width: 768px) {
      .app-main {
        padding: 24px 16px;
      }
    }
  `]
})
export class AppComponent {
  title = 'Task Manager';
}
