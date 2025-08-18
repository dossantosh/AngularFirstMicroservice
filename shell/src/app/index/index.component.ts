//index.component.ts

import { Component, computed, effect, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AuthService } from '@angularFirstMicroservice/auth';

/**
 * Root index/home component displayed after login.
 * Shows basic user info, company name, and logout functionality.
 */
@Component({
  standalone: true,
  selector: 'app-index',
  imports: [CommonModule, RouterModule],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent {
  private readonly auth = inject(AuthService);

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
