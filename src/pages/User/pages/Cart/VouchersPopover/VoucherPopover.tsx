import { Button, Popover, Transition } from '@mantine/core'
import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react'
import usePrevious from 'src/hooks/usePrevious'
import { CartItemExtendedByShop } from 'src/types/cart.type'
import { VoucherResponse } from 'src/types/voucher.type'
import { formatCurrency } from 'src/utils/utils'
import {
  calculateAmountOffVoucher,
  calculateTotalOrderBeforeApplyVoucher,
  calculateValidTime,
  formatVoucherMessage
} from '../utilsCart/utils.cart'
import { useQuery } from '@tanstack/react-query'
import { vouchersUsedApi } from 'src/apis/voucher.api'
const ARROW_OFFSET_X = 100
interface Props {
  shopInfo: {
    id: string
    fullName: string
    userName: string
    avatarUrl: string
  }
  vouchers?: VoucherResponse[]
  checkedCartItems: CartItemExtendedByShop[]
  setPickedVouchers: Dispatch<SetStateAction<{ voucherId: string; shopId: string; voucherOffPrice: number }[]>>
  setTotalonShop: Dispatch<SetStateAction<{ shopId: string; total: number }[]>>
}

export default function VoucherPopover({
  shopInfo,
  vouchers: vouchersByShop,
  checkedCartItems,
  setPickedVouchers,
  setTotalonShop
}: Props) {
  const [opened, setOpened] = useState(false)
  const [selectedVoucherId, setSelectedVoucherId] = useState<string>('')
  const previousSelectedVoucherId = usePrevious(selectedVoucherId)
  const [suggesstionRecommendVoucherId, setSuggesstionRecommendVoucherId] = useState<string>('')
  const [usedVouchers, setUsedVouchers] = useState<Record<string, number>>()
  const buttonRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const currentButton = buttonRef.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setOpened(false)
        }
      },
      { threshold: 0 }
    )

    if (currentButton) {
      observer.observe(currentButton)
    }

    return () => {
      if (currentButton) {
        observer.unobserve(currentButton)
      }
    }
  }, [])

  const { data: vouchersUsed } = useQuery({
    queryKey: ['vouchersUsedByAccountId'],
    queryFn: () => vouchersUsedApi.getVouchersUsed()
  })
  const usedVouchersData = vouchersUsed?.data.body

  useEffect(() => {
    if (usedVouchersData) {
      const voucherCount = usedVouchersData.reduce<Record<string, number>>((acc, voucher) => {
        acc[voucher.voucher.id] = (acc[voucher.voucher.id] || 0) + 1 // lần đâu chưa có gì nên gán = 0 cho không lỗi
        return acc
      }, {})
      setUsedVouchers(voucherCount) // output:: {voucherId: count}
    }
  }, [usedVouchersData])

  const totalOrderBeforeApplyVoucher = useMemo(() => {
    return calculateTotalOrderBeforeApplyVoucher(checkedCartItems)
  }, [checkedCartItems])

  const selectedVoucher = useMemo(() => {
    if (!selectedVoucherId) return null
    return vouchersByShop?.find((voucher) => voucher.id === selectedVoucherId)
  }, [selectedVoucherId, vouchersByShop])

  const totalOrderAfterApplyVoucher = useMemo(() => {
    if (!selectedVoucher) return null
    return totalOrderBeforeApplyVoucher - calculateAmountOffVoucher(selectedVoucher, totalOrderBeforeApplyVoucher)
  }, [selectedVoucher, totalOrderBeforeApplyVoucher])

  useEffect(() => {
    setTotalonShop((prev) => {
      const newTotalOnShop = [...prev]
      const index = newTotalOnShop.findIndex((t) => t.shopId === shopInfo.id)
      if (index !== -1) {
        newTotalOnShop[index] = {
          shopId: shopInfo.id,
          total: totalOrderAfterApplyVoucher || totalOrderBeforeApplyVoucher
        }
      } else {
        newTotalOnShop.push({
          shopId: shopInfo.id,
          total: totalOrderAfterApplyVoucher || totalOrderBeforeApplyVoucher
        })
      }
      return newTotalOnShop.filter((t) => t.total > 0)
    })
  }, [totalOrderBeforeApplyVoucher, totalOrderAfterApplyVoucher])

  const bestChoiceVoucher = useMemo(() => {
    if (!vouchersByShop) return { bestVoucherIndex: -1, bestVoucher: null }

    let bestDiscount = 0
    let bestVoucherIndex = -1
    let bestVoucher: VoucherResponse | null = null

    for (let i = 0; i < vouchersByShop.length; i++) {
      const voucher = vouchersByShop[i]
      // Kiểm tra điều kiện tổng đơn hàng phải lớn hơn hoặc bằng điều kiện tối thiểu của voucher
      if (totalOrderBeforeApplyVoucher >= voucher.minimumTotalOrder) {
        const discountValue = calculateAmountOffVoucher(voucher, totalOrderBeforeApplyVoucher)
        // Tìm voucher có số tiền giảm giá lớn nhất
        if (discountValue > bestDiscount) {
          bestDiscount = discountValue
          bestVoucherIndex = i
          bestVoucher = voucher
        }
      }
    }
    return {
      bestVoucherIndex,
      bestVoucher
    }
  }, [totalOrderBeforeApplyVoucher, vouchersByShop])

  const handlePickVoucher = (voucherId: string) => {
    if (voucherId === selectedVoucherId) {
      setSelectedVoucherId('')
      setPickedVouchers((prev) => {
        return prev.filter((voucher) => voucher.voucherId !== voucherId)
      })
      return
    }
    setSelectedVoucherId(voucherId)
    setPickedVouchers((prev) => {
      const newPickedVouchers = [...prev]
      const index = newPickedVouchers.findIndex((voucher) => voucher.shopId === shopInfo.id)
      const pickedVoucher = vouchersByShop?.find((voucher) => voucher.id === voucherId)
      const voucherOffPrice = pickedVoucher ? calculateAmountOffVoucher(pickedVoucher, totalOrderBeforeApplyVoucher) : 0
      if (index !== -1) {
        newPickedVouchers[index] = { shopId: shopInfo.id, voucherId, voucherOffPrice }
      } else {
        newPickedVouchers.push({ shopId: shopInfo.id, voucherId, voucherOffPrice })
      }
      return newPickedVouchers
    })
  }

  // check khi chưa chọn voucher thì tìm xem có voucher nào áp được không
  useEffect(() => {
    if (!selectedVoucher) {
      let voucherFound = false
      for (const voucher of vouchersByShop ?? []) {
        if (totalOrderBeforeApplyVoucher >= voucher.minimumTotalOrder) {
          voucherFound = true
          const { bestVoucher } = bestChoiceVoucher
          if (bestVoucher && voucher.id === bestVoucher.id) {
            setSuggesstionRecommendVoucherId(voucher.id)
          }
        }
      }
      if (!voucherFound) {
        //
      }
    }
  }, [bestChoiceVoucher, totalOrderBeforeApplyVoucher, vouchersByShop])

  // nếu chọn rồi và bấm tăng quantity thì sẽ giúp disapply cái voucher khi total < minimumTotalOrder
  useEffect(() => {
    if (selectedVoucher && totalOrderBeforeApplyVoucher < selectedVoucher.minimumTotalOrder) {
      handlePickVoucher(selectedVoucherId)
    }
  }, [selectedVoucher, selectedVoucherId, totalOrderBeforeApplyVoucher])

  return (
    <Popover
      width={500}
      opened={opened}
      middlewares={{
        flip: { fallbackPlacements: ['right', 'bottom'] }
      }}
      position='bottom-start'
      withArrow
      shadow='lg'
      arrowPosition='side'
      arrowOffset={ARROW_OFFSET_X}
      arrowSize={12}
      onChange={() => {
        setOpened((o) => !o)
      }}
    >
      <Popover.Target>
        <div>
          {selectedVoucher && (
            <span className='mr-3 text-[#ee4d2d]'>
              ₫{formatCurrency(calculateAmountOffVoucher(selectedVoucher, totalOrderBeforeApplyVoucher))} off applied
            </span>
          )}
          <button ref={buttonRef} onClick={() => setOpened((o) => !o)} className='text-sm text-blue'>
            {selectedVoucher ? 'More Vouchers' : 'Add shop voucher'}
          </button>
        </div>
      </Popover.Target>
      <Popover.Dropdown className='px-6 pt-6 pb-2'>
        <h2 className='text-lg font-semibold mb-4'>{shopInfo.userName} vouchers</h2>
        {/* Voucher List */}
        <div className='overflow-y-auto h-[400px] min-h-[400px]'>
          {/* Voucher 1 */}
          {vouchersByShop && vouchersByShop?.length > 0 ? (
            vouchersByShop?.map((voucher, index) => {
              const usedCount = usedVouchers?.[voucher.id] || 0
              const remainingUses = voucher.maxDistribution - usedCount
              return (
                <div
                  key={voucher.id}
                  className={`flex items-center justify-between p-4 my-3 mr-3 border rounded-md ${
                    selectedVoucherId === voucher.id ? 'border-red-500' : 'border-gray-300'
                  } ${totalOrderBeforeApplyVoucher < (voucher.minimumTotalOrder || 0) ? 'opacity-50 cursor-default' : 'cursor-pointer'}`}
                  onClick={() => {
                    if (totalOrderBeforeApplyVoucher >= (voucher.minimumTotalOrder || 0)) {
                      handlePickVoucher(voucher.id)
                    }
                  }}
                  // thêm điều kiện disable cho voucher
                >
                  <div className='flex items-center space-x-4'>
                    {bestChoiceVoucher.bestVoucherIndex === index ? (
                      <div className='bg-[#ee4d2d] text-xs text-white px-2 py-1 rounded-full'>Best choice</div>
                    ) : (
                      ''
                    )}
                    <div>
                      <p className='text-lg font-semibold'>
                        {voucher.discountType === 'fixed'
                          ? `đ${formatCurrency(voucher.fixedAmount)} off`
                          : formatVoucherMessage(voucher)}
                      </p>
                      <p className='text-sm text-gray-600'>Min. Spend ₫${formatCurrency(voucher.minimumTotalOrder)}</p>
                      <p className='text-xs text-gray-400'>{calculateValidTime(voucher.endDate)}</p>
                      <p className='text-xs text-gray-400'>
                        You have {remainingUses} {remainingUses === 1 ? 'use' : 'uses'} left on this coupon
                      </p>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className='flex h-full items-center justify-center flex-col'>
              {/* prettier-ignore */}
              <svg width={140} height={140} viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M0 0H140V140H0V0Z" fill="white" fillOpacity="0.01" />
                  <path d="M63 115C65.2091 115 67 113.209 67 111C67 108.791 65.2091 107 63 107C60.7909 107 59 108.791 59 111C59 113.209 60.7909 115 63 115Z" stroke="#E8E8E8" strokeWidth={2} />
                  <path d="M77 23C79.2091 23 81 21.2091 81 19C81 16.7909 79.2091 15 77 15C74.7909 15 73 16.7909 73 19C73 21.2091 74.7909 23 77 23Z" stroke="#E8E8E8" strokeWidth={2} />
                  <path fillRule="evenodd" clipRule="evenodd" d="M123 92C123.552 92 124 92.4477 124 93V95.999L127 96C127.552 96 128 96.4477 128 97C128 97.5523 127.552 98 127 98H124V101C124 101.552 123.552 102 123 102C122.448 102 122 101.552 122 101V98H119C118.448 98 118 97.5523 118 97C118 96.4477 118.448 96 119 96H122V93C122 92.4477 122.448 92 123 92Z" fill="#E8E8E8" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M39 23C39.5523 23 40 23.4477 40 24V26.999L43 27C43.5523 27 44 27.4477 44 28C44 28.5523 43.5523 29 43 29H40V32C40 32.5523 39.5523 33 39 33C38.4477 33 38 32.5523 38 32V29H35C34.4477 29 34 28.5523 34 28C34 27.4477 34.4477 27 35 27H38V24C38 23.4477 38.4477 23 39 23Z" fill="#E8E8E8" />
                  <path d="M90.3995 59.4263C90.9853 58.8405 90.9853 57.8908 90.3995 57.305C89.8137 56.7192 88.864 56.7192 88.2782 57.305L67.065 78.5182C66.4792 79.104 66.4792 80.0537 67.065 80.6395C67.6508 81.2253 68.6005 81.2253 69.1863 80.6395L90.3995 59.4263Z" fill="#BDBDBD" />
                  <path d="M70 67C73.3137 67 76 64.3137 76 61C76 57.6863 73.3137 55 70 55C66.6863 55 64 57.6863 64 61C64 64.3137 66.6863 67 70 67Z" stroke="#BDBDBD" strokeWidth={3} />
                  <path d="M88 83C91.3137 83 94 80.3137 94 77C94 73.6863 91.3137 71 88 71C84.6863 71 82 73.6863 82 77C82 80.3137 84.6863 83 88 83Z" stroke="#BDBDBD" strokeWidth={3} />
                  <path fillRule="evenodd" clipRule="evenodd" d="M110 43C112.209 43 114 44.7909 114 47V60C109.029 60 105 64.0294 105 69C105 73.9706 109.029 78 114 78V91C114 93.2091 112.209 95 110 95H30C27.7909 95 26 93.2091 26 91V78C30.9706 78 35 73.9706 35 69C35 64.0294 30.9706 60 26 60V47C26 44.7909 27.7909 43 30 43H110Z" stroke="#BDBDBD" strokeWidth={2} />
                  <path d="M50.5 47H48.5C47.6716 47 47 47.6716 47 48.5V89.5C47 90.3284 47.6716 91 48.5 91H50.5C51.3284 91 52 90.3284 52 89.5V48.5C52 47.6716 51.3284 47 50.5 47Z" fill="#E8E8E8" />
                </svg>
              <h3>No shop vouchers yet</h3>
            </div>
          )}
        </div>
        {/* Selected voucher */}
        <div className='mt-6 p-4 border-t border-gray-300'>
          <p className='text-sm'>
            {selectedVoucherId && selectedVoucher ? '1' : '0'} Voucher Selected:{' '}
            <span className='font-semibold'>
              ₫
              {selectedVoucher &&
                formatCurrency(calculateAmountOffVoucher(selectedVoucher, totalOrderBeforeApplyVoucher))}{' '}
              off
            </span>
          </p>
        </div>
      </Popover.Dropdown>
    </Popover>
  )
}
