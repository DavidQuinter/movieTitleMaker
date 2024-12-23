import { Component, Input } from '@angular/core';
import { signal } from '@angular/core';
import { CommonModule } from '@angular/common';


type ButtonType = '' | 'checkbox' | 'submit';
type CheckboxVariant = 'toggle' | 'rounded' | 'box' | '';

@Component({
  selector: 'app-button-component',
  imports: [CommonModule],
  templateUrl: './button-component.component.html',
  styleUrl: './button-component.component.css'
})
export class ButtonComponent {
  protected labelText = signal<string>('Click me');
  protected iconName = signal<string>("");
  
  @Input() classType: 'btn-primary' | 'btn-secondary' | 'btn-terceary' = 'btn-primary';
  @Input() active: boolean = false;
  @Input() action: () => void = () => {};
  @Input() buttonType: ButtonType = '';
  @Input() checkboxVariant: CheckboxVariant = '';

  handleClick(): void {
    this.action();
    if (this.buttonType === 'checkbox') {
      this.active = !this.active;
    }
  }

  get buttonClasses(): string {
    const classes: string[] = [];

   
    if (this.buttonType === 'checkbox') {
      classes.push('check');
      
      switch (this.checkboxVariant) {
        case 'toggle':
          classes.push('check-toggle');
          break;
        case 'box':
          classes.push('check-box');
          break;
        case 'rounded':
          classes.push('check-rounded');
          break;
      }
    } else {
      classes.push('btn', this.classType);
    }

    if (this.active) {
      classes.push('active');
    }

    return classes.join(' ');
  }

  @Input() set label(value: string) {
    this.labelText.set(value);
  }

  @Input() set icon(value: string) {
    this.iconName.set(value);
  }
}