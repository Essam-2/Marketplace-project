import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { OrdersService } from '../../services/orders.service';
import { Order } from '../../modals/order.model';
import { OrderFormDialogComponent } from './order-form-dialog/order-form-dialog';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './orders.html',
  styleUrls: ['./orders.scss'],
})
export class OrdersComponent implements OnInit {
  displayedColumns = ['name', 'price', 'capacity', 'status', 'actions'];
  data: Order[] = [];

  constructor(
    private ordersService: OrdersService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.ordersService.getOrders().subscribe({
      next: (orders) => {
        this.data = orders;
      },
      error: (error) => {
        this.data = [];
      },
    });
  }

  addNewOrder(): void {
    const dialogRef = this.dialog.open(OrderFormDialogComponent, {
      width: '500px',
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.order) {
        this.ordersService.addOrder(result.order).subscribe({
          next: (order) => {
            this.loadOrders();
            this.snackBar.open('Order added successfully!', 'Close', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
              panelClass: ['success-snackbar']
            });
          },
          error: (error) => {
            this.snackBar.open('Error adding order. Please try again.', 'Close', {
              duration: 5000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
              panelClass: ['error-snackbar']
            });
          },
        });
      }
    });
  }

  editOrder(order: Order, orderId: string): void {
    const dialogRef = this.dialog.open(OrderFormDialogComponent, {
      width: '500px',
      data: { mode: 'edit', order, orderId }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.order) {
        this.ordersService.updateOrder(orderId, result.order).subscribe({
          next: (updatedOrder) => {
            this.loadOrders();
            this.snackBar.open('Order updated successfully!', 'Close', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
              panelClass: ['success-snackbar']
            });
          },
          error: (error) => {
            console.error('Error updating order:', error);
            this.snackBar.open('Error updating order. Please try again.', 'Close', {
              duration: 5000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
              panelClass: ['error-snackbar']
            });
          },
        });
      }
    });
  }

  deleteOrder(orderId: string): void {
    if (confirm('Are you sure you want to delete this order?')) {
      this.ordersService.deleteOrder(orderId).subscribe({
        next: () => {
          console.log('Order deleted successfully');
          this.loadOrders();
          this.snackBar.open('Order deleted successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
        },
        error: (error) => {
          console.error('Error deleting order:', error);
          this.snackBar.open('Error deleting order. Please try again.', 'Close', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        },
      });
    }
  }
}
