import { Routes } from '@angular/router';
import { LoginComponent } from '../app/auth/login/login.component';
import { IndexComponent } from '../app/index/index.component';
import { UsersComponent } from '../app/users/users.component';
import { authGuard } from '../app/auth/auth.guard';

export const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'users', component: UsersComponent, canActivate: [authGuard] },
  { path: '', component: IndexComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
export class AppRoutingModule { }
