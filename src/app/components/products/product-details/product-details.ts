import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductsService } from '../../../services/products.service';
import { CartService } from '../../../services/cart.service';
import { Product } from '../../../modals/product.model';

interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSnackBarModule
  ],
  templateUrl: './product-details.html',
  styleUrls: ['./product-details.scss']
})
export class ProductDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productsService = inject(ProductsService);
  private cartService = inject(CartService);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  product: Product | null = null;
  reviews: Review[] = [];
  quantity: number = 1;
  
  // Array of available images in assets folder
  private productImages: string[] = [
    '/assets/image1.jpg',
    '/assets/image2.jpg',
    '/assets/image3.jpg',
    '/assets/image4.jpg'
  ];
  
  // Static pool of reviews
  private allReviews: Review[] = [
    {
      id: 1,
      userName: 'John Smith',
      rating: 5,
      comment: 'Excellent product! Exceeded my expectations. Would definitely recommend to others.',
      date: '2026-01-28'
    },
    {
      id: 2,
      userName: 'Sarah Johnson',
      rating: 4,
      comment: 'Great quality and fast delivery. Very satisfied with my purchase.',
      date: '2026-01-25'
    },
    {
      id: 3,
      userName: 'Michael Brown',
      rating: 5,
      comment: 'Outstanding! This is exactly what I was looking for. Top-notch quality.',
      date: '2026-01-22'
    },
    {
      id: 4,
      userName: 'Emily Davis',
      rating: 3,
      comment: 'Good product overall, but took longer to arrive than expected.',
      date: '2026-01-20'
    },
    {
      id: 5,
      userName: 'David Wilson',
      rating: 5,
      comment: 'Fantastic! The best purchase I made this year. Highly recommend.',
      date: '2026-01-18'
    },
    {
      id: 6,
      userName: 'Jessica Martinez',
      rating: 4,
      comment: 'Very good product. Worth the price. Would buy again.',
      date: '2026-01-15'
    },
    {
      id: 7,
      userName: 'Robert Taylor',
      rating: 5,
      comment: 'Perfect! Exactly as described. Great customer service too.',
      date: '2026-01-12'
    },
    {
      id: 8,
      userName: 'Amanda Anderson',
      rating: 4,
      comment: 'Nice product with good quality. Shipping was quick.',
      date: '2026-01-10'
    },
    {
      id: 9,
      userName: 'Christopher Lee',
      rating: 5,
      comment: 'Absolutely love it! Best quality for the price range.',
      date: '2026-01-08'
    },
    {
      id: 10,
      userName: 'Jennifer White',
      rating: 3,
      comment: 'Decent product but nothing extraordinary. Does the job.',
      date: '2026-01-05'
    }
  ];

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(productId);
      this.loadRandomReviews();
    } else {
      this.router.navigate(['/products']);
    }
  }

  loadProduct(id: string): void {
    this.productsService.getProducts().subscribe({
      next: (products) => {
        console.log('Looking for product with id:', id);
        console.log('Available products:', products);
        
        // Assign random images to products that don't have images
        const productsWithImages = products.map(product => {
          if (!product.image) {
            const randomImage = this.productImages[Math.floor(Math.random() * this.productImages.length)];
            return { ...product, image: randomImage };
          }
          return product;
        });
        
        // Try to find by productId, or by index if productId doesn't exist
        this.product = productsWithImages.find(p => p.productId === id) || null;
        
        // If not found by productId, try to find by array index
        if (!this.product && !isNaN(Number(id))) {
          const index = Number(id);
          if (index >= 0 && index < productsWithImages.length) {
            this.product = productsWithImages[index];
          }
        }
        
        console.log('Found product:', this.product);
        
        if (!this.product) {
          this.snackBar.open('Product not found', 'Close', { duration: 3000 });
          this.router.navigate(['/products']);
        } else {
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.snackBar.open('Error loading product', 'Close', { duration: 3000 });
        this.router.navigate(['/products']);
      }
    });
  }

  loadRandomReviews(): void {
    // Generate random number between 3 and 8
    const numReviews = Math.floor(Math.random() * 6) + 3;
    
    // Shuffle and pick random reviews
    const shuffled = [...this.allReviews].sort(() => Math.random() - 0.5);
    this.reviews = shuffled.slice(0, numReviews);
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < (this.product.availableQuantity || 0)) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(product: Product): void {
    if (!product.availableQuantity || product.availableQuantity <= 0) {
      this.snackBar.open('Product is out of stock', 'Close', { duration: 3000 });
      return;
    }

    if (this.quantity > (product.availableQuantity || 0)) {
      this.snackBar.open('Not enough stock available', 'Close', { duration: 3000 });
      return;
    }

    this.cartService.addToCart(product, this.quantity);
    this.snackBar.open(`${this.quantity} item(s) added to cart!`, 'Close', { duration: 3000 });
    this.quantity = 1; // Reset quantity after adding
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < rating ? 1 : 0);
  }

  getAverageRating(): number {
    if (this.reviews.length === 0) return 0;
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / this.reviews.length) * 10) / 10;
  }
}
