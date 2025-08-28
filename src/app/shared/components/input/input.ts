import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="input-container">
      @if (label) {
        <label [for]="id" class="input-label">{{ label }}</label>
      }
      <input
        [id]="id"
        [type]="type"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [class]="inputClasses"
        (input)="onInput($event)"
        (blur)="onBlur()"
        (focus)="onFocus()" />
      @if (error) {
        <div class="input-error">{{ error }}</div>
      }
    </div>
  `,
  styles: [`
    .input-container {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .input-label {
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }

    input {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      transition: border-color 0.2s;
    }

    input:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }

    input:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }

    input.error {
      border-color: #dc3545;
    }

    .input-error {
      font-size: 12px;
      color: #dc3545;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  @Input() id = '';
  @Input() type: 'text' | 'email' | 'password' | 'number' = 'text';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() error = '';

  touched = false;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange = (value: string) => {
    // Implementation will be provided by registerOnChange
  };
  onTouched = () => {
    // Implementation will be provided by registerOnTouched
  };

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.onChange(target.value);
  }

  onBlur() {
    if (!this.touched) {
      this.touched = true;
      this.onTouched();
    }
  }

  onFocus(): void {
    // Optional: handle focus event
  }

  get inputClasses(): string {
    return this.error ? 'error' : '';
  }

  writeValue(): void {
    // Value is handled by the input element itself
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
