// users.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../shared/environments/environments';

/**
 * Data transfer object for User
 */
interface UserDTO {
  id: number;
  username: string;
  email: string;
  enabled: boolean;
  isAdmin: boolean;
}

/**
 * Generic keyset pagination response
 */
interface KeysetPage<T> {
  content: T[];
  hasNext: boolean;
  hasPrevious: boolean;
  nextId: number | null;
  previousId: number | null;
  empty: boolean;
}

@Component({
  standalone: true,
  selector: 'app-users',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  private readonly apiUrl = `${environment.apiUrl}/users`;

  // Display data
  userName = 'Temporal Name';
  companyName = "Temporal Name";
  year = new Date().getFullYear();

  // Fetched users from backend
  users: UserDTO[] = [];

  // Filtering form model
  filters = {
    id: null as number | null,
    username: '',
    email: ''
  };

  // Pagination settings
  limit = 50;
  direction: 'NEXT' | 'PREVIOUS' = 'NEXT';
  lastId: number | null = null;

  // Pagination state flags
  hasNext = false;
  hasPrevious = false;
  nextId: number | null = null;
  previousId: number | null = null;
  empty = false;

  constructor(
    private readonly auth: AuthService,
    private readonly http: HttpClient
  ) {
    // Fetch initial list of users on component load
    this.searchUsers();
  }

  /**
   * Logs out the current user and redirects to the login page.
   */
  logout() {
    this.auth.logout();
  }

  /**
   * Sends a GET request to the backend with filters and pagination info.
   * Updates the component state with the result.
   */
  searchUsers() {
    let params = new HttpParams()
      .set('limit', this.limit.toString())
      .set('direction', this.direction);

    if (this.filters.id !== null) {
      params = params.set('id', this.filters.id.toString());
    }
    if (this.filters.username.trim() !== '') {
      params = params.set('username', this.filters.username.trim());
    }
    if (this.filters.email.trim() !== '') {
      params = params.set('email', this.filters.email.trim());
    }
    if (this.lastId !== null) {
      params = params.set('lastId', this.lastId.toString());
    }

    this.http.get<KeysetPage<UserDTO>>(this.apiUrl, { params }).subscribe({
      next: (page) => {
        if (page) {
          this.users = page.content || [];
          this.hasNext = page.hasNext;
          this.hasPrevious = page.hasPrevious;
          this.nextId = page.nextId;
          this.previousId = page.previousId;
          this.empty = this.users.length === 0;
        } else {
          this.clearUsers();
        }
      },
      error: () => this.clearUsers()
    });
  }

  /**
   * Clears the user list and resets pagination state.
   */
  clearUsers() {
    this.users = [];
    this.hasNext = false;
    this.hasPrevious = false;
    this.nextId = null;
    this.previousId = null;
    this.empty = true;
  }

  /**
   * Resets all filters and pagination, then fetches users again.
   */
  clearFilters() {
    this.filters = { id: null, username: '', email: '' };
    this.lastId = null;
    this.direction = 'NEXT';
    this.searchUsers();
  }

  /**
   * Loads the next page of users if available.
   */
  loadNext() {
    if (this.hasNext && this.nextId != null) {
      this.lastId = this.nextId;
      this.direction = 'NEXT';
      this.searchUsers();
    }
  }

  /**
   * Loads the previous page of users if available.
   */
  loadPrevious() {
    if (this.hasPrevious && this.previousId != null) {
      this.lastId = this.previousId;
      this.direction = 'PREVIOUS';
      this.searchUsers();
    }
  }
}
