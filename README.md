# NgxMatProgressBar

[![npm version](https://badge.fury.io/js/ngx-mat-progress-bar.svg)](https://badge.fury.io/js/ngx-mat-progress-bar)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Angular](https://img.shields.io/badge/Angular-14+-red.svg)](https://angular.io/)

A **modern Angular standalone library** that provides a global progress bar component using Angular Material Design. Built for the latest Angular with signals, functional interceptors, and standalone components. Perfect replacement for `ngx-progressbar` without deprecated Angular animations.

## 🎯 Key Features

- 🚀 **Modern Angular** - Standalone components, signals, functional interceptors
- 🎨 **Pure Angular Material** - Direct use of mat-progress-bar without wrapper components  
- ⚡ **Functional HTTP Interceptor** - Latest Angular patterns for request tracking
- 💫 **Signal-Based Service** - Reactive state management with Angular signals
- 🎛️ **Full Material API** - Complete access to all Material progress bar features
- 🎨 **User Control** - You style and position the progress bar as needed
- ♿ **Native Accessibility** - Built-in Material Design accessibility
- 📱 **Material Responsive** - Standard Material Design responsiveness
- 🔄 **Core Focus** - Only HTTP interception and service logic
- 🚫 **No Wrappers** - Clean, minimal component structure

## 📦 Installation

```bash
npm install ngx-mat-progress-bar
```

### Peer Dependencies

Make sure you have the required peer dependencies installed:

```bash
npm install @angular/material @angular/cdk
```

## 🚀 Quick Start

### 1. Setup Providers

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideNgxMatProgressBar, httpProgressInterceptor } from 'ngx-mat-progress-bar';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withInterceptors([httpProgressInterceptor])
    ),
    provideNgxMatProgressBar({
      config: {
        color: 'primary'
      }
    })
  ]
});
```

### 2. Add the Component to Your Template

```html
<!-- Style and position as needed -->
<div class="progress-wrapper">
  <ngx-mat-progress-bar></ngx-mat-progress-bar>
</div>

<!-- Your app content -->
<router-outlet></router-outlet>
```

```css
/* Example: Fixed top progress bar */
.progress-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 4px;
}
```

### 3. Use the Service (with Signals)

```typescript
import { Component, signal, computed } from '@angular/core';
import { NgxMatProgressBarService } from 'ngx-mat-progress-bar';

@Component({
  // ...
})
export class MyComponent {
  private readonly _isWorking = signal(false);
  
  // Access reactive signals
  readonly isLoading = computed(() => this.progressBar.isLoading());
  readonly activeRequests = computed(() => this.progressBar.activeRequests());
  
  constructor(private progressBar: NgxMatProgressBarService) {}

  startLoading() {
    this.progressBar.start();
  }

  setProgress(value: number) {
    this.progressBar.set(value); // 0-100
  }

  completeLoading() {
    this.progressBar.complete();
  }
}
```

## 🛠️ Configuration

### Modern Configuration (Recommended)

```typescript
// Standalone application
provideNgxMatProgressBar({
  config: {
    color: 'primary'        // 'primary' | 'accent' | 'warn'
  }
});

// HTTP client with functional interceptor
provideHttpClient(
  withInterceptors([httpProgressInterceptor])
});
```

### Component Usage

```html
<!-- Use all Material progress bar features directly -->
<ngx-mat-progress-bar 
  [color]="'accent'">
</ngx-mat-progress-bar>

<!-- Or apply any Material progress bar attributes -->
<ngx-mat-progress-bar 
  class="my-custom-progress"
  [style.height]="'8px'">
</ngx-mat-progress-bar>
```

## 📖 API Reference

### NgxMatProgressBarService

#### Methods

| Method | Description | Parameters |
|--------|-------------|------------|
| `start()` | Start the progress bar | None |
| `complete()` | Complete the progress bar with animation | None |
| `set(value)` | Set progress value | `value: number` (0-100) |
| `inc(amount)` | Increment progress value | `amount: number` (default: 5) |
| `reset()` | Reset progress bar | None |
| `updateConfig(config)` | Update configuration | `config: Partial<NgxMatProgressBarConfig>` |
| `isVisible()` | Check if progress bar is visible | Returns `boolean` |
| `isLoading()` | Check if currently loading | Returns `boolean` |

#### Signals

| Signal | Description | Type |
|--------|-------------|------|
| `config()` | Current configuration | `Signal<NgxMatProgressBarConfig>` |
| `isLoading()` | Loading state | `Signal<boolean>` |
| `activeRequests()` | Number of active requests | `Signal<number>` |
| `isVisible()` | Visibility state | `Signal<boolean>` |

### Configuration Interface

```typescript
interface NgxMatProgressBarConfig {
  color?: 'primary' | 'accent' | 'warn';
  mode?: 'determinate' | 'indeterminate' | 'buffer' | 'query';
  value?: number;           // 0-100
  bufferValue?: number;     // 0-100
  visible?: boolean;
}
```

## 💡 Usage Examples

### Basic Usage

```typescript
@Component({
  template: `
    <div class="progress-wrapper">
      <ngx-mat-progress-bar></ngx-mat-progress-bar>
    </div>
    <button (click)="doWork()">Start Work</button>
  `,
  styles: [`
    .progress-wrapper {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      height: 4px;
    }
  `]
})
export class AppComponent {
  constructor(private progressBar: NgxMatProgressBarService) {}

  async doWork() {
    this.progressBar.start();
    
    try {
      await this.someAsyncWork();
      this.progressBar.complete();
    } catch (error) {
      this.progressBar.reset();
    }
  }
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [NPM Package](https://www.npmjs.com/package/ngx-mat-progress-bar)
- [GitHub Repository](https://github.com/evicio1/ngx-mat-progress-bar)
- [Issues](https://github.com/evicio1/ngx-mat-progress-bar/issues)
- [Angular Material](https://material.angular.io/)

---

Made with ❤️ for the Angular community

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
