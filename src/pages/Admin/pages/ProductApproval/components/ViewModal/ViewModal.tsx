import { Badge, MantineProvider, Select, Textarea } from '@mantine/core'
import DOMPurify from 'dompurify'
import { useContext, useEffect, useRef, useState } from 'react'
import ImageSmallSlider from 'src/components/ImageSmallSlider'
import config from 'src/constants/config'
import { AppContext } from 'src/contexts/app.context'
import { CategoryResponse } from 'src/types/category.type'
import {
  ProductDetailForAdminResponse,
  ProductViolationReportRequest,
  VariantsGroupResponse
} from 'src/types/product.type'
import {
  calculateFromToPrice,
  formatCurrency,
  variantColorResolver,
  generateCategoryNameId,
  getIdFromCategoryNameId,
  calculateTotalStockQuantity,
  GMTToLocalStingTime
} from 'src/utils/utils'
import { addMinutes, getMonth, getYear } from 'date-fns'
import DatePicker from 'react-datepicker'
import statusProduct from 'src/constants/status'
import { ProductTabsProcessContext } from 'src/contexts/productTabsProcess.context'
import { InvalidateQueryFilters, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import violationApi from 'src/apis/violation.api'
import productApi from 'src/apis/product.api'
import ButtonModal from 'src/pages/Admin/components/ButtonModal/ButtonModal'
import ButtonViewHistory from 'src/pages/Admin/components/ButtonViewHistory'
import VariantButton from 'src/pages/User/pages/ProductDetail/VariantButton'

interface Props {
  setIsShowViewProductDetail: (isShow: boolean) => void
  productDetail: ProductDetailForAdminResponse | null
  queryKey: string
}

const range = (start: number, end: number) => {
  return new Array(end - start + 1).fill(null).map((_, i) => i + start)
}

const years = range(1990, getYear(new Date()) + 1)
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

interface Errors {
  typeViolationError: string
  reasonsError: string
  suggestError: string
  deadline: string
}

const errorsValue = {
  typeViolationError: '',
  reasonsError: '',
  suggestError: '',
  deadline: ''
}

export default function ViewModal({ setIsShowViewProductDetail, productDetail, queryKey }: Props) {
  const imageRef = useRef<HTMLImageElement>(null)
  const queryClient = useQueryClient()
  const [activeImage, setActiveImage] = useState<string>('')
  const [variantsGroup, setVariantsGroup] = useState<VariantsGroupResponse[]>([])
  const [productPrice, setProductPrice] = useState<string>('')
  const [listStringCategory, setListStringCategory] = useState<string[]>(['', '', '', '', ''])
  const { categories } = useContext(AppContext)
  const [selectedVariants, setSelectedVariants] = useState<string[]>(['', ''])
  const [productStockQuantity, setProductStockQuantity] = useState<number | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [reasons, setReasons] = useState<string>('')
  const [suggest, setSuggest] = useState<string>('')
  const [deadline, setDeadline] = useState<Date | null>(addMinutes(new Date(), 10))
  const [typeViolationId, setTypeViolationId] = useState<string>('')
  const [errorsForm, setErrorsForm] = useState<Errors>(errorsValue)
  const { typeOfViolations } = useContext(ProductTabsProcessContext)

  const createReportViolationMutation = useMutation({
    mutationFn: violationApi.addReportViolation
  })

  const listProductForSaleMutation = useMutation({
    mutationFn: productApi.listProductForSale
  })

  const handleClickOutside = () => {
    setIsShowViewProductDetail(false)
  }

  useEffect(() => {
    if (productDetail) {
      let newVariantsGroup: VariantsGroupResponse[] = []

      if (productDetail.productImages) {
        setActiveImage(productDetail.productImages[0].imageUrl)
      }

      if (productDetail.variantsGroup) {
        productDetail.variantsGroup.forEach((group) => {
          if (group.isPrimary) {
            newVariantsGroup = [group, ...newVariantsGroup]
          } else {
            newVariantsGroup = [...newVariantsGroup, group]
          }
        })
      }

      setVariantsGroup(newVariantsGroup)

      if (categories) {
        for (let index = 0; index < categories.length; index++) {
          const category = categories[index]

          const checkCategoryId = searchCategory(category, productDetail.categoryId, 0)
          if (checkCategoryId) {
            break
          }
        }
      }
    } else {
      setVariantsGroup([])
    }
  }, [productDetail, categories])

  useEffect(() => {
    if (productDetail) {
      let currentProductPrice = ''
      let currentProductStockQuantity = 0

      if (!productDetail.isVariant && productDetail.price) {
        currentProductPrice = '₫' + formatCurrency(productDetail.price)
        currentProductStockQuantity = productDetail.stockQuantity
      } else {
        currentProductPrice = calculateFromToPrice(productDetail?.productVariants)
        currentProductStockQuantity = calculateTotalStockQuantity(productDetail?.productVariants)

        const getProductVariant = () => {
          if (productDetail.variantsGroup.length === 1 && selectedVariants[0]) {
            return productDetail.productVariants.find((item) => item.variant1.id === selectedVariants[0])
          } else if (productDetail.variantsGroup.length === 2 && selectedVariants[0] && selectedVariants[1]) {
            return productDetail.productVariants.find(
              (item) => item.variant1.id === selectedVariants[0] && item.variant2.id === selectedVariants[1]
            )
          }
          return null
        }

        const currentProductVariant = getProductVariant()
        if (currentProductVariant) {
          currentProductPrice = '₫' + formatCurrency(currentProductVariant.price ?? 0)
          currentProductStockQuantity = currentProductVariant.stockQuantity ?? 0
        }
      }

      setProductPrice(currentProductPrice)
      setProductStockQuantity(currentProductStockQuantity)
    } else {
      setProductPrice('')
      setProductStockQuantity(null)
    }
  }, [selectedVariants, productDetail])

  const handleZoom = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const react = e.currentTarget.getBoundingClientRect()
    const image = imageRef.current as HTMLImageElement
    const { naturalHeight, naturalWidth } = image
    const { offsetX, offsetY } = e.nativeEvent

    const top = offsetY * (1 - naturalHeight / react.height)
    const left = offsetX * (1 - naturalWidth / react.width)
    image.style.height = naturalHeight + 'px'
    image.style.width = naturalWidth + 'px'
    image.style.maxWidth = 'unset'
    image.style.top = top + 'px'
    image.style.left = left + 'px'
  }

  const chooseActive = (img: string) => {
    setActiveImage(img)
  }

  const handleRemoveZoom = () => {
    imageRef.current?.removeAttribute('style')
  }

  const searchCategory = (category: CategoryResponse, categoryIds: string, level: number): boolean => {
    const listCategoryId = categoryIds.split('.')
    const currentListCategory = listStringCategory
    if (category.id == listCategoryId[listCategoryId.length - 1]) {
      currentListCategory[level] = generateCategoryNameId({
        name: category.name,
        stringIds: category.parentId ? category.parentId + '.' + category.id : category.id
      })
      setListStringCategory(currentListCategory)
      return true
    }

    if (category.categoriesChild) {
      const result = category.categoriesChild.some((child) => searchCategory(child, categoryIds, level + 1))
      if (result) {
        currentListCategory[level] = generateCategoryNameId({
          name: category.name,
          stringIds: category.parentId ? category.parentId + '.' + category.id : category.id
        })
        setListStringCategory(currentListCategory)
      }
      return result
    }

    return false
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const handleReportViolation = async (close: () => void) => {
    const isSubmit = checkFormSubmit()

    if (isSubmit) {
      close()
      const newReportViolation: ProductViolationReportRequest = {
        productId: [productDetail?.id ?? ''],
        typeViolationId: typeViolationId,
        status: statusProduct.TEMPORARILY_LOCKED,
        reasons: reasons,
        suggest: suggest,
        deadline: GMTToLocalStingTime(deadline ?? new Date())
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

      console.log(newReportViolation)
    }
  }

  const handleDelete = async (close: () => void) => {
    const isSubmit = checkFormSubmit()
    if (isSubmit) {
      close()
      const newReportViolation: ProductViolationReportRequest = {
        productId: [productDetail?.id ?? ''],
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

  const handleListingForSale = async (close: () => void) => {
    close()
    if (productDetail?.id) {
      try {
        const createRes = await listProductForSaleMutation.mutateAsync([productDetail?.id])
        if (createRes.data.statusCode === 200) {
          toast.success(createRes.data.message)
          handleCancel()
          const filters: InvalidateQueryFilters = { queryKey: ['getAllListProductForAdmin'] }
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
    setDeadline(new Date())
    setTypeViolationId('')
    setErrorsForm(errorsValue)
  }

  const colorStatus = (value: string): string => {
    switch (value) {
      case statusProduct.DELETE:
        return 'border border-[#fce2e4] bg-[#f8926b]'
      case statusProduct.TEMPORARILY_LOCKED:
        return 'border border-[#ffce3d] bg-[#fff7e0]'
      default:
        return 'bg-white border'
    }
  }

  return (
    <div className='z-30 bottom-0 top-0 left-0 right-0 fixed overflow-hidden bg-[#00000066]'>
      <div className='absolute top-0 bottom-0 left-0 right-0 flex justify-end items-center'>
        <div onClick={handleClickOutside} className='w-full z-30 h-full fixed'></div>
        <div className='z-40 max-w-[1000px] w-[1000px] bg-white rounded-md h-full overflow-y-auto scroll-auto'>
          <div className='flex flex-col'>
            <div className='p-4 bg-transparent'>
              <div
                className={`${productDetail && colorStatus(productDetail?.status)} sticky text-[#333333] z-10 top-0 h-[70px] flex flex-row justify-between items-center mb-4 shadow rounded-md px-3`}
              >
                <button onClick={() => setIsShowViewProductDetail(false)} className=''>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='size-6'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18' />
                  </svg>
                </button>

                {productDetail?.status != statusProduct.DELETE &&
                productDetail?.status != statusProduct.TEMPORARILY_LOCKED &&
                productDetail?.isActive == true ? (
                  <div className='gap-4 flex items-center'>
                    <ButtonModal
                      nameButton='Report a violation'
                      title='Are you sure you want to report the violation to the seller?'
                      size={700}
                      className='px-4 py-2 rounded-md text-sm font-normal bg-[#f4800c] text-white'
                      handleCancel={handleCancel}
                      handleSubmit={handleReportViolation}
                    >
                      <div className='flex flex-col gap-4 min-h-80'>
                        <div className='flex justify-start text-[#999999] col-span-5 my-3'>
                          <div className='flex justify-start gap-2 text-[#999999] col-span-5'>
                            <div className='w-14 h-14'>
                              <img
                                className='w-full h-full object-cover'
                                src={`${config.awsURL}products/${productDetail?.productImages.find((img) => img.isPrimary)?.imageUrl}`}
                                alt={productDetail?.name}
                              />
                            </div>
                            <div className='flex flex-1 pr-2 flex-col gap-1 justify-start items-start'>
                              <div className='line-clamp-2 text-[#333333] text-sm font-bold'>{productDetail?.name}</div>
                              <div className='text-[#666666] line-clamp-1 text-xs'>Product ID: {productDetail?.id}</div>
                            </div>
                          </div>
                        </div>

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
                              placeholder='enter the reason for the violation'
                              size='sm'
                              inputSize='30'
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
                              size='sm'
                              inputSize='30'
                              placeholder='give suggestions to fix bugs for users'
                              minRows={6}
                              maxRows={6}
                              autosize
                              maxLength={500}
                              error={errorsForm.suggestError}
                            />
                          </div>
                        </div>

                        <div className='grid-cols-8 grid items-center text-sm'>
                          <div className='col-span-2'>Bug Fix Expiration Date:</div>
                          <div className='col-span-6 px-3'>
                            <DatePicker
                              className='h-8 border rounded w-full bg-gray-50 outline-none cursor-pointer hover:border-gray-400 transition-colors'
                              showIcon
                              toggleCalendarOnIconClick
                              icon={
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  fill='#000000'
                                  viewBox='0 0 256 256'
                                  className='h-4'
                                >
                                  <path d='M208,34H182V24a6,6,0,0,0-12,0V34H86V24a6,6,0,0,0-12,0V34H48A14,14,0,0,0,34,48V208a14,14,0,0,0,14,14H208a14,14,0,0,0,14-14V48A14,14,0,0,0,208,34ZM48,46H74V56a6,6,0,0,0,12,0V46h84V56a6,6,0,0,0,12,0V46h26a2,2,0,0,1,2,2V82H46V48A2,2,0,0,1,48,46ZM208,210H48a2,2,0,0,1-2-2V94H210V208A2,2,0,0,1,208,210Zm-70-78a10,10,0,1,1-10-10A10,10,0,0,1,138,132Zm44,0a10,10,0,1,1-10-10A10,10,0,0,1,182,132ZM94,172a10,10,0,1,1-10-10A10,10,0,0,1,94,172Zm44,0a10,10,0,1,1-10-10A10,10,0,0,1,138,172Zm44,0a10,10,0,1,1-10-10A10,10,0,0,1,182,172Z'></path>
                                </svg>
                              }
                              onChange={(event) => {
                                setDeadline(event)
                              }}
                              // onBlur={field.onBlur}
                              selected={deadline}
                              shouldCloseOnSelect={true}
                              locale='vi'
                              showTimeSelect
                              filterTime={(time) => new Date().getTime() < new Date(time).getTime()}
                              timeFormat='HH:mm'
                              timeIntervals={1}
                              dateFormat='dd/MM/yyyy, p'
                              minDate={new Date()}
                              maxDate={new Date(new Date().setDate(new Date().getDate() + 10))}
                              renderCustomHeader={({
                                date,
                                changeYear,
                                changeMonth,
                                decreaseMonth,
                                increaseMonth,
                                prevMonthButtonDisabled,
                                nextMonthButtonDisabled
                              }) => (
                                <div className='m-[10px] flex gap-2 justify-center'>
                                  <button
                                    type='button'
                                    className='text-lg'
                                    onClick={decreaseMonth}
                                    disabled={prevMonthButtonDisabled}
                                  >
                                    {'<'}
                                  </button>
                                  <select
                                    className='z-10 text-gray-700 no-scrollbar p-1 rounded-md border border-solid border-gray-300 bg-slate-100'
                                    value={getYear(date)}
                                    onChange={({ target: { value } }) => changeYear(parseInt(value))}
                                  >
                                    {years.map((option) => (
                                      <option key={option} value={option}>
                                        {option}
                                      </option>
                                    ))}
                                  </select>

                                  <select
                                    className='text-gray-700 p-1 rounded-md border border-solid border-gray-300 bg-slate-100'
                                    value={months[getMonth(date)]}
                                    onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
                                  >
                                    {months.map((option) => (
                                      <option key={option} value={option}>
                                        {option}
                                      </option>
                                    ))}
                                  </select>

                                  <button
                                    type='button'
                                    className='text-lg'
                                    onClick={increaseMonth}
                                    disabled={nextMonthButtonDisabled}
                                  >
                                    {'>'}
                                  </button>
                                </div>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </ButtonModal>
                    {productDetail?.status != statusProduct.FOR_SALE && (
                      <ButtonModal
                        size={500}
                        nameButton='Allow listing for sale'
                        title='The product has been reviewed. Are you sure you want to allow it to be listed for sale on the marketplace?'
                        className='px-4 py-2 rounded-md text-sm font-normal bg-[#198754] text-white'
                        handleSubmit={handleListingForSale}
                      >
                        <div className='flex flex-col gap-4'>
                          <div className='flex justify-start text-[#999999] col-span-5 my-3'>
                            <div className='flex justify-start gap-2 text-[#999999] col-span-5'>
                              <div className='w-14 h-14'>
                                <img
                                  className='w-full h-full object-cover'
                                  src={`${config.awsURL}products/${productDetail?.productImages.find((img) => img.isPrimary)?.imageUrl}`}
                                  alt={productDetail?.name}
                                />
                              </div>
                              <div className='flex flex-1 pr-2 flex-col gap-1 justify-start items-start'>
                                <div className='line-clamp-2 text-[#333333] text-sm font-bold'>
                                  {productDetail?.name}
                                </div>
                                <div className='text-[#666666] line-clamp-1 text-xs'>
                                  Product ID: {productDetail?.id}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </ButtonModal>
                    )}
                    <ButtonModal
                      nameButton='Delete'
                      title='Are you sure to delete the product?'
                      size={700}
                      className='px-4 py-2 rounded-md text-sm font-normal bg-[#DC3545] text-white'
                      handleCancel={handleCancel}
                      handleSubmit={handleDelete}
                    >
                      <div className='flex flex-col gap-4 min-h-80 mb-4'>
                        <div className='flex justify-start text-[#999999] col-span-5 my-3'>
                          <div className='flex justify-start gap-2 text-[#999999] col-span-5'>
                            <div className='w-14 h-14'>
                              <img
                                className='w-full h-full object-cover'
                                src={`${config.awsURL}products/${productDetail?.productImages.find((img) => img.isPrimary)?.imageUrl}`}
                                alt={productDetail?.name}
                              />
                            </div>
                            <div className='flex flex-1 pr-2 flex-col gap-1 justify-start items-start'>
                              <div className='line-clamp-2 text-[#333333] text-sm font-bold'>{productDetail?.name}</div>
                              <div className='text-[#666666] line-clamp-1 text-xs'>Product ID: {productDetail?.id}</div>
                            </div>
                          </div>
                        </div>

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
                    </ButtonModal>
                  </div>
                ) : productDetail && productDetail.isActive ? (
                  <div className='flex-1 ml-4 flex flex-row items-center h-full justify-between '>
                    <div className='flex items-center'>
                      <div className='text-[#ffce3d]'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 24 24'
                          fill='currentColor'
                          className='size-5'
                        >
                          <path
                            fillRule='evenodd'
                            d='M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </div>
                      <div className='ml-2 flex items-center '>
                        <div className='text-md text-[#333333]'>Products temporarily hidden due to infringement</div>
                      </div>
                    </div>
                    <div className='ml-2 flex items-center'>
                      <ButtonViewHistory
                        queryKey='getListHistoryViolationOfProduct'
                        listViolation={productDetail.historyViolations}
                        productDetail={productDetail}
                      />
                    </div>
                  </div>
                ) : (
                  <div className='flex text-blue text-md items-center'>
                    The product is in the process of content completion.
                  </div>
                )}
              </div>

              <div className='grid grid-cols-12 gap-9'>
                <div className='col-span-5'>
                  <div
                    className='relative w-full pt-[100%] overflow-hidden cursor-pointer'
                    onMouseMove={(e) => handleZoom(e)}
                    onMouseLeave={handleRemoveZoom}
                  >
                    <img
                      src={`${config.awsURL}products/${activeImage}`}
                      alt={productDetail?.name}
                      className='absolute pointer-events-none left-0 top-0 h-full w-full bg-white object-cover'
                      ref={imageRef}
                    />
                  </div>
                  {productDetail?.productImages && (
                    <div className='mt-4'>
                      <ImageSmallSlider
                        activeImage={activeImage}
                        chooseActive={chooseActive}
                        images={productDetail.productImages}
                        size={'h-20'}
                        slidesToShow={4}
                      />
                    </div>
                  )}
                </div>
                <div className='col-span-7'>
                  <h1 className='text-lg font-medium line-clamp-2'>{productDetail?.name}</h1>

                  <div className='mt-4 flex items-center bg-gray-50 px-5 py-2'>
                    <div className='text-2xl font-medium text-blue'>{productPrice}</div>
                  </div>

                  {/* variations */}
                  <div className={`mt-2 bg-white pb-[15px] pt-[10px] pl-[20px] pr-[35px]`}>
                    <div className='flex flex-col'>
                      {variantsGroup &&
                        variantsGroup.map((groupItem, iGroup) => (
                          <div key={iGroup} className='w-full'>
                            <div className='mb-2 grid grid-cols-10'>
                              <div className='col-span-2 h-10 flex items-center mt-2'>
                                <div className='text-[#757575] text-sm w-full'>{groupItem.name}</div>
                              </div>
                              <div className='col-span-8 flex flex-wrap overflow-y-auto max-h-56 text-[#000000cc] h-auto'>
                                {groupItem.variants &&
                                  groupItem.variants.map((variant, iVariant) => (
                                    <VariantButton
                                      key={iVariant}
                                      variantData={variant}
                                      activeImage={activeImage}
                                      indexGroupVariant={iGroup + 1}
                                      setActiveImage={setActiveImage}
                                      selectedVariants={selectedVariants}
                                      setSelectedVariants={setSelectedVariants}
                                    />
                                  ))}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className='grid grid-cols-10'>
                    <div className='col-span-3 h-10 flex items-center'>
                      <div className='text-[#333333] text-sm w-full'>Stock quantity: </div>
                    </div>
                    <div className='col-span-7 flex items-center h-10 text-[#000000cc] '>
                      <div className='text-[13px] text-[#05a]'>{productStockQuantity} pieces available</div>
                    </div>
                  </div>

                  <div className='grid grid-cols-10'>
                    <div className='col-span-2 h-10 flex items-center'>
                      <div className='text-[#333333] text-sm w-full'>Status: </div>
                    </div>
                    <div className='col-span-8 flex items-center h-10 text-[#000000cc] '>
                      <MantineProvider theme={{ variantColorResolver }}>
                        <Badge className='px-4 py-4 text-sm' color='lime.4' variant={productDetail?.status}>
                          {productDetail?.status}
                        </Badge>
                      </MantineProvider>
                    </div>
                  </div>
                </div>
              </div>

              <div className='bg-white shadow'>
                <section className='pt-4 px-4'>
                  <div className='rounded bg-gray-50 p-3 text-lg capitalize text-[#000000DE]'>
                    Product Specifications
                  </div>
                  <div className='mx-3 mt-4 mb-4 text-sm leading-loose'>
                    <div className='flex justify-start items-center h-fit mb-2'>
                      <div className='w-36 text-[#00000066] pr-3'>Shop info</div>
                      <div className='flex items-center text-[#000000CC] justify-start line-clamp-1'>
                        <div className='flex col-span-3 flex-row gap-1 items-center py-1 h-full'>
                          <div className='w-10 h-10 flex-shrink-0'>
                            <img
                              src={productDetail?.shop.avatarUrl}
                              alt='avatar'
                              className='w-full h-full object-cover rounded-full'
                            />
                          </div>
                          <div className='flex flex-col gap-1 items-start'>
                            <span className='text-sm'>{productDetail?.shop.userName}</span>
                            <div className='text-[#666666] line-clamp-1 text-xs'>ID : {productDetail?.shop.id}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='flex justify-start items-center h-fit mb-2'>
                      <div className='w-36 text-[#00000066] pr-3'>Category</div>
                      <div className='flex items-center justify-start line-clamp-1'>
                        {listStringCategory &&
                          listStringCategory.map((string, index) => {
                            if (string != '') {
                              return (
                                <div key={index} className='flex items-center justify-start'>
                                  {index > 0 && (
                                    <div className='mx-1'>
                                      <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        strokeWidth={1.2}
                                        stroke='currentColor'
                                        className='size-4 text-[#757575]'
                                      >
                                        <path
                                          strokeLinecap='round'
                                          strokeLinejoin='round'
                                          d='m8.25 4.5 7.5 7.5-7.5 7.5'
                                        />
                                      </svg>
                                    </div>
                                  )}
                                  <div className='text-[13px] text-[#05a]'>{getIdFromCategoryNameId(string).name}</div>
                                </div>
                              )
                            }
                          })}
                      </div>
                    </div>

                    <div className='flex justify-start items-center h-fit mb-2'>
                      <div className='w-36 text-[#00000066] pr-3'>Brand</div>
                      <div className='flex items-center text-[#000000CC] justify-start line-clamp-1'>
                        {productDetail?.brand}
                      </div>
                    </div>
                    <div className='flex justify-start items-center h-fit mb-2'>
                      <div className='w-36 text-[#00000066] pr-3'>Condition</div>
                      <div className='flex items-center text-[#000000CC] justify-start line-clamp-1'>
                        {productDetail?.conditionProduct}
                      </div>
                    </div>
                  </div>
                </section>

                <section className='pt-4 relative px-4 pb-3'>
                  <div className='rounded bg-gray-50 p-3 text-lg capitalize text-[#000000DE]'>Product Description</div>
                  <div
                    className={`relative mx-3 text-[#000000CC] mt-4 mb-1 text-sm leading-loose transition-all duration-200 ease-linear overflow-hidden ${
                      isExpanded ? 'max-h-full' : 'max-h-[200px]'
                    }`}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(productDetail?.description as string)
                      }}
                    />
                    {!isExpanded && (
                      <div className='absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none' />
                    )}
                  </div>
                  <div className={`${isExpanded ? '' : 'absolute bottom-4 w-full'} flex items-center justify-center`}>
                    <button onClick={toggleExpand} className='text-blue text-sm mx-3'>
                      {isExpanded ? 'Collapse' : 'View More'}
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
