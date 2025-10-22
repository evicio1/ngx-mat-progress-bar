import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideNgxMatProgressBar, httpProgressInterceptor } from 'mat-progress-bar-library';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([httpProgressInterceptor])
    ),
    provideNgxMatProgressBar({
      config: {
        color: 'primary',
        mode: 'indeterminate'
      }
    })
  ]
};
