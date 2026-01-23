import { Routes } from '@angular/router';
import { ProductsComponent } from './components/products/products';
import { ProductDetails } from './components/products/product-details/product-details';
import { OrdersComponent } from './components/orders/orders';
import { OrderDetails } from './components/orders/order-details/order-details';
import { UserProfile } from './components/user-profile/user-profile';
import { CartComponent } from './components/cart/cart';

import { authGuard } from './guards/auth.guard';


export const routes: Routes = [

  { path: 'products', component: ProductsComponent },
  { path: 'products/:id', component: ProductDetails },
  { path: 'cart', component: CartComponent },
  { path: 'orders', component: OrdersComponent, canActivate: [authGuard] },
  { path: 'orders/:id', component: OrderDetails, canActivate: [authGuard] },
  { path: 'profile', component: UserProfile, canActivate: [authGuard] },
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: '**', redirectTo: 'products' },
];