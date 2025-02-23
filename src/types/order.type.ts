import { VoucherResponse } from './voucher.type'

export interface Order {
  id?: string
  recipientName: string
  recipientPhone: string
  recipientAddress: string
  orderTotal: number
  orderStatus: string
  paymentMethod: string
  shopId: string
  shopName: string
  voucherId: string
  voucherOffPrice: number
  comment: string
  orderItems: Array<OrderItem>
}

export interface OrderResponse {
  id?: string
  recipientName: string
  recipientPhone: string
  recipientAddress: string
  orderTotal: number
  orderStatus: OrderStatus
  orderTimeLines: Array<OrderTimeLine>
  paymentMethod: string
  shopInfomation: CommonAccountInfomation
  voucherId: string
  voucherUsed: VoucherResponse
  comment: string
  orderItems: Array<OrderItemResponse>
  isAnyRefundProcessing: boolean
  isRating: boolean
  expiredDateRating: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id?: string
  cartItemId: string
  productId: string
  productVariantId: string
  imageUrl: string
  productName: string
  variantName: string
  quantity: number
  price: number
}

export interface OrderItemExtended extends OrderItem {
  disabled: boolean
  checked: boolean
}

export interface OrderItemResponse {
  id?: string
  cartItemId: string
  productId: string
  productVariantId: string
  imageUrl: string
  productName: string
  variantName: string
  quantity: number
  price: number
}

export interface VnpReturnParams {
  vnp_Amount: string
  vnp_BankCode: string
  vnp_CardType: string
  vnp_OrderInfo: string
  vnp_PayDate: string
  vnp_ResponseCode: string
  vnp_TmnCode: string
  vnp_TransactionNo: string
  vnp_TransactionStatus: string
  vnp_TxnRef: string
  vnp_SecureHash: string
}

export interface StripeParams {
  paymentIntentId: string
  stripeResponseCode: string
}

export interface CodParams {
  paymentMethod: string
  codResponseCode: string
}

export interface CommonAccountInfomation {
  id: string
  fullName: string
  userName: string
  avatarUrl: string
}

export interface OrderTimeLine {
  id: string
  description: string
  timestamp: string
}

export type OrderStatus = 'pending' | 'confirmed' | 'delivering' | 'completed' | 'cancelled' | 'refunded' | 'all'
export type OrderActionStatus = 'cancel' | 'contactSeller' | 'rating' | ''
export interface RefundResponse {
  id: string
  shopId: string
  amount: number
  reason: string
  description: string
  status: string
  refundDate: string
  user: CommonAccountInfomation
  refundItems: Array<RefundItemResponse>
  refundImages: Array<RefundImagesResponse>
}

export interface RefundItemResponse {
  id: string
  refundId: string
  orderItemId: string
  refundQuantity: number
  orderItem: OrderItemResponse
}

export interface RefundImagesResponse {
  id: string
  imageUrl: string
}
