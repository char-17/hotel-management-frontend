import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import {
  MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable,
} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatIcon } from '@angular/material/icon';
import { MatCard } from '@angular/material/card';
import { MatSort } from '@angular/material/sort';
/* NgIf import removed — template migrated to @if/@else control flow */
import { MatFabButton, MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
/* Centralized core imports */
import { RoomService } from '../../../../../core/services/room.service';
import { Room } from '../../../../../core/models/room.model';
import { CrudService } from '../../../../../core/services/crud.service';
/* Base class provides all shared CRUD logic */
import { BaseCrudComponent } from '../../../../../shared/components/base-crud/base-crud.component';

@Component({
    selector: 'app-manage-rooms',
    templateUrl: './manage-rooms.component.html',
    styleUrl: './manage-rooms.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatIcon, MatCard, MatTable, MatSort,
        MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatCell, MatCellDef,
        ReactiveFormsModule, MatIconButton, MatTooltip,
        MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
        MatPaginator, MatProgressSpinner, MatFabButton,
    ]
})
export class ManageRoomsComponent extends BaseCrudComponent<Room> {
  displayedColumns = [
    'id', 'roomNumber', 'roomType', 'capacity', 'roomPrice', 'roomStatus', 'actions',
  ];

  readonly entityName = 'room';
  readonly service: CrudService<Room>;

  constructor(roomService: RoomService) {
    super();
    this.service = roomService;
  }

  createBlankItem(): Room {
    return { roomNumber: '', roomType: '', capacity: 1, roomPrice: 0, roomStatus: 'AVAILABLE' } as Room;
  }

  getItemId(item: Room): number | undefined {
    return item.id;
  }

  /* Build reactive form for inline room editing */
  buildEditForm(item: Room): FormGroup {
    return this.fb.group({
      roomNumber: [item.roomNumber, Validators.required],
      roomType: [item.roomType, Validators.required],
      capacity: [item.capacity, [Validators.required, Validators.min(1)]],
      roomPrice: [item.roomPrice, [Validators.required, Validators.min(0)]],
      roomStatus: [item.roomStatus, Validators.required],
    });
  }
}
