// libs/.../main-layout.component.ts
import { Component, computed, effect, inject } from '@angular/core';

import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

import { AuthService } from '@angularFirstMicroservice/auth';

/**
 * Main layout component that wraps the app’s primary structure.
 *
 * Includes the header, footer, and a router outlet for child views.
 * Passes company and user info to header and footer.
 * Handles user logout through AuthService.
 */
@Component({
  selector: 'lib-base-layout',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, FooterComponent],
  template: `
    <div class="dashboard">
      <lib-header
        [companyName]="companyName"
        [userName]="userName()"
        (logout)="logout()"
      ></lib-header>

      <main>
        <router-outlet></router-outlet>
      </main>

      <lib-footer [companyName]="companyName" [year]="year"></lib-footer>
    </div>
  `,
})
export class MainLayoutComponent {
  private readonly auth = inject(AuthService);
  companyName = "Seb's Perfumes";

  // Compute from the signal so it updates when fetch completes
  userName = computed(() => this.auth.user()?.username ?? 'Guest');

  constructor() {
    // Lazy-load the user once if we have a token
    effect(() => {
      if (this.auth.isLoggedIn()) {
        this.auth.ensureUserLoaded();
      }
    });
  }

  /** Current year, used in footer or copyright */
  year = new Date().getFullYear();

  /**
   * Logs the user out and redirects to the login page
   */
  logout() {
    this.auth.logout();
  }
}
