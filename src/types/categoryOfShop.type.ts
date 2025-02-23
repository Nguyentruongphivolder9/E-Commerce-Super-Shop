import { Product } from './product.type'

export interface CategoryOfShopResponse {
  id: string
  name: string
  imageUrl: string
  isActive: boolean
  totalProduct: number
}

export interface CategoryOfShopDecorationResponse {
  id: string
  name: string
  listProducts: Product[]
}
