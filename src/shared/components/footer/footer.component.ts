import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  @Input() companyName = 'Mi Empresa';
  @Input() year = new Date().getFullYear();
}
