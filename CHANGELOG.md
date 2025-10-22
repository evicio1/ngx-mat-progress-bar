# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Versioning Strategy
This library follows Angular's major version numbering:
- **Major version** matches Angular's major version (e.g., 20.x.x for Angular 20+)
- **Minor version** for new features and enhancements
- **Patch version** for bug fixes and improvements

## [20.0.0] - 2025-10-22

### 🎉 Initial Release

#### Added
- **Modern Angular Standalone Library** - Built for Angular 20+ with signals and functional interceptors
- **Pure Angular Material Integration** - Direct use of `mat-progress-bar` without wrapper components
- **Signal-Based Service** - Reactive state management using Angular signals
- **Functional HTTP Interceptor** - Modern `HttpInterceptorFn` for automatic request tracking
- **Router Navigation Tracking** - Automatic progress indication during route navigation
- **Manual Progress Control** - Programmatic control with `start()`, `set()`, `complete()`, `inc()` methods
- **Smart HTTP Request Batching** - Prevents flickering during multiple simultaneous requests
- **Configurable Options** - Customizable debounce timing and behavior settings
- **Debug Logging** - Optional console logging for troubleshooting
- **TypeScript Support** - Full type safety with comprehensive interfaces
- **Standalone Components** - No NgModule required, pure standalone architecture
- **Provider Functions** - Modern Angular provider pattern for easy configuration

#### Core Features
- ⚡ **HTTP Request Tracking** - Automatic progress bar during HTTP requests
- 🧭 **Router Navigation** - Progress indication during route changes  
- 🎛️ **Manual Control** - Programmatic progress bar control
- 📱 **Responsive Design** - Material Design responsive behavior
- ♿ **Accessibility** - Native Material Design accessibility features
- 🎨 **Customizable Styling** - Full control over progress bar appearance
- 🔧 **Configuration Options** - Flexible timing and behavior settings

#### Configuration Options
- `hideDelay` - Delay before hiding progress bar (default: 300ms)
- `minDisplayTime` - Minimum display time to prevent flashing (default: 200ms)
- `enableSmartBatching` - Smart HTTP request batching (default: true)
- `enableDebugLogs` - Debug console logging (default: false)

#### Technical Details
- **Angular Version**: 20.3.0+
- **Material Version**: 20.2.0+
- **License**: MIT
- **Package Size**: Minimal footprint with tree-shaking support
- **Dependencies**: Only Angular Material and Angular Core as peer dependencies

#### Example Usage
```typescript
// Bootstrap with HTTP interceptor
provideHttpClient(withInterceptors([httpProgressInterceptor]))

// Manual control
progressService.start();
progressService.set(50);
progressService.complete();

// Configuration
provideNgxMatProgressBarOptions({
  hideDelay: 500,
  enableDebugLogs: true
});
```

#### Breaking Changes
- N/A (Initial release)

#### Migration Guide
- N/A (Initial release)

---

## Release Notes

### v20.0.0 Highlights
🚀 This initial release provides a complete, modern replacement for `ngx-progressbar` using the latest Angular patterns and Material Design components. The library follows Angular's versioning strategy with major version 20 matching Angular 20+.

Key innovations:
- **Smart HTTP Batching**: Eliminates progress bar flickering during multiple simultaneous requests
- **Signal-Based Architecture**: Leverages Angular's latest reactive primitives
- **Configurable Behavior**: Fine-tune timing and display behavior for your app's needs
- **Router Integration**: Seamless navigation progress tracking with priority management

### Future Roadmap
- Enhanced animation options
- Additional Material Design themes  
- Advanced configuration presets
- Integration examples for popular frameworks
- Performance optimizations
- Accessibility enhancements

### Versioning Strategy
Starting with v20.0.0 to align with Angular 20+:
- **20.x.x**: Compatible with Angular 20+
- **21.x.x**: Will be compatible with Angular 21+ (when released)
- Minor versions for new features, patch versions for fixes
- Initial release of ngx-mat-progress-bar
- Pure Angular Material progress bar wrapper (no additional divs)
- NgxMatProgressBarService for programmatic control
- HTTP interceptor for automatic request tracking
- Support for all Angular Material progress bar modes and features
- TypeScript support with full type definitions
- Angular 20+ compatibility
- Focused on core functionality only

### Features
- 🎨 Pure Angular Material progress bar component
- 🚀 HTTP interceptor for automatic request tracking
- ⚡ Simple service for programmatic control
- 🎛️ Full access to Material progress bar API
- 🎨 Complete user control over styling and positioning
- ♿ Native Material Design accessibility
- 📱 Standard Material Design responsiveness
- 🔄 Focus on HTTP interception and service logic only
- � No wrapper components or unnecessary abstractions

### Philosophy
- Minimal wrapper around Material components
- Users have full control over styling and positioning
- Library focuses only on HTTP interception and service logic
- Direct access to all Material progress bar features

### Breaking Changes
- Initial release, no breaking changes

### Migration
- Replacement for ngx-progressbar library
- Clean, minimal approach without animations dependency
- User-controlled styling and positioning