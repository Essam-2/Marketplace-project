import { Routes } from '@angular/router';
import { ProductsComponent } from './components/products/products';
import { ProductDetails } from './components/products/product-details/product-details';
import { OrdersComponent } from './components/orders/orders';
import { OrderDetails } from './components/orders/order-details/order-details';
import { UserProfile } from './components/user-profile/user-profile';


export const routes: Routes = [
  { path: 'products', component: ProductsComponent },
  { path: 'products/:id', component: ProductDetails },
  { path: 'orders', component: OrdersComponent },
  { path: 'orders/:id', component: OrderDetails },
  { path: 'profile', component: UserProfile },
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: '**', redirectTo: 'products' },
];
