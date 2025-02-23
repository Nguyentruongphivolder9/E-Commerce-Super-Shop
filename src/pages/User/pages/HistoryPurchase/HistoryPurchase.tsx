import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { Link, createSearchParams } from 'react-router-dom'
import { orderApi } from 'src/apis/order.api'
import path from 'src/constants/path'
import useQueryParams from 'src/hooks/useQueryParams'
import { OrderActionStatus, OrderResponse, OrderStatus } from 'src/types/order.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'
import ButtonOrderStatus from './ButtonOrderStatus/ButtonOrderStatus'
import config from 'src/constants/config'
import { parseISO } from 'date-fns'
import { useEffect, useState } from 'react'
import useQueryConfig, { QueryConfig } from 'src/hooks/useQueryConfig'
import UnderlineTabs from 'src/components/UnderlineTabs'

const statusTabs = [
  { url: '', label: 'all' },
  { url: path.historyPurchase + '?status=pending', label: 'pending' },
  { url: path.historyPurchase + '?status=delivering', label: 'delivering' },
  { url: path.historyPurchase + '?status=completed', label: 'completed' },
  { url: path.historyPurchase + '?status=cancelled', label: 'cancelled' },
  { url: path.historyPurchase + '?status=refunded', label: 'refunded' }
]
const purchaseTabs = [
  { status: '', name: 'All' },
  { status: 'confirmed', name: 'To Confirm' },
  { status: 'delivered', name: 'To Delivery' },
  { status: 'completed', name: 'Completed' },
  { status: 'cancelled', name: 'Cancelled' },
  { status: 'refunded', name: 'Return/Refund' }
]
export default function HistoryPurchase() {
  const queryConfig = useQueryConfig()
  const [selectedTab, setSelectedTab] = useState('all')
  const [statusActionTypeModal, setStatusActionTypeModal] = useState<OrderActionStatus>('')
  const { data } = useQuery({
    queryKey: ['OrdersByAccountId', queryConfig],
    queryFn: () => orderApi.getOrders(queryConfig as QueryConfig)
  })
  const orders = data?.data.body

  useEffect(() => {}, [queryConfig])

  const getTypeStatusModal = (value: OrderActionStatus) => {
    setStatusActionTypeModal(value)
  }

  return (
    <div className='rounded-md mx-auto'>
      <div className='w-full sticky top-0 flex rounded-t-sm shadow-sm bg-white'>
        <UnderlineTabs selectedTab={selectedTab} tabs={statusTabs} setSelectedTab={setSelectedTab} isSpacingEvenly />
      </div>
      <div className='mt-4 flex items-center bg-gray-100 px-3'>
        <svg
          className='w-8 h-8 pr-3 peer-has-[:focus]:fill-gray-200 fill-black'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 256 256'
        >
          <path d='M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z'></path>
        </svg>
        <input
          type='text'
          className='peer w-full bg-gray-100 text-black py-3 outline-none'
          placeholder='You can search by Seller Name, Order Id or Product Name'
        />
      </div>
      {orders &&
        orders
          .slice()
          .sort((a, b) => parseISO(a.updatedAt).getTime() - parseISO(b.updatedAt).getTime())
          .map((order) => (
            <div key={order.id} className='my-4 border border-gray-200 rounded-md py-4 px-8 bg-white'>
              <div className='flex justify-between'>
                <div className='flex gap-x-4 items-center'>
                  <h3 className='text-lg font-bold'>{order.shopInfomation.userName}</h3>
                  <button className='px-3 py-1 rounded-sm bg-sky-200'>Chat</button>
                  <button className='px-3 py-1 rounded-sm bg-sky-200'>View Shop</button>
                </div>
                <div>
                  {/* <span className='text-blue/70'>Delivery successful | </span> */}
                  <span className='text-[#ee4d2d] uppercase'>{order.orderStatus}</span>
                </div>
              </div>
              <div className='mt-4 border-t border-gray-200'>
                {order.orderItems.map((orderItem) => (
                  <Link
                    to={path.historyPurchaseDetail.split(':')[0] + `${order.id}`}
                    key={orderItem.id}
                    className='flex items-center justify-between space-x-4 border-b border-gray-200 py-2'
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
                      <button className='py-[2px] px-[4px] text-gray-600 border border-green-400 text-xs'>
                        Free return
                      </button>
                    </div>
                    <p className='text-right'>₫{orderItem.price}</p>
                  </Link>
                ))}
              </div>
              <div className='bg-[#fffefb]'>
                <div className='mt-4'>
                  <p className='text-right text-lg'>Order Total: ₫34.000</p>
                </div>
                <div className='mt-4 flex justify-end items-center gap-x-4'>
                  <ButtonOrderStatus
                    statusTypeModal={statusActionTypeModal}
                    setStatusTypeModal={setStatusActionTypeModal}
                    status={order.orderStatus as OrderStatus}
                    order={order as OrderResponse}
                  />
                </div>
              </div>
            </div>
          ))}
    </div>
  )
}
