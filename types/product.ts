export interface Category {
  id: string;
  name: string;
}

export interface Seller {
  id: string;
  name: string;
}
export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  stock: number;
  categoryId: string;
  category: Category;
  imageUrls: string[];
  seller?: Seller;
}

export interface ProductListResponse {
  success: boolean;
  data: {
    products: Product[];
  };
}
