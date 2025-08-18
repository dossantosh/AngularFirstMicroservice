// apps/shell/src/bootstrap.ts
/**
 * Angular bootstrap entrypoint for the shell.
 * Keep this file free of MF logic so unit tests and tooling stay simple.
 */
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './libs/appComponent';
import { appConfig } from './libs/app.config';

bootstrapApplication(AppComponent, appConfig).catch((err) => {
  // Surface bootstrap errors early (CI/CD + local dev)
  console.error('Shell bootstrap failed:', err);
});
