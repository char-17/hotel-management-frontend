import { Component } from '@angular/core';
import { NavToolbarComponent } from "./shared/nav-toolbar/nav-toolbar.component";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    NavToolbarComponent,
    RouterOutlet
  ],
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'hotel-management-frontend';


}
