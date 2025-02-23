import { Checkbox, Popover, Select } from '@mantine/core'
import { InvalidateQueryFilters, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { produce } from 'immer'
import { keyBy, omit } from 'lodash'
import { useContext, useEffect, useMemo, useState } from 'react'
import { createSearchParams, Link, useLocation, useNavigate } from 'react-router-dom'
import productApi from 'src/apis/product.api'
import Button from 'src/components/Button'
import config from 'src/constants/config'
import path from 'src/constants/path'
import { ProductDetailForShopResponse, ProductImagesResponse } from 'src/types/product.type'
import {
  calculateFromToPrice,
  calculateTotalStockQuantity,
  formatCurrency,
  formatNumbertoSocialStyle
} from 'src/utils/utils'
import ButtonPublishToList from '../../../components/ButtonPublishToList'
import { toast } from 'react-toastify'
import useQueryConfig, { QueryConfig } from 'src/hooks/useQueryConfig'
import useQueryParams from 'src/hooks/useQueryParams'
import { order, sortBy } from 'src/constants/product'
import ListCategoryOfShop from '../../../components/ListCategoryOfShop'
import { ProductTabsProcessContext } from 'src/contexts/productTabsProcess.context'
import NoData from 'src/components/NoData'
import { ParamsConfig } from 'src/types/utils.type'
import ButtonDelete from 'src/pages/Shop/components/ButtonDelete'
import statusProduct from 'src/constants/status'

interface ExtendedProduct extends ProductDetailForShopResponse {
  disabled: boolean
  checked: boolean
}

export default function ProductAll() {
  const { setSelectedTab } = useContext(ProductTabsProcessContext)
  const queryConfig = useQueryConfig()
  setSelectedTab('all')
  const [extendedProduct, setExtendedProduct] = useState<ExtendedProduct[]>([])
  const [limitElement, setLimitElement] = useState<string>('12')
  const [categoryId, setCategoryId] = useState<string>(queryConfig.category ?? '')
  const [searchValue, setSearchValue] = useState<string>(queryConfig.search ?? '')
  const queryParams: QueryConfig = useQueryParams()

  const { data: productsData } = useQuery({
    queryKey: [config.GET_LIST_PRODUCT_OF_SHOP_QUERY_KEY, queryParams],
    queryFn: () =>
      productApi.getListProductOfShop({
        ...queryConfig,
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
      const filters: InvalidateQueryFilters = { queryKey: [config.GET_LIST_PRODUCT_OF_SHOP_QUERY_KEY] }
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
      const filters: InvalidateQueryFilters = { queryKey: [config.GET_LIST_PRODUCT_OF_SHOP_QUERY_KEY] }
      queryClient.invalidateQueries(filters)
    }
  }

  const handleSubmitDeleteProduct = async (close: () => void, productIds: string[]) => {
    const updateProRes = await deleteListProductsMutation.mutateAsync(productIds)
    if (updateProRes.data.statusCode === 200) {
      toast.success(updateProRes.data.message)
      const filters: InvalidateQueryFilters = { queryKey: [config.GET_LIST_PRODUCT_OF_SHOP_QUERY_KEY] }
      queryClient.invalidateQueries(filters)
    }
    close()
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
      pathname: path.productManagementAll,
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
      pathname: path.productManagementAll,
      search: createSearchParams(searchParams).toString()
    })
  }

  const handleRetype = () => {
    setCategoryId('')
    setSearchValue('')
    navigate({
      pathname: path.productManagementAll,
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
        <div className='flex flex-row gap-1 items-center rounded-full px-2 py-1  bg-[#F6F6F6]'>
          <div className='text-xs text-[#999999]'>Listing Limit: 1000</div>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='size-4 text-[#999999]'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z'
            />
          </svg>
        </div>
      </div>
      {extendedProduct && (
        <div>
          <div className='px-4 py-3 flex flex-row text-sm bg-[#F6F6F6]'>
            <span className='mr-3 text-[#333333]'>Sort by:</span>
            <button
              onClick={() =>
                handleSortProducts(
                  sortBy.price as Exclude<ParamsConfig['sort_by'], undefined>,
                  queryConfig.order as Exclude<ParamsConfig['order'], undefined>
                )
              }
              className='flex flex-row items-center mx-3 gap-1'
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
            <button
              onClick={() =>
                handleSortProducts(
                  sortBy.stock as Exclude<ParamsConfig['sort_by'], undefined>,
                  queryConfig.order as Exclude<ParamsConfig['order'], undefined>
                )
              }
              className='flex flex-row items-center mx-3 gap-1'
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
            <button
              onClick={() =>
                handleSortProducts(
                  sortBy.sales as Exclude<ParamsConfig['sort_by'], undefined>,
                  queryConfig.order as Exclude<ParamsConfig['order'], undefined>
                )
              }
              className='flex flex-row items-center mx-3 gap-1'
            >
              <div className='text-[#999999]'>Top Sales</div>
              <div className='flex flex-col gap-[2px] '>
                <div
                  className={`${sortBy.sales == queryConfig.sort_by && queryConfig.order == order.asc ? 'border-t-[#333333]' : 'border-t-[#999999]'} bg-none border-0 border-l-4 border-r-4 border-t-[5px] border-transparent mx-0 my-0 p-0 -rotate-180`}
                ></div>
                <div
                  className={`${sortBy.sales == queryConfig.sort_by && queryConfig.order == order.desc ? 'border-t-[#333333]' : 'border-t-[#999999]'} bg-none border-0 border-l-4 border-r-4 border-t-[5px] border-transparent mx-0 my-0 p-0`}
                ></div>
              </div>
            </button>
          </div>
          <div className='mt-4'>
            {extendedProduct.length > 0 ? (
              <div className='grid grid-cols-12 gap-2'>
                {extendedProduct.map((product, index) => (
                  <div key={index} className='relative group h-auto col-span-2 rounded-sm overflow-hidden'>
                    <div className='flex items-center absolute z-10 top-3 left-3 justify-center shrink-0 pr-3'>
                      <Checkbox key={product.id} checked={product.checked} onChange={handleCheck(index)} />
                    </div>
                    <div className='overflow-hidden w-full h-auto border rounded-sm bg-white'>
                      <div className='relative w-full pt-[100%]'>
                        <img
                          src={`${config.awsURL}products/${product.productImages.find((img: ProductImagesResponse) => img.isPrimary == true)?.imageUrl}`}
                          alt={product.name}
                          className='absolute left-0 top-0 h-full w-full bg-white object-cover'
                        />
                        {!product.isActive && (
                          <div className="px-3 py-2 absolute left-0 top-0 z-[9] h-full w-full flex flex-col justify-center items-center before:content-[''] before:bg-black before:opacity-60 before:absolute before:left-1/2 before:top-1/2 before:w-full before:h-full before:-translate-x-1/2 before:-translate-y-1/2">
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                              strokeWidth={2.0}
                              stroke='currentColor'
                              className='size-8 text-white z-10'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z'
                              />
                            </svg>
                            <div className='z-10 text-md text-white mb-1 font-bold'>Delist</div>
                            <button
                              type='button'
                              onClick={() => handleSubmitPublishProduct([product.id])}
                              className='z-10 h-8 px-4 flex items-center justify-start border rounded-md border-white text-sm text-white'
                            >
                              <span>Publish</span>
                            </button>
                          </div>
                        )}
                      </div>
                      <div className='overflow-hidden'>
                        <Link
                          to={`${path.home + 'shopchannel/portal/product/'}${product.id}`}
                          className='line-clamp-2 min-h-[2rem] text-sm m-2'
                        >
                          {product.name}
                        </Link>
                        <div className='my-2 px-2 py-[1px]'>
                          <div className='mb-2 flex items-start justify-start'>
                            {product.isVariant ? (
                              <div className='text-blue truncate text-orange'>
                                <span className='text-md'>{calculateFromToPrice(product.productVariants)}</span>
                              </div>
                            ) : (
                              <div className='text-blue truncate text-orange'>
                                <span className='text-md'>₫</span>
                                <span className='text-md'>{formatCurrency(product.price)}</span>
                              </div>
                            )}
                          </div>
                          <div className='text-[#333333] text-sm'>
                            <span>Stock</span>{' '}
                            {product.isVariant
                              ? calculateTotalStockQuantity(product?.productVariants)
                              : formatNumbertoSocialStyle(product?.stockQuantity as number)}
                          </div>
                        </div>
                        <div className='flex flex-row px-2 py-[6px]'>
                          <div className='h-[18px] w-full flex flex-row justify-center gap-1 text-xs'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                              strokeWidth={1}
                              stroke='currentColor'
                              className='size-4'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z'
                              />
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'
                              />
                            </svg>
                            <span>{product.productFigure.view}</span>
                          </div>
                          <div className='h-[18px] w-full flex flex-row justify-center gap-1 text-xs'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                              strokeWidth={1}
                              stroke='currentColor'
                              className='size-4'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z'
                              />
                            </svg>
                            <span>{product.productFigure.totalFavorites}</span>
                          </div>
                          <div className='h-[18px] w-full flex flex-row justify-center gap-1 text-xs'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                              strokeWidth={1}
                              stroke='currentColor'
                              className='size-4'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z'
                              />
                            </svg>
                            <span>{product.productFigure.sold}</span>
                          </div>
                        </div>
                        <div className='py-1 flex flex-row border-t-[1px] relative'>
                          <div className='absolute top-[50%] left-[50%] h-4 w-[1px] bg-[#DCDCE0] -translate-x-[50%] -translate-y-[50%]'></div>
                          <Link
                            to={`${path.home + 'shopchannel/portal/product/'}${product.id}`}
                            className='h-6 w-1/2 flex items-center justify-center rounded-md overflow-hidden hover:bg-slate-200 mx-2'
                          >
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                              strokeWidth={1}
                              stroke='currentColor'
                              className='size-4'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125'
                              />
                            </svg>
                          </Link>
                          <Popover width={150} position='top' offset={{ mainAxis: 3, crossAxis: 35 }}>
                            <Popover.Target>
                              <button
                                type='button'
                                className='h-6 w-1/2 flex items-center justify-center rounded-md overflow-hidden hover:bg-slate-200 mx-2'
                              >
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
                                    d='M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z'
                                  />
                                </svg>
                              </button>
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
                                <ButtonDelete
                                  className='bg-white w-full text-left hover:bg-gray-100 px-3 py-2 text-sm tex-[#333333]'
                                  handleConfirm={(close: () => void) => {
                                    handleSubmitDeleteProduct(close, [product.id])
                                  }}
                                />
                              </div>
                            </Popover.Dropdown>
                          </Popover>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='w-full h-96'>
                <NoData title='No data' />
              </div>
            )}
            {extendedProduct.length > 0 && (
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
                          pathname: path.productManagementAll,
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
                          pathname: path.productManagementAll,
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
                        pathname: path.productManagementAll,
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
            )}
          </div>
          {checkedProductCount > 0 && (
            <div className='flex z-10 sticky bottom-0 border-t-[2px] bg-white flex-row justify-between items-center h-16'>
              <div className='flex gap-4 items-center'>
                <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                  <Checkbox
                    indeterminate={indeterminate}
                    label='Receive all notifications'
                    checked={isAllChecked}
                    onChange={handleCheckAll}
                  />
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <div className='text-[#333333]'>{checkedProductCount} products selected</div>
                <ButtonDelete
                  handleConfirm={(close: () => void) => {
                    const listString: string[] = checkedProduct.map((item) => item.id)
                    handleSubmitDeleteProduct(close, listString)
                  }}
                  className='text-[#333333] bg-white text-sm px-5 py-[6px] flex items-center justify-center  rounded-md border border-solid border-[#999999]'
                />
                {productIsPublishedChecked && (
                  <ButtonPublishToList
                    itemHandlerCount={
                      checkedProduct.filter(
                        (item) => item.isActive
                        // &&
                        //   item.status != statusProduct.TEMPORARILY_LOCKED &&
                        //   item.status != statusProduct.DELETE
                      ).length
                    }
                    itemRedundantCount={checkedProduct.length}
                    typeButton='delist'
                    onSubmitToList={handleSubmitToListProduct}
                  />
                )}
                {productIsDelistChecked && (
                  <ButtonPublishToList
                    itemHandlerCount={
                      checkedProduct.filter(
                        (item) => !item.isActive
                        // &&
                        //   item.status != statusProduct.TEMPORARILY_LOCKED &&
                        //   item.status != statusProduct.DELETE
                      ).length
                    }
                    itemRedundantCount={checkedProduct.length}
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
