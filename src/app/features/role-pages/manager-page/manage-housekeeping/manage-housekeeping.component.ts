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
import { HousekeepingService } from '../../../../core/services/housekeeping.service';
import { Housekeeping } from '../../../../core/models/housekeeping.model';
import { CrudService } from '../../../../core/services/crud.service';
/* Base class provides all shared CRUD logic */
import { BaseCrudComponent } from '../../../../shared/components/base-crud/base-crud.component';

@Component({
  selector: 'app-manage-housekeeping',
  templateUrl: './manage-housekeeping.component.html',
  styleUrl: './manage-housekeeping.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule, MatIcon, MatCard, MatTable, MatSort,
    MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatCell, MatCellDef,
    MatIconButton, MatTooltip, MatHeaderRow, MatHeaderRowDef,
    MatRow, MatRowDef, MatPaginator, MatProgressSpinner, MatFabButton,
  ]
})
export class ManageHousekeepingComponent extends BaseCrudComponent<Housekeeping> {
  displayedColumns = [
    'houskeepingId', 'taskDate', 'taskDescription', 'status', 'actions',
  ];

  readonly entityName = 'housekeeping task';
  readonly service: CrudService<Housekeeping>;

  constructor(housekeepingService: HousekeepingService) {
    super();
    this.service = housekeepingService;
  }

  createBlankItem(): Housekeeping {
    return { taskDate: '', taskDescription: '', status: 'PENDING' } as Housekeeping;
  }

  /* Backend typo preserved — field is houskeepingId (missing 'e') */
  getItemId(item: Housekeeping): number | undefined {
    return item.houskeepingId;
  }
}
