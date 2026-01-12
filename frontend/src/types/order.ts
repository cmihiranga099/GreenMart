import { Product } from './product';

export interface OrderItem {
  product: Product | string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  subtotal: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  phone: string;
  street: string;
  city: string;
  zipCode: string;
  country: string;
}

export interface PaymentInfo {
  method: 'stripe' | 'cash_on_delivery';
  status: 'pending' | 'completed' | 'failed';
  stripePaymentIntentId?: string;
  paidAt?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentInfo: PaymentInfo;
  status: 'pending' | 'confirmed' | 'processing' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface OrderResponse {
  success: boolean;
  message: string;
  data: {
    order: Order;
    clientSecret?: string;
  };
}
