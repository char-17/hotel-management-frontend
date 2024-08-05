import { Component, OnInit } from '@angular/core';
import { NavToolbarComponent } from './shared/navbar/nav-toolbar/nav-toolbar.component';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [NavToolbarComponent, RouterOutlet, NgIf],
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'hotel-management-frontend';

  //Admin menu
  showAdminMenu = false;

  constructor(private router: Router) {}

  //Show different menu for admin
  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showAdminMenu = event.urlAfterRedirects === '/admin';
      }
    });
  }

  //Show different menu for manager
}
