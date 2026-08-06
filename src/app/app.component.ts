import { Component } from '@angular/core';
import { NavToolbarComponent } from './shared/navbar/nav-toolbar/nav-toolbar.component';

/* RouterOutlet removed — NavToolbar handles routing via its own router-outlet */
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    imports: [NavToolbarComponent],
    styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'hotel-management-frontend';
}
