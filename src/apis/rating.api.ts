import { PaginationRatingForUserResponse, RatingFigureResponse, RatingForUserResponse } from 'src/types/rating.type'
import { ParamsConfig, SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const ratingApi = {
  createRatings(body: FormData) {
    return http.post<SuccessResponse<string>>('ratings', body, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  createSellerFeedback(body: FormData) {
    return http.post<SuccessResponse<string>>('ratings/seller-feedback', body, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  getRatingFigureByProductIdForUser(productId: string) {
    return http.get<SuccessResponse<RatingFigureResponse>>(`ratings/product/${productId}/figure`)
  },
  getListRatingsByProductIdForUser(queryConfig: ParamsConfig, productId: string) {
    return http.get<SuccessResponse<PaginationRatingForUserResponse>>(`ratings/product/${productId}`, {
      params: { ...queryConfig }
    })
  },
  toggleVoteUseFull(ratingId: string) {
    return http.post<SuccessResponse<string>>(`ratings/${ratingId}/vote-use-full`)
  }
}

export default ratingApi
