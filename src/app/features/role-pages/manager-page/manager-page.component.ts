import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';
import {
  MatCard,
  MatCardAvatar,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MenuService } from '../../../services/ui-manipulation/header-menu/menu.service';

/* Manager dashboard landing page — links to all management sub-pages */
@Component({
    selector: 'app-manager-page',
    templateUrl: './manager-page.component.html',
    styleUrl: './manager-page.component.css',
    imports: [
        RouterLink,
        RouterOutlet,
        NgClass,
        MatCard,
        MatCardHeader,
        MatIcon,
        MatCardTitle,
        MatCardSubtitle,
        MatCardAvatar,
        MatTooltip,
        MatIconModule,
    ]
})
export class ManagerPageComponent {
  constructor(protected menuService: MenuService) {}
}
