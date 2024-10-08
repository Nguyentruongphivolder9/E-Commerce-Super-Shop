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
import UnderlineTabs from 'src/components/UnderlineTabs'
import config from 'src/constants/config'
import path from 'src/constants/path'
import statusProduct from 'src/constants/status'
import { ProductTabsProcessContext } from 'src/contexts/productTabsProcess.context'
import useQueryConfig, { QueryConfig } from 'src/hooks/useQueryConfig'
import useQueryParams from 'src/hooks/useQueryParams'
import ButtonPublishToList from 'src/pages/Shop/components/ButtonPublishToList'
import ListCategoryOfShop from 'src/pages/Shop/components/ListCategoryOfShop'
import { ProductDetailForShopResponse } from 'src/types/product.type'
import { ParamsConfig } from 'src/types/utils.type'
import { formatDateTime } from 'src/utils/utils'
import { log } from 'console'
import ModalHistoryViolation from 'src/pages/Shop/components/ModalHistoryViolation'

interface ExtendedProduct extends ProductDetailForShopResponse {
  disabled: boolean
  checked: boolean
}

const violationTabs = [
  { status: statusProduct.TEMPORARILY_LOCKED, label: 'banned' },
  { status: statusProduct.DELETE, label: 'Super Shop Deleted' }
]

