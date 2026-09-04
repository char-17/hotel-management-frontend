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
import { InvoiceService } from '../../../../core/services/invoice.service';
import { Invoice } from '../../../../core/models/invoice.model';
import { CrudService } from '../../../../core/services/crud.service';
/* Base class provides all shared CRUD logic */
import { BaseCrudComponent } from '../../../../shared/components/base-crud/base-crud.component';

@Component({
  selector: 'app-manage-invoices',
  templateUrl: './manage-invoices.component.html',
  styleUrl: './manage-invoices.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule, MatIcon, MatCard, MatTable, MatSort,
    MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatCell, MatCellDef,
    MatIconButton, MatTooltip, MatHeaderRow, MatHeaderRowDef,
    MatRow, MatRowDef, MatPaginator, MatProgressSpinner, MatFabButton,
  ]
})
export class ManageInvoicesComponent extends BaseCrudComponent<Invoice> {
  displayedColumns = [
    'invoiceId', 'amount', 'date', 'paymentStatus', 'actions',
  ];

  readonly entityName = 'invoice';
  readonly service: CrudService<Invoice>;

  constructor(invoiceService: InvoiceService) {
    super();
    this.service = invoiceService;
  }

  createBlankItem(): Invoice {
    return { amount: 0, date: '', paymentStatus: 'PENDING' } as Invoice;
  }

  getItemId(item: Invoice): number | undefined {
    return item.invoiceId;
  }
}
