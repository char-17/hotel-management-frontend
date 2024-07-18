import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private menuOpenSubject = new BehaviorSubject<boolean>(false);
  menuOpen$ = this.menuOpenSubject.asObservable();

  toggleMenu() {
    this.menuOpenSubject.next(!this.menuOpenSubject.value);
  }

  setMenuOpen(isOpen: boolean) {
    this.menuOpenSubject.next(isOpen);
  }
}
