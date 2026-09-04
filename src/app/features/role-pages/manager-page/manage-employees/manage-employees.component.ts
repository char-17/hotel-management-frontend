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
import { EmployeeService } from '../../../../core/services/employee.service';
import { Employee } from '../../../../core/models/employee.model';
import { CrudService } from '../../../../core/services/crud.service';
/* Base class provides all shared CRUD logic */
import { BaseCrudComponent } from '../../../../shared/components/base-crud/base-crud.component';

@Component({
  selector: 'app-manage-employees',
  templateUrl: './manage-employees.component.html',
  styleUrl: './manage-employees.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule, MatIcon, MatCard, MatTable, MatSort,
    MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatCell, MatCellDef,
    MatIconButton, MatTooltip, MatHeaderRow, MatHeaderRowDef,
    MatRow, MatRowDef, MatPaginator, MatProgressSpinner, MatFabButton,
  ]
})
export class ManageEmployeesComponent extends BaseCrudComponent<Employee> {
  displayedColumns = [
    'employeeId', 'firstName', 'lastName', 'role', 'email', 'phone', 'salary', 'actions',
  ];

  readonly entityName = 'employee';
  readonly service: CrudService<Employee>;

  constructor(employeeService: EmployeeService) {
    super();
    this.service = employeeService;
  }

  createBlankItem(): Employee {
    return { firstName: '', lastName: '', role: '', email: '', phone: '', salary: '0' } as Employee;
  }

  getItemId(item: Employee): number | undefined {
    return item.employeeId;
  }

  /* Build reactive form for inline employee editing */
  buildEditForm(item: Employee): FormGroup {
    return this.fb.group({
      firstName: [item.firstName, Validators.required],
      lastName: [item.lastName, Validators.required],
      role: [item.role, Validators.required],
      email: [item.email, [Validators.required, Validators.email]],
      phone: [item.phone, Validators.required],
      salary: [item.salary, Validators.required],
    });
  }
}
