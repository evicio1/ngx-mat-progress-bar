import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
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
    provideAnimationsAsync(),
    provideNgxMatProgressBar({
      // UI Configuration
      color: 'primary',
      mode: 'indeterminate',
      
      // Behavioral Options
      hideDelay: 500,
      minDisplayTime: 300,
      enableSmartBatching: true,
      enableDebugLogs: true
    })
  ]
};
