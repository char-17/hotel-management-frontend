import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable,
} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatIcon } from '@angular/material/icon';
import { MatCard } from '@angular/material/card';
import { MatFabButton, MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
/* Centralized core imports — NgIf removed: template migrated to @if/@else control flow */
import { GuestService } from '../../../../core/services/guest.service';
import { Guest } from '../../../../core/models/guest.model';
import { CrudService } from '../../../../core/services/crud.service';
/* Base class provides all shared CRUD logic */
import { BaseCrudComponent } from '../../../../shared/components/base-crud/base-crud.component';

@Component({
  selector: 'app-manage-guests',
  templateUrl: './manage-guests.component.html',
  styleUrl: './manage-guests.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule, MatIcon, MatCard, MatTable, MatSort,
    MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatCell, MatCellDef,
    MatIconButton, MatTooltip, MatHeaderRow, MatHeaderRowDef,
    MatRow, MatRowDef, MatPaginator, MatProgressSpinner, MatFabButton,
  ]
})
export class ManageGuestsComponent extends BaseCrudComponent<Guest> {
  displayedColumns = [
    'guestID', 'firstName', 'lastName', 'email', 'phone', 'nationality', 'passportNumber', 'actions',
  ];

  readonly entityName = 'guest';
  readonly service: CrudService<Guest>;

  constructor(guestService: GuestService) {
    super();
    this.service = guestService;
  }

  createBlankItem(): Guest {
    return {
      firstName: '', lastName: '', email: '', phone: '',
      address: '', dateOfBirth: '', nationality: '', passportNumber: '', notes: '',
    } as Guest;
  }

  getItemId(item: Guest): number | undefined {
    return item.guestID;
  }

  /* Build reactive form for inline guest editing */
  buildEditForm(item: Guest): FormGroup {
    return this.fb.group({
      firstName: [item.firstName, Validators.required],
      lastName: [item.lastName, Validators.required],
      email: [item.email, [Validators.required, Validators.email]],
      phone: [item.phone, Validators.required],
      nationality: [item.nationality],
      passportNumber: [item.passportNumber],
    });
  }
}
