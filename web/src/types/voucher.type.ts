/* eslint-disable import/namespace */
import { VoucherSchema } from 'src/utils/validations/voucherValidation'

export interface Voucher {
  id: string
  name: string
  code: string
  voucherType: 'global' | 'shop' | 'shipping'
  discountType: 'fixed' | 'percentage'
  fixedAmount: number
  percentageAmount: number
  maximumDiscount: number
  minimumTotalOrder: number
  isLimit: boolean
  quantity: number
  maxDistribution: number
  status: string
  startDate: string
  endDate: string
}

export type VoucherRequest = Omit<VoucherSchema, 'startDate' | 'endDate'> & {
  id?: string
  isEnd?: boolean
  startDate: string
  endDate: string
}

export type VoucherResponse = Voucher & {
  shopId: string
  status: string
}

export type VoucherInDepotResponse = {
  code: string
  quantity: number
  voucher: VoucherResponse
}

export type VouchersUsedResponse = {
  voucher: VoucherResponse
  orderId: string
}
