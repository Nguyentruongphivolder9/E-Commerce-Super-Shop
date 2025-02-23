import { CategoryOfShopResponse } from 'src/types/categoryOfShop.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const categoryOfShopApi = {
  getAllListCategoryOfShop() {
    return http.get<SuccessResponse<CategoryOfShopResponse[]>>(`shop/categories`)
  },
  addCategory(body: FormData) {
    return http.post<SuccessResponse<CategoryOfShopResponse>>('shop/categories', body, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  updateCategory(body: FormData) {
    return http.put<SuccessResponse<CategoryOfShopResponse>>('shop/categories', body, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  addListProductsForCategoryOfShop(body: { productIds: string[]; categoryOfShopId: string }) {
    return http.post<SuccessResponse<string>>('shop/categories/list-product/add', body)
  },
  toggleDisplayStatusCategoryOfShop(categoryOfShopId: string) {
    return http.post<SuccessResponse<string>>(`shop/categories/${categoryOfShopId}/display`)
  }
}

export default categoryOfShopApi
