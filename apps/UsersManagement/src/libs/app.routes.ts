
import { Routes } from '@angular/router';

import { IndexComponent } from '../app/index/index.component';
import { UsersComponent } from '../app/users/users.component';

import { MainLayoutComponent } from '@angularFirstMicroservice/components';
import { LoginComponent } from '@angularFirstMicroservice/login';
import { authGuard } from '@angularFirstMicroservice/auth';

/**
 * Application route definitions.
 *
 * - Routes using `MainLayoutComponent` are protected by the `authGuard`.
 * - The login route is publicly accessible.
 * - Unmatched routes will be redirected to the home page (`''`).
 */
export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      /**
       * Home page route
       * Protected by the authentication guard
       */
      { path: '', component: IndexComponent, canActivate: [authGuard] },

      /**
       * Users management route
       * Accessible only to authenticated users
       */
      { path: 'users', component: UsersComponent, canActivate: [authGuard] },
    ],
  },

  /**
   * Public login page route
   */
  {
    path: 'login',
    component: LoginComponent,
  },

  /**
   * Wildcard route
   * Redirects unknown paths to the home page
   */
  {
    path: '**',
    redirectTo: '',
  },
];
