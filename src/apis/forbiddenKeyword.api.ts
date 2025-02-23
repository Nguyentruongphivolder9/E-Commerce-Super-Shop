import { ForbiddenKeywordResponse } from 'src/types/forbiddenKeyword.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const forbiddenKeywordApi = {
  getListForbiddenKeyword() {
    return http.get<SuccessResponse<ForbiddenKeywordResponse[]>>('forbidden-keyword')
  },
  addForbiddenKeyword(body: { id: string; keyword: string }) {
    return http.post<SuccessResponse<ForbiddenKeywordResponse>>('forbidden-keyword', body, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  editForbiddenKeyword(body: { id: string; keyword: string }) {
    return http.put<SuccessResponse<ForbiddenKeywordResponse>>('forbidden-keyword', body, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  deleteListForbiddenKeyword(forbiddenKeywordIds: string[]) {
    return http.post<SuccessResponse<ForbiddenKeywordResponse>>('forbidden-keyword/delete-list', forbiddenKeywordIds)
  }
}

export default forbiddenKeywordApi
