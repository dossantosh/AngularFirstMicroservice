import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../app/auth/auth.service';

/**
 * Main layout component that wraps the app’s primary structure.
 * 
 * Includes the header, footer, and a router outlet for child views.
 * Passes company and user info to header and footer.
 * Handles user logout through AuthService.
 */
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
  companyName = "Seb's Perfumes";

  userName = this.auth.currentUser?.username || 'Guest';

  year = new Date().getFullYear();

  constructor(
    private readonly auth: AuthService
  ) {}

  logout() {
    this.auth.logout();
  }
}
