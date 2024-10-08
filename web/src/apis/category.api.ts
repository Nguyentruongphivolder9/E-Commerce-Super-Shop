import { CategoryResponse } from 'src/types/category.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const categoryApi = {
  getCategories() {
    return http.get<SuccessResponse<CategoryResponse[]>>('categories')
  },
  addCategory(body: FormData) {
    return http.post<SuccessResponse<CategoryResponse>>('categories', body, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  updateCategory(body: FormData) {
    return http.put<SuccessResponse<CategoryResponse>>('categories', body, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  getListRelateCategory(id: string) {
    return http.get<SuccessResponse<CategoryResponse[]>>(`categories/${id}/list-relate`)
  },
  getCategoryById(id: string) {
    return http.get<SuccessResponse<CategoryResponse>>(`categories/${id}`)
  },
  deleteCategoryById(id: string) {
    return http.delete<SuccessResponse<string>>(`categories/${id}`)
  }
}

export default categoryApi
