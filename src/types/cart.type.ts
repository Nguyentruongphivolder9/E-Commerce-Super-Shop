import { Product, ProductVariantsResponse } from './product.type'

export interface CartItemRequest {
  id?: string
  productId: string
  shopId: string
  productVariantId: string
  quantity: number
}

export interface CartItemResponse {
  id: string
  quantity: number
  productVariantId: string
  product: Product
  createdAt: string
  updatedAt: string
  shopInfo: {
    id: string
    fullName: string
    userName: string
    avatarUrl: string
  }
}

export type CartItemResponseExtended = CartItemResponse & {
  checked: boolean
  disabled: boolean
}

export interface CartItemExtendedByShop {
  shopInfo: {
    id: string
    fullName: string
    userName: string
    avatarUrl: string
  }
  items: Array<CartItemResponseExtended>
}
