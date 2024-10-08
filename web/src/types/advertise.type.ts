// advertise.type.ts

export interface AdvertiseImage {
  id: string
  imageUrl: string
}

export interface AdvertiseRequest {
  title: string
  startDate: string
  endDate: string
  esFollower: number
  esClick: number
  esBanner: number
  shopId: string | null
  adsStatusId: string | null
  costBanner: number
  costFollowers: number
  costClicks: number
  costTotal: number
  imageFiles: AdvertiseImage[]
}

export interface VnpReturnParams {
  vnp_Amount: string
  vnp_BankCode: string
  vnp_CardType: string
  vnp_OrderInfo: string
  vnp_PayDate: string
  vnp_ResponseCode: string
  vnp_TmnCode: string
  vnp_TransactionNo: string
  vnp_TransactionStatus: string
  vnp_TxnRef: string
  vnp_SecureHash: string
  adsId: string
}

export interface AdvertiseResponse {
  id: string
  title: string
  startDate: string
  endDate: string
  status: string
  esBanner: number
  shopId: string | null
  costBanner: number
  payed: boolean
  run: boolean
  isDeleted: boolean
  click : number

  advertiseImages: {
    id: string
    imageUrl: string
  }[]
}

export interface BannerRespone {
  advertiseId : string
  shopId: string
  advertiseImages: AdvertiseImage[]
}
