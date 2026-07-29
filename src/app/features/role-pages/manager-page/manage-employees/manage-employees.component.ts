import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable, MatTableDataSource,
} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatIcon } from '@angular/material/icon';
import { MatCard } from '@angular/material/card';
import { MatFabButton, MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { catchError, of } from 'rxjs';
import { Employee, EmployeeService } from './employee.service';

@Component({
  selector: 'app-manage-employees',
  templateUrl: './manage-employees.component.html',
  styleUrl: './manage-employees.component.css',
  imports: [
    FormsModule, MatIcon, MatCard, MatTable, MatSort,
    MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatCell, MatCellDef,
    NgIf, MatIconButton, MatTooltip, MatHeaderRow, MatHeaderRowDef,
    MatRow, MatRowDef, MatPaginator, MatProgressSpinner, MatFabButton,
  ]
})
export class ManageEmployeesComponent implements OnInit {
  /* Columns displayed in the employees table */
  displayedColumns: string[] = [
    'employeeId', 'firstName', 'lastName', 'role', 'email', 'phone', 'salary', 'actions',
  ];

  dataSource = new MatTableDataSource<Employee>();
  isLoading = true;
  editingIndex: number | null = null;
  originalItem: Employee | null = null;
  isCreating = false; // Tracks whether we are adding a new employee vs editing

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /* Fetch all employees from the backend */
  loadData(): void {
    this.isLoading = true;
    this.employeeService.getAll()
      .pipe(catchError((error) => {
        console.error('Error loading employees:', error);
        this.isLoading = false;
        return of([]);
      }))
      .subscribe((data) => {
        this.dataSource.data = data;
        this.isLoading = false;
      });
  }

  /* Insert a blank employee at the top of the table for inline creation */
  addItem(): void {
    const newItem: Employee = {
      firstName: '',
      lastName: '',
      role: '',
      email: '',
      phone: '',
      salary: '0',
    } as Employee;
    const data = this.dataSource.data;
    data.unshift(newItem);
    this.dataSource.data = data;
    this.editingIndex = 0;
    this.isCreating = true; // Flag so saveItem knows to POST instead of PUT
  }

  /* Enter edit mode for a row */
  editItem(index: number): void {
    this.editingIndex = index;
    this.originalItem = { ...this.dataSource.data[index] };
  }

  /* Save the edited row to the backend */
  saveItem(index: number): void {
    const item = this.dataSource.data[index];

    /* Branch: create new employee via POST, or update existing via PUT */
    if (this.isCreating) {
      this.employeeService.create(item)
        .pipe(catchError((error) => {
          console.error('Error creating employee:', error);
          alert('Failed to create employee.');
          this.cancelEdit();
          return of(null);
        }))
        .subscribe((created) => {
          if (created) {
            console.log('Employee created:', created);
            this.isCreating = false;
            this.editingIndex = null;
            this.loadData(); // Reload to get server-assigned ID
          }
        });
      return;
    }

    if (item.employeeId === undefined) {
      alert('Cannot save: employee ID is undefined.');
      this.cancelEdit();
      return;
    }
    this.employeeService.update(item.employeeId, item)
      .pipe(catchError((error) => {
        console.error('Error saving employee:', error);
        if (this.originalItem) {
          this.dataSource.data[index] = this.originalItem;
          this.dataSource._updateChangeSubscription();
        }
        alert('Failed to save changes.');
        this.cancelEdit();
        return of(item);
      }))
      .subscribe(() => {
        this.editingIndex = null;
        this.originalItem = null;
      });
  }

  /* Revert changes and exit edit mode */
  cancelEdit(): void {
    /* If we were creating, remove the unsaved blank row */
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

  /* Delete an employee after confirmation */
  deleteItem(index: number): void {
    const item = this.dataSource.data[index];
    if (item.employeeId === undefined) {
      alert('Cannot delete: employee ID is undefined.');
      return;
    }
    if (confirm(`Delete employee ${item.firstName} ${item.lastName}?`)) {
      this.employeeService.delete(item.employeeId)
        .pipe(catchError((error) => {
          console.error('Error deleting employee:', error);
          alert('Failed to delete employee.');
          return of(null);
        }))
        .subscribe(() => {
          this.dataSource.data.splice(index, 1);
          this.dataSource._updateChangeSubscription();
        });
    }
  }
}
