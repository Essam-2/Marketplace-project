import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Order } from '../../../modals/order.model';

export interface OrderDialogData {
  order?: Order;
  orderId?: string;
  mode: 'add' | 'edit';
}

@Component({
  selector: 'app-order-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './order-form-dialog.html',
  styleUrls: ['./order-form-dialog.scss'],
})
export class OrderFormDialogComponent implements OnInit {
  orderForm: FormGroup;
  dialogTitle: string;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<OrderFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrderDialogData
  ) {
    this.isEditMode = data?.mode === 'edit';
    this.dialogTitle = this.isEditMode ? 'Edit Order' : 'Add New Order';
    
    this.orderForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      capacity: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data.order) {
      this.populateForm(this.data.order);
    }
  }

  populateForm(order: Order): void {
    this.orderForm.patchValue({
      name: order.name,
      price: order.price,
      capacity: order.capacity,
      status: order.status,
    });
  }

  onSubmit(): void {
    if (this.orderForm.valid) {
      const order: Order = this.orderForm.value;
      this.dialogRef.close({ order, mode: this.data.mode });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
