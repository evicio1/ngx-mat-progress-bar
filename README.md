# NgxMatProgressBar

[![npm version](https://badge.fury.io/js/ngx-mat-progress-bar.svg)](https://badge.fury.io/js/ngx-mat-progress-bar)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Angular](https://img.shields.io/badge/Angular-22+-red.svg)](https://angular.dev/)
[![npm downloads](https://img.shields.io/npm/dm/ngx-mat-progress-bar.svg)](https://www.npmjs.com/package/ngx-mat-progress-bar)

A **modern Angular standalone library** that provides a global progress bar component using Angular Material Design. Built for the latest Angular with signals, functional interceptors, and standalone components. Perfect replacement for `ngx-progressbar` with configurable options and smart HTTP request batching.

> **🚨 v22.0.0 requires Angular 22.** Stay on `ngx-mat-progress-bar@20` for Angular 20. See [Upgrading to v22](#-upgrading-to-v22) below.

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

### Compatibility

| ngx-mat-progress-bar | Angular | Angular Material |
|----------------------|---------|------------------|
| 22.x | 22.x | 22.x |
| 20.x | 20.x | 20.x |

There is no 21.x release.

### Peer Dependencies

The library needs `@angular/core`, `@angular/common`, `@angular/router`, `@angular/material`, `@angular/cdk` and `rxjs`. An Angular application already has most of them; add Angular Material if you have not yet:

```bash
npm install @angular/material @angular/cdk
```

The progress bar takes its colors from your [Angular Material theme](https://material.angular.dev/guide/theming). Without a theme it still works, but it renders black.

## 🚀 Quick Start

### 1. Setup Providers

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { 
  provideNgxMatProgressBar, 
  httpProgressInterceptor
} from 'ngx-mat-progress-bar';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withInterceptors([httpProgressInterceptor])
    ),
    // Single provider for all configuration
    provideNgxMatProgressBar({
      // UI Configuration
      color: 'primary',

      // Behavioral Options
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

<!-- Optional: bind the color, it overrides the one from the provider -->
<ngx-mat-progress-bar [color]="barColor()"></ngx-mat-progress-bar>

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
// Single, comprehensive configuration
provideNgxMatProgressBar({
  // UI Settings
  color: 'primary',

  // Behavioral Settings
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
interface NgxMatProgressBarConfiguration {
  // UI Configuration
  color?: 'primary' | 'accent' | 'warn';
  mode?: 'determinate' | 'indeterminate' | 'buffer' | 'query'; // Initial mode
  value?: number;           // Initial value, 0-100
  bufferValue?: number;     // Initial buffer value, 0-100
  visible?: boolean;        // Initial visibility

  // Behavioral Options
  hideDelay?: number;           // Delay before hiding (default: 300ms)
  minDisplayTime?: number;      // Minimum display time (default: 200ms)
  enableSmartBatching?: boolean; // Reserved, has no effect yet (requests are always batched)
  enableDebugLogs?: boolean;    // Debug console logs (default: false)
}
```

Notes on the UI configuration:

- **`color`** follows Angular Material: it only changes the bar in Material 2 themes. In a Material 3 theme (the default for new apps) it has no visual effect; style the bar with the [progress bar tokens](https://material.angular.dev/components/progress-bar/styling) instead.
- **`mode`, `value`, `bufferValue` and `visible`** describe the bar's state at startup. `start()`, HTTP requests and router navigation always switch the bar to `indeterminate`, and the first navigation hides it again when it ends.
- Up to v20.1.0 these five settings were accepted but ignored. They are applied from v22.0.0.

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

## 🚀 Upgrading to v22

1. Upgrade your application to Angular 22 and Angular Material 22 (`ng update @angular/core@22 @angular/cli@22 @angular/material@22`).
2. `npm install ngx-mat-progress-bar@22`

What changed for your code:

- **`color` on the component is a signal input.** Template bindings (`[color]="..."`, `color="accent"`) work as before, and changes to a bound value are now applied (they were ignored after the first render). Code that reads or assigns the property directly must change: read it with `component.color()`, set it with `componentRef.setInput('color', value)`.
- **`color` passed to `provideNgxMatProgressBar()` is now applied.** If you pass a color there that you did not want, remove it.
- The library works in zoneless applications, the default for new Angular 22 apps, and with `provideZoneChangeDetection()`.

## 🔄 Migration from v20.0.x to v20.1.x

### Breaking Change: Merged Provider API

In v20.1.0, we simplified the provider API by merging two functions into one for better developer experience.

**Before (v20.0.x):**
```typescript
// Old approach - two separate provider functions
providers: [
  provideNgxMatProgressBar({ color: 'primary', mode: 'indeterminate' }),
  provideNgxMatProgressBarOptions({ hideDelay: 300, enableDebugLogs: true })
]
```

**After (v20.1.x):**
```typescript
// New approach - single unified provider function
providers: [
  provideNgxMatProgressBar({
    color: 'primary',
    mode: 'indeterminate', 
    hideDelay: 300,
    enableDebugLogs: true
  })
]
```

### Migration Steps:

1. **Combine provider calls** - Merge configuration objects from both providers into one
2. **Remove duplicate import** - Only import `provideNgxMatProgressBar`
3. **Update configuration** - All options now go in the same config object

The new API is cleaner and follows Angular ecosystem patterns better!

## 🔗 Links

- [📦 NPM Package](https://www.npmjs.com/package/ngx-mat-progress-bar)
- [🐙 GitHub Repository](https://github.com/evicio1/ngx-mat-progress-bar)
- [🐛 Issues & Support](https://github.com/evicio1/ngx-mat-progress-bar/issues)
- [⚙️ Configuration Guide](https://github.com/evicio1/ngx-mat-progress-bar/blob/main/CONFIGURATION.md)
- [📝 Changelog](https://github.com/evicio1/ngx-mat-progress-bar/blob/main/CHANGELOG.md)
- [🚢 Publishing Guide](https://github.com/evicio1/ngx-mat-progress-bar/blob/main/PUBLISHING.md)
- [🎨 Angular Material](https://material.angular.dev/)

---

Made with ❤️ for the Angular community