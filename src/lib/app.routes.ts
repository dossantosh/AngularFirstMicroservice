import { Routes } from '@angular/router';

import { MainLayoutComponent } from '../shared/components/main-layout.component';
import { IndexComponent } from '../app/index/index.component';
import { UsersComponent } from '../app/users/users.component';

import { LoginComponent } from '../app/auth/login/login.component';

import { authGuard } from '../app/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: IndexComponent, canActivate: [authGuard] },
      { path: 'users', component: UsersComponent, canActivate: [authGuard] },
    ],
  },
  {
    path: 'login',
    component: LoginComponent, // Aquí no hay layout ni header/footer
  },
  {
    path: '**',
    redirectTo: '', // O página 404
  },
];