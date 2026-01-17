import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../modals/product.model';
import { ProductFormDialogComponent } from './product-form-dialog/product-form-dialog';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './products.html',
  styleUrls: ['./products.scss'],
})
export class ProductsComponent implements OnInit {
  data: Product[] = [];

  constructor(
    private productsService: ProductsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productsService.getProducts().subscribe({
      next: (products) => {
        this.data = products;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        
      },
    });
  }

  addNewProduct(): void {
    const dialogRef = this.dialog.open(ProductFormDialogComponent, {
      width: '500px',
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.formData) {
        this.productsService.addProduct(result.formData).subscribe({
          next: (product) => {
            console.log('Product added successfully:', product);
            this.loadProducts();
          },
          error: (error) => {
            console.error('Error adding product:', error);
          },
        });
      }
    });
  }

  editProduct(product: Product, productId: string): void {
    const dialogRef = this.dialog.open(ProductFormDialogComponent, {
      width: '500px',
      data: { mode: 'edit', product, productId }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.formData) {
        this.productsService.updateProduct(productId, result.formData).subscribe({
          next: (updatedProduct) => {
            console.log('Product updated successfully:', updatedProduct);
            this.loadProducts();
          },
          error: (error) => {
            console.error('Error updating product:', error);
          },
        });
      }
    });
  }
}
