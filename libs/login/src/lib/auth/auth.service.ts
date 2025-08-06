// auth.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '@angularFirstMicroservice/environments';
import { Observable, of } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';

/**
 * Interface representing the authenticated user information
 * returned from the backend (`UserAuthDTO`).
 */
export interface User {
  id: number;
  username: string;
  email: string;
  enabled: boolean;
  isAdmin: boolean;
  roles: number[];
  modules: number[];
  submodules: number[];
}

/**
 * Authentication service responsible for handling login, logout,
 * token management, and fetching the current authenticated user.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth/login`;
  private readonly currentUserUrl = `${environment.apiUrl}/auth/me`;

  currentUser: User | null = null;

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  /**
   * Sends login credentials to the backend and stores the returned JWT token
   * in localStorage if authentication is successful.
   *
   * @param credentials The login credentials (username and password).
   * @returns An observable containing the JWT token.
   */
  login(credentials: { username: string; password: string }) {
    return this.http.post<{ jwt: string }>(this.apiUrl, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.jwt);
      })
    );
  }

  /**
   * Logs the user out by clearing the token and redirecting to the login page.
   */
  logout(): void {
    localStorage.removeItem('token');
    this.currentUser = null;
    this.router.navigate(['/login']);
  }

  /**
   * Checks whether the user is currently logged in by verifying the presence
   * of a JWT token in localStorage.
   *
   * @returns True if a token exists, otherwise false.
   */
  isLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
  }

  /**
   * Retrieves the JWT token from localStorage.
   *
   * @returns The token as a string or null if not present.
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Fetches the currently authenticated user's full data (`UserAuthDTO`)
   * from the backend. Caches the result in memory for reuse.
   *
   * @returns An observable of the current user.
   */
  fetchCurrentUser(): Observable<User> {
    if (this.currentUser) {
      return of(this.currentUser); // already cached
    }

    return this.http.get<User>(this.currentUserUrl).pipe(
      tap(user => this.currentUser = user),
      shareReplay(1)
    );
  }
}
