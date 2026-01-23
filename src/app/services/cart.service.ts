import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart, CartItem } from '../modals/cart.model';
import { Product } from '../modals/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly CART_STORAGE_KEY = 'marketplace_cart';
  private cartSubject = new BehaviorSubject<Cart>(this.loadCartFromStorage());
  public cart$: Observable<Cart> = this.cartSubject.asObservable();

  constructor() {}

  /**
   * Load cart from sessionStorage (cache)
   */
  private loadCartFromStorage(): Cart {
    try {
      const cartData = sessionStorage.getItem(this.CART_STORAGE_KEY);
      if (cartData) {
        const cart = JSON.parse(cartData) as Cart;
        return cart;
      }
    } catch (error) {}
    return this.createEmptyCart();
  }

  /**
   * Save cart to sessionStorage (cache)
   */
  private saveCartToStorage(cart: Cart): void {
    try {
      sessionStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {}
  }

  /**
   * Create an empty cart
   */
  private createEmptyCart(): Cart {
    return {
      items: [],
      totalItems: 0,
      totalPrice: 0,
    };
  }

  /**
   * Calculate cart totals
   */
  private calculateTotals(items: CartItem[]): { totalItems: number; totalPrice: number } {
    let totalItems = 0;
    let totalPrice = 0;

    items.forEach((item) => {
      totalItems += item.quantity;
      totalPrice += item.product.price * item.quantity;
    });

    return {
      totalItems,
      totalPrice: Math.round(totalPrice * 100) / 100, // Round to 2 decimal places
    };
  }

  /**
   * Update cart and notify subscribers
   */
  private updateCart(items: CartItem[]): void {
    const totals = this.calculateTotals(items);
    const cart: Cart = {
      items,
      ...totals,
    };
    this.saveCartToStorage(cart);
    this.cartSubject.next(cart);
  }

  /**
   * Get current cart value
   */
  getCart(): Cart {
    return this.cartSubject.value;
  }

  /**
   * Add product to cart
   */
  addToCart(product: Product, quantity: number = 1): boolean {
    if (!product.productId) {
      return false;
    }

    const currentCart = this.getCart();
    const items = [...currentCart.items];
    
    // Check if product already exists in cart
    const existingItemIndex = items.findIndex(
      (item) => item.product.productId === product.productId
    );

    const availableQuantity = product.availableQuantity || 0;
    
    if (existingItemIndex > -1) {
      // Check if adding more would exceed available quantity
      const newQuantity = items[existingItemIndex].quantity + quantity;
      if (newQuantity > availableQuantity) {
        return false;
      }
      // Update quantity if product exists
      items[existingItemIndex].quantity = newQuantity;
    } else {
      // Check if quantity exceeds available
      if (quantity > availableQuantity) {
        return false;
      }
      // Add new item to cart
      items.push({
        product: {
          productId: product.productId,
          name: product.name,
          price: product.price,
          availableQuantity: product.availableQuantity,
          image: product.image,
          description: product.description,
        },
        quantity,
      });
    }

    this.updateCart(items);
    return true;
  }

  /**
   * Remove product from cart
   */
  removeFromCart(productId: string): void {
    const currentCart = this.getCart();
    const items = currentCart.items.filter(
      (item) => item.product.productId !== productId
    );
    this.updateCart(items);
  }

  /**
   * Update item quantity
   */
  updateQuantity(productId: string, quantity: number): boolean {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return true;
    }

    const currentCart = this.getCart();
    const items = [...currentCart.items];
    const itemIndex = items.findIndex(
      (item) => item.product.productId === productId
    );

    if (itemIndex > -1) {
      const availableQuantity = items[itemIndex].product.availableQuantity || 0;
      
      // Check if new quantity exceeds available quantity
      if (quantity > availableQuantity) {
        return false;
      }
      
      items[itemIndex].quantity = quantity;
      this.updateCart(items);
      return true;
    }
    
    return false;
  }

  /**
   * Clear entire cart
   */
  clearCart(): void {
    this.updateCart([]);
  }

  /**
   * Get total items count
   */
  getTotalItems(): number {
    return this.getCart().totalItems;
  }

  /**
   * Get total price
   */
  getTotalPrice(): number {
    return this.getCart().totalPrice;
  }
}
