import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { NgxMatProgressBarService } from './ngx-mat-progress-bar.service';

/**
 * Functional HTTP interceptor for automatic progress bar management
 * 
 * Usage:
 * ```typescript
 * provideHttpClient(
 *   withInterceptors([httpProgressInterceptor])
 * )
 * ```
 */
export const httpProgressInterceptor: HttpInterceptorFn = (req, next) => {
  const progressBarService = inject(NgxMatProgressBarService);
  
  // Skip progress bar for certain requests if needed
  if (req.headers.has('X-Skip-Progress-Bar')) {
    return next(req);
  }

  // Start progress bar for HTTP requests
  progressBarService.startHttp();

  return next(req).pipe(
    finalize(() => {
      // Complete progress bar when request finishes
      progressBarService.completeHttp();
    })
  );
};