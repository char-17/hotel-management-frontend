import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-registration-success-dialog',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatDialogTitle,
    MatButton,
    MatDialogClose,
  ],
  templateUrl: './registration-success-dialog.component.html',
  styleUrls: ['./registration-success-dialog.component.css'],
})
export class RegistrationSuccessDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public message: string,
    private dialogRef: MatDialogRef<RegistrationSuccessDialogComponent>,
  ) {}

  close() {
    this.dialogRef.close();
  }
}
