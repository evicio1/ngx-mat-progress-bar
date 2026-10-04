import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { NgxMatProgressBarService, NgxMatProgressBarOptions } from './ngx-mat-progress-bar.service';

export interface NgxMatProgressBarConfiguration extends NgxMatProgressBarOptions {
  /** Progress bar color theme (Material 2 themes only, see MatProgressBar.color) */
  color?: 'primary' | 'accent' | 'warn';
  /** Initial progress bar mode. start(), HTTP requests and navigation always switch to indeterminate */
  mode?: 'determinate' | 'indeterminate' | 'buffer' | 'query';
  /** Initial progress bar value (0-100) */
  value?: number;
  /** Initial buffer value for buffer mode (0-100) */
  bufferValue?: number;
  /** Whether to show the progress bar initially */
  visible?: boolean;
}

/**
 * Provides NgxMatProgressBar service with comprehensive configuration
 * Returns modern EnvironmentProviders for better type safety
 * 
 * Usage:
 * ```typescript
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     provideNgxMatProgressBar({
 *       color: 'primary',
 *       mode: 'indeterminate',
 *       hideDelay: 300,
 *       enableDebugLogs: true
 *     }),
 *     provideHttpClient(
 *       withInterceptors([httpProgressInterceptor])
 *     )
 *   ]
 * });
 * ```
 */
export function provideNgxMatProgressBar(
  config?: Partial<NgxMatProgressBarConfiguration>
): EnvironmentProviders {
  const { color, mode, value, bufferValue, visible, ...options } = config || {};
  
  const providers: any[] = [NgxMatProgressBarService];
  
  // Add progress bar UI configuration if provided
  const uiConfig = Object.fromEntries(
    Object.entries({ color, mode, value, bufferValue, visible }).filter(([, setting]) => setting !== undefined)
  );
  if (Object.keys(uiConfig).length > 0) {
    providers.push({
      provide: 'NGX_MAT_PROGRESS_BAR_CONFIG',
      useValue: uiConfig
    });
  }
  
  // Add behavioral options if provided
  if (Object.keys(options).length > 0) {
    providers.push({
      provide: 'NGX_MAT_PROGRESS_BAR_OPTIONS',
      useValue: options
    });
  }
  
  return makeEnvironmentProviders(providers);
}