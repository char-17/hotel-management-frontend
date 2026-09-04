import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { StaffService } from '../../../../core/services/staff.service';
import { Staff } from '../../../../core/models/staff.model';
import { CrudService } from '../../../../core/services/crud.service';
/* Base class provides all shared CRUD logic */
import { BaseCrudComponent } from '../../../../shared/components/base-crud/base-crud.component';

@Component({
  selector: 'app-manage-staff',
  templateUrl: './manage-staff.component.html',
  styleUrl: './manage-staff.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule, MatIcon, MatCard, MatTable, MatSort,
    MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatCell, MatCellDef,
    MatIconButton, MatTooltip, MatHeaderRow, MatHeaderRowDef,
    MatRow, MatRowDef, MatPaginator, MatProgressSpinner, MatFabButton,
  ]
})
export class ManageStaffComponent extends BaseCrudComponent<Staff> {
  displayedColumns = [
    'id', 'firstName', 'lastName', 'username', 'email', 'actions',
  ];

  readonly entityName = 'staff member';
  readonly service: CrudService<Staff>;

  constructor(staffService: StaffService) {
    super();
    this.service = staffService;
  }

  createBlankItem(): Staff {
    return { firstName: '', lastName: '', username: '', email: '' } as Staff;
  }

  getItemId(item: Staff): number | undefined {
    return item.id;
  }
}
