import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled"
      [class]="buttonClasses"
      (click)="buttonClick.emit($event)">
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      border: none;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #0056b3;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover:not(:disabled) {
      background-color: #545b62;
    }

    .btn-danger {
      background-color: #dc3545;
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      background-color: #c82333;
    }

    .btn-ghost {
      background-color: transparent;
      color: #007bff;
      border: 1px solid #007bff;
    }

    .btn-ghost:hover:not(:disabled) {
      background-color: #007bff;
      color: white;
    }

    .btn-small {
      padding: 6px 12px;
      font-size: 12px;
    }

    .btn-medium {
      padding: 8px 16px;
      font-size: 14px;
    }

    .btn-large {
      padding: 12px 24px;
      font-size: 16px;
    }
  `]
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'medium';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;

  @Output() buttonClick = new EventEmitter<Event>();

  get buttonClasses(): string {
    return `btn-${this.variant} btn-${this.size}`;
  }
}
