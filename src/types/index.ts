export type ProductCategory =
  | "Outerwear"
  | "Denim"
  | "Bottoms"
  | "Knitwear"
  | "Leather"
  | "Footwear"
  | "Dresses"
  | "Accessories"
  | "Shirts";

export interface ProductVariant {
  id: string;
  sku: string;
  size: string;
  color: string;
  colorHex: string;
  stock: number;
  price?: number;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  color: string;
  colorHex: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  sizes: string[];
  images: string[];
  isNew?: boolean;
  isSale?: boolean;
  description?: string;
  materialsAndCare?: string;
  shippingAndReturns?: string;
  variants: ProductVariant[];
  createdAt: string;
}

export interface CollectionItem {
  id: string;
  slug: string;
  name: string;
  pieceCount: number;
  image: string;
  tone: string;
  categoryFilter?: ProductCategory;
}

export interface HeroSlide {
  id: number;
  kicker: string;
  titleLine1: string;
  titleLine2: string;
  image: string;
  gradient: string;
}

export interface CartItem {
  key: string; // `${productId}-${size}-${color}`
  product: Product;
  size: string;
  color: string;
  qty: number;
}

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "SHIPPING"
  | "COMPLETED"
  | "CANCELLED";

export type DeliveryMethod = "std" | "exp";
export type PaymentMethod = "cod" | "online";

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  addressLine: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface OrderItem {
  productId: number;
  productName: string;
  productSlug: string;
  image: string;
  color: string;
  size: string;
  price: number;
  qty: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  shippingAddress: Address;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  createdAt: string;
}

export type UserRole = "CUSTOMER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  addresses?: Address[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