export default function ProductViolationBanned() {
  const { setSelectedTab, typeOfViolations } = useContext(ProductTabsProcessContext)
  setSelectedTab('violation')
  const queryParams: QueryConfig = useQueryParams()
  const queryConfig = useQueryConfig()
  const [extendedProduct, setExtendedProduct] = useState<ExtendedProduct[]>([])
  const [limitElement, setLimitElement] = useState<string>('12')
  const [categoryId, setCategoryId] = useState<string>(queryConfig.category ?? '')
  const [searchValue, setSearchValue] = useState<string>(queryConfig.search ?? '')
  const [violationTypeSelected, setViolationTypeSelected] = useState<string>(queryConfig.violationType ?? 'All')
  const [selectedTabViolation, setSelectedTabViolation] = useState(violationTabs[0].label)
  const statusSelected = useMemo(() => {
    return violationTabs.find((item) => item.label === selectedTabViolation)?.status
  }, [selectedTabViolation])
  const [modalOpen, setModalOpen] = useState(false)

  const { data: productsData } = useQuery({
    queryKey: ['getAllProductWithStatusViolationForShop', queryParams, statusSelected],
    queryFn: () =>
      productApi.getListProductOfShop({
        ...queryConfig,
        status: statusSelected,
        limit: limitElement
      } as ParamsConfig)
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
      console.log('okeee')
    } catch (e) {
      console.log(e)
    }
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
      pathname: path.productViolationBanned,
      search: createSearchParams(searchParams).toString()
    })
  }

  const handleRetype = () => {
    setCategoryId('')
    setSearchValue('')
    navigate({
      pathname: path.productViolationBanned,
      search: createSearchParams(
        omit(
          {
            ...queryConfig
          },
          ['category', 'search', 'violationType']
        )
      ).toString()
    })
  }
  const handleEditClick = () => {
    setModalOpen(true)
  }

  return (
    <div className='w-full'>
      <ModalHistoryViolation isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <div className='mb-3 flex items-center justify-between'>
        <div className='flex border-b border-b-gray-300'>
          <UnderlineTabs
            tabs={violationTabs}
            selectedTab={selectedTabViolation}
            setSelectedTab={setSelectedTabViolation}
          />
        </div>
        <button onClick={() => handleEditClick()} type='button' className='text-sm text-blue'>
          History violation
        </button>
      </div>
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
      <div>
        <div className='border-[1px] border-gray-200 rounded-md overflow-hidden'>
          <div className='px-4 py-3 flex flex-row text-sm bg-[#F6F6F6]'>
            <div className='flex w-7 items-center py-3 pr-2'>
              <Checkbox indeterminate={indeterminate} checked={isAllChecked} onChange={handleCheckAll} />
            </div>
            <div className='py-3 px-2 flex-1 grid grid-cols-12 items-center'>
              <div className='flex justify-start text-[#999999] col-span-3'>Product name</div>
              <div className='flex justify-start text-[#999999] col-span-1'>Updated on</div>
              <div className='flex justify-start text-[#999999] col-span-2'>
                <Popover width={250} trapFocus position='bottom' arrowSize={12} withArrow shadow='md'>
                  <Popover.Target>
                    <div className='flex text-[#999999] gap-2 items-center'>
                      <span>Violation Type</span>
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
                  </Popover.Target>
                  <Popover.Dropdown>
                    <div className='flex flex-col'>
                      <div
                        onClick={() => {
                          setViolationTypeSelected('All')
                          navigate({
                            pathname: path.productViolationBanned,
                            search: createSearchParams(
                              omit(
                                {
                                  ...queryConfig
                                },
                                ['violationType']
                              )
                            ).toString()
                          })
                        }}
                        className={`${violationTypeSelected == 'All' ? 'text-blue font-semibold' : 'text-[#333333]'} text-sm hover:bg-slate-100 p-1 cursor-pointer`}
                      >
                        All
                      </div>
                      {typeOfViolations &&
                        typeOfViolations.map((item) => (
                          <div
                            onClick={() => {
                              setViolationTypeSelected(item.id)
                              navigate({
                                pathname: path.productViolationBanned,
                                search: createSearchParams({
                                  ...queryConfig,
                                  violationType: item.id
                                }).toString()
                              })
                            }}
                            key={item.id}
                            className={`${violationTypeSelected == item.id ? 'text-blue font-semibold' : 'text-[#333333]'} text-sm hover:bg-slate-100 p-1 cursor-pointer`}
                          >
                            {item.title}
                          </div>
                        ))}
                    </div>
                  </Popover.Dropdown>
                </Popover>
              </div>
              <div className='flex justify-start text-[#999999] col-span-2'>Violation reason</div>
              <div className='flex justify-start text-[#999999] col-span-2'>Deadline</div>
              <div className='flex justify-start text-[#999999] col-span-2'>Suggestion</div>
            </div>
            <div className='flex items-center w-24 py-3 pl-2 pr-4 text-[#999999]'>Action</div>
          </div>
          {extendedProduct.length > 0 ? (
            extendedProduct.map((product, index) => {
              const violation = product.historyViolations.find((item) => !item.isRepaired)
              return (
                <div className='mb-3' key={index}>
                  <div className='px-4 flex h-auto col-span-2 rounded-sm overflow-hidden'>
                    <div className='flex w-7 items-center py-3 pr-2'>
                      <Checkbox key={product.id} checked={product.checked} onChange={handleCheck(index)} />
                    </div>
                    <div className='py-3 px-2 flex-1 grid grid-cols-12 items-start'>
                      <div className='flex justify-start text-[#999999] col-span-3'>
                        <div className='flex justify-start gap-2 text-[#999999] w-full'>
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
                      <div className='flex justify-start col-span-1 text-[#333333] text-sm pr-2'>
                        {formatDateTime(violation?.updatedAt as string)}
                      </div>
                      <div className='flex justify-start col-span-2 text-[#333333] text-sm pr-2'>
                        {violation?.typeViolation.title}
                      </div>
                      <div className='flex justify-start col-span-2 text-[#333333] text-sm pr-2'>
                        {violation?.reasons}
                      </div>
                      <div className='flex justify-start col-span-2 text-[#333333] text-sm pr-2'>
                        {formatDateTime(violation?.deadline as string)}
                      </div>
                      <div className='flex justify-start col-span-2 text-[#333333] text-sm pr-2'>
                        {violation?.suggest}
                      </div>
                    </div>
                    <div className='flex justify-start w-24 flex-col text-sm items-start gap-2 text-blue py-3 pl-2 pr-4'>
                      <Link to={`${path.home + 'shopchannel/portal/product/'}${product.id}`}>Repair</Link>
                      <button type='button' className=' text-sm tex-blue'>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
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
                        pathname: path.productViolationBanned,
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
                        pathname: path.productViolationBanned,
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
                      pathname: path.productViolationBanned,
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
              <Button
                className='text-[#333333] bg-white text-sm px-5 py-[6px] flex items-center justify-center  rounded-md border border-solid border-[#999999]'
                type='button'
                onClick={() => {}}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
