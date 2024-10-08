import { Spoiler } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { format, parseISO } from 'date-fns'
import { useRef, useState } from 'react'
import { orderApi } from 'src/apis/order.api'
import UnderlineTabs from 'src/components/UnderlineTabs'
import { formatCurrency } from 'src/utils/utils'
import { calculateMaxheightForSpoiler } from '../utils/ultils'
import config from 'src/constants/config'
import RefundOrderShopDetailModal from '../RefundOrderShopDetailModal/RefundOrderShopDetailModal'
import path from 'src/constants/path'
import useQueryConfig, { QueryConfig } from 'src/hooks/useQueryConfig'

const MAX_QTY_TO_DISPLAY = 2
const statusTabs = [
  { url: '', label: 'all' },
  { url: path.returnOrderShop + '?status=processing', label: 'processing' },
  { url: path.returnOrderShop + '?status=rejected', label: 'rejected' },
  { url: path.returnOrderShop + '?status=done', label: 'done' }
]

export default function RefundOrderShop() {
  const queryConfig = useQueryConfig()
  const [selectedTab, setSelectedTab] = useState('all')
  const actualWidthRefSpoiler = useRef<HTMLDivElement | null>(null)
  const actualWidthRefEachItem = useRef<HTMLDivElement | null>(null)
  const { data } = useQuery({
    queryKey: ['RefundOrdersByShopId', queryConfig],
    queryFn: () => orderApi.getRefundOrderByShopPagination(queryConfig as QueryConfig)
  })
  const refunds = data?.data.body?.content
  console.log(queryConfig)
  return (
    <div className='bg-white rounded-md'>
      <div className='bg-white shadow-md p-4'>
        <div className='flex justify-between items-center mb-4'>
          <div>
            <h2 className='text-xl font-semibold'>Refund/Return</h2>
          </div>
          <div>
            <button className='px-4 py-2 bg-blue-600 text-white rounded-md'>Export</button>
            <button className='ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md'>Export History</button>
          </div>
        </div>
        {/* Tabs */}
        <div className='flex border-b border-b-gray-300 mb-4'>
          <UnderlineTabs selectedTab={selectedTab} tabs={statusTabs} setSelectedTab={setSelectedTab} />
        </div>

        {/* Filter Section */}
        {/* <div className='flex items-center rounded-md'>
          <div className='flex items-center gap-x-2 w-1/2'>
            <Select
              size='sm'
              placeholder='Select reason'
              searchable
              data={allowableSearch}
              allowDeselect={false}
              comboboxProps={{ transitionProps: { transition: 'scale-y', duration: 200 } }}
              style={{ flexShrink: 0 }}
              nothingFoundMessage='Nothing found...'
              value={searchTypeValue ? searchTypeValue : ''}
              onChange={(value) => setSearchTypeValue(value || '')}
            />
            <TextInput
              className='w-full'
              size='sm'
              onChange={(e) => {
                setSearchValue(e.target.value)
              }}
              value={searchValue}
              placeholder={`Input ${
                searchTypeValue === allowableSearch[0].value
                  ? 'Order ID'
                  : searchTypeValue === allowableSearch[1].value
                    ? 'Buyer Name'
                    : searchTypeValue === allowableSearch[2].value
                      ? 'Product Name'
                      : ''
              }`}
            />
          </div>
          <div className='ml-6'>
            <button
              onClick={handelSearchAndFilter}
              className='text-blue text-sm px-4 py-1 border-[1px] rounded-sm border-blue'
            >
              Apply
            </button>
          </div>
        </div> */}
      </div>
      {/* Orders List */}
      <div className=''>
        <div className='bg-white shadow-md p-4'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-lg font-semibold'>
              {refunds?.length || 0} {refunds && refunds?.length > 1 ? 'Refunds' : 'Refund'}
            </h3>
          </div>
          {/* Order Item */}
          <div className='min-w-[1000px]'>
            <div className='grid grid-cols-12 rounded-sm bg-gray-100 py-3 px-9 text-sm capitalize text-gray-500 shadow'>
              <div className='col-span-5'>
                <div className='flex items-center'>
                  <div className='flex flex-shrink-0 items-center justify-center pr-3'></div>
                  <div className='flex-grow text-black'>Product</div>
                </div>
              </div>
              <div className='col-span-7'>
                <div className='grid grid-cols-7 text-center'>
                  <div className='col-span-1'>Total Amount</div>
                  <div className='col-span-2'>Status</div>
                  <div className='col-span-2'>Refund date</div>
                  <div className='col-span-2'>Actions</div>
                </div>
              </div>
            </div>

            {refunds &&
              refunds.length > 0 &&
              refunds.map((refund, indexShop) => (
                <div className='bg-white my-4 border border-gray-200 rounded-sm' key={refund.id}>
                  <div className='flex items-center justify-between gap-x-3 px-4 py-3 border-b  border-gray-200'>
                    <div className='flex items-center gap-x-2'>
                      <img
                        src={refund && refund.user.avatarUrl}
                        alt='avatar'
                        className='w-8 h-8 rounded-full object-cover'
                      />
                      <p className='text-sm'>{refund.user.userName}</p>
                      {/* chat icon */}
                      <svg className='w-6 h-6 fill-blue' viewBox='0 0 256 256'>
                        <path d='M216,80H184V48a16,16,0,0,0-16-16H40A16,16,0,0,0,24,48V176a8,8,0,0,0,13,6.22L72,154V184a16,16,0,0,0,16,16h93.59L219,230.22a8,8,0,0,0,5,1.78,8,8,0,0,0,8-8V96A16,16,0,0,0,216,80ZM66.55,137.78,40,159.25V48H168v88H71.58A8,8,0,0,0,66.55,137.78ZM216,207.25l-26.55-21.47a8,8,0,0,0-5-1.78H88V152h80a16,16,0,0,0,16-16V96h32Z'></path>
                      </svg>
                    </div>
                    <div className='text-sm'>Refund ID: {refund.id?.split('-').join('_').toLocaleUpperCase()}</div>
                  </div>

                  <Spoiler
                    maxHeight={
                      actualWidthRefSpoiler.current && actualWidthRefEachItem.current
                        ? calculateMaxheightForSpoiler(
                            actualWidthRefSpoiler.current.offsetHeight,
                            actualWidthRefEachItem.current.offsetHeight,
                            MAX_QTY_TO_DISPLAY
                          )
                        : 200
                    }
                    showLabel={`View ${refund.refundItems.length - MAX_QTY_TO_DISPLAY} more item(s)`}
                    hideLabel='Hide details'
                    styles={{
                      control: {
                        color: 'gray',
                        fontSize: '14px',
                        marginLeft: '165px'
                      }
                    }}
                  >
                    <div className='totalEntireWidthForSpoilerIncluedFullItems' ref={actualWidthRefSpoiler}>
                      <div className={`${refund.refundItems.length > 1 ? 'rounded-sm' : 'px-5'}`}>
                        {refund.refundItems.map((item, indexOrderItem) => (
                          <div key={item.id} ref={actualWidthRefEachItem}>
                            <div className='px-4 grid grid-cols-12 items-center rounded-sm bg-white text-center text-sm text-gray-500'>
                              <div className='col-span-5 border-r border-gray-300 py-2'>
                                <div className='flex-grow'>
                                  <div className='flex'>
                                    <div className='h-20 w-20 flex-shrink-0'>
                                      <img
                                        className='h-full w-full object-cover'
                                        alt={item.orderItem.imageUrl}
                                        src={`${config.awsURL}products/${item.orderItem.imageUrl}`}
                                      />
                                    </div>
                                    <div className='flex-1'>
                                      <div className='w-full flex items-center flex-row h-full'>
                                        <div className='w-7/12 pt-[5px] pl-[10px] pr-4'>
                                          <div className='line-clamp-3 text-[#000000DE] text-left'>
                                            <p>{item.orderItem.productName}</p>
                                            <p className='text-gray-400'>Variant: {item.orderItem.variantName}</p>
                                          </div>
                                        </div>
                                        <div className='w-5/12 flex items-center justify-center h-full'>
                                          <p>x{item.refundQuantity}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className='col-span-7 h-full'>
                                <div className='grid grid-cols-7 items-center h-full'>
                                  <div className='col-span-1 h-full'>
                                    <div className='relative h-full flex items-center justify-center'>
                                      <span className='absolute z-10 top-full -translate-y-1/2 ml-3 text-[#000000DE]'>
                                        {indexOrderItem >= 1 ? '' : '₫' + formatCurrency(refund.amount)}
                                      </span>
                                    </div>
                                  </div>
                                  <div className='col-span-2 h-full'>
                                    <div className='relative h-full flex items-center justify-center'>
                                      <span className='absolute z-10 top-full -translate-y-1/2 capitalize'>
                                        {indexOrderItem >= 1 ? '' : refund.status}
                                      </span>
                                    </div>
                                  </div>
                                  <div className='col-span-2 h-full'>
                                    <div className='relative h-full flex items-center justify-center'>
                                      <span className='absolute z-10 top-full -translate-y-1/2'>
                                        {indexOrderItem >= 1
                                          ? ''
                                          : format(parseISO(refund.refundDate), 'dd/MM/yyyy, HH:mm')}
                                      </span>
                                    </div>
                                  </div>
                                  <div className='col-span-2 h-full'>
                                    <div className='relative h-full flex items-center justify-center'>
                                      {indexOrderItem >= 1 ? (
                                        ''
                                      ) : (
                                        <div className='absolute z-10 top-full -translate-y-1/2 flex flex-col gap-y-3 justify-center'>
                                          <RefundOrderShopDetailModal refundId={refund.id as string} />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* {indexCartItem < order.orderItems.length - 1 && (
                        <div className='h-[1px] mr-5 ml-10 bg-gray-200'></div>
                      )} */}
                          </div>
                        ))}
                      </div>
                    </div>
                  </Spoiler>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
