import { Injectable } from '@angular/core';

/* Centralized menu state service — controls sidebar toggle across role pages */
@Injectable({
  providedIn: 'root',
})
export class MenuService {
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
