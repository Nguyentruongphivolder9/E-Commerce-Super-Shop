type Role = 'USER' | 'ADMIN' | 'SELLER'

export interface User {
  id: string
  avatarUrl: string
  isActive: boolean
  email: string
  exp: number
  fullName: string
  gender: string
  birthDay: Date
  phoneNumber: string
  role: Role
  address: string
  sub: string
  userName: string
  fullNameChanges: number
  bio?: string
}

export interface ShopInfo {
  id: string
  avatarUrl: string
  isActive: boolean
  email: string
  fullName: string
  userName: string
}

export interface UserInfo {
  id: string
  avatarUrl: string
  isActive: boolean
  email: string
  fullName: string
  userName: string
}

export interface SellerInfoResponse {
  id: string
  ratingTotal: number
  ratingResponse: number
  ratingStar: number
  productTotal: number
  followerTotal: number
  followingTotal: number
  joinedDate: string
  account: ShopInfo
}
