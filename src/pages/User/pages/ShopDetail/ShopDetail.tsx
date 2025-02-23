import { Pagination } from '@mantine/core'
import SortProductList from './SortProductList'
import AsideFilter from './AsideFilter'
import useQueryConfig, { QueryConfig } from 'src/hooks/useQueryConfig'
import useQueryParams from 'src/hooks/useQueryParams'
import { createSearchParams, useNavigate, useParams } from 'react-router-dom'
import {
  calculatePercent,
  formatNumbertoSocialStyle,
  generateURLAvatar,
  getIdFromCategoryNameId,
  timeAgo
} from 'src/utils/utils'
import { useQuery } from '@tanstack/react-query'
import productApi from 'src/apis/product.api'
import path from 'src/constants/path'
import Product from 'src/components/Product'
import { ParamsConfig } from 'src/types/utils.type'
import ListProductDecoration from './ListProductDecoration'

export default function ShopDetail() {
  const navigate = useNavigate()
  const queryParams: QueryConfig = useQueryParams()
  const queryConfig = useQueryConfig()
  queryConfig.limit = '60'
  const { nameId } = useParams()

  const { data: shopDetailData } = useQuery({
    queryKey: ['getShopDetail', nameId],
    queryFn: () => productApi.getShopDetail(nameId!)
  })

  console.log(shopDetailData)

  const { data: productsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['getListProductsShopDetail', queryParams, nameId],
    queryFn: () => {
      return productApi.getListProductsShopDetail(nameId!, queryConfig as ParamsConfig)
    }
  })
  const productsRes = productsData?.data.body
  const shopDetailRes = shopDetailData?.data.body
  const shopInfo = shopDetailRes?.shopInfo

  // console.log(productsRes)

  return (
    <div className='bg-[#f6f6f6]'>
      <div className='bg-white py-5 h-48'>
        <div className='container h-full'>
          <div className='flex items-center h-full'>
            <div className='h-full flex w-96 relative rounded-md overflow-hidden'>
              <div
                className='absolute top-0 left-0 w-full h-full bg-cover bg-center blur-sm'
                style={{
                  backgroundImage: `url(${generateURLAvatar(shopInfo?.account.avatarUrl ?? 'https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/shopmicrofe/dc2a8ae5803b2531c9a5.jpg')})`
                }}
              />
              <div className='absolute top-0 left-0 w-full h-full bg-[#00000099]'></div>
              <div className='z-20 h-full w-full p-3 bg-transparent flex flex-col justify-center gap-3'>
                <div className='flex h-20 gap-3'>
                  <div className='h-20 w-20'>
                    <div className='h-full w-full border rounded-full overflow-hidden'>
                      <img
                        className='w-full h-full object-cover'
                        src={generateURLAvatar(
                          shopInfo?.account.avatarUrl ??
                            'https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/shopmicrofe/dc2a8ae5803b2531c9a5.jpg'
                        )}
                        alt=''
                      />
                    </div>
                  </div>
                  <div className='h-auto flex-1 text-xl text-white line-clamp-2'>{shopInfo?.account.userName}</div>
                </div>

                <div className='h-6 w-full flex gap-4'>
                  <button className='text-white w-1/2 gap-2 rounded-sm flex justify-center items-center border border-white'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='size-4'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
                    </svg>
                    <span className='uppercase text-xs'>FOLLOW</span>
                  </button>

                  <button className='text-white w-1/2 gap-2 rounded-sm flex justify-center items-center border border-white'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.5}
                      stroke='currentColor'
                      className='size-4'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155'
                      />
                    </svg>

                    <span className='uppercase text-xs'>Chat</span>
                  </button>
                </div>
              </div>
            </div>

            <div className='h-full grid grid-cols-2 flex-1 py-[10px] pl-8'>
              <div className='flex gap-2'>
                <svg
                  enableBackground='new 0 0 15 15'
                  viewBox='0 0 15 15'
                  x={0}
                  y={0}
                  strokeWidth={0}
                  className='w-4 h-4 text-[#333333]'
                >
                  <path d='m13 1.9c-.2-.5-.8-1-1.4-1h-8.4c-.6.1-1.2.5-1.4 1l-1.4 4.3c0 .8.3 1.6.9 2.1v4.8c0 .6.5 1 1.1 1h10.2c.6 0 1.1-.5 1.1-1v-4.6c.6-.4.9-1.2.9-2.3zm-11.4 3.4 1-3c .1-.2.4-.4.6-.4h8.3c.3 0 .5.2.6.4l1 3zm .6 3.5h.4c.7 0 1.4-.3 1.8-.8.4.5.9.8 1.5.8.7 0 1.3-.5 1.5-.8.2.3.8.8 1.5.8.6 0 1.1-.3 1.5-.8.4.5 1.1.8 1.7.8h.4v3.9c0 .1 0 .2-.1.3s-.2.1-.3.1h-9.5c-.1 0-.2 0-.3-.1s-.1-.2-.1-.3zm8.8-1.7h-1v .1s0 .3-.2.6c-.2.1-.5.2-.9.2-.3 0-.6-.1-.8-.3-.2-.3-.2-.6-.2-.6v-.1h-1v .1s0 .3-.2.5c-.2.3-.5.4-.8.4-1 0-1-.8-1-.8h-1c0 .8-.7.8-1.3.8s-1.1-1-1.2-1.7h12.1c0 .2-.1.9-.5 1.4-.2.2-.5.3-.8.3-1.2 0-1.2-.8-1.2-.9z' />
                </svg>

                <div className='text-sm flex gap-1'>
                  <span className='text-[#333333]'>Products:</span>
                  <span className='text-blue'>{shopInfo?.productTotal}</span>
                </div>
              </div>
              <div className='flex gap-2'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='size-5 text-[#333333]'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z'
                  />
                </svg>

                <div className='text-sm flex gap-1'>
                  <span className='text-[#333333]'>Followers:</span>
                  <span className='text-blue'>{formatNumbertoSocialStyle(shopInfo?.followerTotal ?? 0)}</span>
                </div>
              </div>
              <div className='flex gap-2'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='size-5 text-[#333333]'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z'
                  />
                </svg>

                <div className='text-sm flex gap-1'>
                  <span className='text-[#333333]'>Following:</span>
                  <span className='text-blue'>{formatNumbertoSocialStyle(shopInfo?.followingTotal ?? 0)}</span>
                </div>
              </div>
              <div className='flex gap-2'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='size-5 text-[#333333]'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z'
                  />
                </svg>

                <div className='text-sm flex gap-1'>
                  <span className='text-[#333333]'>Rating:</span>
                  <span className='text-blue'>
                    {shopInfo?.ratingStar ?? 0} ({formatNumbertoSocialStyle(shopInfo?.ratingTotal ?? 0)} Rating)
                  </span>
                </div>
              </div>
              <div className='flex gap-2'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='size-4'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z'
                  />
                </svg>

                <div className='text-sm flex gap-1'>
                  <span className='text-[#333333]'>Chat Performance:</span>
                  <span className='text-blue'>
                    {calculatePercent(shopInfo?.ratingResponse ?? 0, shopInfo?.ratingTotal ?? 0)}% (Within Hours)
                  </span>
                </div>
              </div>
              <div className='flex gap-2'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='size-5'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z'
                  />
                </svg>

                <div className='text-sm flex gap-1'>
                  <span className='text-[#333333]'>Joined:</span>
                  <span className='text-blue'>{timeAgo(shopInfo?.joinedDate ?? Date.now().toString())}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-5'>
        <div className='container'>
          <div className='bg-transparent  pb-5'>
            <div className='px-1 flex items-center justify-between text-[#333333] h-14'>
              <div className='text-xl font-bold text-blue uppercase'>Top products</div>
              {/* <Link to={'#'} className='text-sm font-medium text-blue mr-4'>
              View all
            </Link> */}
            </div>
            <ListProductDecoration listProducts={shopDetailRes?.topSales ?? []} />
          </div>

          {shopDetailRes &&
            shopDetailRes.categoryOfShopDecoration.length > 0 &&
            shopDetailRes.categoryOfShopDecoration.map((item, index) => (
              <div className='bg-transparent  pb-5' key={index}>
                <div className='px-1 flex items-center justify-between text-[#333333] h-14'>
                  <div className='text-xl font-medium text-[#999999] uppercase'>{item.name}</div>
                  {/* <Link to={'#'} className='text-sm font-medium text-blue mr-4'>
              View all
            </Link> */}
                </div>
                <ListProductDecoration listProducts={item.listProducts ?? []} />
              </div>
            ))}

          <div className='grid grid-cols-11 gap-6 mt-4'>
            <div className='col-span-2'>
              <AsideFilter
                selectedCategory={queryConfig.category ?? 'all'}
                queryConfig={queryConfig}
                categories={shopDetailRes?.categoryOfShop ?? []}
                pathCurrent={`${path.shopDetail}/${nameId}`}
              />
            </div>
            {isLoadingProducts ? (
              <div className='col-span-9 flex items-center justify-center h-96'>
                <div className='w-16 h-16 border-8 border-dashed rounded-full animate-spin border-blue-600'></div>
              </div>
            ) : (
              <div className='col-span-9'>
                <SortProductList
                  path={`${path.shopDetail}/${nameId}`}
                  queryConfig={queryConfig}
                  pageSize={Number(productsRes?.totalPages)}
                />
                <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 '>
                  {productsRes?.listProducts.map((product, index) => (
                    <div key={index} className='col-span-1'>
                      <Product product={product} />
                    </div>
                  ))}
                </div>
                <div className='mt-4 flex items-center justify-center'>
                  <Pagination
                    onChange={(value) => {
                      navigate({
                        pathname: `${path.shopDetail}/${nameId}`,
                        search: createSearchParams({
                          ...queryConfig,
                          page: value.toString()
                        }).toString()
                      })
                    }}
                    total={Number(productsRes?.totalPages)}
                    siblings={1}
                    defaultValue={queryConfig.page ? Number.parseInt(queryConfig.page) : 1}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
