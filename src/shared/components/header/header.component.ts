import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [RouterModule],
})
export class HeaderComponent {
  @Input() companyName = 'Mi Empresa';
  @Input() userName = 'Usuario';
  @Output() logout = new EventEmitter<void>();
}
