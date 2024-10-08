import { Button, Popover, Transition } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { CartItemExtendedByShop } from 'src/types/cart.type'
import { formatCurrency } from 'src/utils/utils'
import { calculateTotalOrderBeforeApplyVoucher } from '../utilsCart/utils.cart'
import { useMemo } from 'react'
interface Props {
  quantityCheckedCartItems: number
  totalFinalCheckedPurchasePrice: number
  checkedCartItems: CartItemExtendedByShop[]
  pickedVouchers: { voucherId: string; shopId: string; voucherOffPrice: number }[]
}
const ARROW_OFFSET_X = 100
const getTransformOrigin = (arrowOffsetX: number) => {
  return `calc(100% - ${arrowOffsetX}px) 100%`
}
const scale = {
  in: { opacity: 1, transform: 'scale(1)' },
  out: { opacity: 0, transform: 'scale(0)' },
  common: { transformOrigin: getTransformOrigin(ARROW_OFFSET_X) },
  transitionProperty: 'transform, opacity'
}
export default function DiscountDetailPopover({
  quantityCheckedCartItems,
  totalFinalCheckedPurchasePrice,
  checkedCartItems,
  pickedVouchers
}: Props) {
  const [opened, { close, open }] = useDisclosure(false)
  const subTotal = useMemo(() => {
    return calculateTotalOrderBeforeApplyVoucher(checkedCartItems)
  }, [checkedCartItems])
  const totalOffPriceVoucher = useMemo(
    () => pickedVouchers.reduce((total, voucher) => total + voucher.voucherOffPrice, 0),
    [pickedVouchers]
  )
  return (
    <Popover
      width={600}
      position='top-end'
      offset={-5}
      withArrow
      arrowPosition='side'
      arrowOffset={ARROW_OFFSET_X}
      arrowSize={15}
      shadow='md'
      opened={opened}
    >
      <Popover.Target>
        <div onMouseEnter={open} onMouseLeave={close}>
          <div className='flex items-center sm:justify-end'>
            <div className='text-base leading-5 pt-1'>
              Total({quantityCheckedCartItems}) {quantityCheckedCartItems > 1 ? 'items' : 'item'}:
            </div>
            <div className='ml-2 text-2xl leading-7 text-blue'>₫{formatCurrency(totalFinalCheckedPurchasePrice)}</div>
          </div>
        </div>
      </Popover.Target>
      <Transition mounted={opened} transition={scale} duration={200} timingFunction='linear'>
        {(transitionStyle) => (
          <Popover.Dropdown style={{ ...transitionStyle }} px={30} onMouseEnter={open} onMouseLeave={close}>
            <h2 className='text-lg mb-4'>Discount Detail</h2>
            <div className='border-b border-gray-300 pb-4'>
              <div className='flex justify-between'>
                <span>Subtotal</span>
                <span className='font-semibold'>₫{formatCurrency(subTotal)}</span>
              </div>
              <div className='flex justify-between mt-2'>
                <span>Voucher Discount</span>
                <span className=''>-₫{formatCurrency(totalOffPriceVoucher)}</span>
              </div>
              {/* <div className='flex justify-between mt-2'>
                <span>Product Discount</span>
                <span className=''>-₫70.000</span>
              </div> */}
            </div>
            <div className='flex justify-between mt-4'>
              <span>Saved</span>
              <span className='font-semibold text-[#ee4d2d]'>-₫{formatCurrency(totalOffPriceVoucher)}</span>
            </div>
            <div className='flex justify-between mt-2 font-bold text-lg'>
              <span>Total Amount</span>
              <span>₫{formatCurrency(totalFinalCheckedPurchasePrice)}</span>
            </div>
            <p className='text-gray-500 text-sm mt-2 text-right'>* Final price shown at checkout</p>
          </Popover.Dropdown>
        )}
      </Transition>
    </Popover>
  )
}
