/* eslint-disable jsx-a11y/label-has-associated-control */
import { Link, createSearchParams } from 'react-router-dom'
import Button from 'src/components/Button'
import VoucherBoxType from './components/VoucherBoxType'
import classNames from 'classnames'
import path from 'src/constants/path'
import useQueryParams from 'src/hooks/useQueryParams'
import Table from './components/Table'
import { VoucherResponse } from 'src/types/voucher.type'
import voucherApi from 'src/apis/voucher.api'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useContext, useMemo, useState } from 'react'
import { StatusVoucher } from './enums/voucherInfo.enum'
import UnderlineTabs from 'src/components/UnderlineTabs'

const voucherTimeTabs = [
  { status: 'all', label: 'all' },
  { status: 'ongoing', label: 'ongoing' },
  { status: 'upgoing', label: 'upcoming' },
  { status: 'expire', label: 'expire' }
]

export default function VoucherShop() {
  const [selectedTab, setSelectedTab] = useState(voucherTimeTabs[0].label)
  const queryParams: { status?: string } = useQueryParams()
  const status: string = queryParams.status || 'all'
  const { data } = useQuery({
    queryKey: ['vouchers'],
    queryFn: () => voucherApi.getVouchers()
  })
  // const vouchers: VoucherResponse[] = useMemo(() => data?.data.body?.content ?? [], [data?.data.body?.content])
  const filterVouchers = (allVouchers: VoucherResponse[], selectedTab: string) => {
    switch (selectedTab) {
      case 'ongoing':
        return allVouchers.filter((voucher) => voucher.status === StatusVoucher.ONGOING)
      case 'upcoming':
        return allVouchers.filter((voucher) => voucher.status === StatusVoucher.UPCOMING)
      case 'expire':
        return allVouchers.filter((voucher) => voucher.status === StatusVoucher.EXPIRE)
      case 'All':
      default:
        return allVouchers
    }
  }

  const vouchers = useMemo(() => {
    const allVouchers = data?.data.body?.content ?? []
    return filterVouchers(allVouchers, selectedTab)
  }, [data?.data.body?.content, selectedTab])
  return (
    <>
      <div className='bg-white p-5 mb-5'>
        <div className='pb-5'>
          <h2 className='text-[20px] leading-[24px]  text-[#333333]'>Create Vouchers</h2>
          <p className='text-sm text-gray-400/95'>
            Create a Shopwide Discount Code or Product Discount Code now to attract buyers.
            <Link to='' className='ml-2 text-sm text-blue'>
              Find out more
            </Link>
          </p>
        </div>
        <div className='pb-5'>
          <h2 className='text-[18px] leading-[24px] text-[#333333] mb-4'>Improve conversion rates</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4'>
            <VoucherBoxType
              linkURL={`${path.voucherShopAdd}?${createSearchParams({ voucherType: 'shop' })}`}
              title='Shop-wide vouchers'
              content='Voucher applies to all products in your Shop'
              icon={
                <svg viewBox='0 0 21 20' fill='none' xmlns='http://www.w3.org/2000/svg' className='fill-blue w-5 h-5'>
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M14.875 5.625a2.183 2.183 0 01-2.188 2.188A2.183 2.183 0 0110.5 5.624a2.183 2.183 0 01-2.187 2.188 2.183 2.183 0 01-2.187-2.188 2.183 2.183 0 01-2.188 2.187 2.179 2.179 0 01-1.83-.99 2.174 2.174 0 01-.357-1.185v-.012l.62-2.481A2.5 2.5 0 014.796 1.25h11.408a2.5 2.5 0 012.426 1.894l.62 2.48V5.638a2.177 2.177 0 01-.357 1.186 2.18 2.18 0 01-1.83.99 2.183 2.183 0 01-2.188-2.187zM3 8.933V17.5c0 .69.56 1.25 1.25 1.25h12.5c.69 0 1.25-.56 1.25-1.25V8.933a3.44 3.44 0 01-3.125-.656 3.423 3.423 0 01-2.188.786 3.423 3.423 0 01-2.187-.786 3.424 3.424 0 01-2.188.786 3.423 3.423 0 01-2.187-.786A3.44 3.44 0 013 8.933zm8.208 6.066a.579.579 0 00-.22-.483 2.675 2.675 0 00-.768-.357 7.273 7.273 0 01-.899-.358c-.758-.371-1.137-.882-1.137-1.533a1.38 1.38 0 01.28-.856c.21-.263.488-.463.804-.579a3.121 3.121 0 011.166-.208c.388-.006.772.07 1.128.225.316.134.587.357.779.642.186.281.283.612.277.95h-1.405a.709.709 0 00-.222-.557.844.844 0 00-.589-.195.967.967 0 00-.607.168.508.508 0 00-.217.422.524.524 0 00.241.41c.262.167.548.294.847.377.346.104.68.244.996.417.632.364.949.866.949 1.506a1.43 1.43 0 01-.579 1.205c-.385.292-.914.438-1.586.438a3.186 3.186 0 01-1.289-.252 1.973 1.973 0 01-.868-.7A1.834 1.834 0 018 14.658h1.414a.91.91 0 00.241.695c.162.146.426.22.791.22a.91.91 0 00.55-.152.5.5 0 00.212-.422z'
                  ></path>
                </svg>
              }
            />
            {/* <VoucherBoxType
              linkURL='#'
              title='Product Voucher'
              content='Vouchers applicable for selected products to run specific promotions'
              icon={
                <svg viewBox='0 0 21 20' fill='none' xmlns='http://www.w3.org/2000/svg' className='fill-blue w-5 h-5'>
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M13.625 4.375V5h-6.25v-.625a3.125 3.125 0 116.25 0zM3.621 5h2.504v-.625a4.375 4.375 0 118.75 0V5h2.503a1.25 1.25 0 011.245 1.138l1.128 12.5A1.25 1.25 0 0118.506 20H2.492a1.25 1.25 0 01-1.245-1.362l1.129-12.5A1.25 1.25 0 013.62 5zm7.911 8.75a.705.705 0 01.063.327.607.607 0 01-.26.514 1.11 1.11 0 01-.669.185c-.444 0-.766-.09-.963-.268a1.11 1.11 0 01-.294-.847H7.688c-.009.441.114.875.351 1.246.263.38.63.676 1.058.853.496.21 1.03.314 1.57.307.818 0 1.462-.178 1.932-.533a1.74 1.74 0 00.704-1.468c0-.779-.385-1.39-1.156-1.834a6.322 6.322 0 00-1.212-.508 3.812 3.812 0 01-1.032-.459.638.638 0 01-.294-.5.619.619 0 01.264-.513c.217-.15.477-.222.74-.205.26-.015.517.07.717.238a.864.864 0 01.27.677h1.712a2.034 2.034 0 00-.338-1.156 2.165 2.165 0 00-.949-.782 3.295 3.295 0 00-1.373-.273 3.801 3.801 0 00-1.42.253c-.385.14-.723.384-.978.704a1.68 1.68 0 00-.342 1.043c0 .793.461 1.415 1.384 1.867.355.17.72.316 1.095.437.333.094.649.24.935.434.089.07.16.16.206.262z'
                  ></path>
                </svg>
              }
            /> */}
          </div>
        </div>
        {/* <div className='pb-5'>
          <h2 className='text-[18px] leading-[24px] text-[#333333] mb-4'>Target Specific Buyer Groups</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4'>
            <VoucherBoxType
              linkURL='#'
              title='New Buyer Voucher'
              content='Shop vouchers to attract new and potential buyersShop vouchers to attract new and potential buyers'
              icon={
                <svg viewBox='0 0 21 20' fill='none' xmlns='http://www.w3.org/2000/svg' className='fill-blue w-5 h-5'>
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M14.25 3.75A3.749 3.749 0 0110.5 7.5a3.749 3.749 0 01-3.75-3.75A3.749 3.749 0 0110.5 0a3.749 3.749 0 013.75 3.75zM3 12.107C3 9.542 7.997 8.25 10.5 8.25c2.046 0 5.759.863 7.046 2.58a5 5 0 00-6.01 6.784H4.25c-.69 0-1.25-.56-1.25-1.25v-4.257zm9.654 5.507a4 4 0 106.943-3.977 4 4 0 00-6.943 3.977zm2.43-1.322c.169.128.338.225.508.292a1.7 1.7 0 00.551.099c.07 0 .137-.006.199-.019a.574.574 0 00.16-.068.307.307 0 00.112-.105.249.249 0 00.038-.155.22.22 0 00-.069-.161.604.604 0 00-.154-.13 1.491 1.491 0 00-.199-.1 4.454 4.454 0 00-.192-.074 9.181 9.181 0 01-.446-.18 1.854 1.854 0 01-.415-.26 1.311 1.311 0 01-.298-.372 1.07 1.07 0 01-.093-.546c.004-.111.029-.225.074-.34.05-.116.12-.224.211-.323.095-.099.213-.184.354-.254.144-.074.316-.124.514-.149v-.322h.434v.316c.26.025.488.087.682.186.198.095.347.186.446.273l-.459.644a1.702 1.702 0 00-.378-.18 1.46 1.46 0 00-.452-.099c-.186-.012-.32.015-.403.081-.079.066-.12.132-.124.198 0 .062.016.116.05.162a.5.5 0 00.136.123c.058.034.124.067.198.1.075.029.149.06.223.093l.08.03c.158.067.31.14.46.218.152.078.289.171.409.279.12.103.214.225.285.365.07.14.103.304.099.49a1.133 1.133 0 01-.087.39 1.06 1.06 0 01-.23.354c-.099.107-.227.198-.384.272-.157.075-.34.12-.551.137v.421h-.434v-.427a2.007 2.007 0 01-.744-.199c-.21-.111-.4-.246-.57-.403l.458-.657z'
                  ></path>
                </svg>
              }
            />
            <VoucherBoxType
              linkURL='#'
              title='Repeat Buyer Groups'
              content='Shop vouchers targeting buyers with recent purchase from the shop'
              icon={
                <svg viewBox='0 0 21 20' fill='none' xmlns='http://www.w3.org/2000/svg' className='fill-blue w-5 h-5'>
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M18.625 10a8.125 8.125 0 01-13.87 5.745l-1.326 1.326A9.969 9.969 0 0010.5 20c5.523 0 10-4.477 10-10s-4.477-10-10-10S.5 4.477.5 10a9.968 9.968 0 002.902 7.044A10 10 0 01.5 10h1.875a8.125 8.125 0 0113.87-5.745l1.326-1.326A10 10 0 0120.5 10h-1.875z'
                  ></path>
                  <path d='M16.75 3.438l1.875-1.876v3.75h-3.75l1.875-1.875zM4.25 16.563l-1.875 1.875v-3.75h3.75L4.25 16.561zM7.896 11.855c.423.32.847.563 1.27.728.424.155.883.237 1.38.248.175 0 .34-.016.495-.047.155-.041.29-.098.403-.17a.764.764 0 00.279-.264.62.62 0 00.093-.387.55.55 0 00-.17-.403 1.507 1.507 0 00-.388-.325 3.693 3.693 0 00-.496-.248 11.003 11.003 0 00-.48-.186 22.816 22.816 0 01-1.116-.45 4.634 4.634 0 01-1.038-.65 3.28 3.28 0 01-.743-.93c-.186-.371-.264-.826-.232-1.363.01-.279.072-.563.186-.852.124-.29.3-.558.526-.806.238-.248.532-.46.884-.635a3.84 3.84 0 011.286-.372v-.806h1.084v.79c.651.063 1.22.218 1.705.465.495.238.867.465 1.115.682l-1.147 1.612a4.254 4.254 0 00-.945-.45 3.648 3.648 0 00-1.13-.248c-.466-.03-.801.036-1.008.202-.196.165-.3.33-.31.496 0 .154.041.289.124.402.083.114.196.217.34.31.146.083.31.165.497.248.186.072.372.15.558.233l.2.077c.393.165.776.346 1.147.542a4.82 4.82 0 011.023.697c.3.259.537.563.713.915.175.35.258.759.247 1.224-.01.32-.082.645-.217.976-.124.32-.315.614-.573.883a3.083 3.083 0 01-.96.681c-.393.186-.853.3-1.38.341v1.054h-1.084v-1.07c-.713-.061-1.333-.226-1.86-.495a6.69 6.69 0 01-1.425-1.007l1.147-1.642z'></path>
                </svg>
              }
            />
          </div>
        </div> */}
      </div>

      <div className='bg-white'>
        <div className='p-5'>
          <div className='flex gap-2'>
            <h2 className='text-[18px] leading-[24px] text-[#333333] mb-4'>Voucher Performance</h2>
            <span className='text-sm text-gray-400'>(Data from 31-05-2024 to 07-06-2024 GMT+7)</span>
          </div>
          <div className='flex h-[110px] p-4 border rounded-md '>
            <div className='flex-grow'>
              <div className='flex items-center'>
                <span className='text-sm mr-1'>Sales</span>
                <svg xmlns='http://www.w3.org/2000/svg' className='w-4 h-4 fill-blue' viewBox='0 0 256 256'>
                  <path d='M136,180a8,8,0,1,1-8-8A8,8,0,0,1,136,180ZM128,76c-19.85,0-36,14.36-36,32v4a4,4,0,0,0,8,0v-4c0-13.23,12.56-24,28-24s28,10.77,28,24-12.56,24-28,24a4,4,0,0,0-4,4v8a4,4,0,0,0,8,0v-4.2c18-1.77,32-15.36,32-31.8C164,90.36,147.85,76,128,76Zm100,52A100,100,0,1,1,128,28,100.11,100.11,0,0,1,228,128Zm-8,0a92,92,0,1,0-92,92A92.1,92.1,0,0,0,220,128Z'></path>
                </svg>
              </div>
              <div>
                <span className='text-base mr-1'>₫</span>
                <span className='text-lg'>0</span>
              </div>
              <div className='text-xs text-gray-500'>vs Previous 7 Days 0.00 %</div>
            </div>

            <div className='h-full w-[1px] bg-gray-300'></div>

            <div className='flex-grow pl-5'>
              <div className='flex items-center'>
                <span className='text-sm mr-1'>Orders</span>
                <svg xmlns='http://www.w3.org/2000/svg' className='w-4 h-4 fill-blue' viewBox='0 0 256 256'>
                  <path d='M136,180a8,8,0,1,1-8-8A8,8,0,0,1,136,180ZM128,76c-19.85,0-36,14.36-36,32v4a4,4,0,0,0,8,0v-4c0-13.23,12.56-24,28-24s28,10.77,28,24-12.56,24-28,24a4,4,0,0,0-4,4v8a4,4,0,0,0,8,0v-4.2c18-1.77,32-15.36,32-31.8C164,90.36,147.85,76,128,76Zm100,52A100,100,0,1,1,128,28,100.11,100.11,0,0,1,228,128Zm-8,0a92,92,0,1,0-92,92A92.1,92.1,0,0,0,220,128Z'></path>
                </svg>
              </div>
              <div>
                <span className='text-lg'>0</span>
              </div>
              <div className='text-xs text-gray-500'>vs Previous 7 Days 0.00 %</div>
            </div>

            <div className='h-full w-[1px] bg-gray-300'></div>

            <div className='flex-grow pl-5'>
              <div className='flex items-center'>
                <span className='text-sm mr-1'>Usage Rate</span>
                <svg xmlns='http://www.w3.org/2000/svg' className='w-4 h-4 fill-blue' viewBox='0 0 256 256'>
                  <path d='M136,180a8,8,0,1,1-8-8A8,8,0,0,1,136,180ZM128,76c-19.85,0-36,14.36-36,32v4a4,4,0,0,0,8,0v-4c0-13.23,12.56-24,28-24s28,10.77,28,24-12.56,24-28,24a4,4,0,0,0-4,4v8a4,4,0,0,0,8,0v-4.2c18-1.77,32-15.36,32-31.8C164,90.36,147.85,76,128,76Zm100,52A100,100,0,1,1,128,28,100.11,100.11,0,0,1,228,128Zm-8,0a92,92,0,1,0-92,92A92.1,92.1,0,0,0,220,128Z'></path>
                </svg>
              </div>
              <div>
                <span className='text-lg'>0</span>
              </div>
              <div className='text-xs text-gray-500'>vs Previous 7 Days 0.00 %</div>
            </div>

            <div className='h-full w-[1px] bg-gray-300'></div>

            <div className='flex-grow pl-5'>
              <div className='flex items-center'>
                <span className='text-sm mr-1'>Buyers</span>
                <svg xmlns='http://www.w3.org/2000/svg' className='w-4 h-4 fill-blue' viewBox='0 0 256 256'>
                  <path d='M136,180a8,8,0,1,1-8-8A8,8,0,0,1,136,180ZM128,76c-19.85,0-36,14.36-36,32v4a4,4,0,0,0,8,0v-4c0-13.23,12.56-24,28-24s28,10.77,28,24-12.56,24-28,24a4,4,0,0,0-4,4v8a4,4,0,0,0,8,0v-4.2c18-1.77,32-15.36,32-31.8C164,90.36,147.85,76,128,76Zm100,52A100,100,0,1,1,128,28,100.11,100.11,0,0,1,228,128Zm-8,0a92,92,0,1,0-92,92A92.1,92.1,0,0,0,220,128Z'></path>
                </svg>
              </div>
              <div>
                <span className='text-lg'>0</span>
              </div>
              <div className='text-xs text-gray-500'>vs Previous 7 Days 0.00 %</div>
            </div>
          </div>
        </div>

        <div className='p-5 mb-10'>
          <h2 className='text-[18px] leading-[24px] text-[#333333] mb-4'>Voucher List</h2>
          <div className='flex border-b border-b-gray-300'>
            <UnderlineTabs
              tabs={voucherTimeTabs.map((ele) => ele)}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
          </div>
          <div className='mt-6'>
            <div className='flex items-center'>
              <label className='text-sm mr-4 '>Search</label>
              <div className='h-[1.875rem] mr-6 rounded-sm'>
                <select
                  name=''
                  className='h-full w-[140px] px-3 text-sm border hover:border-gray-500 focus:outline-none focus:border-gray-400'
                >
                  <option value='name'>Voucher Name</option>
                  <option value='code'>Voucher Code</option>
                </select>
                <input
                  type='text'
                  placeholder='Input'
                  className='h-full px-3 text-sm border border-l-gray-300 hover:border-gray-500 focus:outline-none focus:border-gray-400'
                />
              </div>
              <Button className='border border-blue text-blue hover:bg-[#f4fbff] text-sm py-1 px-4 min-w-[76px] min-h-[32px] rounded-[4px]'>
                Search
              </Button>
            </div>
          </div>

          <Table data={vouchers} />
        </div>
      </div>
    </>
  )
}
