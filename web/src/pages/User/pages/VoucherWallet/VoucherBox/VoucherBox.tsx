import classNames from 'classnames'
import { ReactNode } from 'react'
import { DiscountType, VoucherType } from 'src/pages/Shop/page/VoucherShop/enums/voucherInfo.enum'
import { VoucherResponse } from 'src/types/voucher.type'
import { formatCurrency } from 'src/utils/utils'
import { parseISO, differenceInDays, differenceInHours, format } from 'date-fns'
import { Link } from 'react-router-dom'
interface Props {
  voucher: VoucherResponse
}
const defVar: {
  iconGlobalShop: ReactNode
  iconShop: ReactNode
  iconShipping: ReactNode
} = {
  iconGlobalShop: (
    <svg
      className='w-8 h-8 fill-white'
      xmlns='http://www.w3.org/2000/svg'
      width='32'
      height='32'
      fill='#000000'
      viewBox='0 0 256 256'
    >
      <path d='M128,26A102,102,0,1,0,230,128,102.12,102.12,0,0,0,128,26Zm89.8,96H173.89c-1.54-40.77-18.48-68.23-30.43-82.67A90.19,90.19,0,0,1,217.8,122ZM128,215.83a110,110,0,0,1-15.19-19.45A128.37,128.37,0,0,1,94.13,134h67.74a128.37,128.37,0,0,1-18.68,62.38A110,110,0,0,1,128,215.83ZM94.13,122a128.37,128.37,0,0,1,18.68-62.38A110,110,0,0,1,128,40.17a110,110,0,0,1,15.19,19.45A128.37,128.37,0,0,1,161.87,122Zm18.41-82.67c-12,14.44-28.89,41.9-30.43,82.67H38.2A90.19,90.19,0,0,1,112.54,39.33ZM38.2,134H82.11c1.54,40.77,18.48,68.23,30.43,82.67A90.19,90.19,0,0,1,38.2,134Zm105.26,82.67c11.95-14.44,28.89-41.9,30.43-82.67H217.8A90.19,90.19,0,0,1,143.46,216.67Z'></path>
    </svg>
  ),
  iconShop: (
    <svg
      className='w-8 h-8 fill-white'
      xmlns='http://www.w3.org/2000/svg'
      width='32'
      height='32'
      fill='#000000'
      viewBox='0 0 256 256'
    >
      <path d='M216,42H40A14,14,0,0,0,26,56V200a14,14,0,0,0,14,14H216a14,14,0,0,0,14-14V56A14,14,0,0,0,216,42Zm2,158a2,2,0,0,1-2,2H40a2,2,0,0,1-2-2V56a2,2,0,0,1,2-2H216a2,2,0,0,1,2,2ZM174,88a46,46,0,0,1-92,0,6,6,0,0,1,12,0,34,34,0,0,0,68,0,6,6,0,0,1,12,0Z'></path>
    </svg>
  ),
  iconShipping: (
    <svg
      className='w-8 h-8 fill-white'
      xmlns='http://www.w3.org/2000/svg'
      width='32'
      height='32'
      fill='#000000'
      viewBox='0 0 256 256'
    >
      <path d='M222,98.47V96a54.06,54.06,0,0,0-54-54h-8a14,14,0,0,0-14,14V178H126V72a6,6,0,0,0-6-6H16A14,14,0,0,0,2,80V184a30,30,0,0,0,54,18,30,30,0,0,0,53.4-12h85.2a30,30,0,0,0,59.4-6V136A38.07,38.07,0,0,0,222,98.47ZM158,56a2,2,0,0,1,2-2h8a42,42,0,0,1,42,42v8a6,6,0,0,0,6,6,26,26,0,0,1,26,26v24a30,30,0,0,0-47.4,18H158ZM16,78h98V178h-4.6A30,30,0,0,0,56,166a30,30,0,0,0-42-6V80A2,2,0,0,1,16,78ZM32,202a18,18,0,1,1,18-18A18,18,0,0,1,32,202Zm48,0a18,18,0,1,1,18-18A18,18,0,0,1,80,202Zm144,0a18,18,0,1,1,18-18A18,18,0,0,1,224,202Z'></path>
    </svg>
  )
}

// const defaultValueProps: Props = {
//   code: 'FGJWEHF45',
//   title: '12% off Capped at ₫25k',
//   secondTitle: 'Min. Spend ₫0',
//   time: 'Use in: 1 day',
//   voucherType: 'global',
//   discountType: 'fixed',
//   quantity: 5
// }

