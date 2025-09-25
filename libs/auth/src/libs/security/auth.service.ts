// security-lib/src/lib/auth.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';

/**
 * Interface representing the authenticated user information
 * returned from the backend (UserAuthDTO).
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
 * Authentication service that handles login, logout, token management,
 * and retrieval of the current authenticated user.
 *
 * <p>
 * Endpoints are resolved via {@link AUTH_API_ENDPOINTS}, keeping the lib
 * host-agnostic. Each app (shell, UsersManagement, etc.) may override
 * the defaults when needed.
 * </p>
 */
@Injectable({ providedIn: 'root' })
export class AuthService {

  /** HTTP client injected by Angular's DI. */
  private readonly http = inject(HttpClient);

  /** Router for navigation after logout. */
  private readonly router = inject(Router);

  /** Computed URLs using the injected prefixes/paths. */
  private readonly loginUrl = `/api-auth/api/auth/login`;
  private readonly currentUserUrl = `/api-auth/api/auth/me`;

  /** Display-only cache of the current user. */
  currentUser: User | null = null;

  /** Reactive source for the current user (preferred by components). */
  private readonly _user = signal<User | null>(null);
  /** Readonly signal for components. */
  readonly user = this._user.asReadonly();

  /**
   * Sends login credentials and stores the JWT on success.
   *
   * @param credentials Username and password.
   * @return Observable with the JWT wrapper.
   */
  login(credentials: { username: string; password: string }) {
    return this.http
      .post<{ jwt: string }>(this.loginUrl, credentials)
      .pipe(tap(res => localStorage.setItem('token', res.jwt)));
  }

  /** Logs out the current user and navigates to the login page. */
  logout(): void {
    localStorage.removeItem('token');
    this.currentUser = null;
    this._user.set(null);
    this.router.navigate(['/login']);
  }

  /**
   * Indicates whether a JWT token is present in localStorage.
   *
   * @return True when a token is present; otherwise false.
   */
  isLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
  }

  /**
   * Retrieves the JWT token from localStorage.
   *
   * @return The token string or null when absent.
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Fetches the current authenticated user (cached + shareReplay).
   *
   * @return Observable of the current user.
   */
  fetchCurrentUser(): Observable<User> {
    if (this.currentUser) {
      if (this._user() !== this.currentUser) this._user.set(this.currentUser);
      return of(this.currentUser);
    }

    return this.http.get<User>(this.currentUserUrl).pipe(
      tap(user => {
        this.currentUser = user;
        this._user.set(user);
      }),
      shareReplay(1)
    );
  }

  /**
   * Idempotent loader that triggers a fetch only when a token exists and user cache is empty.
   */
  ensureUserLoaded(): void {
    if (this.isLoggedIn() && !this.currentUser) {
      this.fetchCurrentUser().subscribe();
    }
  }
}
