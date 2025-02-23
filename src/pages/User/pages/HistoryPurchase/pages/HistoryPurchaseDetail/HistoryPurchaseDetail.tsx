import { useQuery } from '@tanstack/react-query'
import { parseISO, format } from 'date-fns'
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { orderApi } from 'src/apis/order.api'
import StyledStepperPurchase from 'src/components/StyledStepperPurchase'

import path from 'src/constants/path'
import ButtonOrderStatus from '../../ButtonOrderStatus/ButtonOrderStatus'
import { OrderActionStatus, OrderResponse, OrderStatus } from 'src/types/order.type'
import { formatCurrency } from 'src/utils/utils'
import config from 'src/constants/config'
import { calculateAmountOffVoucher } from '../../../Cart/utilsCart/utils.cart'

export default function HistoryPurchaseDetail() {
  const { orderId } = useParams()
  const [statusActionTypeModal, setStatusActionTypeModal] = useState<OrderActionStatus>('')
  const { data } = useQuery({
    queryKey: ['HistoryPurchaseDetailForUser'],
    queryFn: () => orderApi.getOrder(orderId as string),
    enabled: orderId !== undefined
  })
  const order = data?.data.body
  const isCompletelyRated = order?.isRating

  if (!order) return null
  return (
    <div>
      <div className='flex justify-between items-center bg-white p-3 rounded-sm'>
        <Link to={path.historyPurchase}>
          <div className='flex items-center'>
            <svg className='fill-gray-400 w-6 h-6' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'>
              <path d='M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z'></path>
            </svg>
            <span className='text-base'>Back</span>
          </div>
        </Link>
        <div className='flex items-center'>
          <span className='uppercase'>ORDER ID. {order?.id?.split('-').join('_')}</span>
          <span className='inline-block w-[2px] h-4 bg-gray-300 mx-3' />
          <span className='text-[#ee4d2d] uppercase'>{order?.orderStatus}</span>
        </div>
      </div>
      <div className='mt-[1px] py-10 bg-white p-3'>
        <div className='px-16'>
          <StyledStepperPurchase orderStatus={order.orderStatus} isRating={false} orientation='horizontal' />
          <div className='flex justify-between items-center -mx-16 mt-5'>
            <div className='flex flex-col justify-center items-center w-[208px]'>
              <p>Order Placed</p>
              <p className='text-gray-400'>{format(parseISO(order?.updatedAt), 'dd-MM-yyyy HH:mm')}</p>
            </div>
            <div className='flex flex-col justify-center items-center w-[208px]'>
              <p className='line-clamp-2'>Payment Info Confirmed</p>
              <p className='text-gray-400'>{format(parseISO(order?.updatedAt), 'dd-MM-yyyy HH:mm')}</p>
            </div>
            <div className='flex flex-col justify-center items-center w-[208px]'>
              <p>Shipped out</p>
              <p className='text-gray-400'>{format(parseISO(order?.updatedAt), 'dd-MM-yyyy HH:mm')}</p>
            </div>
            <div className='flex flex-col justify-center items-center w-[208px]'>
              <p>Order Received</p>
              <p className='text-gray-400'>{format(parseISO(order?.updatedAt), 'dd-MM-yyyy HH:mm')}</p>
            </div>
            <div className='flex flex-col justify-center items-center w-[208px]'>
              <p>{order.orderStatus === 'completed' && order.isRating ? 'Order Completed' : 'To Rate'}</p>
              <p className='text-gray-400'>{format(parseISO(order?.updatedAt), 'dd-MM-yyyy HH:mm')}</p>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-[1px] px-3 py-7 flex justify-end items-center gap-x-4 bg-white'>
        <ButtonOrderStatus
          statusTypeModal={statusActionTypeModal}
          setStatusTypeModal={setStatusActionTypeModal}
          status={(order?.orderStatus as OrderStatus) || ''}
          order={order as OrderResponse}
        />
      </div>
      <div className='bg-white mt-[1px]'>
        <div className='grid grid-cols-10 p-6'>
          <div className='col-span-3'>
            <h1 className='text-2xl'>Delivery address</h1>
            <div className='mt-4 space-y-2 text-gray-500'>
              <p>{order?.recipientName}</p>
              <p>{order?.recipientPhone}</p>
              <p>{order?.recipientAddress}</p>
            </div>
          </div>
          <div className='col-span-7 mt-5'>{/* <TimeLinePurchase /> */}</div>
        </div>
      </div>

      <div key={order.id} className='mt-4 py-4 px-4 bg-white'>
        <div className='flex justify-between'>
          <div className='flex gap-x-4 items-center'>
            <h3 className='text-lg font-bold'>{order.shopInfomation.userName}</h3>
            <button className='px-3 py-1 rounded-sm bg-sky-200'>Chat</button>
            <button className='px-3 py-1 rounded-sm bg-sky-200'>View Shop</button>
          </div>
        </div>
        <div className='mt-4 border-t border-gray-200'>
          {order.orderItems.map((orderItem) => (
            <Link
              to={path.historyPurchaseDetail.split(':')[0] + `${order.id}`}
              key={orderItem.id}
              className='flex items-center justify-between space-x-4  py-2'
            >
              <img
                src={`${config.awsURL}products/${orderItem.imageUrl}`}
                alt='Sản phẩm'
                className='w-16 h-16 object-cover'
              />
              <div className='flex-1 mr-auto space-y-1'>
                <h4 className='text-lg'>{orderItem.productName}</h4>
                <p className='flex items-center justify-start text-gray-500'>{orderItem.variantName}</p>
                <p>x{orderItem.quantity}</p>
                <button className='py-[2px] px-[4px] text-gray-600 border border-green-400 text-xs'>Free return</button>
              </div>
              <p className='text-right'>₫{orderItem.price}</p>
            </Link>
          ))}
        </div>
      </div>
      <div className='bg-white border-t border-gray-300'>
        <div className='flex justify-end items-center border-b border-dashed border-gray-200 px-6 text-right'>
          <div className='text-xs py-[13px] px-[10px]'>
            <span>Merchandise Subtotal</span>
          </div>
          <div className='w-60 border-l border-dashed border-gray-200 py-[13px] break-words'>
            <span>
              ₫{formatCurrency(order.orderTotal + calculateAmountOffVoucher(order.voucherUsed, order.orderTotal))}
            </span>
          </div>
        </div>
        <div className='flex justify-end items-center border-b border-dashed border-gray-200 px-6 text-right'>
          <div className='text-xs py-[13px] px-[10px]'>
            <span>Shopee Voucher Applied</span>
          </div>
          <div className='w-60 border-l border-dashed border-gray-200 py-[13px] break-words'>
            <span>-₫{formatCurrency(calculateAmountOffVoucher(order.voucherUsed, order.orderTotal))}</span>
          </div>
        </div>
        <div className='flex justify-end items-center px-6 text-right'>
          <div className='text-xs py-[13px] px-[10px]'>
            <span>Order Total</span>
          </div>
          <div className='w-60 border-l border-dashed border-gray-200 py-[13px] break-words'>
            <span className='text-xl text-[#ee4d2d]'>₫{formatCurrency(order.orderTotal)}</span>
          </div>
        </div>
        <div className='flex justify-start py-2 items-center border border-yellow-300 px-6 text-xs'>
          Please pay <span className='text-[#ee4d2d] mx-1'>₫{formatCurrency(order.orderTotal)}</span> upon delivery.
        </div>
        <div className='flex justify-end items-center px-6 text-right'>
          <div className='text-xs py-[13px] px-[10px]'>
            <span>Payment Method</span>
          </div>
          <div className='w-60 border-l border-dashed border-gray-200 py-[13px] break-words'>
            <span>{order.paymentMethod === 'cod' ? 'Cash on delivery' : order.paymentMethod}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
