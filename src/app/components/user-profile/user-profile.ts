import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
import { User } from '../../modals/user.model';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss',
})
export class UserProfile implements OnInit {
  userForm: FormGroup;
  userId?: string;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      nationalId: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.userService.getUserProfile().subscribe({
      next: (user) => {
        this.userId = user.id;
        this.userForm.patchValue({
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          nationalId: user.nationalId,
        });
      },
      error: (error) => {
        // No profile exists yet
      },
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const user: User = this.userForm.value;
      
      const saveRequest = this.userId 
        ? this.userService.updateUserProfile(user)
        : this.userService.createUserProfile(user);
      
      saveRequest.subscribe({
        next: (savedUser) => {
          if (!this.userId) {
            this.userId = savedUser.id;
          }
          this.snackBar.open('Profile saved successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
        },
        error: (error) => {
          this.snackBar.open('Error saving profile. Please try again.', 'Close', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        },
      });
    }
  }

  onCancel(): void {
    this.loadUserProfile();
  }
}
