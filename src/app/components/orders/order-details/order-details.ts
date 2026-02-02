import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { OrdersService } from '../../../services/orders.service';
import { Order } from '../../../modals/order.model';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatDividerModule, MatSnackBarModule],
  templateUrl: './order-details.html',
  styleUrls: ['./order-details.scss'],
})
export class OrderDetails implements OnInit {
  order?: Order;
  orderId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ordersService: OrdersService,
    private snackBar: MatSnackBar,    
    private cdr: ChangeDetectorRef,

  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id') || '';
    if (this.orderId) {
      this.loadOrderDetails();
    }
  }

  loadOrderDetails(): void {
    this.ordersService.getOrderById(this.orderId).subscribe({
      next: (order) => {
        this.order = order;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.order = undefined;
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/orders']);
  }

  getStatusConfig(status: string): { icon: string; class: string; label: string } {
    const statusLower = status?.toLowerCase() || '';
    
    if (statusLower === 'delivered') {
      return { icon: 'check_circle', class: 'status-delivered', label: 'Delivered' };
    } else if (statusLower === 'shipped' || statusLower === 'shipping') {
      return { icon: 'local_shipping', class: 'status-shipped', label: 'Shipped' };
    } else if (statusLower === 'confirmed') {
      return { icon: 'assignment_turned_in', class: 'status-confirmed', label: 'Confirmed' };
    } else if (statusLower === 'pending') {
      return { icon: 'schedule', class: 'status-pending', label: 'Awaiting Confirmation' };
    } else if (statusLower === 'cancelled' || statusLower === 'canceled') {
      return { icon: 'cancel', class: 'status-cancelled', label: 'Cancelled' };
    } else if (statusLower === 'processing') {
      return { icon: 'sync', class: 'status-processing', label: 'Processing' };
    }
    return { icon: 'info', class: 'status-default', label: status };
  }
}
