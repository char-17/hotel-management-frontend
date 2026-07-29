import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { NavToolbarComponent } from '../../../shared/navbar/nav-toolbar/nav-toolbar.component';

/* Home landing page — only needs card layout and nav toolbar */
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [
        MatCardModule,
        MatButtonModule,
        NavToolbarComponent,
    ]
})
export class HomeComponent {}
