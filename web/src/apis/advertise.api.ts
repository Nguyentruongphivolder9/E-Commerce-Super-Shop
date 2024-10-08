import { SuccessResponse } from 'src/types/utils.type'
import { AdvertiseResponse, BannerRespone } from 'src/types/advertise.type'
import http from 'src/utils/http'

const advertiseApi = {
  createAdvertise(formData: FormData) {
    return http.post<SuccessResponse<{ paymentUrl: string }>>('/advertises', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  updatePayment_Advertise(formData: FormData) {
    return http.put<SuccessResponse<{ paymentUrl: string }>>('/advertises/payed', formData)
  },

  getListAdvertise() {
    return http.get<SuccessResponse<AdvertiseResponse[]>>('advertises')
  },

  getAdvertiseById(id: string) {
    return http.get<SuccessResponse<AdvertiseResponse>>(`advertises/${id}`)
  },

  updateAdvertiseStatusAdmin(advertiseId: string) {
    return http.put<SuccessResponse<AdvertiseResponse>>(`advertises/status/update/${advertiseId}`)
  },

  getActiveAdvertiseImages() {
    return http.get<SuccessResponse<BannerRespone[]>>('advertises/active-images')
  },
  getAllAdvertiseOfShop() {
    return http.get<SuccessResponse<AdvertiseResponse[]>>(`advertises/shop`)
  },

  incrementClick: (id: string) => {
    return http.put(`/advertises/increment-click/${id}`)
  },

  getDeletedAdvertises() {
    return http.get<SuccessResponse<AdvertiseResponse[]>>('advertises/admin/deleted')
  },

  getDeletedAdvertisesShop() {
    return http.get<SuccessResponse<AdvertiseResponse[]>>('advertises/shop/deleted')
  },

  retryPaymentAdvertise: (id: string, paymentMethod: string) => {
    return http.post(`advertises/retry-payment/${id}`, null, {
      params: {
        paymentMethod
      }
    })
  }
}

export default advertiseApi
