import { provideEventPlugins } from '@taiga-ui/event-plugins';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environments';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ 
      eventCoalescing: true
    }),
    provideRouter(routes),
    provideEventPlugins(),
    provideFirebaseApp(() => {
      console.log('Initializing Firebase with config:', environment.firebase);
      return initializeApp(environment.firebase);
    }),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
  ],
};
