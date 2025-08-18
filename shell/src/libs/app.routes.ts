import { Routes } from '@angular/router';

import { IndexComponent } from '../app/index/index.component';
import { LoginComponent } from '../app/login/login.component';
import { MainLayoutComponent } from '@angularFirstMicroservice/components';

import { loadFromRemote } from '../mf-runtime';

// Use the token-based functional guard

export const routes: Routes = [
  /**
   * Authenticated area
   */
  {
    path: '',
    component: MainLayoutComponent,
    // canActivate: [AUTH_GUARD],
    children: [
      /**
       * Home page route
       * Protected by the authentication guard
       */
      { path: '', component: IndexComponent },

      /**
       * Users management route
       * Accessible only to authenticated users
       */
      {
        path: 'UsersManagement',
        /**
         * Strongly typed remote import path '<remote>/<exposed>'.
         * Includes a runtime null check to satisfy TS18047.
         */
        loadChildren: () =>
          loadFromRemote<typeof import('UsersManagement/Routes')>('UsersManagement/Routes')
            .then((m) => {
              if (!m) throw new Error('Failed to load remote: UsersManagement/Routes');
              return m.remoteRoutes;
            }),
      },
    ],
  },

  /**
   * Public login page route
   */
  { path: 'login', component: LoginComponent },

  /**
   * Wildcard routea
   * Redirects unknown root paths to the login page
   */
  { path: '**', redirectTo: '' },
];
