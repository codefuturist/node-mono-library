export interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  category: string;
  imageUrl: string | null;
  createdAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  total: number;
  status: string;
  createdAt: Date;
  items?: OrderItem[];
  user?: User;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
}
