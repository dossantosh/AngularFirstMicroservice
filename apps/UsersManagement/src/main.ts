import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './libs/appComponent';
import { appConfig } from './libs/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));