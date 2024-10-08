import { differenceInDays, differenceInHours, parseISO, format } from 'date-fns'
import { CartItemExtendedByShop } from 'src/types/cart.type'
import { ProductVariantsResponse } from 'src/types/product.type'
import { VoucherResponse } from 'src/types/voucher.type'
import { formatCurrency } from 'src/utils/utils'

export function formatVoucherMessage(voucher: VoucherResponse) {
  const cappedDiscount = voucher.maximumDiscount ? `Capped at đ${formatCurrency(voucher.maximumDiscount)}` : ''
  return `${formatCurrency(voucher.percentageAmount)}% off ${cappedDiscount}`
}

export function calculateValidTime(endDat: string) {
  const endDate = parseISO(endDat)
  const today = new Date()

  const daysDifference = differenceInDays(endDate, today)
  const hoursDifference = differenceInHours(endDate, today)

  let formattedResult

  if (daysDifference > 0) {
    formattedResult = `Valid till: ${format(endDate, 'dd.MM.yyyy')}`
  } else if (daysDifference === 0) {
    formattedResult = `Expiring today: ${Math.max(hoursDifference, 0)} hours left`
  } else {
    formattedResult = `Expired ${Math.abs(daysDifference)} days ago`
  }

  return formattedResult
}

export function calculateTotalOrderBeforeApplyVoucher(checkedCartItems: CartItemExtendedByShop[]) {
  return checkedCartItems.reduce((result, current) => {
    return (result += current.items.reduce((shopTotal, item) => {
      const product = item.product
      const productVariantsMap = new Map<string, ProductVariantsResponse>(
        product.productVariants.map((proVariant) => [proVariant.id, proVariant])
      )

      const proVariant =
        item.productVariantId && Array.isArray(product.productVariants) && product.productVariants.length > 0
          ? productVariantsMap.get(item.productVariantId)
          : null

      const price = proVariant ? proVariant.price : product.price
      shopTotal += price * item.quantity

      return shopTotal
    }, 0))
  }, 0)
}

// export function calculateTotalOrderBeforeApplyVoucherAndBeforeDiscount(checkedCartItems: CartItemExtendedByShop[]) {
//   return checkedCartItems.reduce((result, current) => {
//     return (result += current.items.reduce((shopTotal, item) => {
//       const product = item.product
//       const productVariantsMap = new Map<string, ProductVariantsResponse>(
//         product.productVariants.map((proVariant) => [proVariant.id, proVariant])
//       )

//       const proVariant =
//         item.productVariantId && Array.isArray(product.productVariants) && product.productVariants.length > 0
//           ? productVariantsMap.get(item.productVariantId)
//           : null

//       const price = proVariant ? proVariant.beforePrice : product.beforePrice
//       shopTotal += price * item.quantity

//       return shopTotal
//     }, 0))
//   }, 0)
// }

export const calculateAmountOffVoucher = (selectedVoucher: VoucherResponse, totalOrderByShop: number) => {
  if (!selectedVoucher) return 0
  let offPrice = 0

  // Xử lý giảm giá dựa trên discountType
  if (selectedVoucher.discountType === 'fixed') {
    offPrice = selectedVoucher.fixedAmount
  } else if (selectedVoucher.discountType === 'percentage') {
    // phải bé hơn maximumDiscount
    offPrice = Math.min(totalOrderByShop * (selectedVoucher.percentageAmount / 100), selectedVoucher.maximumDiscount)
  }

  // tính giá off sẽ giảm cho đơn
  return offPrice
}
