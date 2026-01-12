export interface Address {
  type: 'home' | 'work' | 'other';
  street: string;
  city: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'customer' | 'admin';
  avatar?: string;
  addresses?: Address[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
  };
}
