import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AdminPageComponent } from '../../admin-page.component';
import { MatCard } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTooltip } from '@angular/material/tooltip';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-manage-rooms',
  templateUrl: './manage-rooms.component.html',
  styleUrl: './manage-rooms.component.css',
  standalone: true,
  imports: [
    AdminPageComponent,
    MatCard,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatFormField,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatIcon,
    MatIconButton,
    MatInput,
    MatPaginator,
    MatProgressSpinner,
    MatRow,
    MatRowDef,
    MatTable,
    MatTooltip,
    NgIf,
    ReactiveFormsModule,
    MatHeaderCellDef,
  ],
})
export class ManageRoomsComponent implements OnInit {
  roomForm: FormGroup;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [
    'id',
    'room number',
    'room price',
    'room status',
    'room type',
    'capacity',
    'actions',
  ];

  isLoading = false;
  pageNumber = 0;

  constructor(private fb: FormBuilder) {
    this.roomForm = this.fb.group({
      roomRows: this.fb.array([]),
    });
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.loadRooms();
  }

  get roomRows() {
    return this.roomForm.get('roomRows') as FormArray;
  }

  loadRooms() {
    const rooms = [
      {
        id: '1',
        roomNumber: '101',
        roomPrice: 100,
        roomStatus: 'Available',
        roomType: 'Single',
        capacity: 1,
      },
      {
        id: '2',
        roomNumber: '102',
        roomPrice: 150,
        roomStatus: 'Occupied',
        roomType: 'Double',
        capacity: 2,
      },
      {
        id: '3',
        roomNumber: '103',
        roomPrice: 200,
        roomStatus: 'Available',
        roomType: 'Suite',
        capacity: 4,
      },
      {
        id: '4',
        roomNumber: '104',
        roomPrice: 250,
        roomStatus: 'Occupied',
        roomType: 'Single',
        capacity: 1,
      },
      {
        id: '5',
        roomNumber: '105',
        roomPrice: 300,
        roomStatus: 'Available',
        roomType: 'Double',
        capacity: 2,
      },
      {
        id: '6',
        roomNumber: '106',
        roomPrice: 350,
        roomStatus: 'Under Maintenance',
        roomType: 'Suite',
        capacity: 4,
      },
      {
        id: '7',
        roomNumber: '107',
        roomPrice: 400,
        roomStatus: 'Available',
        roomType: 'Single',
        capacity: 1,
      },
      {
        id: '8',
        roomNumber: '108',
        roomPrice: 450,
        roomStatus: 'Occupied',
        roomType: 'Double',
        capacity: 2,
      },
      {
        id: '9',
        roomNumber: '109',
        roomPrice: 500,
        roomStatus: 'Available',
        roomType: 'Suite',
        capacity: 4,
      },
      {
        id: '10',
        roomNumber: '110',
        roomPrice: 550,
        roomStatus: 'Under Maintenance',
        roomType: 'Single',
        capacity: 1,
      },
    ];

    rooms.forEach((room) => this.addRoomRow(room));
    this.dataSource.data = this.roomRows.controls;
  }

  addRoomRow(room: {
    id: string;
    roomNumber: string;
    roomPrice: number;
    roomStatus: string;
    roomType: string;
    capacity: number;
  }) {
    const row: FormGroup = this.fb.group({
      id: [room.id],
      roomNumber: [room.roomNumber],
      roomPrice: [room.roomPrice],
      roomStatus: [room.roomStatus],
      roomType: [room.roomType],
      capacity: [room.capacity],
    });
    this.roomRows.push(row);
  }

  editRoom(index: number) {
    const row = this.roomRows.at(index);
    if (row) {
      row.get('IsEditable')?.setValue(true);
    }
  }

  saveRoom(index: number) {
    const row = this.roomRows.at(index);
    if (row) {
      row.get('IsEditable')?.setValue(false);
    }
  }

  cancelEdit(index: number) {
    const row = this.roomRows.at(index);
    if (row) {
      row.get('IsEditable')?.setValue(false);
    }
  }

  deleteRoom(index: number) {
    if (this.roomRows.length > 0) {
      this.roomRows.removeAt(index);
      this.dataSource.data = this.roomRows.controls;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  goToPage() {
    // Add logic to navigate to the specified page if using pagination
    // For example:
    const paginator: MatPaginator = this.dataSource.paginator as MatPaginator;
    paginator.pageIndex = this.pageNumber - 1;
    paginator.page.next({
      pageIndex: paginator.pageIndex,
      pageSize: paginator.pageSize,
      length: paginator.length,
    });
  }
}
