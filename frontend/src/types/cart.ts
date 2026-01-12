import { Product } from './product';

export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: string;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  updatedAt: string;
}

export interface CartResponse {
  success: boolean;
  data: {
    cart: Cart;
    subtotal: number;
    itemCount: number;
  };
}
