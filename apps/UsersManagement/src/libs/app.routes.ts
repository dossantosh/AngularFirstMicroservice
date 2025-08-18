import { Routes } from '@angular/router';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { UsersComponent } from '../app/users/users.component';

// import { provideAppEnv } 

export const remoteRoutes: Routes = [
  {
    path: '',
    component: UsersComponent,
    providers: [
      provideHttpClient(withInterceptorsFromDi()),
      // provideAppEnv({ usersManagementUrl: 'http://localhost:9090/api' })
    ]
  }
];
