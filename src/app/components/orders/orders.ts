import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OrdersService } from '../../services/orders.service';
import { Order } from '../../modals/order.model';
import { OrderFormDialogComponent } from './order-form-dialog/order-form-dialog';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule, MatDialogModule],
  templateUrl: './orders.html',
  styleUrls: ['./orders.scss'],
})
export class OrdersComponent implements OnInit {
  displayedColumns = ['name', 'price', 'capacity', 'status', 'actions'];
  data: Order[] = [];

  constructor(
    private ordersService: OrdersService,
    private dialog: MatDialog
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
        console.error('Error loading orders:', error);
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
            console.log('Order added successfully:', order);
            this.loadOrders();
          },
          error: (error) => {
            console.error('Error adding order:', error);
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
            console.log('Order updated successfully:', updatedOrder);
            this.loadOrders();
          },
          error: (error) => {
            console.error('Error updating order:', error);
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
        },
        error: (error) => {
          console.error('Error deleting order:', error);
        },
      });
    }
  }
}
