//index.component.ts
import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AuthService } from '../auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-index',
  imports: [CommonModule, RouterModule],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent {
  userName = 'Sebastián Dos Santos';
  companyName = 'Seb\'s Perfumes';
  year = new Date().getFullYear();

  constructor(private readonly auth: AuthService) {}

  logout() {
    this.auth.logout();
  }
}
