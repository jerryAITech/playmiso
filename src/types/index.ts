export interface CategoryType {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  image?: string | null;
  color?: string | null;
  _count?: {
    products: number;
  };
}

export interface ProductType {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  discount?: number | null;
  images: string; // JSON string of string[]
  videoUrl?: string | null; // Product demo video
  categoryId: string;
  category?: CategoryType;
  ageGroup: string;
  stock: number;
  isFeatured: boolean;
  isTrending: boolean;
  isBestseller: boolean;
  rating: number;
  reviewsCount: number;
  safetyInfo?: string | null;
  brand?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  canonicalUrl?: string | null;
  ogImage?: string | null;
  createdAt: string | Date;
}

export interface CartItem {
  id: string; // Product ID
  title: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  image: string;
  quantity: number;
  ageGroup: string;
  maxStock: number;
}

export interface OrderType {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  paymentMethod: string;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  notes?: string | null;
  createdAt: string | Date;
  items: {
    id: string;
    title: string;
    price: number;
    quantity: number;
    image?: string | null;
  }[];
}
