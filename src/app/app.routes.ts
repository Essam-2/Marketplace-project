import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing';
import { ProductsComponent } from './components/products/products';
import { ProductDetailsComponent } from './components/products/product-details/product-details';
import { OrdersComponent } from './components/orders/orders';
import { OrderDetails } from './components/orders/order-details/order-details';
import { UserProfile } from './components/user-profile/user-profile';
import { CartComponent } from './components/cart/cart';
import { CheckoutComponent } from './components/checkout/checkout';

import { authGuard } from './guards/auth.guard';


export const routes: Routes = [

  { path: '', component: LandingComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  { path: 'cart', component: CartComponent, canActivate: [authGuard] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] },
  { path: 'orders', component: OrdersComponent, canActivate: [authGuard] },
  { path: 'orders/:id', component: OrderDetails, canActivate: [authGuard] },
  { path: 'profile', component: UserProfile, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];