import {
  AfterViewInit, ChangeDetectorRef, Directive, inject, OnInit, ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { catchError, of } from 'rxjs';
import { CrudService } from '../../../core/services/crud.service';
import {
  ConfirmDialogComponent, ConfirmDialogData,
} from '../confirm-dialog/confirm-dialog.component';

/**
 * Abstract base for all inline CRUD table components.
 * Subclasses only provide: service, entityName, displayedColumns,
 * createBlankItem(), and getItemId().
 */
@Directive()
export abstract class BaseCrudComponent<T> implements OnInit, AfterViewInit {
  /* Shared table state — identical across all 9 manage-* components */
  dataSource = new MatTableDataSource<T>();
  isLoading = true;
  editingIndex: number | null = null;
  originalItem: T | null = null;
  isCreating = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  /* Injected via inject() so subclasses don't need to pass them through super() */
  protected snackBar = inject(MatSnackBar);
  protected dialog = inject(MatDialog);
  protected cdr = inject(ChangeDetectorRef);

  /* Subclass must provide these four members */
  abstract readonly service: CrudService<T>;
  abstract readonly entityName: string;
  abstract readonly displayedColumns: string[];
  abstract createBlankItem(): T;
  abstract getItemId(item: T): number | undefined;

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    /* Wire Material paginator and sort to the data source */
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /* Snackbar helpers — shared across all manage-* components */
  protected showSuccess(msg: string): void {
    this.snackBar.open(msg, 'Close', { duration: 3000 });
  }

  protected showError(msg: string): void {
    this.snackBar.open(msg, 'Close', { duration: 5000, panelClass: ['error-snackbar'] });
  }

  /* Fetch all entities from the backend */
  loadData(): void {
    this.isLoading = true;
    this.service.getAll()
      .pipe(catchError((error) => {
        console.error(`Error loading ${this.entityName}s:`, error);
        this.isLoading = false;
        /* Notify OnPush — isLoading changed in error path */
        this.cdr.markForCheck();
        return of([]);
      }))
      .subscribe((data) => {
        this.dataSource.data = data;
        this.isLoading = false;
        /* Notify OnPush — data and isLoading changed asynchronously */
        this.cdr.markForCheck();
      });
  }

  /* Insert a blank row at the top for inline creation */
  addItem(): void {
    const newItem = this.createBlankItem();
    const data = this.dataSource.data;
    data.unshift(newItem);
    this.dataSource.data = data;
    this.editingIndex = 0;
    this.isCreating = true;
  }

  /* Enter edit mode for a row */
  editItem(index: number): void {
    this.editingIndex = index;
    this.originalItem = { ...this.dataSource.data[index] };
  }

  /* Save the edited row — POST for new, PUT for existing */
  saveItem(index: number): void {
    const item = this.dataSource.data[index];

    if (this.isCreating) {
      this.service.create(item)
        .pipe(catchError((error) => {
          console.error(`Error creating ${this.entityName}:`, error);
          this.showError(`Failed to create ${this.entityName}.`);
          this.cancelEdit();
          /* Notify OnPush — state changed in error path */
          this.cdr.markForCheck();
          return of(null);
        }))
        .subscribe((created) => {
          if (created) {
            this.isCreating = false;
            this.editingIndex = null;
            this.loadData();
          }
          /* Notify OnPush — editing state changed */
          this.cdr.markForCheck();
        });
      return;
    }

    const id = this.getItemId(item);
    if (id === undefined) {
      this.showError(`Cannot save: ${this.entityName} ID is undefined.`);
      this.cancelEdit();
      return;
    }

    this.service.update(id, item)
      .pipe(catchError((error) => {
        console.error(`Error saving ${this.entityName}:`, error);
        if (this.originalItem) {
          this.dataSource.data[index] = this.originalItem;
          this.dataSource._updateChangeSubscription();
        }
        this.showError('Failed to save changes.');
        this.cancelEdit();
        /* Notify OnPush — state reverted in error path */
        this.cdr.markForCheck();
        return of(item);
      }))
      .subscribe(() => {
        this.editingIndex = null;
        this.originalItem = null;
        /* Notify OnPush — editing state cleared */
        this.cdr.markForCheck();
      });
  }

  /* Revert changes and exit edit mode */
  cancelEdit(): void {
    if (this.isCreating) {
      const data = this.dataSource.data;
      data.splice(0, 1);
      this.dataSource.data = data;
      this.isCreating = false;
      this.editingIndex = null;
      return;
    }
    if (this.editingIndex !== null && this.originalItem) {
      this.dataSource.data[this.editingIndex] = this.originalItem;
      this.dataSource._updateChangeSubscription();
    }
    this.editingIndex = null;
    this.originalItem = null;
  }

  /* Delete after confirmation via Material dialog */
  deleteItem(index: number): void {
    const item = this.dataSource.data[index];
    const id = this.getItemId(item);
    if (id === undefined) {
      this.showError(`Cannot delete: ${this.entityName} ID is undefined.`);
      return;
    }
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Delete',
        message: `Delete ${this.entityName} #${id}?`,
      } as ConfirmDialogData,
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.service.delete(id)
          .pipe(catchError((error) => {
            console.error(`Error deleting ${this.entityName}:`, error);
            this.showError(`Failed to delete ${this.entityName}.`);
            /* Notify OnPush — error feedback shown */
            this.cdr.markForCheck();
            return of(null);
          }))
          .subscribe(() => {
            this.dataSource.data.splice(index, 1);
            this.dataSource._updateChangeSubscription();
            /* Notify OnPush — row removed from table */
            this.cdr.markForCheck();
          });
      }
    });
  }
}
