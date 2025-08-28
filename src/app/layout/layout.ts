import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  template: `
    <app-header></app-header>
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .main-content {
      min-height: calc(100vh - 60px);
      padding: 20px;
    }
  `]
})
export class LayoutComponent {}
