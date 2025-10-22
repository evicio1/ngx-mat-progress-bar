# NgxMatProgressBar

[![npm version](https://badge.fury.io/js/ngx-mat-progress-bar.svg)](https://badge.fury.io/js/ngx-mat-progress-bar)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Angular](https://img.shields.io/badge/Angular-20+-red.svg)](https://angular.io/)
[![npm downloads](https://img.shields.io/npm/dm/ngx-mat-progress-bar.svg)](https://www.npmjs.com/package/ngx-mat-progress-bar)

A **modern Angular standalone library** that provides a global progress bar component using Angular Material Design. Built for the latest Angular with signals, functional interceptors, and standalone components. Perfect replacement for `ngx-progressbar` with configurable options and smart HTTP request batching.

## 🎯 Key Features

- 🚀 **Modern Angular** - Standalone components, signals, functional interceptors
- 🎨 **Pure Angular Material** - Direct use of mat-progress-bar without wrapper components  
- ⚡ **Functional HTTP Interceptor** - Latest Angular patterns for request tracking
- 💫 **Signal-Based Service** - Reactive state management with Angular signals
- 🎛️ **Smart HTTP Batching** - Prevents flickering during multiple simultaneous requests
- ⚙️ **Configurable Options** - Customizable debounce timing and behavior settings
- 🧭 **Router Navigation Tracking** - Automatic progress indication during route navigation
- 🔧 **Full Material API** - Complete access to all Material progress bar features
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
import { 
  provideNgxMatProgressBar, 
  httpProgressInterceptor,
  provideNgxMatProgressBarOptions 
} from 'ngx-mat-progress-bar';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withInterceptors([httpProgressInterceptor])
    ),
    // Optional: Configure progress bar options
    provideNgxMatProgressBarOptions({
      hideDelay: 300,
      minDisplayTime: 200,
      enableSmartBatching: true,
      enableDebugLogs: false
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

## 🛠️ Configuration Options

### Smart HTTP Request Batching

The library intelligently handles multiple simultaneous HTTP requests to prevent progress bar flickering:

```typescript
// Configure options globally
provideNgxMatProgressBarOptions({
  hideDelay: 500,           // Wait 500ms before hiding after requests complete
  minDisplayTime: 300,      // Show for at least 300ms to prevent flashing
  enableSmartBatching: true, // Group overlapping requests (recommended)
  enableDebugLogs: true     // Enable console logging for development
});

// Or configure at runtime
this.progressBar.configureOptions({
  hideDelay: 1000,
  enableDebugLogs: true
});
```

### Configuration Interface

```typescript
interface NgxMatProgressBarOptions {
  hideDelay?: number;           // Delay before hiding (default: 300ms)
  minDisplayTime?: number;      // Minimum display time (default: 200ms)  
  enableSmartBatching?: boolean; // Smart HTTP batching (default: true)
  enableDebugLogs?: boolean;    // Debug console logs (default: false)
}
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
| `configureOptions(options)` | Update configuration options | `options: NgxMatProgressBarOptions` |
| `getOptions()` | Get current configuration | Returns `NgxMatProgressBarOptions` |

#### Signals

| Signal | Description | Type |
|--------|-------------|------|
| `config()` | Current configuration | `Signal<NgxMatProgressBarConfig>` |
| `isLoading()` | Loading state | `Signal<boolean>` |
| `activeRequests()` | Number of active requests | `Signal<number>` |
| `isVisible()` | Visibility state | `Signal<boolean>` |
| `isNavigating()` | Router navigation state | `Signal<boolean>` |

### Progress Bar Configuration

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

### Multiple HTTP Requests (Dashboard Loading)

```typescript
export class DashboardComponent {
  constructor(
    private progressBar: NgxMatProgressBarService,
    private http: HttpClient
  ) {
    // Configure for dashboard with multiple API calls
    this.progressBar.configureOptions({
      hideDelay: 400,           // Wait for potential additional requests
      minDisplayTime: 250,      // Ensure users see loading feedback
      enableSmartBatching: true // Essential for smooth UX
    });
  }

  async loadDashboard() {
    // These HTTP requests will be automatically batched
    // Shows one smooth progress bar instead of flickering
    const user$ = this.http.get('/api/user');
    const analytics$ = this.http.get('/api/analytics');
    const notifications$ = this.http.get('/api/notifications');

    await forkJoin([user$, analytics$, notifications$]).toPromise();
    // Progress bar automatically hides after all requests complete
  }
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](https://github.com/evicio1/ngx-mat-progress-bar/blob/main/LICENSE) file for details.

### MIT License Summary
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution  
- ✅ Private use
- ❌ Liability
- ❌ Warranty

## 🔗 Links

- [📦 NPM Package](https://www.npmjs.com/package/ngx-mat-progress-bar)
- [🐙 GitHub Repository](https://github.com/evicio1/ngx-mat-progress-bar)
- [🐛 Issues & Support](https://github.com/evicio1/ngx-mat-progress-bar/issues)
- [⚙️ Configuration Guide](https://github.com/evicio1/ngx-mat-progress-bar/blob/main/CONFIGURATION.md)
- [📝 Changelog](https://github.com/evicio1/ngx-mat-progress-bar/blob/main/CHANGELOG.md)
- [🎨 Angular Material](https://material.angular.io/)

---

Made with ❤️ for the Angular community