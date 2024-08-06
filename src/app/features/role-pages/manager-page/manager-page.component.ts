import { Component } from '@angular/core';
import {
  MatCard,
  MatCardAvatar,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MenuService } from '../../../services/ui-manipulation/header-menu/menu.service';
import { RouterLink } from '@angular/router';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-manager-page',
  templateUrl: './manager-page.component.html',
  styleUrl: './manager-page.component.css',
  standalone: true,
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
export class ManagerPageComponent {
  constructor(protected menuService: MenuService) {}
}
