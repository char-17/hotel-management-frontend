import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass, NgOptimizedImage } from '@angular/common';
import {
  MatCard,
  MatCardAvatar,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
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
    MatCardContent,
    NgOptimizedImage,
    MatCardHeader,
    MatIcon,
    MatCardTitle,
    MatCardSubtitle,
    MatCardAvatar,
    MatTooltip,
  ],
})
export class AdminPageComponent {
  constructor(protected menuService: MenuService) {}
}
