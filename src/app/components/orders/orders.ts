import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { OrdersService } from '../../services/orders.service';
import { AuthService } from '../../services/auth.service';
import { Order } from '../../modals/order.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule, MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule],
  templateUrl: './orders.html',
  styleUrls: ['./orders.scss'],
})
export class OrdersComponent implements OnInit {
  displayedColumns = ['orderDate', 'totalOrderPrice', 'totalItems', 'orderStatusText', 'actions'];
  data: Order[] = [];
  isLoading = false;

  constructor(
    private ordersService: OrdersService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.ordersService.getOrders().pipe(
      finalize(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (orders) => {
        this.data = orders;
      },
      error: (error) => {
        this.data = [];
      },
    });
  }

  // addNewOrder(): void {
  //   const dialogRef = this.dialog.open(OrderFormDialogComponent, {
  //     width: '500px',
  //     data: { mode: 'add' }
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result && result.order) {
  //       this.ordersService.addOrder(result.order).subscribe({
  //         next: (order) => {
  //           this.loadOrders();
  //           this.snackBar.open('Order added successfully!', 'Close', {
  //             duration: 3000,
  //             horizontalPosition: 'end',
  //             verticalPosition: 'top',
  //             panelClass: ['success-snackbar']
  //           });
  //         },
  //         error: (error) => {
  //           this.snackBar.open('Error adding order. Please try again.', 'Close', {
  //             duration: 5000,
  //             horizontalPosition: 'end',
  //             verticalPosition: 'top',
  //             panelClass: ['error-snackbar']
  //           });
  //         },
  //       });
  //     }
  //   });
  // }

  viewDetails(orderId: string): void {
    this.router.navigate(['/orders', orderId]);
  }

  // editOrder(order: Order, orderId: string): void {
  //   const dialogRef = this.dialog.open(OrderFormDialogComponent, {
  //     width: '500px',
  //     data: { mode: 'edit', order, orderId }
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result && result.order) {
  //       this.ordersService.updateOrder(orderId, result.order).subscribe({
  //         next: (updatedOrder) => {
  //           this.loadOrders();
  //           this.snackBar.open('Order updated successfully!', 'Close', {
  //             duration: 3000,
  //             horizontalPosition: 'end',
  //             verticalPosition: 'top',
  //             panelClass: ['success-snackbar']
  //           });
  //         },
  //         error: (error) => {
  //           this.snackBar.open('Error updating order. Please try again.', 'Close', {
  //             duration: 5000,
  //             horizontalPosition: 'end',
  //             verticalPosition: 'top',
  //             panelClass: ['error-snackbar']
  //           });
  //         },
  //       });
  //     }
  //   });
  // }

  // deleteOrder(orderId: string): void {
  //   if (confirm('Are you sure you want to delete this order?')) {
  //     this.ordersService.deleteOrder(orderId).subscribe({
  //       next: () => {
  //         this.loadOrders();
  //         this.snackBar.open('Order deleted successfully!', 'Close', {
  //           duration: 3000,
  //           horizontalPosition: 'end',
  //           verticalPosition: 'top',
  //           panelClass: ['success-snackbar']
  //         });
  //       },
  //       error: (error) => {
  //         this.snackBar.open('Error deleting order. Please try again.', 'Close', {
  //           duration: 5000,
  //           horizontalPosition: 'end',
  //           verticalPosition: 'top',
  //           panelClass: ['error-snackbar']
  //         });
  //       },
  //     });
  //   }
  // }
}
