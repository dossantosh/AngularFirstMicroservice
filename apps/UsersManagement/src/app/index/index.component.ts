//index.component.ts

import { Component, inject } from '@angular/core';

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

  /** Name of the logged-in user */
  userName = this.auth.currentUser?.username || 'Guest';

  /** Current year, used in footer or copyright */
  year = new Date().getFullYear();

  /**
   * Logs the user out and redirects to the login page
   */
  logout() {
    this.auth.logout();
  }
}
