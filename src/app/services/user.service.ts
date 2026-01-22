import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../modals/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUserProfile(customerId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me/${customerId}`);
  }

  updateUserProfile(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/user/profile`, user);
  }

  createUserProfile(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/user/profile`, user);
  }
}
