// ============== Authentication Types ==============
export interface LoginRequest {
  email: string;
  password: string;
  twoFactorCode?: string;
  twoFactorRecoveryCode?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface AccessTokenResponse {
  tokenType: string;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  resetCode: string;
  newPassword: string;
}

export interface ResendConfirmationEmailRequest {
  email: string;
}

export interface InfoResponse {
  email: string;
  isEmailConfirmed: boolean;
}

export interface InfoRequest {
  newEmail?: string | null;
  newPassword?: string | null;
  oldPassword?: string | null;
}

// ============== Product Types ==============
export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  image: string;
  images: string[];
  stock: number;
  sku?: string;
  barcode?: string;
  specifications: ProductSpecification[];
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  badge?: string;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface ProductSpecification {
  name: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  color?: string;
  size?: string;
  fit?: string;
  sleeveType?: string;
  neckType?: string;
  material?: string;
  season?: string;
  stock: number;
  price?: number;
  sku?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  helpful: number;
  createdAt: string;
}

export interface CreateReviewRequest {
  rating: number;
  title: string;
  comment: string;
  images?: string[] | null;
}

export interface ProductsFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sort?: string;
  color?: string;
  size?: string;
}

// ============== Category Types ==============
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  parentCategoryId?: string;
  subcategories?: Category[];
  productCount: number;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ============== Cart Types ==============
export interface CartItemVariant {
  color?: string;
  size?: string;
  fit?: string;
  sleeveType?: string;
  neckType?: string;
  material?: string;
  season?: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedVariant?: CartItemVariant;
  addedAt: string;
}

export interface Cart {
  userId?: string;
  cartToken?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shippingCost?: number;
  discountAmount: number;
  discountCode?: string;
  total: number;
  itemCount: number;
  updatedAt: string;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
  variant?: CartItemVariant;
}

export interface UpdateQuantityRequest {
  quantity: number;
}

export interface ApplyCouponRequest {
  couponCode: string;
}

// ============== Wishlist Types ==============
export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product?: Product;
  addedAt: string;
}

export interface Wishlist {
  userId: string;
  items: WishlistItem[];
  itemCount: number;
  updatedAt: string;
}

export interface AddToWishlistRequest {
  productId: string;
}

export interface ShareWishlistRequest {
  email: string;
  message?: string;
}

// ============== Order Types ==============
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  subtotal: number;
  variant?: {
    color?: string;
    size?: string;
    fit?: string;
  };
}

export interface ShippingMethod {
  id: string;
  name: string;
  description?: string;
  cost: number;
  estimatedDays: number;
  provider?: string;
}

export interface PaymentMethod {
  type: string;
  cardName?: string;
  cardLast4?: string;
  cardBrand?: string;
}

export interface PaymentMethodDetails {
  type: string;
  cardNumber?: string;
  cardName?: string;
  expiryDate?: string;
  cvv?: string;
}

export interface CreateOrderRequest {
  shippingAddressId: string;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  discountCode?: string;
  shippingCost: number;
  tax: number;
  total: number;
  shippingAddress: Address;
  shippingMethod: ShippingMethod;
  trackingNumber?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  notes?: string;
  cancellationReason?: string;
}

export interface CancelOrderRequest {
  reason: string;
}

export interface ReturnItemRequest {
  itemId: string;
  quantity: number;
  reason: string;
}

export interface ReturnOrderRequest {
  items: ReturnItemRequest[];
  notes?: string;
}

// ============== User Types ==============
export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
  role: 'customer' | 'admin' | 'vendor';
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  addresses?: Address[];
  preferences?: UserPreferences;
}

export interface UserPreferences {
  newsletter: boolean;
  notifications: boolean;
  language: string;
  currency: string;
}

export interface Address {
  id: string;
  userId?: string;
  fullName: string;
  phone: string;
  address: string;
  addressLine?: string;
  city: string;
  district: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  type: 'home' | 'work' | 'other';
  createdAt?: string;
}

export interface CreateAddressRequest {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  type: number;
}

export interface UpdateAddressRequest {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface UpdateProfileRequest {
  fullName?: string;
  phone?: string;
  avatar?: string;
}

export interface UpdatePreferencesRequest {
  newsletter: boolean;
  notifications: boolean;
  language: string;
  currency: string;
}

// ============== Payment Types ==============
export interface ValidatePaymentRequest {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

export interface ProcessPaymentRequest {
  orderId: string;
  paymentMethod: PaymentMethodDetails;
  amount: number;
}

// ============== Shipping Types ==============
export interface CalculateShippingCostRequest {
  shippingMethodId: string;
  items: ShippingItemRequest[];
  postalCode: string;
}

export interface ShippingItemRequest {
  productId: string;
  quantity: number;
  weight: number;
}

// ============== Contact Types ==============
export interface ContactMessageRequest {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// ============== Newsletter Types ==============
export interface SubscribeRequest {
  email: string;
  name?: string;
}

export interface UnsubscribeRequest {
  email: string;
}

// ============== Site Settings Types ==============
export interface SocialLinks {
  facebook?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  youTube?: string | null;
}

export interface SiteLegalPage {
  slug: string;
  title: string;
  path: string;
  content?: string | null;
}

export interface PaymentCompliance {
  legalPages: SiteLegalPage[];
  aboutPageContent?: string | null;
  preInformationFormPageContent?: string | null;
  deliveryReturnsPageContent?: string | null;
  privacyPolicyPageContent?: string | null;
  distanceSellingAgreementPageContent?: string | null;
  visaLogoUrl?: string | null;
  mastercardLogoUrl?: string | null;
  iyzicoPayLogoUrl?: string | null;
}

export interface PaymentComplianceItem {
  key: string;
  label: string;
  met: boolean;
}

export interface PaymentComplianceStatus {
  completed: number;
  total: number;
  items: PaymentComplianceItem[];
}

export interface SiteSettings {
  id: string;
  code: string;
  name: string;
  siteName: string;
  domain?: string | null;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  address?: string | null;
  emails: string[];
  phones: string[];
  workingHours: string[];
  socialLinks: SocialLinks;
  paymentCompliance?: PaymentCompliance;
  paymentComplianceStatus?: PaymentComplianceStatus;
  isActive: boolean;
  isDefault: boolean;
}

export interface LegalPageData {
  slug: string;
  title: string;
  path: string;
  content?: string | null;
  siteName: string;
  code: string;
}

// ============== API Response Types ==============
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
}

export interface HttpValidationProblemDetails extends ProblemDetails {
  errors?: Record<string, string[]>;
}

// ============== Pagination Types ==============
export interface PaginationResponse<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}