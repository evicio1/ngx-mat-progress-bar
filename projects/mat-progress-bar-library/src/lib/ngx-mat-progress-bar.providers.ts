import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { NgxMatProgressBarService, NgxMatProgressBarConfig, NgxMatProgressBarOptions } from './ngx-mat-progress-bar.service';

export interface NgxMatProgressBarConfiguration extends NgxMatProgressBarOptions {
  /** Progress bar color theme */
  color?: 'primary' | 'accent' | 'warn';
  /** Progress bar mode */
  mode?: 'determinate' | 'indeterminate' | 'buffer' | 'query';
  /** Progress bar value (0-100) */
  value?: number;
  /** Buffer value for buffer mode (0-100) */
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
  if (color || mode || value !== undefined || bufferValue !== undefined || visible !== undefined) {
    providers.push({
      provide: 'NGX_MAT_PROGRESS_BAR_CONFIG',
      useValue: { color, mode, value, bufferValue, visible }
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