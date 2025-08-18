/**
 * Angular bootstrap entrypoint for the UsersManagement remote.
 * Keep MF/runtime logic out of here; this file only bootstraps Angular.
 */
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './libs/appComponent';
import { appConfig } from './libs/app.config';

bootstrapApplication(AppComponent, appConfig).catch((err) => {
  // Log early so we see boot issues in dev/CI
  console.error('[UsersManagement] bootstrap failed:', err);
});
