import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './products.html',
  styleUrls: ['./products.scss'],
})
export class ProductsComponent {
  data = [
    {
      name: 'Product A',
      price: '$10.00',
      capacity: 'Small',
      status: 'Available',
      image: 'https://material.angular.dev/assets/img/examples/shiba2.jpg',
      description: 'A compact product suitable for small needs.',
    },
    {
      name: 'Product B',
      price: '$24.50',
      capacity: 'Medium',
      status: 'Low stock',
      image: 'https://material.angular.dev/assets/img/examples/shiba2.jpg',
      description: 'A mid-size product with balanced features.',
    },
    {
      name: 'Product C',
      price: '$7.99',
      capacity: 'Large',
      status: 'Available',
      image: 'https://material.angular.dev/assets/img/examples/shiba2.jpg',
      description: 'A large-capacity product for heavy use.',
    },
    {
      name: 'Product C',
      price: '$7.99',
      capacity: 'Large',
      status: 'Available',
      image: 'https://material.angular.dev/assets/img/examples/shiba2.jpg',
      description: 'A large-capacity product for heavy use.',
    },
    {
      name: 'Product C',
      price: '$7.99',
      capacity: 'Large',
      status: 'Available',
      image: 'https://material.angular.dev/assets/img/examples/shiba2.jpg',
      description: 'A large-capacity product for heavy use.',
    },
    {
      name: 'Product C',
      price: '$7.99',
      capacity: 'Large',
      status: 'Available',
      image: 'https://material.angular.dev/assets/img/examples/shiba2.jpg',
      description: 'A large-capacity product for heavy use.',
    },
    {
      name: 'Product C',
      price: '$7.99',
      capacity: 'Large',
      status: 'Available',
      image: 'https://material.angular.dev/assets/img/examples/shiba2.jpg',
      description: 'A large-capacity product for heavy use.',
    },
    {
      name: 'Product C',
      price: '$7.99',
      capacity: 'Large',
      status: 'Available',
      image: 'https://material.angular.dev/assets/img/examples/shiba2.jpg',
      description: 'A large-capacity product for heavy use.',
    },
    {
      name: 'Product C',
      price: '$7.99',
      capacity: 'Large',
      status: 'Available',
      image: 'https://material.angular.dev/assets/img/examples/shiba2.jpg',
      description: 'A large-capacity product for heavy use.',
    },
    {
      name: 'Product C',
      price: '$7.99',
      capacity: 'Large',
      status: 'Available',
      image: 'https://material.angular.dev/assets/img/examples/shiba2.jpg',
      description: 'A large-capacity product for heavy use.',
    },
    {
      name: 'Product C',
      price: '$7.99',
      capacity: 'Large',
      status: 'Available',
      image: 'https://material.angular.dev/assets/img/examples/shiba2.jpg',
      description: 'A large-capacity product for heavy use.',
    },
    {
      name: 'Product C',
      price: '$7.99',
      capacity: 'Large',
      status: 'Available',
      image: 'https://material.angular.dev/assets/img/examples/shiba2.jpg',
      description: 'A large-capacity product for heavy use.',
    },
  ];
}
