// auth.service.ts

import { Injectable, inject, signal } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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
  /** Runtime environment injected via APP_ENV token (provided by shell/remote) */
  // private readonly env: AppEnv =
  //   // Optional fallback avoids NG0201 if a host forgets the provider during dev
  //   inject(APP_ENV, { optional: true }) ?? {
  //     usersManagementUrl: 'http://localhost:9090/api',
  //   };

  /** HTTP client injected by Angular's DI */
  private readonly http = inject(HttpClient);

  /** Router for navigation after logout */
  private readonly router = inject(Router);

  /** API endpoints derived from runtime env (safe: evaluated in DI context) */
  // private readonly usersManagementUrl = `${this.env.usersManagementUrl}/auth/login`;
  // private readonly currentUserUrl = `${this.env.usersManagementUrl}/auth/me`;

  private readonly usersManagementUrl = `http://localhost:9090/api/auth/login`;
  private readonly currentUserUrl = `http://localhost:9090/api/auth/me`;

  /** Display-only cache of the current user */
  currentUser: User | null = null;

  /** Reactive source for the current user (preferred by components) */
  private readonly _user = signal<User | null>(null);
  /** Readonly signal for components */
  readonly user = this._user.asReadonly();

  /**
   * Sends login credentials to the backend and stores the returned JWT token
   * in localStorage if authentication is successful.
   *
   * @param credentials The login credentials (username and password).
   * @returns An observable containing the JWT token.
   */
  login(credentials: { username: string; password: string }) {
    return this.http
      .post<{ jwt: string }>(this.usersManagementUrl, credentials)
      .pipe(
        tap((response) => {
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
    this._user.set(null);
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
   * Flow:
   *
   * 1. Check if the currentUser is already cached.
   * 2. If cached, return it as an observable.
   * 3. If not cached, make an HTTP request to fetch the user data.
   *
   * If a user object is already in memory, wrap it in of(...) to return an observable immediately (no HTTP request).
   *
   * Otherwise — make an HTTP GET request
   *
   * this.http.get<User>(...) calls the backend’s /auth/me endpoint.
   *
   * .pipe(...)
   *
   * tap(...) when the backend returns the user, store it in this.currentUser so next time we skip the HTTP request.
   *
   * shareReplay(1) →
   *
   * Caches the last emitted value in the observable itself.
   *
   * If multiple subscribers call this at the same time (e.g., guard + component), it will reuse the same HTTP request instead of firing duplicates.
   *
   * The 1 means “keep the most recent value”.
   *
   * @returns An observable of the current user.
   */
  fetchCurrentUser(): Observable<User> {
    if (this.currentUser) {
      // keep signal in sync if it wasn't yet
      if (this._user() !== this.currentUser) this._user.set(this.currentUser);
      return of(this.currentUser);
    }

    return this.http.get<User>(this.currentUserUrl).pipe(
      tap((user) => {
        this.currentUser = user;
        this._user.set(user); // update the signal so UI reacts
      }),
      shareReplay(1)
    );
  }

  /**
   * Idempotent loader you can call from components or after login.
   * It triggers fetch only when we have a token and no user yet.
   */
  ensureUserLoaded(): void {
    if (this.isLoggedIn() && !this.currentUser) {
      this.fetchCurrentUser().subscribe(); // one-shot; already shareReplayed
    }
  }
}
