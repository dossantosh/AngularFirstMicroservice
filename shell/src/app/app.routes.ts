import { Route } from '@angular/router';

import { IndexComponent } from './index/index.component';
import { LoginComponent } from './login/login.component';

import { MainLayoutComponent } from '@angularFirstMicroservice/components';
import { AUTH_GUARD } from '@angularFirstMicroservice/auth';
/**
 * Application routes configuration.
 * Defines the root path and associated component.
 */
export const appRoutes: Route[] = [
  /**
   * Authenticated area
   */
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AUTH_GUARD],
    children: [
      /**
       * Home page route
       */
      { path: '', component: IndexComponent },

      /**
       * Users management route
       * Javadoc: Loads the remote's route config from the MF container.
       */
      {
        path: 'usersmanagement',
        loadChildren: () =>
          import('UsersManagement/Routes').then((m) => m!.remoteRoutes),
      },
    ],
  },

  /**
   * Public login page route
   */
  { path: 'login', component: LoginComponent },

  /**
   * Wildcard route
   * Javadoc: Redirect unknown paths to the root (auth area).
   */
  { path: '**', redirectTo: '' },
];
