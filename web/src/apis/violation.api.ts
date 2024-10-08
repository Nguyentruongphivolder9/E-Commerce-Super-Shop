import {
  ProductTypeViolation,
  ProductViolationHistory,
  ProductViolationReportRequest,
  ProductViolationResponse
} from 'src/types/product.type'
import { Pagination, ParamsConfig, SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const violationApi = {
  getListTypeViolation() {
    return http.get<SuccessResponse<ProductTypeViolation[]>>('violations/type')
  },
  addTypeViolation(body: { id: string; title: string }) {
    return http.post<SuccessResponse<ProductTypeViolation>>('violations/type', body, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  editTypeViolation(body: { id: string; title: string }) {
    return http.put<SuccessResponse<ProductTypeViolation>>('violations/type', body, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  deleteListTypeViolation(typeViolationIds: string[]) {
    return http.post<SuccessResponse<ProductTypeViolation>>('violations/type/delete-list', typeViolationIds)
  },

  getListHistoryViolation() {
    return http.get<SuccessResponse<ProductViolationHistory[]>>('violations/product')
  },
  getListHistoryViolationOfProduct(productId: string) {
    return http.get<SuccessResponse<ProductViolationHistory[]>>(`violations/product/${productId}`)
  },
  addReportViolation(body: ProductViolationReportRequest) {
    return http.post<SuccessResponse<ProductViolationHistory[]>>('violations/product', body)
  },
  deleteReportViolation(id: string) {
    return http.delete<SuccessResponse<string>>(`violations/product/${id}`)
  },
  getProductsViolation(queryConfig: ParamsConfig) {
    return http.get<SuccessResponse<Pagination<ProductViolationResponse[]>>>(`violations/history/shop`, {
      params: queryConfig
    })
  }
}

export default violationApi
