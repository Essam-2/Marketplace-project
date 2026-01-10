
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './orders.html',
  styleUrls: ['./orders.scss'],
})
export class OrdersComponent {
  displayedColumns = ['name', 'price', 'capacity', 'status', 'actions'];
  data = [
    { name: 'Product A', price: '$10.00', capacity: 'Small', status: 'Available' },
    { name: 'Product B', price: '$24.50', capacity: 'Medium', status: 'Low stock' },
    { name: 'Product C', price: '$7.99', capacity: 'Large', status: 'Available' }
  ];
}
