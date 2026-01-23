export interface OrderItem {
  productId: string;
  productName: string;
  qty: number;
  price: number;
}

export interface OrderCustomer {
  id: string;
  name: string;
}

export interface OrderTotals {
  items: number;
  price: number;
}

export interface Order {
  orderId?: string;
  orderDate?: string;
  statusText?: string;
  customer?: OrderCustomer;
  items: OrderItem[];
  totals?: OrderTotals;
}
