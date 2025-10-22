import { Injectable, signal, computed, Inject, Optional } from '@angular/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { filter } from 'rxjs/operators';

export type ThemePalette = 'primary' | 'accent' | 'warn' | undefined;

export interface NgxMatProgressBarConfig {
  /** Progress bar color theme */
  color?: ThemePalette;
  /** Progress bar mode */
  mode?: ProgressBarMode;
  /** Progress bar value (0-100) */
  value?: number;
  /** Buffer value for buffer mode (0-100) */
  bufferValue?: number;
  /** Whether to show the progress bar */
  visible?: boolean;
}

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

@Injectable({
  providedIn: 'root'
})
export class NgxMatProgressBarService {
  // Signals for reactive state management
  private readonly _config = signal<NgxMatProgressBarConfig>({
    color: 'primary',
    mode: 'indeterminate',
    value: 0,
    bufferValue: 0,
    visible: false
  });

  private readonly _activeRequests = signal(0);
  private readonly _isManualMode = signal(false);
  private readonly _isNavigating = signal(false);
  private readonly _savedState = signal<NgxMatProgressBarConfig | null>(null);

  // Debouncing for smooth HTTP progress
  private _hideProgressTimeout: any = null;
  private readonly _hideProgressDelay = signal(300); // configurable
  private readonly _minDisplayTime = signal(200); // configurable
  private readonly _enableSmartBatching = signal(true); // configurable
  private readonly _enableDebugLogs = signal(false); // configurable
  private _progressStartTime: number | null = null;

  // Public signals
  readonly config = this._config.asReadonly();
  readonly activeRequests = this._activeRequests.asReadonly();
  
  // Computed signals
  readonly isLoading = computed(() => this._activeRequests() > 0);
  readonly isVisible = computed(() => this._config().visible || false);
  readonly isNavigating = this._isNavigating.asReadonly();

  constructor(
    private router: Router,
    @Optional() @Inject('NGX_MAT_PROGRESS_BAR_OPTIONS') private options?: NgxMatProgressBarOptions
  ) {
    this.initializeRouterTracking();
    
    // Apply provided options
    if (this.options) {
      this.configureOptions(this.options);
    }
  }

  /**
   * Configure progress bar options
   */
  configureOptions(options: NgxMatProgressBarOptions): void {
    if (options.hideDelay !== undefined) {
      this._hideProgressDelay.set(Math.max(0, options.hideDelay));
    }
    if (options.minDisplayTime !== undefined) {
      this._minDisplayTime.set(Math.max(0, options.minDisplayTime));
    }
    if (options.enableSmartBatching !== undefined) {
      this._enableSmartBatching.set(options.enableSmartBatching);
    }
    if (options.enableDebugLogs !== undefined) {
      this._enableDebugLogs.set(options.enableDebugLogs);
    }
  }

  /**
   * Get current configuration options
   */
  getOptions(): NgxMatProgressBarOptions {
    return {
      hideDelay: this._hideProgressDelay(),
      minDisplayTime: this._minDisplayTime(),
      enableSmartBatching: this._enableSmartBatching(),
      enableDebugLogs: this._enableDebugLogs()
    };
  }

  /**
   * Initialize router event tracking
   */
  private initializeRouterTracking(): void {
    // Track navigation start
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe(() => {
      this.startNavigation();
    });

    // Track navigation end (success, cancel, or error)
    this.router.events.pipe(
      filter(event => 
        event instanceof NavigationEnd || 
        event instanceof NavigationCancel || 
        event instanceof NavigationError
      )
    ).subscribe(() => {
      this.completeNavigation();
    });
  }

  /**
   * Start the progress bar (for manual use) - completely independent of HTTP
   */
  start(): void {
    this._isManualMode.set(true);
    this._activeRequests.set(0); // Reset HTTP counter to avoid conflicts
    this.updateConfig({ visible: true, mode: 'indeterminate' });
  }

  /**
   * Complete the progress bar with animation (for manual use)
   */
  complete(): void {
    if (!this._isManualMode()) return;
    
    // Simulate completion animation
    this.updateConfig({ mode: 'determinate', value: 100 });
    
    setTimeout(() => {
      this.updateConfig({ visible: false, value: 0 });
      this._isManualMode.set(false);
    }, 300); // Slightly longer animation
  }

  /**
   * Set progress value (0-100) - for manual use
   */
  set(value: number): void {
    if (!this._isManualMode()) {
      this._isManualMode.set(true);
      this._activeRequests.set(0); // Reset HTTP counter
    }
    this.updateConfig({ 
      mode: 'determinate', 
      value: Math.max(0, Math.min(100, value)),
      visible: true 
    });
  }

  /**
   * Increment progress value
   */
  inc(amount: number = 5): void {
    const currentValue = this._config().value || 0;
    this.set(currentValue + amount);
  }

