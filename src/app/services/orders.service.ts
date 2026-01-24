import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order } from '../modals/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders/my`, { withCredentials: true });
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/orders/${id}/details`, { withCredentials: true });
  }

  addOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/orders/create-with-items`, order, { withCredentials: true });
  }

}
