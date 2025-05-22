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
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-manage-rooms',
  templateUrl: './manage-rooms.component.html',
  styleUrl: './manage-rooms.component.css',
  standalone: true,
  imports: [
    AdminPageComponent,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatFormField,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatInput,
    MatRow,
    MatRowDef,
    MatTable,
    ReactiveFormsModule,
    MatHeaderCellDef,
  ],
})
export class ManageRoomsComponent implements OnInit {
  roomForm: FormGroup;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [
    'roomId',
    'roomNumber',
    'roomPrice',
    'roomStatus',
    'roomType',
    'roomCapacity',
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
        roomId: '1',
        roomNumber: '101',
        roomPrice: 100,
        roomStatus: 'Available',
        roomType: 'Single',
        roomCapacity: 1,
      },
      {
        roomId: '2',
        roomNumber: '102',
        roomPrice: 150,
        roomStatus: 'Occupied',
        roomType: 'Double',
        roomCapacity: 2,
      },
      {
        roomId: '3',
        roomNumber: '103',
        roomPrice: 200,
        roomStatus: 'Available',
        roomType: 'Suite',
        roomCapacity: 4,
      },
      {
        roomId: '4',
        roomNumber: '104',
        roomPrice: 250,
        roomStatus: 'Occupied',
        roomType: 'Single',
        roomCapacity: 1,
      },
      {
        roomId: '5',
        roomNumber: '105',
        roomPrice: 300,
        roomStatus: 'Available',
        roomType: 'Double',
        roomCapacity: 2,
      },
      {
        roomId: '6',
        roomNumber: '106',
        roomPrice: 350,
        roomStatus: 'Under Maintenance',
        roomType: 'Suite',
        roomCapacity: 4,
      },
      {
        roomId: '7',
        roomNumber: '107',
        roomPrice: 400,
        roomStatus: 'Available',
        roomType: 'Single',
        roomCapacity: 1,
      },
      {
        roomId: '8',
        roomNumber: '108',
        roomPrice: 450,
        roomStatus: 'Occupied',
        roomType: 'Double',
        roomCapacity: 2,
      },
      {
        roomId: '9',
        roomNumber: '109',
        roomPrice: 500,
        roomStatus: 'Available',
        roomType: 'Suite',
        roomCapacity: 4,
      },
    ];

    rooms.forEach((room) => this.addRoomRow(room));
    this.dataSource.data = this.roomRows.controls;
  }

  addRoomRow(room: {
    roomId: string;
    roomNumber: string;
    roomPrice: number;
    roomStatus: string;
    roomType: string;
    roomCapacity: number;
  }) {
    const row: FormGroup = this.fb.group({
      roomId: [room.roomId],
      roomNumber: [room.roomNumber],
      roomPrice: [room.roomPrice],
      roomStatus: [room.roomStatus],
      roomType: [room.roomType],
      roomCapacity: [room.roomCapacity],
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
