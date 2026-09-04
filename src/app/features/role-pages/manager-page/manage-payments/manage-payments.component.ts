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
import { PaymentService } from '../../../../core/services/payment.service';
import { Payment } from '../../../../core/models/payment.model';
import { CrudService } from '../../../../core/services/crud.service';
/* Base class provides all shared CRUD logic */
import { BaseCrudComponent } from '../../../../shared/components/base-crud/base-crud.component';

@Component({
  selector: 'app-manage-payments',
  templateUrl: './manage-payments.component.html',
  styleUrl: './manage-payments.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule, MatIcon, MatCard, MatTable, MatSort,
    MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatCell, MatCellDef,
    MatIconButton, MatTooltip, MatHeaderRow, MatHeaderRowDef,
    MatRow, MatRowDef, MatPaginator, MatProgressSpinner, MatFabButton,
  ]
})
export class ManagePaymentsComponent extends BaseCrudComponent<Payment> {
  displayedColumns = [
    'paymentId', 'paymentDate', 'amount', 'paymentMethod', 'actions',
  ];

  readonly entityName = 'payment';
  readonly service: CrudService<Payment>;

  constructor(paymentService: PaymentService) {
    super();
    this.service = paymentService;
  }

  createBlankItem(): Payment {
    return { paymentDate: '', amount: 0, paymentMethod: '' } as Payment;
  }

  getItemId(item: Payment): number | undefined {
    return item.paymentId;
  }
}
