import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { NgClass, DecimalPipe, CurrencyPipe } from '@angular/common';
import {
  MatCard,
  MatCardAvatar,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MenuService } from '../../../services/ui-manipulation/header-menu/menu.service';
import { DashboardService } from '../../../core/services/dashboard.service';
import { DashboardStats } from '../../../core/models/dashboard-stats.model';

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrl: './admin-page.component.css',
    imports: [
        RouterLink,
        NgClass,
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardSubtitle,
        MatCardAvatar,
        MatIcon,
        MatProgressSpinner,
        RouterOutlet,
        RouterModule,
        DecimalPipe,
        CurrencyPipe,
    ]
})
export class AdminPageComponent implements OnInit {
  stats: DashboardStats | null = null;
  isLoadingStats = true;

  constructor(
    protected menuService: MenuService,
    private dashboardService: DashboardService,
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.isLoadingStats = true;
    this.dashboardService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.isLoadingStats = false;
      },
      error: () => {
        this.isLoadingStats = false;
      },
    });
  }
}
