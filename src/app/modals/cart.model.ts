export interface CartItem {
  product: {
    productId: string;
    name: string;
    price: number;
    availableQuantity?: number;
    image?: string;
    description?: string;
  };
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}
