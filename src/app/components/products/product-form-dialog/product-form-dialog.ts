import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../../modals/product.model';

export interface ProductDialogData {
  product?: Product;
  productId?: string;
  mode: 'add' | 'edit';
}

@Component({
  selector: 'app-product-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './product-form-dialog.html',
  styleUrls: ['./product-form-dialog.scss'],
})
export class ProductFormDialogComponent implements OnInit {
  productForm: FormGroup;
  selectedFile: File | null = null;
  dialogTitle: string;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProductFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductDialogData
  ) {
    this.isEditMode = data?.mode === 'edit';
    this.dialogTitle = this.isEditMode ? 'Edit Product' : 'Add New Product';
    
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      capacity: ['', Validators.required],
      status: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data.product) {
      this.populateForm(this.data.product);
    }
  }

  populateForm(product: Product): void {
    this.productForm.patchValue({
      name: product.name,
      price: product.price,
      capacity: product.capacity,
      status: product.status,
      image: product.image,
      description: product.description,
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const formData = new FormData();
      formData.append('name', this.productForm.get('name')?.value);
      formData.append('price', this.productForm.get('price')?.value);
      formData.append('capacity', this.productForm.get('capacity')?.value);
      formData.append('status', this.productForm.get('status')?.value);
      formData.append('description', this.productForm.get('description')?.value);
      
      if (this.selectedFile) {
        formData.append('image', this.selectedFile, this.selectedFile.name);
      } else {
        const imageVal = this.productForm.get('image')?.value;
        if (imageVal) {
          formData.append('image', imageVal);
        }
      }

      this.dialogRef.close({ formData, mode: this.data.mode });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      this.productForm.patchValue({ image: this.selectedFile.name });
      this.productForm.get('image')?.updateValueAndValidity();
    }
  }
}