  /**
   * Reset progress bar
   */
  reset(): void {
    this._activeRequests.set(0);
    this._isManualMode.set(false);
    this.updateConfig({ 
      visible: false, 
      value: 0, 
      mode: 'indeterminate' 
    });
  }

  /**
   * Start progress for HTTP interceptor
   */
  startHttp(): void {
    if (this._isManualMode()) return; // Don't interfere with manual mode
    
    // Clear any pending hide timeout since we have a new request
    if (this._hideProgressTimeout) {
      clearTimeout(this._hideProgressTimeout);
      this._hideProgressTimeout = null;
    }
    
    const wasIdle = this._activeRequests() === 0;
    this._activeRequests.update(count => count + 1);
    
    // Only start progress bar for the first request in a batch
    if (wasIdle) {
      this._progressStartTime = Date.now();
      this.updateConfig({ visible: true, mode: 'indeterminate' });
      if (this._enableDebugLogs()) {
        console.log('HTTP batch started, showing progress bar');
      }
    } else if (this._enableDebugLogs()) {
      console.log(`Additional HTTP request (${this._activeRequests()} total), keeping bar active`);
    }
  }

  /**
   * Complete progress for HTTP interceptor with debouncing
   */
  completeHttp(): void {
    if (this._isManualMode()) return; // Don't interfere with manual mode
    
    this._activeRequests.update(count => Math.max(0, count - 1));
    if (this._enableDebugLogs()) {
      console.log(`HTTP request completed, ${this._activeRequests()} remaining`);
    }

    // Only consider hiding when all requests are done
    if (this._activeRequests() === 0 && !this._isNavigating()) {
      const elapsedTime = this._progressStartTime ? Date.now() - this._progressStartTime : 0;
      const remainingMinTime = Math.max(0, this._minDisplayTime() - elapsedTime);
      
      // Show completion animation
      this.updateConfig({ mode: 'determinate', value: 100 });
      
      // Wait for min display time + hide delay to prevent flickering
      const totalDelay = remainingMinTime + this._hideProgressDelay();
      
      this._hideProgressTimeout = setTimeout(() => {
        // Double-check that no new requests started during delay
        if (this._activeRequests() === 0 && !this._isNavigating()) {
          this.updateConfig({ visible: false, value: 0, mode: 'indeterminate' });
          this._progressStartTime = null;
          if (this._enableDebugLogs()) {
            console.log('HTTP batch complete, hiding progress bar after debounce');
          }
        }
        this._hideProgressTimeout = null;
      }, totalDelay);
    }
    // If navigation is active, let navigation handle completion
  }

  /**
   * Start progress for router navigation (highest priority)
   */
  startNavigation(): void {
    // Save current state if something else is active
    if (this._config().visible && !this._isNavigating()) {
      this._savedState.set({ ...this._config() });
      if (this._enableDebugLogs()) {
        console.log('Navigation starting, saved current state:', this._savedState());
      }
    }
    
    this._isNavigating.set(true);
    this.updateConfig({ visible: true, mode: 'indeterminate' });
  }

  /**
   * Complete progress for router navigation (highest priority)
   */
  completeNavigation(): void {
    this._isNavigating.set(false);

    // Clear any pending HTTP hide timeout since navigation resets everything
    if (this._hideProgressTimeout) {
      clearTimeout(this._hideProgressTimeout);
      this._hideProgressTimeout = null;
    }

    // Show navigation completion briefly
    this.updateConfig({ mode: 'determinate', value: 100 });
    
    setTimeout(() => {
      // Navigation to a new page should reset all progress states
      // This makes UX sense - new page = fresh start
      if (this._enableDebugLogs()) {
        console.log('Navigation complete, resetting all progress states for fresh page');
      }
      
      this._isManualMode.set(false);
      this._activeRequests.set(0); // Reset HTTP requests (they're likely stale after navigation)
      this._savedState.set(null);
      this._progressStartTime = null; // Reset timing
      
      // Hide progress bar completely
      this.updateConfig({ 
        visible: false, 
        value: 0, 
        mode: 'indeterminate' 
      });
    }, 300);
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<NgxMatProgressBarConfig>): void {
    this._config.update(currentConfig => ({ ...currentConfig, ...config }));
  }

  /**
   * Get current configuration
   */
  getConfig(): NgxMatProgressBarConfig {
    return this._config();
  }

  /**
   * Debug method to check current state
   */
  getDebugState() {
    return {
      config: this._config(),
      activeRequests: this._activeRequests(),
      isManualMode: this._isManualMode(),
      isNavigating: this._isNavigating(),
      savedState: this._savedState(),
      isLoading: this.isLoading(),
      isVisible: this.isVisible(),
      options: this.getOptions()
    };
  }
}