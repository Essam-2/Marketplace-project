import { Routes } from '@angular/router';
import { ProductsComponent } from './components/products/products';
import { ProductDetails } from './components/products/product-details/product-details';
import { OrdersComponent } from './components/orders/orders';
import { OrderDetails } from './components/orders/order-details/order-details';
import { UserProfile } from './components/user-profile/user-profile';
import { Login } from './components/login/login';
import { authGuard } from './guards/auth.guard';


export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'products', component: ProductsComponent, canActivate: [authGuard] },
  { path: 'products/:id', component: ProductDetails, canActivate: [authGuard] },
  { path: 'orders', component: OrdersComponent, canActivate: [authGuard] },
  { path: 'orders/:id', component: OrderDetails, canActivate: [authGuard] },
  { path: 'profile', component: UserProfile, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
