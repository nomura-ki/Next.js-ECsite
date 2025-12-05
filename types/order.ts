export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface ShippingAddress {
  name: string;
  postalCode: string;
  address: string;
  phone: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

export interface OrderDetail {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderSummary {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
}
