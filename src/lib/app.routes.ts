import { Routes } from '@angular/router';
import { LoginComponent } from '../app/auth/login/login.component';
import { IndexComponent } from '../app/index/index.component';
import { authGuard  } from '../app/auth/auth.guard';

export const appRoutes: Routes = [
  { path: '', component: IndexComponent, canActivate: [authGuard ] },
  { path: 'dashboard', component: IndexComponent, canActivate: [authGuard ] },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' },
];
export class AppRoutingModule {}
