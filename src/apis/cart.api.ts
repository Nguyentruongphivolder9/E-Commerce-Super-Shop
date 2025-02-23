import { CartItemRequest, CartItemResponse } from 'src/types/cart.type'
import { Omit2, Pagination, SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const cartApi = {
  getListCart() {
    return http.get<SuccessResponse<Pagination<CartItemResponse[]>>>(`cart`)
  },
  addToCart(body: CartItemRequest) {
    return http.post<SuccessResponse<CartItemResponse>>(`cart`, body)
  },

  updateCart(body: CartItemRequest) {
    return http.put<SuccessResponse<CartItemResponse>>(`cart`, body)
  },

  updateProductVariant(body: Omit2<CartItemRequest, 'quantity'>) {
    return http.put<SuccessResponse<CartItemResponse>>(`cart/productVariant`, body)
  },

  deleteCartItems(listIdCartItem: string[]) {
    return http.delete<SuccessResponse<null>>(`cart`, {
      data: { listIdCartItem }
    })
  }
}

export default cartApi