function formatVoucherMessage(voucher: VoucherResponse) {
  const cappedDiscount = voucher.maximumDiscount ? `Capped at đ${voucher.maximumDiscount}` : ''
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

export default function VoucherBox({ voucher }: Props) {
  return (
    <div className='relative h-[116px] rounded-sm shadow-[3px_10px_8px_rgba(0,0,0,0.1)]'>
      <div className='up_part relative flex h-full '>
        <div className='relative -l-[1px] flex items-center justify-center text-white min-w-[120px] rounded-l-sm'>
          <div className='absolute flex justify-center items-center flex-col-reverse text-sm uppercase'>
            <span className='mt-2'>
              {voucher.voucherType === 'global' ? 'Global' : voucher.voucherType === 'shop' ? 'Shop' : 'Free Ship'}
            </span>
            {voucher.voucherType === 'global'
              ? defVar.iconGlobalShop
              : voucher.voucherType === 'shop'
                ? defVar.iconShop
                : defVar.iconShipping}
          </div>
          <svg
            className={`w-[120px] h-[116px] `}
            width='100%'
            height='100%'
            viewBox='0 0 106 106'
            fill='none'
            xmlns='http://www.w3.org/1999/xlink'
          >
            <path
              className={`${voucher.voucherType === 'shipping' ? 'fill-[#00bfa5]' : 'fill-blue'}`}
              fillRule='evenodd'
              clipRule='evenodd'
              d='M0 2a2 2 0 0 1 2-2h106v106H2a2 2 0 0 1-2-2v-3a3 3 0 1 0 0-6v-4a3 3 0 1 0 0-6v-4a3 3 0 1 0 0-6v-4a3 3 0 1 0 0-6v-4a3 3 0 1 0 0-6v-4a3 3 0 1 0 0-6v-4a3 3 0 1 0 0-6v-4a3 3 0 1 0 0-6v-4a3 3 0 1 0 0-6v-4a3 3 0 0 0 0-6V2Z'
              fill='#0099FF'
            ></path>
          </svg>
        </div>
        <div className='flex flex-1 border  border-l-0 border-gray-300'>
          <div className='flex flex-col flex-1 pl-3 gap-1 justify-center'>
            <span className='text-base font-semibold '>{voucher.code}</span>
            <span className='text-sm'>
              {voucher.discountType === DiscountType.FIXED
                ? `đ${formatCurrency(voucher.fixedAmount)} off`
                : formatVoucherMessage(voucher)}
            </span>
            <span className='text-sm'>{`Min. Spend đ${formatCurrency(voucher.minimumTotalOrder)}`}</span>
            <div className='flex items-center'>
              <svg
                className='w-3 h-3 fill-gray-400'
                xmlns='http://www.w3.org/2000/svg'
                width='32'
                height='32'
                fill='#000000'
                viewBox='0 0 256 256'
              >
                <path d='M128,26A102,102,0,1,0,230,128,102.12,102.12,0,0,0,128,26Zm0,192a90,90,0,1,1,90-90A90.1,90.1,0,0,1,128,218Zm62-90a6,6,0,0,1-6,6H128a6,6,0,0,1-6-6V72a6,6,0,0,1,12,0v50h50A6,6,0,0,1,190,128Z'></path>
              </svg>
              <span className='text-xs font-normal text-gray-400 ml-1'>{calculateValidTime(voucher.endDate)}</span>
            </div>
          </div>
          <div className='flex flex-column items-center justify-center p-3'>
            <Link to='/'>
              <div
                className={classNames(
                  'h-[30px] flex justify-center items-center text-center text-[11px] leading-none line-clamp-2 whitespace-normal break-words min-w-[3.475rem] max-w-[3.475rem]  px-[0.5rem] border  rounded-sm',
                  {
                    'border-blue/95 text-blue/95': voucher.voucherType === VoucherType.GLOBAL || VoucherType.SHOP,
                    'border-[#00bfa5] text-[#00bfa5]': voucher.voucherType === VoucherType.SHIPPING
                  }
                )}
              >
                Use
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className='low_part mx-[0.5rem] shadow-sm bg-white h-2 relative'>
        <div
          className={classNames(
            'absolute h-full min-w-[calc(120px-0.5rem)] max-w-[calc(120px-0.5rem)] z-10 border-r-[0.0625rem] border-dashed border-r-white  shadow-sm',
            {
              'bg-blue/40': voucher.voucherType === VoucherType.GLOBAL || voucher.voucherType === VoucherType.SHOP,
              'bg-[#00bfa5]/40': voucher.voucherType === VoucherType.SHIPPING
            }
          )}
        ></div>
      </div>
      <div
        className={`quantity_part absolute top-2 -right-[5px] h-4 w-9 rounded-l-full rounded-tr-sm ${voucher.voucherType === VoucherType.GLOBAL || voucher.voucherType === VoucherType.SHOP ? 'bg-blue' : 'bg-[#00bfa5]'} text-white`}
      >
        <div className='flex justify-center items-center text-xs'>
          x{voucher.maxDistribution}
          <div
            className={`absolute top-[83%] right-1 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[4px] ${voucher.voucherType === VoucherType.GLOBAL || voucher.voucherType === VoucherType.SHOP ? 'border-b-blue/50' : 'border-b-[#00bfa5]/50'}  border-b-blue/50 -rotate-45 translate-x-1/2 translate-y-1/2`}
          ></div>
        </div>
      </div>
    </div>
  )
}
