import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth/auth.service';

import { environment } from '../../shared/environments/environments';

interface UserDTO {
  id: number;
  username: string;
  email: string;
  enabled: boolean;
  isAdmin: boolean;
}

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

  userName = 'Sebastián Dos Santos';
  companyName = "Seb's Perfumes";
  year = new Date().getFullYear();

  users: UserDTO[] = [];
  filters = {
    id: null as number | null,
    username: '',
    email: ''
  };

  limit = 50;
  direction: 'NEXT' | 'PREVIOUS' = 'NEXT';
  lastId: number | null = null;

  hasNext = false;
  hasPrevious = false;
  nextId: number | null = null;
  previousId: number | null = null;
  empty = false;

  constructor(
    private readonly auth: AuthService,
    private readonly http: HttpClient
  ) {
    this.searchUsers();
  }

  logout() {
    this.auth.logout();
  }

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
          this.hasPrevious = page.hasPrevious; // uso correcto aquí
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

  clearUsers() {
    this.users = [];
    this.hasNext = false;
    this.hasPrevious = false;
    this.nextId = null;
    this.previousId = null;
    this.empty = true;
  }

  clearFilters() {
    this.filters = { id: null, username: '', email: '' };
    this.lastId = null;
    this.direction = 'NEXT';
    this.searchUsers();
  }

  loadNext() {
    if (this.hasNext && this.nextId != null) {
      this.lastId = this.nextId;
      this.direction = 'NEXT';
      this.searchUsers();
    }
  }

  loadPrevious() {
    if (this.hasPrevious && this.previousId != null) {
      this.lastId = this.previousId;
      this.direction = 'PREVIOUS';
      this.searchUsers();
    }
  }
}
