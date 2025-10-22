import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { NgxMatProgressBarService } from './ngx-mat-progress-bar.service';

/**
 * Legacy class-based HTTP interceptor for backward compatibility
 * 
 * @deprecated Use httpProgressInterceptor functional interceptor instead
 */
@Injectable()
export class NgxMatProgressBarInterceptor implements HttpInterceptor {
  private activeRequests = 0;

  constructor(private progressBarService: NgxMatProgressBarService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip progress bar for certain requests if needed
    if (req.headers.has('X-Skip-Progress-Bar')) {
      return next.handle(req);
    }

    // Start progress bar on first request
    if (this.activeRequests === 0) {
      this.progressBarService.start();
    }
    this.activeRequests++;

    return next.handle(req).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // Request completed successfully
        }
      }),
      finalize(() => {
        // Decrease active requests count
        this.activeRequests--;
        
        // Complete progress bar when no more active requests
        if (this.activeRequests === 0) {
          this.progressBarService.complete();
        }
      })
    );
  }
}