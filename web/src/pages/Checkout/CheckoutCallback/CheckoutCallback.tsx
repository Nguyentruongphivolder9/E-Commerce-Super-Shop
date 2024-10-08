import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import cartApi from 'src/apis/cart.api'
import { orderApi } from 'src/apis/order.api'
import { voucherDepotApi } from 'src/apis/voucher.api'
import config from 'src/constants/config'
import path from 'src/constants/path'
import useQueryParams from 'src/hooks/useQueryParams'
import useQueryParamsGeneric from 'src/hooks/useQueryParamsGeneric'
import { CodParams, StripeParams, VnpReturnParams } from 'src/types/order.type'
type PaymentMethod = 'stripe' | 'vnp' | 'cod' | 'unknown'
const detectPaymentMethod = (params: VnpReturnParams | StripeParams | CodParams): PaymentMethod => {
  if ('vnp_Amount' in params && 'vnp_ResponseCode' in params) {
    return 'vnp'
  } else if ('paymentIntentId' in params && 'stripeResponseCode' in params) {
    return 'stripe'
  } else if ('paymentMethod' in params && 'codResponseCode' in params) {
    return 'cod'
  } else {
    return 'unknown'
  }
}

export default function CheckoutCallback() {
  const queryClient = useQueryClient()
  const params: VnpReturnParams | StripeParams | CodParams = useQueryParamsGeneric()
  const [responseCode, setResponseCode] = useState<string>()
  const [isSuccess, setIsSuccess] = useState(false)
  const paymentMethod = detectPaymentMethod(params)
  useEffect(() => {
    if (paymentMethod === 'stripe') {
      setResponseCode((params as StripeParams).stripeResponseCode)
    } else if (paymentMethod === 'vnp') {
      setResponseCode((params as VnpReturnParams).vnp_ResponseCode)
    } else if (paymentMethod === 'cod') {
      setResponseCode((params as CodParams).codResponseCode)
    }
  }, [paymentMethod, params])

  const { isSuccess: isVnPaySuccess } = useQuery({
    queryKey: ['VnpayReturnParams'],
    queryFn: () => orderApi.passVNpayReturnParams(params as VnpReturnParams),
    enabled: paymentMethod === 'vnp' && Object.keys(params as VnpReturnParams).length !== 0
  })

  const { isSuccess: isStripeSuccess } = useQuery({
    queryKey: ['StripeReturnParams'],
    queryFn: () => orderApi.passStripeReturnParams(params as StripeParams),
    enabled: paymentMethod === 'stripe' && Object.keys(params as StripeParams).length !== 0
  })

  useEffect(() => {
    setIsSuccess(() => {
      if (isVnPaySuccess || isStripeSuccess) {
        queryClient.invalidateQueries({ queryKey: [config.GET_LIST_CART_QUERY_KEY] })
        return true
      } else {
        return false
      }
    })
  }, [isStripeSuccess, isVnPaySuccess, queryClient])

  useEffect(() => {
    if (isSuccess || responseCode === '00') {
      queryClient.invalidateQueries({ queryKey: [config.GET_LIST_CART_QUERY_KEY] })
      setIsSuccess(false)
    }
  }, [isSuccess, responseCode, queryClient])

  return (
    <div className='h-[700px] flex justify-center items-center'>
      <div className='flex justify-center items-center w-[700px] h-[400px] bg-white shadow-[0_0_30px_rgba(0,0,0,0.2)]'>
        <div className='flex flex-col items-center justify-center'>
          <div className='mb-12 flex items-center justify-center w-[80px] h-[80px] rounded-full shadow-md bg-blue'>
            {responseCode === '00' ? (
              <svg className='fill-white w-[50px] h-[50px]' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'>
                <path d='M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z'></path>
              </svg>
            ) : (
              <svg className='fill-white w-[40px] h-[40px]' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'>
                <path d='M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z'></path>
              </svg>
            )}
          </div>
          {responseCode === '00' ? (
            <div className='flex flex-col justify-center items-center'>
              <h2 className='text-2xl font-bold mb-2'>Thank you for ordering!</h2>
              <p className='text-gray-500'>Your order will be processed within 24 hours during working days.</p>
            </div>
          ) : (
            <h2 className='text-2xl font-bold mb-2'>Your order have been cancelled</h2>
          )}
          <div className='mt-4'>
            {responseCode == '00' ? (
              <NavLink
                to={path.historyPurchase}
                className='bg-white hover:bg-gray-100 text-gray-500 font-bold py-2 px-4 rounded transition-colors ease-linear'
              >
                View Order
              </NavLink>
            ) : (
              <NavLink
                to={path.cart}
                className='bg-white hover:bg-gray-100 text-gray-500 font-bold py-2 px-4 rounded transition-colors ease-linear'
              >
                View Cart
              </NavLink>
            )}
            <NavLink
              to={'/'}
              className='bg-blue hover:bg-blue/90 text-white font-bold py-2 px-4 rounded ml-4 transition-colors ease-linear'
            >
              Continue Shopping
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  )
}
