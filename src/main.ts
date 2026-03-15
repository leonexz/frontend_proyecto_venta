/*
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
*/
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideHttpClient } from '@angular/common/http';  // Proporciona HttpClient globalmente
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';  // Importar de app.routes

bootstrapApplication(App, {
  providers: [
    provideHttpClient(),  // Esto resuelve el error de HttpClient
    provideRouter(routes)
  ]
});