import { Routes } from '@angular/router';
import { ProductsComponent } from './components/products/products';
import { OrdersComponent } from './components/orders/orders';
import { UserProfile } from './components/user-profile/user-profile';


export const routes: Routes = [
  { path: 'products', component: ProductsComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'profile', component: UserProfile },
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: '**', redirectTo: 'products' },
];
