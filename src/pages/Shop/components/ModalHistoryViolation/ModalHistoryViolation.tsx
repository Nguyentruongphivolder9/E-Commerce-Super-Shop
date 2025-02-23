import { Modal, Pagination } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import violationApi from 'src/apis/violation.api'
import Button from 'src/components/Button'
import NoData from 'src/components/NoData'
import config from 'src/constants/config'
import { order, sortBy } from 'src/constants/product'
import statusProduct from 'src/constants/status'
import { ParamsConfig } from 'src/types/utils.type'
import {
  calculateFromToPrice,
  calculateTotalStockQuantity,
  formatCurrency,
  formatNumbertoSocialStyle,
  removeEmptyParams
} from 'src/utils/utils'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function ModalHistoryViolation({ isOpen, onClose }: Props) {
  const [params, setParams] = useState<ParamsConfig>({
    page: '1',
    limit: '12',
    sort_by: '',
    order: 'desc',
    search: ''
  })
  const { data: productsData } = useQuery({
    queryKey: ['getListProductViolation', params, isOpen],
    queryFn: () => violationApi.getProductsViolation(removeEmptyParams(params)),
    enabled: isOpen
  })

  const productsViolation = productsData?.data.body?.content
  const [searchValue, setSearchValue] = useState<string>(params.search ?? '')
  const totalPage = productsData?.data.body?.totalPages

  const handleSortProducts = (
    sortByType: Exclude<ParamsConfig['sort_by'], undefined>,
    orderBy: Exclude<ParamsConfig['order'], undefined>
  ) => {
    const updateParams = { ...params }
    const nextOrderBy = (currentSortBy: string, currentOrderBy: string): string => {
      if (params.sort_by === currentSortBy) {
        switch (currentOrderBy) {
          case order.asc:
            return order.desc
          case order.desc:
            return ''
          default:
            return order.asc
        }
      }
      return order.asc
    }

    const nextOrder = nextOrderBy(sortByType, orderBy)

    if (nextOrder) {
      updateParams.sort_by = sortByType
      updateParams.order = nextOrder == 'asc' ? 'asc' : 'desc'
    } else {
      updateParams.sort_by = ''
      updateParams.order = ''
    }
    setParams(updateParams)
  }

  const handelSearchAndFilter = () => {
    const updateParams = { ...params }
    if (searchValue != '') {
      updateParams.search = searchValue
      updateParams.page = '1'
    } else {
      delete updateParams.search
    }

    setParams(updateParams)
  }

  const handleRetype = () => {
    setSearchValue('')
    setParams({
      page: '1',
      limit: '12',
      sort_by: '',
      order: 'desc',
      search: ''
    })
  }

  return (
    <>
      <Modal size={1100} opened={isOpen} onClose={onClose} centered withCloseButton={false}>
        <div className='max-h-full flex relative'>
          <div className='w-full bg-white flex flex-col overflow-y-auto h-full'>
            <div className='min-h-6 p-6 flex-shrink-0 pr-7 text-xl font-medium overflow-hidden text-[#333333] '>
              History Violation
            </div>
            <div className='relative text-sm px-6 flex-grow max-h-[450px] overflow-y-auto scrollbar-thin'>
              <div className='w-full'>
                <div className='mb-4 flex flex-row justify-between items-center '>
                  <div className='text-md text-[#333333]'>{productsData?.data.body?.totalElements ?? 0} Product</div>
                  <div className='w-[600px]'>
                    <div className='grid grid-cols-7 flex-1 gap-4 justify-between items-center'>
                      <div className='col-span-5 bg-white rounded-sm py-1 flex relative'>
                        <input
                          type='text'
                          className='pl-10 border text-sm rounded-md border-solid text-black px-3 py-2 flex-grow outline-none bg-transparent'
                          placeholder='Search product name, product id'
                          onChange={(e) => {
                            setSearchValue(e.target.value)
                          }}
                          value={searchValue}
                        />
                        <div className='absolute top-[30%] left-4 flex-shrink-0 bg-orange hover:opacity-95'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth={1.5}
                            stroke='currentColor'
                            className='w-5 h-5 text-[#999999]'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
                            />
                          </svg>
                        </div>
                      </div>

                      <Button
                        onClick={handelSearchAndFilter}
                        className='text-blue text-sm h-9 col-span-1 border-[1px] rounded-sm border-blue'
                      >
                        Apply
                      </Button>
                      <Button
                        onClick={handleRetype}
                        className='text-[#333333] text-sm h-9 col-span-1 border-[1px] rounded-sm'
                      >
                        Retype
                      </Button>
                    </div>
                  </div>
                </div>
                {productsViolation && (
                  <div>
                    <div className='border-[1px] border-gray-200 rounded-md overflow-hidden'>
                      <div className='px-4 py-3 flex flex-row text-sm bg-[#F6F6F6]'>
                        <div className='py-3 px-2 flex-1 grid grid-cols-12 items-center'>
                          <div className='flex justify-start text-[#999999] col-span-5'>Product name</div>
                          <div className='flex justify-start col-span-2'>
                            <button
                              onClick={() =>
                                handleSortProducts(
                                  sortBy.price as Exclude<ParamsConfig['sort_by'], undefined>,
                                  params.order as Exclude<ParamsConfig['order'], undefined>
                                )
                              }
                              className='flex flex-row items-center gap-1'
                            >
                              <div className='text-[#999999]'>Price</div>
                              <div className='flex flex-col gap-[2px] '>
                                <div
                                  className={`${sortBy.price == params.sort_by && params.order == order.asc ? 'border-t-[#333333]' : 'border-t-[#999999]'} bg-none border-0 border-l-4 border-r-4 border-t-[5px] border-transparent mx-0 my-0 p-0 -rotate-180`}
                                ></div>
                                <div
                                  className={`${sortBy.price == params.sort_by && params.order == order.desc ? 'border-t-[#333333]' : 'border-t-[#999999]'} bg-none border-0 border-l-4 border-r-4 border-t-[5px] border-transparent mx-0 my-0 p-0`}
                                ></div>
                              </div>
                            </button>
                          </div>
                          <div className='flex justify-start col-span-2'>
                            <button
                              onClick={() =>
                                handleSortProducts(
                                  sortBy.stock as Exclude<ParamsConfig['sort_by'], undefined>,
                                  params.order as Exclude<ParamsConfig['order'], undefined>
                                )
                              }
                              className='flex flex-row items-center gap-1'
                            >
                              <div className='text-[#999999]'>Stock</div>
                              <div className='flex flex-col gap-[2px] '>
                                <div
                                  className={`${sortBy.stock == params.sort_by && params.order == order.asc ? 'border-t-[#333333]' : 'border-t-[#999999]'} bg-none border-0 border-l-4 border-r-4 border-t-[5px] border-transparent mx-0 my-0 p-0 -rotate-180`}
                                ></div>
                                <div
                                  className={`${sortBy.stock == params.sort_by && params.order == order.desc ? 'border-t-[#333333]' : 'border-t-[#999999]'} bg-none border-0 border-l-4 border-r-4 border-t-[5px] border-transparent mx-0 my-0 p-0`}
                                ></div>
                              </div>
                            </button>
                          </div>
                          <div className='flex justify-start col-span-3'>
                            <div className='flex flex-row items-center gap-1'>
                              <div className='text-[#999999]'>Type Violation</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {productsViolation.length > 0 ? (
                        productsViolation.map((item, index) => (
                          <div className='mb-3' key={index}>
                            <div className='px-4 flex h-auto col-span-2 rounded-sm overflow-hidden'>
                              <div className='py-3 px-2 flex-1 grid grid-cols-12 items-start'>
                                <div className='flex justify-start text-[#999999] col-span-5'>
                                  <div className='flex justify-start gap-2 text-[#999999] col-span-5'>
                                    <div className='w-14 h-14'>
                                      <img
                                        className='w-full h-full object-cover'
                                        src={`${config.awsURL}products/${item.product.productImages.find((img) => img.isPrimary)?.imageUrl}`}
                                        alt={item.product.name}
                                      />
                                    </div>
                                    <div className='flex flex-1 pr-2 flex-col gap-1 justify-start items-start'>
                                      <div className='line-clamp-2 text-[#333333] text-sm font-bold'>
                                        {item.product.name}
                                      </div>
                                      <div className='text-[#666666] line-clamp-1 text-xs'>
                                        Product ID: {item.product.id}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className='flex justify-start col-span-2 text-[#333333] text-sm'>
                                  {item.product.isVariant
                                    ? calculateFromToPrice(item.product.productVariants)
                                    : '₫' + formatCurrency(item.product.price)}
                                </div>
                                <div className='flex justify-start col-span-2 text-[#333333] text-sm'>
                                  {item.product.isVariant
                                    ? calculateTotalStockQuantity(item.product.productVariants)
                                    : formatNumbertoSocialStyle(item.product.stockQuantity)}
                                </div>
                                <div className='flex justify-start col-span-3 text-[#333333] text-sm'>
                                  {item.typeViolation.title}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className='w-full h-96'>
                          <NoData title='No Product Found' />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {productsViolation && productsViolation.length > 0 && (
              <div className='mt-4 flex justify-end px-6'>
                <Pagination
                  total={Number(totalPage)}
                  siblings={1}
                  defaultValue={params.page ? Number.parseInt(params.page as string) : 1}
                  onChange={(value) => {
                    setParams({ ...params, page: value })
                  }}
                />
              </div>
            )}
            <div className='flex flex-row justify-end items-center p-6 '>
              <div className='flex flex-row gap-5 items-center'>
                <button
                  onClick={onClose}
                  className='text-sm hover:bg-gray-100 text-[#999999] border border-solid border-gray-300 rounded-md px-4 py-2'
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
          <button onClick={onClose} type='button' className='text-[#999999] h-6 p-1 absolute right-12 top-6 w-6'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='size-6'
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='M6 18 18 6M6 6l12 12' />
            </svg>
          </button>
        </div>
      </Modal>
    </>
  )
}
