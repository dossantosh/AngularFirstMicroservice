import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './lib/appComponent';
import { appConfig } from './lib/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));