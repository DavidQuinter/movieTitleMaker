import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { CanvasService } from './canva-service/canva-service.service';

export const appConfig: ApplicationConfig = {
  providers: [ CanvasService ,provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient(), ]
};
