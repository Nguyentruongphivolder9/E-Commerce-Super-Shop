import { UserInfo } from './user.type'

export interface RatingRequest {
  imageFiles: File[]
  productId: string
  orderItemId: string
  ratingStar: number
  productQuality: string
  trueDescription: string
  comment: string
}

export interface RatingResponse {
  id: string
  productId: string
  ratingStar: number
  productQuality: string
  trueDescription: string
  comment: string
  feedbackImages: FeedbackImageResponse[]
  account: UserInfo
  createdAt: string
  updatedAt: string
}

export interface FeedbackImageResponse {
  id: string
  imageUrl: string
}

export interface SellerFeedbackResponse {
  id: string
  message: string
  createdAt: string
}

export interface RatingForUserResponse extends RatingResponse {
  isVoteUseFull: boolean
  countVote: number
  variantName: string
  sellerFeedback: SellerFeedbackResponse
}
export interface PaginationRatingForUserResponse {
  listRatings: RatingForUserResponse[]
  totalPages: number
}

export interface RatingFigureResponse {
  start5: number
  start4: number
  start3: number
  start2: number
  start1: number
  withComment: number
  withPhoto: number
}
