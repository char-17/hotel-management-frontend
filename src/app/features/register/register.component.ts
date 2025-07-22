import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  ErrorStateMatcher,
  MatNativeDateModule,
  MatOptionModule,
} from '@angular/material/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NavToolbarComponent } from '../../shared/navbar/nav-toolbar/nav-toolbar.component';

import { RegisterRequest, RegisterService } from './register.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { RegistrationSuccessDialogComponent } from './registration-success-dialog/registration-success-dialog.component';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: AbstractControl | null,
    form: FormGroupDirective | NgForm | null,
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatOptionModule,
    NavToolbarComponent,
  ],
})
export class RegisterComponent {
  registerForm: FormGroup;
  matcher = new MyErrorStateMatcher();

  private dialog = inject(MatDialog);
  // private router = inject(Router);

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private router: Router,
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      validSelection: [
        '',
        [Validators.required, Validators.pattern('male|female')],
      ],
      dateOfBirth: ['', Validators.required],
    });
  }

  onRegisterError(errorMessage: string): void {
    (document.activeElement as HTMLElement)?.blur();

    this.dialog.open(RegistrationSuccessDialogComponent, {
      data: errorMessage,
    });
  }

  onRegisterSuccess(): void {
    (document.activeElement as HTMLElement)?.blur(); //afairoume to focus apo to button

    const dialogRef = this.dialog.open(RegistrationSuccessDialogComponent, {
      data: 'Registered Successfull',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.router.navigate(['/login']);
    });
  }

  register(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formValue = this.registerForm.value;

    const request: RegisterRequest = {
      username: formValue.username,
      password: formValue.password,
      email: formValue.email,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      gender: formValue.validSelection,
      dateOfBirth: formValue.dateOfBirth.toISOString().split('T')[0], // YYYY-MM-DD
    };

    this.registerService.register(request).subscribe({
      next: (response) => {
        console.log('Ответ от сервера:', response);
        if (
          response.registrationErrorMessage === 'Registration Successfully!'
        ) {
          this.onRegisterSuccess(); //Перенаправление на /login
          console.log(response);
        } else {
          // ошибка от сервера
          console.log(response);
        }
      },
      error: (err) => {
        console.error('Ошибка при регистрации:', err);
        this.onRegisterError(
          'Registration Failed!, There is already user with that username',
        );
      },
    });
  }
}
