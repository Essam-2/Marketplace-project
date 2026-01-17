import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../modals/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  addProduct(product: Product | FormData): Observable<Product> {
    const url = `${this.apiUrl}/products`;
    if (product instanceof FormData) {
      return this.http.post<Product>(url, product);
    }
    return this.http.post<Product>(url, product);
  }

  updateProduct(id: string, product: Product | FormData): Observable<Product> {
    const url = `${this.apiUrl}/products/${id}`;
    if (product instanceof FormData) {
      return this.http.put<Product>(url, product);
    }
    return this.http.put<Product>(url, product);
  }
}
