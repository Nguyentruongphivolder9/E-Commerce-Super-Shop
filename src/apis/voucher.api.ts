import { config } from 'process'
import { Pagination, SuccessResponse } from 'src/types/utils.type'
import { VoucherInDepotResponse, VoucherRequest, VoucherResponse, VouchersUsedResponse } from 'src/types/voucher.type'
import http from 'src/utils/http'

const voucherApi = {
  createVoucher(body: VoucherRequest) {
    return http.post<SuccessResponse<VoucherResponse>>('vouchers', body)
  },
  getVouchers() {
    return http.get<SuccessResponse<Pagination<VoucherResponse[]>>>('vouchers')
  },

  getVouchersByMultipleShopId(shopIds: string[]) {
    return http.get<SuccessResponse<VoucherResponse[]>>('vouchers/multipleShop', {
      params: {
        shopIds: shopIds.join(',')
      }
    })
  },
  async getVoucher(id: string) {
    return http.get<SuccessResponse<VoucherResponse>>(`vouchers/${id}`)
  },
  updateVoucher(formData: { id: string; body: VoucherRequest }) {
    return http.patch<SuccessResponse<VoucherResponse>>(`vouchers/${formData.id}`, formData.body)
  },
  deleteVoucher(id: string) {
    return http.delete<SuccessResponse<null>>(`vouchers/${id}`)
  }
}

const voucherDepotApi = {
  addVoucherToDepot(body: { code: string }) {
    return http.post<SuccessResponse<VoucherInDepotResponse>>('vouchers/depot', body)
  },
  getVouchersInDepot() {
    return http.get<SuccessResponse<Pagination<VoucherInDepotResponse[]>>>('vouchers/depot')
  }
}

const vouchersUsedApi = {
  getVouchersUsed() {
    return http.get<SuccessResponse<VouchersUsedResponse[]>>('vouchers/used')
  }
}
export { voucherDepotApi, vouchersUsedApi }
export default voucherApi
