export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: {
    url: string;
    publicId: string;
  };
  isActive: boolean;
}

export interface ProductImage {
  url: string;
  publicId: string;
  isPrimary: boolean;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  quantity: number;
  images: ProductImage[];
  category: Category;
  unit: string;
  tags: string[];
  status: 'active' | 'inactive' | 'out_of_stock';
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: Product[];
}
