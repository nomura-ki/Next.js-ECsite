export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  subtotal: number;
}

export interface CartData {
  items: CartItem[];
  total: number;
  itemCount: number;
}
