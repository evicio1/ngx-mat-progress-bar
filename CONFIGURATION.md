# 🎯 Configuration Options

The ngx-mat-progress-bar library provides several configuration options to customize the behavior of the progress bar, particularly for handling multiple HTTP requests and debouncing.

## 📋 Available Options

```typescript
export interface NgxMatProgressBarOptions {
  /** Delay before hiding progress bar after all HTTP requests complete (in ms) */
  hideDelay?: number;
  /** Minimum time to display progress bar to prevent flashing (in ms) */
  minDisplayTime?: number;
  /** Whether to enable smart batching for overlapping HTTP requests */
  enableSmartBatching?: boolean;
  /** Whether to show debug logs in console */
  enableDebugLogs?: boolean;
}
```

## 🔧 Configuration Methods

### Method 1: Using Provider (Recommended)

Configure globally in your `main.ts` or `app.config.ts`:

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { 
  httpProgressInterceptor, 
  provideNgxMatProgressBarOptions 
} from 'ngx-mat-progress-bar';
import { App } from './app/app';

bootstrapApplication(App, {
  providers: [
    provideRouter([/* your routes */]),
    provideHttpClient(withInterceptors([httpProgressInterceptor])),
    
    // Configure progress bar options globally
    provideNgxMatProgressBarOptions({
      hideDelay: 500,           // Wait 500ms before hiding
      minDisplayTime: 300,      // Show for at least 300ms
      enableSmartBatching: true, // Prevent flickering on multiple requests
      enableDebugLogs: false    // Disable debug logs in production
    })
  ]
});
```

### Method 2: Runtime Configuration

Configure programmatically in your component or service:

```typescript
import { NgxMatProgressBarService } from 'ngx-mat-progress-bar';

@Component({...})
export class MyComponent {
  constructor(private progressBar: NgxMatProgressBarService) {
    // Configure at runtime
    this.progressBar.configureOptions({
      hideDelay: 1000,          // Very slow hiding for demos
      minDisplayTime: 500,      // Long minimum display
      enableDebugLogs: true     // Enable debug for development
    });
  }
}
```

## ⚙️ Option Details

### `hideDelay` (default: 300ms)
Controls how long to wait before hiding the progress bar after all HTTP requests complete.

**Use cases:**
- **Short (100-200ms)**: Fast, responsive feel
- **Medium (300-500ms)**: Balanced, prevents flickering
- **Long (1000ms+)**: Demo purposes, very visible feedback

```typescript
// Fast hiding - good for simple apps
{ hideDelay: 150 }

// Slow hiding - good for complex apps with many rapid requests
{ hideDelay: 800 }
```

### `minDisplayTime` (default: 200ms)
Minimum time the progress bar stays visible to prevent ultra-quick flashes.

**Use cases:**
- **Short (100ms)**: Very responsive, minimal visual interruption
- **Medium (200-300ms)**: Good balance, ensures users see feedback
- **Long (500ms+)**: Ensures all users notice loading state

```typescript
// Quick flash prevention
{ minDisplayTime: 100 }

// Strong visual feedback
{ minDisplayTime: 400 }
```

### `enableSmartBatching` (default: true)
Enables intelligent request batching to prevent progress bar flickering.

**When enabled:**
- Multiple overlapping HTTP requests are treated as one operation
- Progress bar stays visible until ALL requests complete
- Smooth, professional user experience

**When disabled:**
- Each HTTP request shows/hides progress bar independently
- Can cause flickering with rapid requests
- Only use if you need per-request progress feedback

```typescript
// Enable for smooth UX (recommended)
{ enableSmartBatching: true }

// Disable for per-request feedback
{ enableSmartBatching: false }
```

### `enableDebugLogs` (default: false)
Shows detailed console logs for troubleshooting progress bar behavior.

**Debug output includes:**
- HTTP request start/complete events
- Request batching information
- Navigation state changes
- Configuration changes

```typescript
// Enable for development
{ enableDebugLogs: true }

// Disable for production
{ enableDebugLogs: false }
```

## 🎯 Common Configuration Scenarios

### Dashboard Application
Loading multiple data sources simultaneously:

```typescript
provideNgxMatProgressBarOptions({
  hideDelay: 400,           // Wait for potential additional requests
  minDisplayTime: 250,      // Ensure users see loading feedback
  enableSmartBatching: true, // Essential for smooth UX
  enableDebugLogs: false
})
```

### Real-time Application
Frequent, rapid API calls:

```typescript
progressBar.configureOptions({
  hideDelay: 600,           // Longer delay for frequent requests
  minDisplayTime: 200,      // Quick minimum time
  enableSmartBatching: true, // Prevent constant flickering
  enableDebugLogs: false
});
```

### Development/Testing
Debugging progress bar behavior:

```typescript
progressBar.configureOptions({
  hideDelay: 1500,          // Very visible for testing
  minDisplayTime: 500,      // Easy to observe
  enableSmartBatching: true,
  enableDebugLogs: true     // See all internal events
});
```

### Mobile Application
Optimized for touch interfaces:

```typescript
provideNgxMatProgressBarOptions({
  hideDelay: 250,           // Quick response
  minDisplayTime: 300,      // Ensure visibility on slower devices
  enableSmartBatching: true,
  enableDebugLogs: false
})
```

## 🔍 Runtime Option Reading

Get current configuration:

```typescript
const currentOptions = this.progressBar.getOptions();
console.log('Current hide delay:', currentOptions.hideDelay);
console.log('Debug enabled:', currentOptions.enableDebugLogs);
```

## 📊 Performance Considerations

- **`hideDelay`**: Higher values use more setTimeout resources but provide smoother UX
- **`minDisplayTime`**: Minimal performance impact, improves perceived performance
- **`enableSmartBatching`**: Improves performance by reducing DOM updates
- **`enableDebugLogs`**: Disable in production to avoid console overhead

## 🔄 Dynamic Configuration

Options can be changed at runtime:

```typescript
export class DashboardComponent {
  constructor(private progressBar: NgxMatProgressBarService) {}

  onDevelopmentMode() {
    this.progressBar.configureOptions({
      enableDebugLogs: true,
      hideDelay: 2000  // Very slow for observation
    });
  }

  onProductionMode() {
    this.progressBar.configureOptions({
      enableDebugLogs: false,
      hideDelay: 300   // Fast and responsive
    });
  }
}
```