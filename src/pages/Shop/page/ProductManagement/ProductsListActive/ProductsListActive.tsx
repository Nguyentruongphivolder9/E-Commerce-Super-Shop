import { Checkbox, Popover, Select } from '@mantine/core'
import { InvalidateQueryFilters, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { produce } from 'immer'
import { keyBy, omit } from 'lodash'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { createSearchParams, Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import productApi from 'src/apis/product.api'
import Button from 'src/components/Button'
import NoData from 'src/components/NoData'
import config from 'src/constants/config'
import path from 'src/constants/path'
import { order, sortBy } from 'src/constants/product'
import statusProduct from 'src/constants/status'
import { ProductTabsProcessContext } from 'src/contexts/productTabsProcess.context'
import useQueryConfig, { QueryConfig } from 'src/hooks/useQueryConfig'
import useQueryParams from 'src/hooks/useQueryParams'
import ButtonPublishToList from 'src/pages/Shop/components/ButtonPublishToList'
import ListCategoryOfShop from 'src/pages/Shop/components/ListCategoryOfShop'
import { ProductDetailForShopResponse } from 'src/types/product.type'
import { ParamsConfig } from 'src/types/utils.type'
import {
  calculateFromToPrice,
  calculateTotalStockQuantity,
  formatCurrency,
  formatNumbertoSocialStyle
} from 'src/utils/utils'

interface ExtendedProduct extends ProductDetailForShopResponse {
  disabled: boolean
  checked: boolean
}

type ExpandedIndexes = {
  [key: number]: boolean
}

export default function ProductsListActive() {
  const { setSelectedTab } = useContext(ProductTabsProcessContext)
  setSelectedTab('for sale')
  const queryParams: QueryConfig = useQueryParams()
  const queryConfig = useQueryConfig()
  const [extendedProduct, setExtendedProduct] = useState<ExtendedProduct[]>([])
  const [limitElement, setLimitElement] = useState<string>('12')
  const [categoryId, setCategoryId] = useState<string>(queryConfig.category ?? '')
  const [searchValue, setSearchValue] = useState<string>(queryConfig.search ?? '')
  const [expandedIndexes, setExpandedIndexes] = useState<ExpandedIndexes>({})

  const { data: productsData } = useQuery({
    queryKey: ['getAllProductWithStatusForSaleForShop', queryParams],
    queryFn: () =>
      productApi.getListProductOfShop({
        ...queryConfig,
        status: statusProduct.FOR_SALE,
        limit: limitElement
      } as ParamsConfig)
  })
  const updateStatusListProductMutation = useMutation({
    mutationFn: productApi.updateStatusListProduct
  })

  const deleteListProductsMutation = useMutation({
    mutationFn: productApi.deleteListProducts
  })

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const location = useLocation()
  const chosenProductIdFromLocation = (location.state as { ProductId: string } | null)?.ProductId
  const products = productsData?.data.body?.listProduct.content
  const isAllChecked = useMemo(() => extendedProduct?.every((product) => product.checked), [extendedProduct])
  const checkedProduct = useMemo(() => extendedProduct.filter((product) => product.checked), [extendedProduct])
  const indeterminate = extendedProduct.some((value) => value.checked) && !isAllChecked
  const checkedProductCount = checkedProduct.length
  const productIsPublishedChecked = checkedProduct.some((item) => item.isActive)
  const productIsDelistChecked = checkedProduct.some((item) => !item.isActive)
  const page = Number(productsData?.data.body?.listProduct.pageable.pageNumber) + 1
  const totalPage = productsData?.data.body?.listProduct.totalPages
  const listCategoryOfShopData = productsData?.data.body?.listCategoryId

  useEffect(() => {
    setExtendedProduct((prev) => {
      const extendedProductObject = keyBy(prev, 'id')

      return (
        products?.map((product) => {
          const isChosenProductIdFromLocation = chosenProductIdFromLocation == product.id
          return {
            ...product,
            disabled: false,
            checked: isChosenProductIdFromLocation || Boolean(extendedProductObject[product.id]?.checked)
          }
        }) || []
      )
    })
  }, [products, chosenProductIdFromLocation])

  const handleCheck = (ProductIndex: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedProduct(
      produce((draft) => {
        draft[ProductIndex].checked = e.target.checked
      })
    )
  }

  const handleCheckAll = () => {
    setExtendedProduct((prev) =>
      prev.map((Product) => ({
        ...Product,
        checked: !isAllChecked
      }))
    )
  }

  const handleSubmitToListProduct = async (typeSubmit: string) => {
    try {
      if (typeSubmit == 'publish') {
        const listString: string[] = checkedProduct.filter((item) => !item.isActive).map((item) => item.id)
        await handleSubmitPublishProduct(listString)
      } else if (typeSubmit == 'delist') {
        const listString: string[] = checkedProduct.filter((item) => item.isActive).map((item) => item.id)
        await handleSubmitDelistProduct(listString)
      }
    } catch (e) {
      console.log(e)
    }
  }
  const handleSubmitDelistProduct = async (productIds: string[]) => {
    const updateProRes = await updateStatusListProductMutation.mutateAsync({
      listProductId: productIds,
      isActive: false
    })
    if (updateProRes.data.statusCode === 200) {
      toast.success(updateProRes.data.message)
      const filters: InvalidateQueryFilters = { queryKey: ['getAllProductWithStatusForSaleForShop'] }
      queryClient.invalidateQueries(filters)
    }
  }

  const handleSubmitPublishProduct = async (productIds: string[]) => {
    const updateProRes = await updateStatusListProductMutation.mutateAsync({
      listProductId: productIds,
      isActive: true
    })
    if (updateProRes.data.statusCode === 200) {
      toast.success(updateProRes.data.message)
      const filters: InvalidateQueryFilters = { queryKey: ['getAllProductWithStatusForSaleForShop'] }
      queryClient.invalidateQueries(filters)
    }
  }

  const handleSubmitDeleteProduct = async (productIds: string[]) => {
    const updateProRes = await deleteListProductsMutation.mutateAsync(productIds)
    if (updateProRes.data.statusCode === 200) {
      toast.success(updateProRes.data.message)
      const filters: InvalidateQueryFilters = { queryKey: [config.GET_LIST_PRODUCT_OF_SHOP_QUERY_KEY] }
      queryClient.invalidateQueries(filters)
    }
  }

  const handleSortProducts = (
    sortByType: Exclude<ParamsConfig['sort_by'], undefined>,
    orderBy: Exclude<ParamsConfig['order'], undefined>
  ) => {
    const nextOrderBy = (currentSortBy: string, currentOrderBy: string): string => {
      if (queryConfig.sort_by === currentSortBy) {
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
    const searchParams: Record<string, string> = {
      ...queryConfig
    }

    if (nextOrder) {
      searchParams.sort_by = sortByType
      searchParams.order = nextOrder
    } else {
      delete searchParams.sort_by
      delete searchParams.order
    }

    navigate({
      pathname: path.productManagementForSale,
      search: createSearchParams(searchParams).toString()
    })
  }

  const handelSearchAndFilter = () => {
    const searchParams: Record<string, string> = {
      ...queryConfig
    }
    if (searchValue != '') {
      searchParams.search = searchValue
      searchParams.page = '1'
    } else {
      delete searchParams.search
    }

    if (categoryId != '') {
      searchParams.category = categoryId
      searchParams.page = '1'
    } else {
      delete searchParams.categoryId
    }

    navigate({
      pathname: path.productManagementForSale,
      search: createSearchParams(searchParams).toString()
    })
  }

  const handleRetype = () => {
    setCategoryId('')
    setSearchValue('')
    navigate({
      pathname: path.productManagementForSale,
      search: createSearchParams(
        omit(
          {
            ...queryConfig
          },
          ['category', 'search']
        )
      ).toString()
    })
  }

  const handleToggleExpand = (index: number) => {
    setExpandedIndexes((prev) => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  return (
    <div className='w-full'>
      <div className='grid grid-cols-12 gap-4 justify-between items-center mb-6'>
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

        <div className='col-span-5'>
          <ListCategoryOfShop
            categoryId={categoryId}
            setCategoryId={setCategoryId}
            listCategoryOfShopData={listCategoryOfShopData}
          />
        </div>

        <Button
          onClick={handelSearchAndFilter}
          className='text-blue text-sm h-9 col-span-1 border-[1px] rounded-sm border-blue'
        >
          Apply
        </Button>
        <Button onClick={handleRetype} className='text-[#333333] text-sm h-9 col-span-1 border-[1px] rounded-sm'>
          Retype
        </Button>
      </div>
      <div className='mb-4 flex flex-row items-center gap-2'>
        <div className='text-md text-[#333333]'>{productsData?.data.body?.listProduct.totalElements ?? 0} Product</div>
      </div>
      {extendedProduct && (
        <div>
          <div className='border-[1px] border-gray-200 rounded-md overflow-hidden'>
            <div className='px-4 py-3 flex flex-row text-sm bg-[#F6F6F6]'>
              <div className='flex w-7 items-center py-3 pr-2'>
                <Checkbox indeterminate={indeterminate} checked={isAllChecked} onChange={handleCheckAll} />
              </div>
              <div className='py-3 px-2 flex-1 grid grid-cols-12 items-center'>
                <div className='flex justify-start text-[#999999] col-span-5'>Product name</div>
                <div className='flex justify-start col-span-3'>
                  <button
                    onClick={() =>
                      handleSortProducts(
                        sortBy.price as Exclude<ParamsConfig['sort_by'], undefined>,
                        queryConfig.order as Exclude<ParamsConfig['order'], undefined>
                      )
                    }
                    className='flex flex-row items-center gap-1'
                  >
                    <div className='text-[#999999]'>Price</div>
                    <div className='flex flex-col gap-[2px] '>
                      <div
                        className={`${sortBy.price == queryConfig.sort_by && queryConfig.order == order.asc ? 'border-t-[#333333]' : 'border-t-[#999999]'} bg-none border-0 border-l-4 border-r-4 border-t-[5px] border-transparent mx-0 my-0 p-0 -rotate-180`}
                      ></div>
                      <div
                        className={`${sortBy.price == queryConfig.sort_by && queryConfig.order == order.desc ? 'border-t-[#333333]' : 'border-t-[#999999]'} bg-none border-0 border-l-4 border-r-4 border-t-[5px] border-transparent mx-0 my-0 p-0`}
                      ></div>
                    </div>
                  </button>
                </div>
                <div className='flex justify-start col-span-2'>
                  <button
                    onClick={() =>
                      handleSortProducts(
                        sortBy.stock as Exclude<ParamsConfig['sort_by'], undefined>,
                        queryConfig.order as Exclude<ParamsConfig['order'], undefined>
                      )
                    }
                    className='flex flex-row items-center gap-1'
                  >
                    <div className='text-[#999999]'>Stock</div>
                    <div className='flex flex-col gap-[2px] '>
                      <div
                        className={`${sortBy.stock == queryConfig.sort_by && queryConfig.order == order.asc ? 'border-t-[#333333]' : 'border-t-[#999999]'} bg-none border-0 border-l-4 border-r-4 border-t-[5px] border-transparent mx-0 my-0 p-0 -rotate-180`}
                      ></div>
                      <div
                        className={`${sortBy.stock == queryConfig.sort_by && queryConfig.order == order.desc ? 'border-t-[#333333]' : 'border-t-[#999999]'} bg-none border-0 border-l-4 border-r-4 border-t-[5px] border-transparent mx-0 my-0 p-0`}
                      ></div>
                    </div>
                  </button>
                </div>
                <div className='flex justify-start col-span-2'>
                  <button className='flex flex-row items-center gap-1'>
                    <div className='text-[#999999]'>Top Sales</div>
                    <div className='flex flex-col gap-[2px] '>
                      <div
                        className={
                          'bg-none border-0 border-l-4 border-r-4 border-t-[5px] border-transparent border-t-[#999999] mx-0 my-0 p-0 -rotate-180'
                        }
                      ></div>
                      <div
                        className={
                          'bg-none border-0 border-l-4 border-r-4 border-t-[5px] border-transparent border-t-[#999999] mx-0 my-0 p-0'
                        }
                      ></div>
                    </div>
                  </button>
                </div>
              </div>
              <div className='flex items-center w-24 py-3 pl-2 pr-4 text-[#999999]'>Action</div>
            </div>
            {extendedProduct.length > 0 ? (
              extendedProduct.map((product, index) => (
                <div className='mb-3' key={index}>
                  <div className='px-4 flex h-auto col-span-2 rounded-sm overflow-hidden'>
                    <div className='flex w-7 items-center py-3 pr-2'>
                      <Checkbox key={product.id} checked={product.checked} onChange={handleCheck(index)} />
                    </div>
                    <div className='py-3 px-2 flex-1 grid grid-cols-12 items-start'>
                      <div className='flex justify-start text-[#999999] col-span-5'>
                        <div className='flex justify-start gap-2 text-[#999999] col-span-5'>
                          <div className='w-14 h-14'>
                            <img
                              className='w-full h-full object-cover'
                              src={`${config.awsURL}products/${product.productImages.find((img) => img.isPrimary)?.imageUrl}`}
                              alt={product.name}
                            />
                          </div>
                          <div className='flex flex-1 pr-2 flex-col gap-1 justify-start items-start'>
                            <div className='line-clamp-2 text-[#333333] text-sm font-bold'>{product.name}</div>
                            <div className='text-[#666666] line-clamp-1 text-xs'>Product ID: {product.id}</div>
                          </div>
                        </div>
                      </div>
                      <div className='flex justify-start col-span-3 text-[#333333] text-sm'>
                        {product.isVariant
                          ? calculateFromToPrice(product.productVariants)
                          : '₫' + formatCurrency(product.price)}
                      </div>
                      <div className='flex justify-start col-span-2 text-[#333333] text-sm'>
                        {product.isVariant
                          ? calculateTotalStockQuantity(product.productVariants)
                          : formatNumbertoSocialStyle(product.stockQuantity)}
                      </div>
                      <div className='flex justify-start col-span-2 text-[#333333] text-sm'>
                        {product.productFigure.sold}
                      </div>
                    </div>
                    <div className='flex justify-start w-24 flex-col text-sm items-start gap-2 text-blue py-3 pl-2 pr-4'>
                      <Link to={`${path.home + 'shopchannel/portal/product/'}${product.id}`}>Update</Link>
                      <Popover width={150} position='bottom-end' offset={{ mainAxis: 3, crossAxis: 8 }}>
                        <Popover.Target>
                          <button>See more</button>
                        </Popover.Target>
                        <Popover.Dropdown
                          style={{
                            padding: 0,
                            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                            overflow: 'hidden'
                          }}
                        >
                          <div className=''>
                            {product.isActive ? (
                              <button
                                type='button'
                                onClick={() => handleSubmitDelistProduct([product.id])}
                                className='bg-white w-full text-left hover:bg-gray-100 px-3 py-2 text-sm tex-[#333333]'
                              >
                                Delist
                              </button>
                            ) : (
                              <button
                                type='button'
                                onClick={() => handleSubmitPublishProduct([product.id])}
                                className='bg-white w-full text-left hover:bg-gray-100 px-3 py-2 text-sm tex-[#333333]'
                              >
                                Publish
                              </button>
                            )}
                            <button
                              type='button'
                              className='bg-white w-full text-left hover:bg-gray-100 px-3 py-2 text-sm tex-[#333333]'
                              onClick={() => handleSubmitDeleteProduct([product.id])}
                            >
                              Delete
                            </button>
                          </div>
                        </Popover.Dropdown>
                      </Popover>
                    </div>
                  </div>

                  {product.isVariant &&
                    product.productVariants
                      .slice(0, expandedIndexes[index] ? product.productVariants.length : 2)
                      .map((productVariant, pvIndex) => (
                        <div key={pvIndex} className='px-4 flex h-auto col-span-2 rounded-sm overflow-hidden'>
                          <div className='flex w-7 items-center py-3 pr-2'></div>
                          <div className='py-3 px-2 flex-1 grid grid-cols-12 items-start'>
                            <div className='flex justify-end text-[#999999] col-span-5'>
                              <div className='flex justify-start w-5/6 gap-2 text-[#999999] col-span-5'>
                                {productVariant.variant1.imageUrl && (
                                  <div className='w-14 h-14'>
                                    <img
                                      className='w-full h-full object-cover'
                                      src={`${config.awsURL}products/${productVariant.variant1.imageUrl}`}
                                      alt={productVariant.variant1.name}
                                    />
                                  </div>
                                )}
                                <div className='flex flex-1 flex-col gap-1 justify-start items-start'>
                                  <div className='line-clamp-2 text-[#333333] text-sm'>
                                    {productVariant.variant1.name}
                                    {productVariant.variant2 != null &&
                                      productVariant.variant2.name &&
                                      ',' + productVariant.variant2.name}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className='flex justify-start col-span-3 text-[#333333] text-sm'>
                              {'₫' + formatCurrency(productVariant.price)}
                            </div>
                            <div className='flex justify-start col-span-2 text-[#333333] text-sm'>
                              {formatNumbertoSocialStyle(productVariant.stockQuantity)}
                            </div>
                            <div className='flex justify-start col-span-2 text-[#333333] text-sm'>
                              {productVariant.sold}
                            </div>
                          </div>
                          <div className='flex justify-start w-24 py-3 pl-2 pr-4'></div>
                        </div>
                      ))}

                  {product.isVariant && product.productVariants.length > 2 && (
                    <div className='px-4 flex gap-2 items-center justify-center'>
                      <button onClick={() => handleToggleExpand(index)} className='text-blue-600 text-sm'>
                        {expandedIndexes[index] ? 'Collapse' : 'View More'}
                      </button>
                      <div className={`${expandedIndexes[index] ? 'rotate-180' : 'rotate-0'}`}>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          strokeWidth={1.5}
                          stroke='currentColor'
                          className='size-4'
                        >
                          <path strokeLinecap='round' strokeLinejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5' />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className='w-full h-96'>
                <NoData title='No Product Found' />
              </div>
            )}
          </div>
          {extendedProduct.length > 0 && (
            <div className='mt-4'>
              <div className='py-6 flex items-center gap-3 justify-end'>
                <div className='flex items-center'>
                  <div className='mr-2'>
                    {page == 1 ? (
                      <span className='flex items-center justify-center px-3 h-8 rounded-tl-sm rounded-bl-sm bg-white/60 hover:bg-slate-100 cursor-not-allowed shadow'>
                        {' '}
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 24 24'
                          fill='currentColor'
                          className='w-3 h-3'
                        >
                          <path
                            fillRule='evenodd'
                            d='M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </span>
                    ) : (
                      <Link
                        to={{
                          pathname: path.productManagementForSale,
                          search: createSearchParams({
                            ...queryConfig,
                            page: (page - 1).toString()
                          }).toString()
                        }}
                        className='flex items-center justify-center px-3 h-8 rounded-tl-sm rounded-bl-sm bg-white hover:bg-slate-100 shadow'
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 24 24'
                          fill='currentColor'
                          className='w-3 h-3'
                        >
                          <path
                            fillRule='evenodd'
                            d='M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </Link>
                    )}
                  </div>
                  <div className='text-sm'>
                    <span className='text-blue'>{page}</span>
                    <span className='mx-2'>/</span>
                    <span>{totalPage}</span>
                  </div>
                  <div className='ml-2'>
                    {page == totalPage ? (
                      <span className='flex items-center justify-center px-3 h-8 rounded-tl-sm rounded-bl-sm bg-white/60 hover:bg-slate-100 cursor-not-allowed  shadow'>
                        {' '}
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 24 24'
                          fill='currentColor'
                          className='w-3 h-3'
                        >
                          <path
                            fillRule='evenodd'
                            d='M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </span>
                    ) : (
                      <Link
                        to={{
                          pathname: path.productManagementForSale,
                          search: createSearchParams({
                            ...queryConfig,
                            page: (page + 1).toString()
                          }).toString()
                        }}
                        className='flex items-center justify-center px-3 h-8 rounded-tl-sm rounded-bl-sm bg-white hover:bg-slate-100 shadow'
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 24 24'
                          fill='currentColor'
                          className='w-3 h-3'
                        >
                          <path
                            fillRule='evenodd'
                            d='M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </Link>
                    )}
                  </div>
                </div>
                <div className='flex items-center gap-3 '>
                  <div className=''>pagination</div>
                  <Select
                    placeholder='Pick value'
                    data={[
                      { value: '12', label: '12 / page' },
                      { value: '24', label: '24 / page' },
                      { value: '48', label: '48 / page' }
                    ]}
                    defaultValue={limitElement}
                    style={{ color: '#999999' }}
                    className='w-28 font-medium'
                    onChange={(value) => {
                      setLimitElement(value as string)
                      navigate({
                        pathname: path.productManagementForSale,
                        search: createSearchParams({
                          ...queryConfig,
                          limit: value as string,
                          page: '1'
                        }).toString()
                      })
                    }}
                  />
                </div>
              </div>
            </div>
          )}
          {checkedProductCount > 0 && (
            <div className='flex z-10 sticky bottom-0 border-t-[2px] bg-white flex-row justify-between items-center h-16'>
              <div className='flex gap-4 items-center ml-4'>
                <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                  <Checkbox
                    indeterminate={indeterminate}
                    label='Receive all notifications'
                    checked={isAllChecked}
                    onChange={handleCheckAll}
                  />
                </div>
                <div>Select All</div>
              </div>
              <div className='flex items-center gap-4'>
                <div className='text-[#333333]'>{checkedProductCount} products selected</div>
                <Button
                  className='text-[#333333] bg-white text-sm px-5 py-[6px] flex items-center justify-center  rounded-md border border-solid border-[#999999]'
                  type='button'
                  onClick={() => {
                    const listString: string[] = checkedProduct.map((item) => item.id)
                    handleSubmitDeleteProduct(listString)
                  }}
                >
                  Delete
                </Button>
                {productIsPublishedChecked && (
                  <ButtonPublishToList
                    itemHandlerCount={checkedProduct.filter((item) => !item.isActive).length}
                    itemRedundantCount={checkedProduct.filter((item) => item.isActive).length}
                    typeButton='delist'
                    onSubmitToList={handleSubmitToListProduct}
                  />
                )}
                {productIsDelistChecked && (
                  <ButtonPublishToList
                    itemHandlerCount={checkedProduct.filter((item) => item.isActive).length}
                    itemRedundantCount={checkedProduct.filter((item) => !item.isActive).length}
                    typeButton='publish'
                    onSubmitToList={handleSubmitToListProduct}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
