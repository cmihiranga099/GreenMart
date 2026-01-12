import { Product } from './product';

export interface WishlistItem {
  product: Product;
  addedAt: string;
}

export interface Wishlist {
  _id: string;
  user: string;
  products: WishlistItem[];
  updatedAt: string;
}

export interface WishlistResponse {
  success: boolean;
  data: Wishlist;
}
