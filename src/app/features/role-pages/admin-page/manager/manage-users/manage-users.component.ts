import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {
  MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable,
} from '@angular/material/table';
/* Centralized core imports */
import { UserService } from '../../../../../core/services/user.service';
import { User } from '../../../../../core/models/user.model';
import { CrudService } from '../../../../../core/services/crud.service';
import { MatCard } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
/* NgIf removed — template migrated to @if/@else control flow; DatePipe/formatDate kept */
import { DatePipe, formatDate } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatFabButton, MatIconButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTooltip } from '@angular/material/tooltip';
/* Base class provides all shared CRUD logic */
import { BaseCrudComponent } from '../../../../../shared/components/base-crud/base-crud.component';

@Component({
    selector: 'app-manage-users',
    templateUrl: './manage-users.component.html',
    styleUrls: ['./manage-users.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatCard, MatTable, MatSort,
        MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatCellDef,
        FormsModule, MatIcon, MatCell, MatIconButton,
        MatPaginator, MatProgressSpinner, MatHeaderRow, MatRow,
        MatRowDef, MatHeaderRowDef, DatePipe, MatTooltip, MatFabButton,
    ]
})
export class ManageUsersComponent extends BaseCrudComponent<User> {
  /* Password column removed — passwords must never be displayed in the UI */
  displayedColumns = [
    'id', 'username', 'firstName', 'lastName', 'email',
    'gender', 'dateOfBirth', 'role', 'actions',
  ];

  readonly entityName = 'user';
  readonly service: CrudService<User>;

  constructor(userService: UserService) {
    super();
    this.service = userService;
  }

  createBlankItem(): User {
    return {
      username: '', password: '', firstName: '', lastName: '',
      email: '', gender: '', dateOfBirth: '', role: 5,
    };
  }

  getItemId(item: User): number | undefined {
    return item.id;
  }

  /* Override to format dateOfBirth before sending to backend */
  override saveItem(index: number): void {
    const user = this.dataSource.data[index];
    /* Format date to yyyy-MM-dd before sending to backend */
    user.dateOfBirth = formatDate(user.dateOfBirth, 'yyyy-MM-dd', 'en-US');
    super.saveItem(index);
  }
}
