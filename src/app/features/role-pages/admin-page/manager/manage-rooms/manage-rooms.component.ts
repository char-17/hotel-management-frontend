import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MatIcon } from '@angular/material/icon';
import { MatCard } from '@angular/material/card';
import { MatSort } from '@angular/material/sort';
import { NgIf } from '@angular/common';
import { MatFabButton, MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { Room, RoomService } from './room.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-manage-rooms',
  templateUrl: './manage-rooms.component.html',
  styleUrl: './manage-rooms.component.css',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatIcon,
    MatCard,
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    NgIf,
    FormsModule,
    MatIconButton,
    MatTooltip,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatPaginator,
    MatProgressSpinner,
    MatFabButton,
  ],
})
export class ManageRoomsComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'roomNumber',
    'roomType',
    'capacity',
    'roomPrice',
    'roomStatus',
    'actions',
  ];

  dataSource = new MatTableDataSource<Room>();
  isLoading = true;
  editingIndex: number | null = null;
  originalRoom: Room | null = null; // Для хранения оригинальных данных при редактировании

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private roomService: RoomService) {}

  ngOnInit() {
    this.loadRooms();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadRooms(): void {
    this.isLoading = true;
    this.roomService
      .getRooms()
      .pipe(
        catchError((error) => {
          console.error('Error while loading rooms:', error);
          this.isLoading = false;
          return of([]); // Возвращаем пустой массив в случае ошибки
        }),
      )
      .subscribe((rooms) => {
        this.dataSource.data = rooms;
        this.isLoading = false;
      });
  }

  editRoom(index: number): void {
    this.editingIndex = index;
    // Клонируем объект для возможности отмены изменений
    this.originalRoom = { ...this.dataSource.data[index] };
  }

  saveRoom(index: number): void {
    if (this.editingIndex === index) {
      const roomToSave = this.dataSource.data[index];
      // Проверка на undefined для id
      if (roomToSave.id === undefined) {
        console.error(
          'Ошибка: ID комнаты для сохранения не определен.',
          roomToSave,
        );
        alert('Невозможно сохранить комнату: ID не определен.');
        this.cancelEdit();
        return;
      }

      this.roomService
        .updateRoom(roomToSave.id, roomToSave)
        .pipe(
          catchError((error) => {
            console.error('Ошибка при сохранении комнаты:', error);
            if (this.originalRoom) {
              this.dataSource.data[index] = this.originalRoom;
              this.dataSource._updateChangeSubscription();
            }
            alert(
              'Не удалось сохранить изменения. Проверьте консоль для деталей.',
            );
            this.cancelEdit();
            return of(roomToSave);
          }),
        )
        .subscribe((updatedRoom) => {
          console.log('Комната обновлена:', updatedRoom);
          this.editingIndex = null;
          this.originalRoom = null;
        });
    }
  }

  cancelEdit(): void {
    if (this.editingIndex !== null && this.originalRoom) {
      this.dataSource.data[this.editingIndex] = this.originalRoom;
      this.dataSource._updateChangeSubscription(); // Обновляем таблицу
    }
    this.editingIndex = null;
    this.originalRoom = null;
  }

  deleteRoom(index: number): void {
    const roomToDelete = this.dataSource.data[index];
    // Проверка на undefined для id
    if (roomToDelete.id === undefined) {
      console.error(
        'Ошибка: ID комнаты для удаления не определен.',
        roomToDelete,
      );
      alert('Невозможно удалить комнату: ID не определен.');
      return;
    }

    if (
      confirm(
        `Вы уверены, что хотите удалить комнату №${roomToDelete.roomNumber}?`,
      )
    ) {
      this.roomService
        .deleteRoom(roomToDelete.id)
        .pipe(
          catchError((error) => {
            console.error('Ошибка при удалении комнаты:', error);
            alert('Не удалось удалить комнату. Проверьте консоль для деталей.');
            return of(null);
          }),
        )
        .subscribe(() => {
          console.log('Комната удалена:', roomToDelete);
          this.dataSource.data.splice(index, 1);
          this.dataSource._updateChangeSubscription();
        });
    }
  }
}
