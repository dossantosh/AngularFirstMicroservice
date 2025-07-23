// src/app/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../enviroments/environments';
import { of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth/login`;

  constructor(private readonly http: HttpClient, private readonly router: Router) { }

  login(credentials: { username: string; password: string }) {
    return this.http.post<{ jwt: string }>(this.apiUrl, credentials)
      .pipe(tap(response => {
        localStorage.setItem('token', response.jwt);
      }));
  }

  // //fake para pruebas
  // login(credentials: { username: string; password: string }) {
  // //   Simulamos un login exitoso con token "fake-token"
  //   return of({ token: 'fake-token' }).pipe(
  //     delay(1000), // simula un retraso de 1 segundo
  //     tap(response => {
  //       localStorage.setItem('token', response.token);
  //     })
  //   );
  // }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
  isLoggedIn(): boolean {
    if (typeof window === 'undefined') {
      // 📝 Estamos en Node o en un entorno sin DOM
      return false;
    }

    const token = localStorage.getItem('token');
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
