import { FormDataProduct } from 'src/contexts/productAdd.context'
import { FormDataEditProduct } from 'src/contexts/productEdit.context'
import {
  ListProductForAdminResponse,
  PreviewImagesResponse,
  Product,
  ListProductForShopResponse,
  ProductDetailForUserResponse,
  ShopDetailResponse,
  ProductPagination
} from 'src/types/product.type'
import { Pagination, ParamsConfig, SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const productApi = {
  getProductById(id: string, shopId: string) {
    return http.get<SuccessResponse<ProductDetailForUserResponse>>(`products/${id}/shop/${shopId}`)
  },
  getProductByIdForEdit(id: string) {
    return http.get<SuccessResponse<Product>>(`products/${id}/shop/edit`)
  },
  productCreate(body: FormDataProduct) {
    return http.post<SuccessResponse<string>>('products', body)
  },
  productUpdate(body: FormDataEditProduct) {
    return http.put<SuccessResponse<string>>(`products/${body.id}/shop/edit`, body)
  },
  preCheckImageInfoProCreate(body: FormData) {
    return http.post<SuccessResponse<PreviewImagesResponse[]>>('preview-images', body, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  preCheckImageInfoProRemove(id: string) {
    return http.delete<SuccessResponse<null>>(`preview-images/${id}`)
  },
  getListProductInterest() {
    return http.get<SuccessResponse<Product[]>>('products-interest')
  },
  updateStatusListProduct(body: { listProductId: string[]; isActive: boolean }) {
    return http.post<SuccessResponse<Product[]>>('products/shop/edit-status/list', body)
  },
  getListProductOfShop(queryConfig: ParamsConfig) {
    return http.get<SuccessResponse<ListProductForShopResponse>>('products/list-of-shop', {
      params: queryConfig
    })
  },
  getListProductOfCategoryForUser(category: string, queryConfig: ParamsConfig) {
    return http.get<SuccessResponse<Pagination<Product[]>>>('products/list-for-user', {
      params: { ...queryConfig, category: category }
    })
  },
  getListProductOfForAdmin(queryConfig: ParamsConfig) {
    return http.get<SuccessResponse<ListProductForAdminResponse>>('products/list-for-admin', {
      params: { ...queryConfig }
    })
  },
  listProductForSale(stringIds: string[]) {
    return http.post<SuccessResponse<ListProductForAdminResponse>>('products/listing-for-sale', stringIds)
  },
  getListProductRecommendation() {
    return http.get<SuccessResponse<Pagination<Product[]>>>(`products/recommendation`)
  },
  deleteListProducts(listProductId: string[]) {
    return http.post<SuccessResponse<string>>(`products/shop/delete/list`, { listProductId: listProductId })
  },
  getShopDetail(shopId: string) {
    return http.get<SuccessResponse<ShopDetailResponse>>(`shop-detail/${shopId}`)
  },
  getListProductsShopDetail(shopId: string, queryConfig: ParamsConfig) {
    return http.get<SuccessResponse<ProductPagination>>(`shop-detail/${shopId}/list-products`, {
      params: queryConfig
    })
  }
}

export default productApi
