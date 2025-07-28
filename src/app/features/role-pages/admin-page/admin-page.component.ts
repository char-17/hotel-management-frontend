import { Component } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';
import {
  MatCard,
  MatCardAvatar,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatTooltip } from '@angular/material/tooltip';
import { MenuService } from '../../../services/ui-manipulation/header-menu/menu.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  standalone: true,
  styleUrl: './admin-page.component.css',
  imports: [
    RouterLink,
    NgClass,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardAvatar,
    MatTooltip,
    RouterOutlet,
    RouterModule,
  ],
})
export class AdminPageComponent {
  constructor(protected menuService: MenuService) {}
}
