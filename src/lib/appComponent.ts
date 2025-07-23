import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,  // Aquí es donde se cargan los componentes según la ruta activa
})
export class AppComponent {
  protected title = 'usersmanagement';
}
