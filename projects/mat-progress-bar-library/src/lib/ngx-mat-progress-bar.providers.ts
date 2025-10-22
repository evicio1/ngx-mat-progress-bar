import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { NgxMatProgressBarService, NgxMatProgressBarConfig } from './ngx-mat-progress-bar.service';

export interface NgxMatProgressBarProviderConfig {
  /** Default configuration for the progress bar */
  config?: Partial<NgxMatProgressBarConfig>;
}

/**
 * Provides NgxMatProgressBar service with optional configuration
 * Returns modern EnvironmentProviders for better type safety
 * 
 * Usage:
 * ```typescript
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     provideNgxMatProgressBar({
 *       config: {
 *         color: 'primary'
 *       }
 *     }),
 *     provideHttpClient(
 *       withInterceptors([httpProgressInterceptor])
 *     )
 *   ]
 * });
 * ```
 */
export function provideNgxMatProgressBar(
  config?: NgxMatProgressBarProviderConfig
): EnvironmentProviders {
  return makeEnvironmentProviders([
    NgxMatProgressBarService,
    ...(config?.config ? [
      {
        provide: 'NGX_MAT_PROGRESS_BAR_CONFIG',
        useValue: config.config
      }
    ] : [])
  ]);
}