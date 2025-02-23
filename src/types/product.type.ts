import { CategoryOfShopDecorationResponse, CategoryOfShopResponse } from './categoryOfShop.type'
import { SellerInfoResponse, ShopInfo } from './user.type'
import { Pagination } from './utils.type'

export interface Product {
  id: string
  shopId: string
  categoryId: string
  name: string
  price: number
  stockQuantity: number
  description: string
  conditionProduct: string
  isVariant: boolean
  isActive: boolean
  isCensored: boolean
  brand: string
  status: string
  productImages: ProductImagesResponse[]
  variantsGroup: VariantsGroupResponse[]
  productVariants: ProductVariantsResponse[]
  productFigure: ProductFigureResponse
  createdAt: string
  updatedAt: string
}

export interface ProductViolationHistory {
  id: string
  typeViolation: ProductTypeViolation
  status: string
  reasons: string
  suggest: string
  deadline: string
  isRepaired: boolean
  prevStatus: string
  createdAt: string
  updatedAt: string
}

export interface ProductTypeViolation {
  id: string
  title: string
  countViolation: number
  createdAt: string
  updatedAt: string
}

export interface ProductRequest {
  id?: string
  name: string
  shopId?: string
  categoryId: string
  price?: number
  stockQuantity?: number
  description?: string
  conditionProduct: string
  isVariant: boolean
  isActive: boolean
  productImages: PreviewImagesResponse[]
  productVariants?: ProductVariantsResponse[]
  variantsGroup?: VariantsGroupRequest[]
}

export interface ProductViolationReportRequest {
  productId: string[]
  status: string
  typeViolationId: string
  reasons: string
  suggest: string
  deadline: string
}

export interface VariantsGroupRequest {
  id: string
  name: string
  isPrimary: boolean
  variants: VariantsRequest[]
}

export interface VariantsRequest {
  id: string
  name: string
  variantImage?: PreviewImagesResponse
}

export interface ProductVariantsRequest {
  id: string
  price: number
  stockQuantity: number
  variantsGroup1Id: string
  variant1Id: string
  variantsGroup2Id?: string
  variant2Id?: string
}

export interface PreviewImagesResponse {
  id: string
  imageUrl: string
}

export interface ProductImagesResponse {
  id: string
  imageUrl: string
  isPrimary: boolean
}

export interface VariantsGroupResponse {
  id: string
  name: string
  isPrimary: boolean
  variants: VariantsResponse[]
}

export interface VariantsResponse {
  id: string
  name: string
  imageUrl?: string | null | undefined
  isActive: boolean
}

export interface ProductVariantsResponse {
  id: string
  price: number
  stockQuantity: number
  sold: number
  variant1: VariantsResponse
  variant2: VariantsResponse
}

export interface ProductFigureResponse {
  ratingStar: number
  sold: number
  view: number
  totalRatings: number
  totalStars: number
  totalFavorites: number
}

// for shop
export interface ListProductForShopResponse {
  listProduct: Pagination<ProductDetailForShopResponse[]>
  listCategoryId: string[]
}
export interface ProductDetailForShopResponse extends Product {
  historyViolations: ProductViolationHistory[]
}

// for admin
export interface ProductDetailForAdminResponse extends Product {
  historyViolations: ProductViolationHistory[]
  shop: ShopInfo
}

export interface ListProductForAdminResponse {
  listProduct: Pagination<ProductDetailForAdminResponse[]>
  listCategoryId: string[]
}

export interface ProductDetailForUserResponse extends Product {
  isFavorite: boolean
  isProductOfShop: boolean
  seller: SellerInfoResponse
}

// shop detail
export interface ShopDetailResponse {
  shopInfo: SellerInfoResponse
  topSales: Product[]
  categoryOfShop: CategoryOfShopResponse[]
  categoryOfShopDecoration: CategoryOfShopDecorationResponse[]
}

export interface ProductPagination {
  listProducts: Product[]
  totalPages: number
}
export interface ProductViolationResponse extends ProductViolationHistory {
  product: Product
}
