import { QueryConfig } from 'src/hooks/useQueryConfig'
import { Order, OrderResponse, RefundResponse, StripeParams, VnpReturnParams } from 'src/types/order.type'
import { Pagination, ParamsConfig, SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

export const orderApi = {
  placeOrder(body: Order[]) {
    return http.post<SuccessResponse<{ paymentUrl: string }>>(`orders`, body)
  },

  getOrders(queryConfig: QueryConfig) {
    return http.get<SuccessResponse<OrderResponse[]>>(`orders`, {
      params: { ...queryConfig }
    })
  },

  getOrderByShop() {
    return http.get<SuccessResponse<OrderResponse[]>>(`orders/shop`)
  },

  getOrderByShopPagination(queryConfig: QueryConfig) {
    return http.get<SuccessResponse<Pagination<OrderResponse[]>>>(`orders/shop/paginate`, {
      params: { ...queryConfig }
    })
  },

  getOrder(orderId: string) {
    return http.get<SuccessResponse<OrderResponse>>(`orders/${orderId}`)
  },

  getRefundOrderByShop() {
    return http.get<SuccessResponse<RefundResponse[]>>(`orders/shop/refunds`)
  },

  getRefundOrderByShopPagination(queryConfig: QueryConfig) {
    return http.get<SuccessResponse<Pagination<RefundResponse[]>>>(`orders/shop/refunds/paginate`, {
      params: { ...queryConfig }
    })
  },

  getRefund(refundId: string) {
    return http.get<SuccessResponse<RefundResponse>>(`orders/refund/${refundId}`)
  },

  // Check rollBack
  passVNpayReturnParams(vnpReturnParamsObj: VnpReturnParams) {
    return http.get<SuccessResponse<VnpReturnParams>>(`orders/vnpayParams`, {
      params: vnpReturnParamsObj
    })
  },

  passStripeReturnParams(stripeReturnParamsObj: StripeParams) {
    return http.get<SuccessResponse<StripeParams>>(`orders/stripeParams`, {
      params: stripeReturnParamsObj
    })
  },

  refundOrder(body: FormData) {
    return http.post<SuccessResponse<[]>>('orders/refunds', body, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  processRefundOrder(refundId: string) {
    return http.post<SuccessResponse<null>>(`orders/shop/refunds/stripe/${refundId}`)
  },

  deleteRefundImages() {
    return http.delete<SuccessResponse<null>>(`orders/refunds/images`)
  },

  cancelOrder(orderId: string) {
    return http.post<SuccessResponse<null>>(`orders/user/${orderId}`)
  },

  confirmOrder(orderId: string) {
    return http.post<SuccessResponse<null>>(`orders/shop/confirm/${orderId}`)
  }
}
