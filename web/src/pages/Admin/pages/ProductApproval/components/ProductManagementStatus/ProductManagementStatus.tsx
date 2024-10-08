import { Badge, Checkbox, MantineProvider, Select, Textarea, Tooltip } from '@mantine/core'
import { InvalidateQueryFilters, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { produce } from 'immer'
import { keyBy, omit } from 'lodash'
import { useContext, useEffect, useMemo, useState } from 'react'
import { createSearchParams, Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import productApi from 'src/apis/product.api'
import violationApi from 'src/apis/violation.api'
import Button from 'src/components/Button'
import NoData from 'src/components/NoData'
import config from 'src/constants/config'
import { order, sortBy } from 'src/constants/product'
import statusProduct from 'src/constants/status'
import { ProductTabsProcessContext } from 'src/contexts/productTabsProcess.context'
import useQueryConfig, { QueryConfig } from 'src/hooks/useQueryConfig'
import useQueryParams from 'src/hooks/useQueryParams'
import ButtonModal from 'src/pages/Admin/components/ButtonModal/ButtonModal'
import ListCategoryOfShop from 'src/pages/Shop/components/ListCategoryOfShop'
import { ProductDetailForAdminResponse, ProductViolationReportRequest } from 'src/types/product.type'
import { formatDateTime, GMTToLocalStingTime, variantColorResolver } from 'src/utils/utils'
import ViewModal from '../ViewModal'
import { ParamsConfig } from 'src/types/utils.type'

interface ExtendedProduct extends ProductDetailForAdminResponse {
  disabled: boolean
  checked: boolean
}

interface Errors {
  typeViolationError: string
  reasonsError: string
  suggestError: string
}

const errorsValue = {
  typeViolationError: '',
  reasonsError: '',
  suggestError: ''
}

interface Props {
  queryKey: string
  path: string
  status?: string
}

export default function ProductManagementStatus({ queryKey, path, status = '' }: Props) {
  const queryParams: QueryConfig = useQueryParams()
  const queryConfig = useQueryConfig()
  const params =
    status == ''
      ? queryConfig
      : {
          ...queryConfig,
          status: status
        }

  const { data: productsData } = useQuery({
    queryKey: [queryKey, queryParams],
    queryFn: () => productApi.getListProductOfForAdmin(params as ParamsConfig)
  })

  const createReportViolationMutation = useMutation({
    mutationFn: violationApi.addReportViolation
  })

  const listProductForSaleMutation = useMutation({
    mutationFn: productApi.listProductForSale
  })

  const [extendedProduct, setExtendedProduct] = useState<ExtendedProduct[]>([])
  const [limitElement, setLimitElement] = useState<string>('12')
  const [categoryId, setCategoryId] = useState<string>(queryConfig.category ?? '')
  const [searchValue, setSearchValue] = useState<string>(queryConfig.search ?? '')
  const [isShowViewProductDetail, setIsShowViewProductDetail] = useState<boolean>(false)
  const [productDetail, setProductDetail] = useState<ProductDetailForAdminResponse | null>(null)
  const [reasons, setReasons] = useState<string>('')
  const [suggest, setSuggest] = useState<string>('')
  const [typeViolationId, setTypeViolationId] = useState<string>('')
  const [errorsForm, setErrorsForm] = useState<Errors>(errorsValue)
  const { typeOfViolations } = useContext(ProductTabsProcessContext)

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const location = useLocation()
  const chosenProductIdFromLocation = (location.state as { ProductId: string } | null)?.ProductId
  const products = productsData?.data.body?.listProduct.content
  const isAllChecked = useMemo(() => extendedProduct?.every((product) => product.checked), [extendedProduct])
  const checkedProduct = useMemo(() => extendedProduct.filter((product) => product.checked), [extendedProduct])
  const indeterminate = extendedProduct.some((value) => value.checked) && !isAllChecked
  const checkedProductCount = checkedProduct.length
  const page = Number(productsData?.data.body?.listProduct.pageable.pageNumber) + 1
  const totalPage = productsData?.data.body?.listProduct.totalPages
  const listCategoryOfShopData = productsData?.data.body?.listCategoryId
  const checkListStatusPendingApproval = checkedProduct.filter(
    (product) => product.status == statusProduct.PENDING_APPROVAL
  )
  // const checkListStatusViolation = checkedProduct.filter(
  //   (product) => product.status == statusProduct.DELETE || product.status == statusProduct.TEMPORARILY_LOCKED
  // )
  const checkListStatusForSale = checkedProduct.filter((product) => product.status == statusProduct.FOR_SALE)

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
      pathname: path,
      search: createSearchParams(searchParams).toString()
    })
  }

  const handelSearchAndFilter = () => {
    const searchParams: Record<string, string> = {
      ...queryConfig
    }
    if (searchValue != '') {
      searchParams.search = searchValue
    } else {
      delete searchParams.search
    }

    if (categoryId != '') {
      searchParams.category = categoryId
    } else {
      delete searchParams.categoryId
    }

    navigate({
      pathname: path,
      search: createSearchParams(searchParams).toString()
    })
  }

  const handleRetype = () => {
    setCategoryId('')
    setSearchValue('')
    navigate({
      pathname: path,
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            limit: limitElement
          },
          ['category', 'search']
        )
      ).toString()
    })
  }

  const handleDeleteProduct = async (close: () => void, productId?: string) => {
    const isSubmit = checkFormSubmit()
    if (isSubmit) {
      close()
      let listStringIds
      if (productId) {
        listStringIds = [productId]
      } else {
        const listStringIdPendingApproval: string[] = checkListStatusPendingApproval.map((item) => item.id)
        const listStringIdForSale: string[] = checkListStatusForSale.map((item) => item.id)
        listStringIds = [...listStringIdPendingApproval, ...listStringIdForSale]
      }

      const newReportViolation: ProductViolationReportRequest = {
        productId: listStringIds,
        typeViolationId: typeViolationId,
        status: statusProduct.DELETE,
        reasons: reasons,
        suggest: suggest,
        deadline: GMTToLocalStingTime(new Date())
      }

      try {
        const createRes = await createReportViolationMutation.mutateAsync(newReportViolation)
        if (createRes.data.statusCode === 200) {
          toast.success(createRes.data.message)
          handleCancel()
          const filters: InvalidateQueryFilters = { queryKey: [queryKey] }
          queryClient.invalidateQueries(filters)
          setIsShowViewProductDetail(false)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  const checkFormSubmit = (): boolean => {
    let isSubmit = true
    const newError = {
      typeViolationError: '',
      reasonsError: '',
      suggestError: '',
      deadline: ''
    }
    if (reasons == '') {
      isSubmit = false
      newError.reasonsError = 'This field cannot be empty'
    }

    if (suggest == '') {
      isSubmit = false
      newError.suggestError = 'This field cannot be empty'
    }

    if (typeViolationId == '') {
      isSubmit = false
      newError.typeViolationError = 'This field cannot be empty'
    }
    setErrorsForm(newError)
    return isSubmit
  }

  const handleCancel = () => {
    setSuggest('')
    setReasons('')
    setTypeViolationId('')
    setErrorsForm(errorsValue)
  }

  const handleListingForSale = async (close: () => void) => {
    close()
    try {
      const listStringIdPendingApproval: string[] = checkListStatusPendingApproval.map((item) => item.id)
      const createRes = await listProductForSaleMutation.mutateAsync(listStringIdPendingApproval)
      if (createRes.data.statusCode === 200) {
        toast.success(createRes.data.message)
        handleCancel()
        const filters: InvalidateQueryFilters = { queryKey: [queryKey] }
        queryClient.invalidateQueries(filters)
        setIsShowViewProductDetail(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='w-full relative'>
      {isShowViewProductDetail && (
        <ViewModal
          queryKey={queryKey}
          productDetail={productDetail}
          setIsShowViewProductDetail={setIsShowViewProductDetail}
        />
      )}
      <div className='w-full'>
        <div className='grid grid-cols-12 gap-4 justify-between items-center mb-6'>
          <div className='col-span-5 bg-white rounded-sm p-1 flex relative'>
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
          <div className='text-md text-[#333333]'>
            {productsData?.data.body?.listProduct.totalElements ?? 0} Product
          </div>
        </div>
        {extendedProduct && (
          <div>
            <div className='border-[1px] border-gray-200 rounded-md overflow-hidden'>
              <div className='px-4 py-3 flex flex-row text-sm bg-[#F6F6F6]'>
                <div className='flex w-7 items-center py-3 pr-2'>
                  <Checkbox indeterminate={indeterminate} checked={isAllChecked} onChange={handleCheckAll} />
                </div>
                <div className='py-3 px-2 flex-1 grid grid-cols-12 items-center'>
                  <div className='flex justify-start text-[#999999] col-span-3'>Shop</div>
                  <div className='flex justify-start text-[#999999] col-span-5'>Product name</div>
                  <div className='flex justify-start col-span-2'>
                    <button
                      onClick={() =>
                        handleSortProducts(
                          sortBy.price as Exclude<ParamsConfig['sort_by'], undefined>,
                          queryConfig.order as Exclude<ParamsConfig['order'], undefined>
                        )
                      }
                      className='flex flex-row items-center gap-1'
                    >
                      <div className='text-[#999999]'>Updated Time</div>
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
                    <div className='flex flex-row items-center gap-1'>
                      <div className='text-[#999999]'>Status</div>
                    </div>
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
                        <div className='flex col-span-3 flex-row gap-1 items-center px-4 py-1 h-full'>
                          <div className='w-10 h-10 mr-2 flex-shrink-0'>
                            <img
                              src={product.shop.avatarUrl}
                              alt='avatar'
                              className='w-full h-full object-cover rounded-full'
                            />
                          </div>
                          <div className='flex flex-col gap-1 items-start'>
                            <span className='text-sm'>{product.shop.userName}</span>
                            <Tooltip
                              multiline
                              position='bottom'
                              w={220}
                              withArrow
                              transitionProps={{ duration: 200 }}
                              label={product.shop.id}
                            >
                              <div className='text-[#666666] line-clamp-1 text-xs'>ID : {product.id}</div>
                            </Tooltip>
                          </div>
                        </div>
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
                        <div className='flex justify-start col-span-2 text-[#333333] text-sm'>
                          {formatDateTime(product.updatedAt)}
                        </div>
                        <div className='flex justify-start col-span-2 text-[#333333] text-sm'>
                          <MantineProvider theme={{ variantColorResolver }}>
                            <Badge color='lime.4' variant={product.status}>
                              {product.status}
                            </Badge>
                          </MantineProvider>
                        </div>
                      </div>
                      <div className='flex justify-start w-24 flex-col text-sm items-start gap-1 text-blue py-3 pl-2 pr-4'>
                        <button
                          onClick={() => {
                            setProductDetail(product)
                            setIsShowViewProductDetail(true)
                          }}
                          className='px-2 py-1 w-full rounded-md text-xs font-normal bg-blue text-white'
                        >
                          View
                        </button>
                        {(product.status == statusProduct.FOR_SALE ||
                          product.status == statusProduct.PENDING_APPROVAL) && (
                          <ButtonModal
                            nameButton='Delete'
                            title='Are you sure to delete the product?'
                            size={700}
                            className='px-2 py-1 w-full text-xs rounded-md font-normal bg-[#DC3545] text-white'
                            handleSubmit={(close: () => void) => handleDeleteProduct(close, product.id)}
                          >
                            <div className='flex flex-col gap-4 min-h-80'>
                              <div className='flex justify-start text-[#999999] col-span-5 my-3'>
                                <div className='flex justify-start gap-2 text-[#999999] col-span-5'>
                                  <div className='w-14 h-14'>
                                    <img
                                      className='w-full h-full object-cover'
                                      src={`${config.awsURL}products/${product?.productImages.find((img) => img.isPrimary)?.imageUrl}`}
                                      alt={product?.name}
                                    />
                                  </div>
                                  <div className='flex flex-1 pr-2 flex-col gap-1 justify-start items-start'>
                                    <div className='line-clamp-2 text-[#333333] text-sm font-bold'>{product?.name}</div>
                                    <div className='text-[#666666] line-clamp-1 text-xs'>Product ID: {product?.id}</div>
                                  </div>
                                </div>
                              </div>

                              <div className='flex flex-col gap-4 min-h-80 mb-4'>
                                <div className='grid-cols-8 grid items-center text-sm'>
                                  <div className='col-span-2'>Type violation:</div>
                                  <div className='col-span-6 px-3'>
                                    <Select
                                      placeholder='type of violation'
                                      value={typeViolationId}
                                      data={typeOfViolations?.map((item) => ({
                                        value: item.id,
                                        label: item.title
                                      }))}
                                      defaultValue={''}
                                      allowDeselect={false}
                                      onChange={(value) => {
                                        setTypeViolationId(value!)
                                        setErrorsForm({ ...errorsForm, typeViolationError: '' })
                                      }}
                                      error={errorsForm.typeViolationError}
                                    />
                                  </div>
                                </div>

                                <div className='grid-cols-8 grid items-start text-sm'>
                                  <div className='col-span-2 h-8'>Reasons:</div>
                                  <div className='col-span-6 px-3'>
                                    <Textarea
                                      value={reasons}
                                      onChange={(e) => {
                                        setReasons(e.target.value)
                                        setErrorsForm({ ...errorsForm, reasonsError: '' })
                                      }}
                                      size='sm'
                                      inputSize='30'
                                      placeholder='enter the reason for the violation'
                                      minRows={3}
                                      maxRows={6}
                                      autosize
                                      maxLength={200}
                                      error={errorsForm.reasonsError}
                                    />
                                  </div>
                                </div>

                                <div className='grid-cols-8 grid items-start text-sm'>
                                  <div className='col-span-2 h-8'>Suggest:</div>
                                  <div className='col-span-6 px-3'>
                                    <Textarea
                                      value={suggest}
                                      onChange={(e) => {
                                        setSuggest(e.target.value)
                                        setErrorsForm({ ...errorsForm, suggestError: '' })
                                      }}
                                      placeholder='give suggestions to fix bugs for users'
                                      size='sm'
                                      inputSize='30'
                                      minRows={6}
                                      maxRows={6}
                                      autosize
                                      maxLength={500}
                                      error={errorsForm.suggestError}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </ButtonModal>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className='w-full h-96'>
                  <NoData title='No data' />
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
                            pathname: path,
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
                            pathname: path,
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
                          pathname: path,
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
                </div>
                <div className='flex items-center gap-4'>
                  <div className='text-[#333333]'>{checkedProductCount} products selected</div>
                  {(checkListStatusPendingApproval.length > 0 || checkListStatusForSale.length > 0) && (
                    <ButtonModal
                      nameButton='Delete'
                      title='Are you sure you want to delete 10 products?'
                      size={700}
                      className='px-5 py-[6px] rounded-md text-sm font-normal bg-[#DC3545] text-white'
                      handleSubmit={handleDeleteProduct}
                      handleCancel={handleCancel}
                    >
                      <div className='mb-3'>
                        <div className='flex flex-col'>
                          {checkListStatusPendingApproval.length > 0 &&
                            checkListStatusPendingApproval.map((item) => (
                              <div
                                key={item.id}
                                className='flex border p-2 rounded-sm mb-2 justify-start gap-2 text-[#999999] col-span-5'
                              >
                                <div className='w-14 h-14'>
                                  <img
                                    className='w-full h-full object-cover'
                                    src={`${config.awsURL}products/${item.productImages.find((img) => img.isPrimary)?.imageUrl}`}
                                    alt={item.name}
                                  />
                                </div>
                                <div className='flex flex-1 pr-2 flex-col gap-1 justify-start items-start'>
                                  <div className='line-clamp-2 text-[#333333] text-sm font-bold'>{item.name}</div>
                                  <div className='text-[#666666] line-clamp-1 text-xs'>Product ID: {item.id}</div>
                                </div>
                              </div>
                            ))}
                          {checkListStatusForSale.length > 0 &&
                            checkListStatusForSale.map((item) => (
                              <div
                                key={item.id}
                                className='flex border p-2 rounded-sm mb-2 justify-start gap-2 text-[#999999] col-span-5'
                              >
                                <div className='w-14 h-14'>
                                  <img
                                    className='w-full h-full object-cover'
                                    src={`${config.awsURL}products/${item.productImages.find((img) => img.isPrimary)?.imageUrl}`}
                                    alt={item.name}
                                  />
                                </div>
                                <div className='flex flex-1 pr-2 flex-col gap-1 justify-start items-start'>
                                  <div className='line-clamp-2 text-[#333333] text-sm font-bold'>{item.name}</div>
                                  <div className='text-[#666666] line-clamp-1 text-xs'>Product ID: {item.id}</div>
                                </div>
                              </div>
                            ))}
                        </div>
                        <div className='flex flex-col gap-4 min-h-80 mb-4'>
                          <div className='grid-cols-8 grid items-center text-sm'>
                            <div className='col-span-2'>Type violation:</div>
                            <div className='col-span-6 px-3'>
                              <Select
                                placeholder='type of violation'
                                value={typeViolationId}
                                data={typeOfViolations?.map((item) => ({
                                  value: item.id,
                                  label: item.title
                                }))}
                                defaultValue={''}
                                allowDeselect={false}
                                onChange={(value) => {
                                  setTypeViolationId(value!)
                                  setErrorsForm({ ...errorsForm, typeViolationError: '' })
                                }}
                                error={errorsForm.typeViolationError}
                              />
                            </div>
                          </div>

                          <div className='grid-cols-8 grid items-start text-sm'>
                            <div className='col-span-2 h-8'>Reasons:</div>
                            <div className='col-span-6 px-3'>
                              <Textarea
                                value={reasons}
                                onChange={(e) => {
                                  setReasons(e.target.value)
                                  setErrorsForm({ ...errorsForm, reasonsError: '' })
                                }}
                                size='sm'
                                inputSize='30'
                                placeholder='enter the reason for the violation'
                                minRows={3}
                                maxRows={6}
                                autosize
                                maxLength={200}
                                error={errorsForm.reasonsError}
                              />
                            </div>
                          </div>

                          <div className='grid-cols-8 grid items-start text-sm'>
                            <div className='col-span-2 h-8'>Suggest:</div>
                            <div className='col-span-6 px-3'>
                              <Textarea
                                value={suggest}
                                onChange={(e) => {
                                  setSuggest(e.target.value)
                                  setErrorsForm({ ...errorsForm, suggestError: '' })
                                }}
                                placeholder='give suggestions to fix bugs for users'
                                size='sm'
                                inputSize='30'
                                minRows={6}
                                maxRows={6}
                                autosize
                                maxLength={500}
                                error={errorsForm.suggestError}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </ButtonModal>
                  )}
                  {checkListStatusPendingApproval.length > 0 && (
                    <ButtonModal
                      size={500}
                      nameButton='Allow listing for sale'
                      title='The product has been reviewed. Are you sure you want to allow it to be listed for sale on the marketplace?'
                      className='px-4 py-2 rounded-md text-sm font-normal bg-[#198754] text-white'
                      handleSubmit={handleListingForSale}
                    >
                      <div className='flex flex-col gap-4'>
                        {checkListStatusPendingApproval.length > 0 &&
                          checkListStatusPendingApproval.map((item) => (
                            <div
                              key={item.id}
                              className='flex border p-2 rounded-sm mb-2 justify-start gap-2 text-[#999999] col-span-5'
                            >
                              <div className='w-14 h-14'>
                                <img
                                  className='w-full h-full object-cover'
                                  src={`${config.awsURL}products/${item.productImages.find((img) => img.isPrimary)?.imageUrl}`}
                                  alt={item.name}
                                />
                              </div>
                              <div className='flex flex-1 pr-2 flex-col gap-1 justify-start items-start'>
                                <div className='line-clamp-2 text-[#333333] text-sm font-bold'>{item.name}</div>
                                <div className='text-[#666666] line-clamp-1 text-xs'>Product ID: {item.id}</div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </ButtonModal>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
