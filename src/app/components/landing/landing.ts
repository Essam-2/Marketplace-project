import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './landing.html',
  styleUrls: ['./landing.scss'],
})
export class LandingComponent {
  features = [
    {
      icon: 'shopping_bag',
      title: 'Wide Selection',
      description: 'Discover thousands of quality products from trusted sellers'
    },
    {
      icon: 'local_shipping',
      title: 'Fast Delivery',
      description: 'Quick and reliable shipping to your doorstep across Egypt'
    },
    {
      icon: 'verified_user',
      title: 'Secure Payment',
      description: 'Multiple payment options with secure checkout process'
    },
    {
      icon: 'support_agent',
      title: '24/7 Support',
      description: 'Dedicated customer service team ready to help you anytime'
    }
  ];

  constructor(private router: Router) {}

  navigateToProducts(): void {
    this.router.navigate(['/products']);
  }
}
