// ===== PRODUCT TYPES =====
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  categoryName?: string;
  images: string[];
  basePrice: number;
  status: 'active' | 'inactive';
  featured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  variants: ProductVariant[];
  soldCount: number;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  digitalType: 'license_key' | 'account' | 'download_link' | 'topup';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  status: 'active' | 'inactive';
  productCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// ===== ORDER TYPES =====
export type OrderStatus = 'pending' | 'paid' | 'processing' | 'completed' | 'cancelled' | 'refunded';

export interface Order {
  id: string;
  orderId: string;
  snOrder?: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  userAddress?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  serviceFee: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paidAt?: Date;
  notes?: string;
  productKey?: string;
  accountUsername?: string;
  accountPassword?: string;
  deliveredAt?: Date;
  timeline: OrderTimelineItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  variantId?: string;
  variantName?: string;
  sku: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderTimelineItem {
  status: OrderStatus;
  timestamp: Date;
  updatedBy: string;
  note?: string;
}

// ===== USER TYPES =====
export interface UserProfile {
  id: string;
  uid: string;
  displayName: string;
  email: string;
  phone?: string;
  address?: string;
  photoURL?: string;
  isAdmin: boolean;
  status: 'active' | 'inactive' | 'blocked';
  walletBalance: number;
  coins: number;
  totalOrders: number;
  totalSpent: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  isAdmin: boolean;
  lastLogin?: Date;
}

// ===== VOUCHER TYPES =====
export interface Voucher {
  id: string;
  code: string;
  type: 'percentage' | 'nominal';
  value: number;
  minPurchase: number;
  maxDiscount: number;
  quota: number;
  used: number;
  expiresAt: Date;
  status: 'active' | 'inactive' | 'expired';
  applicableTo: 'all' | 'category' | 'product';
  applicableIds?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// ===== REVIEW TYPES =====
export interface Review {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  status: 'approved' | 'hidden' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

// ===== MISSION TYPES =====
export type MissionType = 'order_count' | 'order_amount' | 'login_streak' | 'share' | 'review' | 'referral';

export interface Mission {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  type: MissionType;
  target: number;
  rewardPoints: number;
  rewardVoucherId?: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  maxParticipants?: number;
  status: 'active' | 'inactive' | 'expired';
  requireUpload: boolean;
  requirePhone: boolean;
  requireEmail: boolean;
  terms?: string;
  participantCount: number;
  completedCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserMission {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  missionId: string;
  missionTitle: string;
  proofImage?: string;
  phone?: string;
  email?: string;
  notes?: string;
  duration: number;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  startedAt: Date;
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ===== WALLET TYPES =====
export type TransactionType = 'reward' | 'withdraw' | 'adjust' | 'coin_exchange' | 'purchase';
export type TransactionStatus = 'success' | 'pending' | 'failed';

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  type: TransactionType;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  status: TransactionStatus;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface Wallet {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  balance: number;
  coins: number;
  totalReward: number;
  totalWithdraw: number;
  totalSpent: number;
  status: 'active' | 'blocked';
  updatedAt: Date;
}

// ===== WITHDRAW TYPES =====
export type WithdrawStatus = 'pending' | 'approved' | 'rejected';
export type WithdrawMethod = 'bank_transfer' | 'e_wallet';

export interface WithdrawRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  method: WithdrawMethod;
  accountNumber: string;
  accountName: string;
  bankName?: string;
  eWalletType?: string;
  status: WithdrawStatus;
  adminNote?: string;
  processedAt?: Date;
  processedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ===== PRODUCT KEY TYPES =====
export interface ProductKey {
  id: string;
  productId: string;
  productName: string;
  variantId?: string;
  variantName?: string;
  key: string;
  status: 'available' | 'sold' | 'used';
  customerId?: string;
  customerName?: string;
  orderId?: string;
  assignedAt?: Date;
  createdAt: Date;
}

// ===== INVOICE TYPES =====
export interface Invoice {
  id: string;
  type: 'purchase' | 'withdraw';
  orderId?: string;
  withdrawId?: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  status: 'sent' | 'resent' | 'failed';
  sentAt: Date;
  createdAt: Date;
}

// ===== DASHBOARD TYPES =====
export interface DashboardStats {
  totalRevenue: number;
  totalRevenueChange: number;
  totalOrders: number;
  totalOrdersChange: number;
  totalCustomers: number;
  totalCustomersChange: number;
  totalProducts: number;
  totalProductsChange: number;
  activeMissions: number;
  activeMissionsChange: number;
  pendingWithdraws: number;
  pendingWithdrawsChange: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface OrderStatusChartData {
  status: string;
  count: number;
  color: string;
}

export interface CategorySalesData {
  category: string;
  sales: number;
  percentage: number;
}

export interface MissionCompletionData {
  mission: string;
  completed: number;
  total: number;
  rate: number;
}

// ===== COIN SETTINGS =====
export interface CoinSettings {
  exchangeRate: number;
  minExchange: number;
  maxExchange: number;
  updatedAt: Date;
}

// ===== APP CONFIG =====
export interface AppConfig {
  maintenanceMode: boolean;
  maintenanceMessage?: string;
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress?: string;
  storeLogo?: string;
  updatedAt: Date;
}

// ===== FILTER / PAGINATION =====
export interface FilterState {
  search: string;
  status: string;
  category: string;
  dateRange: { from: Date | null; to: Date | null };
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}

// ===== NOTIFICATION =====
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  link?: string;
  createdAt: Date;
}
