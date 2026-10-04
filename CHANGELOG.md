# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Versioning Strategy
This library follows Angular's major version numbering:
- **Major version** matches Angular's major version (e.g., 20.x.x for Angular 20+)
- **Minor version** for new features and enhancements
- **Patch version** for bug fixes and improvements

## [22.0.0] - 2026-10-05

### 🚨 BREAKING CHANGES

- **angular**: Requires Angular 22 and Angular Material 22. Peer dependencies are now `^22.0.0`. Use `ngx-mat-progress-bar@20` with Angular 20. There is no 21.x release
- **component**: `color` on `<ngx-mat-progress-bar>` is a signal input. Template bindings are unchanged. Code that reads or assigns `component.color` directly must use `component.color()` and `componentRef.setInput('color', value)`
- **providers**: `color`, `mode`, `value`, `bufferValue` and `visible` passed to `provideNgxMatProgressBar()` are now applied (see Fixed). An application that passed values it did not want will see them take effect

### 🐛 Fixed

- **providers**: `color`, `mode`, `value`, `bufferValue` and `visible` passed to `provideNgxMatProgressBar()` were ignored. They now set the bar's initial state
- **component**: A change to a bound `[color]` after the first render was ignored. The bar now follows it
- **component**: The component forced the color to `primary` when no `color` was bound, which would have overridden the provider's color
- **package**: `@angular/router` and `rxjs` are imported by the library but were missing from `peerDependencies`
- **package**: A package built locally with `npm run package` or `npm run publish:npm` had no `LICENSE` and an outdated README. `npm run build:lib` now copies both from the repository root
- **package**: The copy published to GitHub Packages contained a tarball of itself

### 🔧 Changed

- **angular**: Built with Angular 22.2.1, Angular Material 22.2.1, ng-packagr 22.2.4 and TypeScript 6.0
- **component**: Templates use built-in control flow (`@if`) instead of `*ngIf`, so the component no longer imports `CommonModule`
- **release**: The package is published from GitHub Actions with npm trusted publishing (OIDC) instead of an `NPM_TOKEN` secret, and carries a provenance attestation. See [PUBLISHING.md](PUBLISHING.md)
- **tests**: The unit tests run again. All 15 were failing on 20.1.0

### 📚 Documentation

- **readme**: Compatibility table, theme requirement, what the UI settings do, and an upgrade guide for v22
- **configuration**: `CONFIGURATION.md` still used `provideNgxMatProgressBarOptions`, which was removed in 20.1.0. It also described a behaviour for `enableSmartBatching: false` that was never implemented. The option has no effect
- **publishing**: New `PUBLISHING.md`

### 🏗️ Migration Guide

1. Upgrade the application to Angular 22: `ng update @angular/core@22 @angular/cli@22 @angular/material@22`
2. `npm install ngx-mat-progress-bar@22`
3. If code reads or assigns the component's `color` property directly, switch to `color()` and `setInput('color', value)`

---

## [20.1.0] - 2025-10-22

### 🚨 BREAKING CHANGES

- **providers**: Merged `provideNgxMatProgressBar` and `provideNgxMatProgressBarOptions` into a single provider function for cleaner API
  
  **Before:**
  ```typescript
  // Old approach - two separate provider functions
  providers: [
    provideNgxMatProgressBar({ color: 'primary', mode: 'indeterminate' }),
    provideNgxMatProgressBarOptions({ hideDelay: 300, enableDebugLogs: true })
  ]
  ```
  
  **After:**
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

### ✨ Added

- **providers**: New unified `NgxMatProgressBarConfiguration` interface combining UI and behavioral options
- **providers**: Single `provideNgxMatProgressBar()` function accepts all configuration options
- **api**: Simplified developer experience with cleaner API surface

### 🔧 Changed

- **providers**: Combined visual configuration (color, mode, value) with behavioral options (hideDelay, enableDebugLogs) in single provider
- **types**: Updated TypeScript definitions to reflect merged configuration interface

### 📚 Documentation

- **readme**: Updated all examples to use new unified provider syntax
- **api**: Added comprehensive JSDoc documentation for merged provider function

### 🏗️ Migration Guide

To migrate from v20.0.x to v20.1.x:

1. **Replace two provider calls with one:**
   ```typescript
   // Remove separate providers
   - provideNgxMatProgressBar({ color: 'primary' }),
   - provideNgxMatProgressBarOptions({ hideDelay: 300 })
   
   // Use single merged provider
   + provideNgxMatProgressBar({ 
   +   color: 'primary',
   +   hideDelay: 300 
   + })
   ```

2. **Update imports (if needed):**
   ```typescript
   // Only import single provider function
   import { provideNgxMatProgressBar } from 'ngx-mat-progress-bar';
   ```

3. **Combine configurations:**
   - All visual options (color, mode, value, etc.) and behavioral options (hideDelay, enableDebugLogs, etc.) now go in the same configuration object

---

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
- **20.x.x**: Compatible with Angular 20
- **22.x.x**: Compatible with Angular 22 (there is no 21.x release)
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