import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../app/auth/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterModule],
  template: `
    <div class="dashboard">
      <app-header
        [companyName]="companyName"
        [userName]="userName"
        (logout)="logout()"
      ></app-header>

      <main>
        <router-outlet></router-outlet>
      </main>

      <app-footer
        [companyName]="companyName"
        [year]="year"
      ></app-footer>
    </div>
  `
})
export class MainLayoutComponent {
  companyName = 'Mi Empresa';
  userName = 'Usuario';
  year = new Date().getFullYear();

  constructor(
    private readonly auth: AuthService
  ){}

  logout() {
    this.auth.logout();
  }
}
