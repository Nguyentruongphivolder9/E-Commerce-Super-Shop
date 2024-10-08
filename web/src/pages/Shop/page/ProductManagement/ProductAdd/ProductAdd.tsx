import { useContext, useEffect, useRef, useState } from 'react'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragEndEvent
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import ImageItem from '../../../components/ImageItem'
import CategoryList from '../../../components/CategoryList'
import { Link, useNavigate } from 'react-router-dom'
import VariationsForm from './VariationsForm'
import { generateUniqueId } from 'src/utils/utils'
import { Controller, FormProvider, useFieldArray, useWatch } from 'react-hook-form'
import Button from 'src/components/Button'
import {
  PreviewImagesResponse,
  ProductVariantsRequest,
  VariantsGroupRequest,
  VariantsRequest
} from 'src/types/product.type'
import productApi from 'src/apis/product.api'
import { useMutation } from '@tanstack/react-query'
import { FormDataProduct, ProductAddContext } from 'src/contexts/productAdd.context'
import { toast } from 'react-toastify'
import config from 'src/constants/config'
import { useDisclosure } from '@mantine/hooks'
import { Popover, Select } from '@mantine/core'
import TipTapEditor from 'src/pages/Shop/components/TipTapEditor'
import path from 'src/constants/path'
import ButtonCancel from 'src/pages/Shop/components/ButtonCancel'
import ButtonPublish from './ButtonPublish'
import ButtonDelist from './ButtonDelist'
export default function ProductAdd() {
  const fileInputImagesRef = useRef<HTMLInputElement>(null)
  const [images, setImages] = useState<PreviewImagesResponse[]>([])
  const [isDisplayCateList, setIsDisplayCateList] = useState(false)
  const [isDisplayFormVariations, setIsDisplayFormVariations] = useState(false)
  const [arraysVariant1, setArraysVariant1] = useState<VariantsRequest[]>([])
  const [arraysVariant2, setArraysVariant2] = useState<VariantsRequest[]>([])
  const [categoryValue, setCategoryValue] = useState<string>('')
  const [applyPrice, setApplyPrice] = useState<number>(0)
  const [applyStock, setApplyStock] = useState<number>(0)
  const { productMethods } = useContext(ProductAddContext)
  const [opened, { close, open }] = useDisclosure(false)
  const navigator = useNavigate()

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    getValues,
    clearErrors,
    setError
  } = productMethods

  const {
    fields: fieldsVariantsGroup,
    append: appendVariantsGroup,
    remove: removeVariantsGroup,
    update: updateVariantsGroup,
    replace: replaceVariantsGroup
  } = useFieldArray({
    control,
    name: 'variantsGroup'
  })

  const {
    append: appendProductImages,
    remove: removeProductImages,
    move: moveProductImages
  } = useFieldArray({
    control,
    name: 'productImages'
  })

  const {
    append: appendProductVariants,
    update: updateProductVariants,
    replace: replaceProductVariants
  } = useFieldArray({
    control,
    name: 'productVariants'
  })

  const variantsGroupWatch = useWatch({
    control,
    name: 'variantsGroup'
  })
  const productVariantsWatch = useWatch({
    control,
    name: 'productVariants'
  })
  const productImagesWatch = useWatch({
    control,
    name: 'productImages'
  })

  const productCreateMutation = useMutation({
    mutationFn: productApi.productCreate
  })

  const preCheckImageCreateMutation = useMutation({
    mutationFn: productApi.preCheckImageInfoProCreate
  })
  const preCheckImageDeleteMutation = useMutation({
    mutationFn: productApi.preCheckImageInfoProRemove
  })

  useEffect(() => {
    setImages(productImagesWatch as PreviewImagesResponse[])
  }, [productImagesWatch])

  const handleUploadImages = () => {
    fileInputImagesRef.current?.click()
  }

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    const formData = new FormData()

    if (!files || files.length === 0) return

    const maxImages = 9
    const currentImageCount = images.length
    const remainingSlots = maxImages - currentImageCount
    const filesToAdd = Math.min(files.length, remainingSlots)

    for (let i = 0; i < filesToAdd; i++) {
      const fileExtension = files[i].name.split('.').pop()?.toLowerCase()
      const validExtensions = ['png', 'jpg', 'jpeg']

      if (!fileExtension || !validExtensions.includes(fileExtension)) continue
      if (files[i].type.split('/')[0] !== 'image') continue

      if (files[i].size > 2097152) continue

      formData.append('imageFiles', files[i])
    }

    try {
      const arraysImage: PreviewImagesResponse[] = []
      const responsePreCheckImage = await preCheckImageCreateMutation.mutateAsync(formData)
      const resultPreCheckImage = responsePreCheckImage.data.body
      console.log(resultPreCheckImage)

      resultPreCheckImage?.forEach((item) => {
        const newImage = {
          id: item.id,
          imageUrl: item.imageUrl
        }
        arraysImage.push(newImage)
      })
      appendProductImages(arraysImage)
    } catch (error) {
      console.log(error)
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const getTaskPos = (id: string) => images.findIndex((image) => image.id === id)

  const handleImageDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id === over?.id) return

    const originalPos = getTaskPos(active.id as string)
    const newPos = getTaskPos(over?.id as string) as number

    moveProductImages(originalPos, newPos)
  }

  const deleteImage = async (id: string, index: number) => {
    try {
      await preCheckImageDeleteMutation.mutateAsync(id)
      removeProductImages(index)
    } catch (error) {
      console.log(error)
    }
  }

  const handlerShowCategoryList = () => {
    if (isDisplayCateList) {
      document.body.style.overflow = 'auto'
      setIsDisplayCateList(false)
    } else {
      document.body.style.overflow = 'hidden'
      setIsDisplayCateList(true)
    }
  }

  const handlerRemoveVariations = (index: number) => {
    if (
      variantsGroupWatch === null ||
      variantsGroupWatch === undefined ||
      variantsGroupWatch.length === 0 ||
      variantsGroupWatch.length > 2
    ) {
      return
    } else if (variantsGroupWatch.length === 1) {
      setValue('isVariant', false)
      replaceVariantsGroup([])
      replaceProductVariants([])
      clearErrors(`variantsGroup`)
      setIsDisplayFormVariations(false)
    } else {
      const removeItemVariantsGroup = variantsGroupWatch.find((_, idx) => idx === index)

      // nếu xóa variant group có isPrimary là true
      if (removeItemVariantsGroup?.isPrimary) {
        const variantsGroup = variantsGroupWatch.find((item, idx) => idx !== index && item.isPrimary === false)

        if (variantsGroup !== undefined) {
          replaceProductVariants([])
          const newObjectProductVariant: ProductVariantsRequest[] = []

          variantsGroup.variants?.forEach((item) => {
            const newProductVariant = {
              id: generateUniqueId(),
              price: 0,
              stockQuantity: 0,
              variantsGroup1Id: variantsGroup.id,
              variant1Id: item.id,
              variantsGroup2Id: '',
              variant2Id: ''
            }
            newObjectProductVariant.push(newProductVariant)
            variantsGroup.isPrimary = true
            updateVariantsGroup(index + 1, variantsGroup)
          })

          appendProductVariants(newObjectProductVariant)
          removeVariantsGroup(index)
        }
        // nếu xóa variant group có isPrimary là false
      } else {
        const variantsGroup = variantsGroupWatch.find((item, idx) => idx !== index && item.isPrimary === true)
        replaceProductVariants([])
        const newObjectProductVariant: ProductVariantsRequest[] = []

        variantsGroup?.variants?.forEach((item) => {
          const newProductVariant = {
            id: generateUniqueId(),
            price: 0,
            stockQuantity: 0,
            variantsGroup1Id: variantsGroup.id,
            variant1Id: item.id,
            variantsGroup2Id: '',
            variant2Id: ''
          }
          newObjectProductVariant.push(newProductVariant)
        })

        appendProductVariants(newObjectProductVariant)
        removeVariantsGroup(index)
      }
    }
  }

  const handlerAddVariations = () => {
    if (fieldsVariantsGroup.length >= 2) {
      return
    } else if (fieldsVariantsGroup.length === 1) {
      const newVariant2 = {
        id: generateUniqueId(),
        name: '',
        variantImage: {},
        isActive: true
      }

      const newVariantGroup2 = {
        id: generateUniqueId(),
        name: '',
        isPrimary: false,
        variants: [newVariant2]
      }

      replaceProductVariants([])
      variantsGroupWatch?.forEach((itemVariantsGroup) => {
        if (itemVariantsGroup.isPrimary) {
          itemVariantsGroup.variants?.forEach((itemVariant1) => {
            const newProductVariant = {
              id: generateUniqueId(),
              price: 0,
              stockQuantity: 0,
              variantsGroup1Id: itemVariantsGroup.id,
              variant1Id: itemVariant1.id,
              variantsGroup2Id: newVariantGroup2.id,
              variant2Id: newVariant2.id
            }
            appendProductVariants([newProductVariant])
          })
        }
      })

      appendVariantsGroup([newVariantGroup2])
    } else {
      const newVariant = {
        id: generateUniqueId(),
        name: '',
        variantImage: {},
        isActive: true
      }
      const newVariantGroup = {
        id: generateUniqueId(),
        name: '',
        isPrimary: true,
        variants: [newVariant]
      }

      const newProductVariant = {
        id: generateUniqueId(),
        price: 0,
        stockQuantity: 0,
        variantsGroup1Id: newVariantGroup.id,
        variant1Id: newVariant.id,
        variantsGroup2Id: null,
        variant2Id: null
      }
      appendProductVariants([newProductVariant])
      appendVariantsGroup([newVariantGroup])
      setIsDisplayFormVariations(true)
      setValue('isVariant', true)
    }
  }

  useEffect(() => {
    setArraysVariant1([])
    setArraysVariant2([])
    variantsGroupWatch?.forEach((item) => {
      if (item.isPrimary) {
        setArraysVariant1(item.variants as VariantsRequest[])
      } else {
        setArraysVariant2(item.variants as VariantsRequest[])
      }
    })
  }, [variantsGroupWatch, setError])

  const onSubmitDelist = handleSubmit(async (data) => {
    data.isActive = false
    try {
      const createProRes = await productCreateMutation.mutateAsync(data as FormDataProduct)
      if (createProRes.data.statusCode === 201) {
        toast.success(createProRes.data.message)
        navigator(path.productManagementAll)
      }
    } catch (error) {
      console.log(error)
    }
  })

  const onSubmitPublish = handleSubmit(async (data) => {
    data.isActive = true
    try {
      const createProRes = await productCreateMutation.mutateAsync(data as FormDataProduct)
      if (createProRes.data.statusCode === 201) {
        toast.success(createProRes.data.message)
        navigator(path.productManagementAll)
      }
    } catch (error) {
      console.log(error)
    }
  })

  const handleSubmitSaveProduct = (open: () => void) => {
    handleSubmit(async (data) => {
      if (!Object.keys(errors).length) {
        open()
      }
    })()
  }

  const handleApplyToAll = () => {
    productVariantsWatch?.forEach((item, index) => {
      updateProductVariants(index, {
        id: item.id,
        price: applyPrice,
        stockQuantity: applyStock,
        variantsGroup1Id: item.variantsGroup1Id,
        variant1Id: item.variant1Id,
        variantsGroup2Id: item.variantsGroup2Id,
        variant2Id: item.variant2Id
      } as ProductVariantsRequest)
    })
  }

  return (
    <div>
      {isDisplayCateList && (
        <CategoryList
          handlerShowCategoryList={handlerShowCategoryList}
          setCategoryId={setValue}
          setCategoryValue={setCategoryValue}
          categoryValue={categoryValue}
        />
      )}
      <div className='grid grid-cols-11 gap-4'>
        <FormProvider {...productMethods}>
          <form className='col-span-9'>
            <div className='sticky z-10 top-14 h-14 flex flex-row rounded-md bg-white items-center shadow mb-4'>
              <div className='px-4 text-sm font-normal hover:text-blue'>Basic information</div>
              {/* <div className='px-4 text-sm font-normal hover:text-blue'>Specification</div> */}
              <div className='px-4 text-sm font-normal hover:text-blue'>Sales Information</div>
              {/* <div className='px-4 text-sm font-normal hover:text-blue'>Shipping</div> */}
              <div className='px-4 text-sm font-normal hover:text-blue'>Others</div>
            </div>

            {/* Basic Information */}
            <div className='p-6 rounded-md bg-white shadow mb-6'>
              <div className='text-xl text-[#333333] font-bold mb-6'>Basic Information</div>
              <div className='mb-6'>
                {/* Product Image */}
                <div className='grid grid-cols-11 mb-6'>
                  <div className='col-span-2 flex flex-row justify-end items-start gap-1 mr-5'>
                    <span className='text-red-600 text-xs'>*</span>
                    <div className='text-sm text-[#333333]'>Product Images</div>
                  </div>
                  <div className='col-span-9 flex flex-col justify-center'>
                    <div className='bg-white rounded-sm p-1 flex-wrap flex items-center flex-row gap-3 w-full'>
                      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleImageDragEnd}>
                        <SortableContext items={images} strategy={verticalListSortingStrategy}>
                          {images.map((image, index) => (
                            <ImageItem
                              key={image.id}
                              id={image.id as string}
                              index={index}
                              imageUrl={image.imageUrl}
                              deleteImage={deleteImage}
                            />
                          ))}
                        </SortableContext>
                      </DndContext>
                      {images.length < 9 && (
                        <div className='w-24 h-24 border-dashed border-2 border-blue rounded-md flex items-center justify-center'>
                          <input
                            className='hidden'
                            type='file'
                            accept='.jpg,.jpeg,.png'
                            ref={fileInputImagesRef}
                            onChange={onFileChange}
                            multiple
                          />
                          <button
                            className='h-full w-full flex flex-col justify-center items-center'
                            type='button'
                            onClick={handleUploadImages}
                          >
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width={30}
                              height={30}
                              fill='#0099FF'
                              viewBox='0 0 256 256'
                            >
                              <path d='M216,40H72A16,16,0,0,0,56,56V72H40A16,16,0,0,0,24,88V200a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V184h16a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM72,56H216v62.75l-10.07-10.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L72,109.37ZM184,200H40V88H56v80a16,16,0,0,0,16,16H184Zm32-32H72V132l36-36,49.66,49.66a8,8,0,0,0,11.31,0L194.63,120,216,141.38V168ZM160,84a12,12,0,1,1,12,12A12,12,0,0,1,160,84Z' />
                            </svg>
                            <div className='text-xs text-blue flex flex-col'>
                              <span>Add Image</span>
                              <span>({images.length}/9)</span>
                            </div>
                          </button>
                        </div>
                      )}
                    </div>
                    <div
                      className={`${errors.productImages?.message ? 'visible' : 'invisible'} mt-1 h-4 text-xs px-2 text-[#ff4742]`}
                    >
                      {errors.productImages?.message}
                    </div>
                  </div>
                </div>

                {/* Promotion Name */}
                <div className='grid grid-cols-11 mb-6'>
                  <div className='col-span-2 flex flex-row justify-end items-center gap-1 mr-5'>
                    <span className='text-red-600 text-xs'>*</span>
                    <div className='text-sm text-[#333333]'>Promotion Name</div>
                  </div>
                  <div className='col-span-9 flex items-center'>
                    <div className='bg-white rounded-sm p-1 flex items-center flex-row gap-3 w-full'>
                      {images.length !== 0 ? (
                        <div className='group w-24 h-24 relative border-dashed border-2 border-blue rounded-md overflow-hidden flex items-center'>
                          <img
                            className='object-cover h-full w-full'
                            src={`${config.awsURL}products/${images[0].imageUrl}`}
                            alt={'upload file'}
                          />
                        </div>
                      ) : (
                        <div className='w-24 h-24 border-dashed border-2 border-blue rounded-md flex items-center justify-center'>
                          <div className='h-full w-full flex flex-col justify-center items-center cursor-not-allowed'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width={30}
                              height={30}
                              fill='#0099FF'
                              viewBox='0 0 256 256'
                            >
                              <path d='M216,40H72A16,16,0,0,0,56,56V72H40A16,16,0,0,0,24,88V200a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V184h16a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM72,56H216v62.75l-10.07-10.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L72,109.37ZM184,200H40V88H56v80a16,16,0,0,0,16,16H184Zm32-32H72V132l36-36,49.66,49.66a8,8,0,0,0,11.31,0L194.63,120,216,141.38V168ZM160,84a12,12,0,1,1,12,12A12,12,0,0,1,160,84Z' />
                            </svg>
                            <div className='text-xs text-blue flex flex-col'>
                              <span>(0/1)</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <ul className='flex-1 pl-4'>
                        <li className='text-xs text-[#999999] list-disc'>Size: Max 2Mb</li>
                        <li className='text-xs text-[#999999] list-disc'>Format: .png, .jpg, .jpeg</li>
                        <li className='text-xs text-[#999999] list-disc'>
                          Promotion Image will be used on the promotion page, search result page, daily discover,
                          etc，Upload Promotion Image will inspire buyers to click on your product.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className='grid grid-cols-11 mb-3 items-start'>
                  <div className='col-span-2 h-10 flex flex-row justify-end items-center gap-1 mr-5'>
                    <span className='text-red-600 text-xs'>*</span>
                    <div className='text-sm text-[#333333]'>Product Name</div>
                  </div>
                  <div className='col-span-9'>
                    <div
                      className={`px-5 border h-10 rounded-md flex items-center p-1 ${errors.name?.message ? 'border-[#ff4742]' : 'hover:border-[#999999]'}`}
                    >
                      <div className='bg-white rounded-sm p-1 flex items-center flex-row justify-between w-full'>
                        <input
                          type='text'
                          {...register('name')}
                          maxLength={120}
                          className='text-sm text-[#333333] w-full border-none outline-none pr-3'
                          placeholder='Brand Name + Product Type + Key Features (Materials, Colors, Size, Model)'
                        />
                        <div className='text-sm text-[#999999]'>{watch().name?.length}/120</div>
                      </div>
                    </div>
                    <div
                      className={`${errors.name?.message ? 'visible' : 'invisible'} mt-1 h-4 text-xs px-2 text-[#ff4742]`}
                    >
                      {errors.name?.message}
                    </div>
                  </div>
                </div>

                <div className='grid grid-cols-11 mb-3'>
                  <div className='col-span-2 h-10 flex flex-row justify-end items-center gap-1 mr-5'>
                    <span className='text-red-600 text-xs'>*</span>
                    <div className='text-sm text-[#333333]'>Category</div>
                  </div>
                  <div className='col-span-9'>
                    <div
                      className={`px-5 border h-10 rounded-md flex items-center p-1  ${errors.categoryId?.message ? 'border-[#ff4742]' : 'hover:border-[#999999]'}`}
                    >
                      <button
                        onClick={handlerShowCategoryList}
                        type='button'
                        className='bg-white rounded-sm p-1 flex items-center flex-row justify-between w-full cursor-pointer'
                      >
                        <input hidden {...register('categoryId')} />
                        <input
                          type='text'
                          value={categoryValue}
                          className='text-sm text-[#333333] w-full border-none outline-none pr-3 cursor-pointer'
                          placeholder='Please set category'
                          readOnly
                        />
                        <div className='flex-shrink-0 bg-orange hover:opacity-95'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth={1.5}
                            stroke='currentColor'
                            className='size-5 text-[#999999]'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10'
                            />
                          </svg>
                        </div>
                      </button>
                    </div>
                    <div
                      className={`${errors.categoryId?.message ? 'visible' : 'invisible'} mt-1 h-4 text-xs px-2 text-[#ff4742]`}
                    >
                      {errors.categoryId?.message}
                    </div>
                  </div>
                </div>

                <div className='grid grid-cols-11 mb-3'>
                  <div className='col-span-2 flex flex-row justify-end gap-1 mr-5'>
                    <span className='text-red-600 text-xs'>*</span>
                    <div className='text-sm text-[#333333]'>Product Description</div>
                  </div>
                  <div className='col-span-9 relative'>
                    <TipTapEditor
                      control={control}
                      className={`rounded-md overflow-hidden flex flex-col border ${errors.description?.message ? 'border-[#ff4742]' : 'hover:border-[#999999]'}`}
                    />
                    <div
                      className={`${errors.description?.message ? 'visible' : 'invisible'} mt-1 h-4 text-xs px-2 text-[#ff4742]`}
                    >
                      {errors.description?.message}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Specification */}
            {/* <div className='p-6 rounded-md bg-white shadow mb-6'>
                <div className='mb-6'>
                  <h2 className='text-xl text-[#333333] font-bold'>Basic information</h2>
                  <p className='text-sm text-[#999999]'>
                    <span className='text-[#333333]'>Complete: 0 / 9 </span>Fill in more attributes to boost the exposure
                    of your product.
                    <Link to={'#'} className='text-blue'>
                      How to set attributes
                    </Link>
                  </p>
                </div>
              </div> */}

            {/* Sales Information */}
            <div className='p-6 rounded-md bg-white shadow mb-6'>
              <div className='text-xl text-[#333333] font-bold mb-6'>Sales Information</div>
              <div className='mb-6'>
                <div className='grid grid-cols-11 mb-6 items-start'>
                  <div className='col-span-2 h-10 flex flex-row justify-end items-center gap-2 mr-5'>
                    <span className='relative flex h-2 w-2'>
                      <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-blue opacity-75' />
                      <span className='relative inline-flex rounded-full h-2 w-2 bg-sky-500' />
                    </span>

                    <div className='text-sm text-[#333333]'>Variations</div>
                  </div>

                  {isDisplayFormVariations ? (
                    <VariationsForm
                      variantsGroup={fieldsVariantsGroup as VariantsGroupRequest[]}
                      handlerAddVariations={handlerAddVariations}
                      handlerRemoveVariations={handlerRemoveVariations}
                    />
                  ) : (
                    <div
                      onClick={handlerAddVariations}
                      aria-hidden={true}
                      className='w-48 px-5 h-10 rounded-md flex items-center p-1 hover:border-blue hover:bg-sky-100 border-dashed border-[1px] border-[#999999] cursor-pointer'
                    >
                      <div className=' rounded-sm p-1 flex items-center flex-row justify-between w-full text-blue bg-transparent'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          strokeWidth={1.3}
                          stroke='currentColor'
                          className='size-5'
                        >
                          <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
                        </svg>
                        <span className='text-sm'>Enable Variations</span>
                      </div>
                    </div>
                  )}
                </div>
                {isDisplayFormVariations && (
                  <div className='grid grid-cols-11 mb-6 items-start'>
                    <div className='col-span-2 h-10 flex flex-row justify-end items-center gap-2 mr-5'>
                      <span className='relative flex h-2 w-2'>
                        <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-blue opacity-75' />
                        <span className='relative inline-flex rounded-full h-2 w-2 bg-sky-500' />
                      </span>

                      <div className='text-sm text-[#333333]'>Variation List</div>
                    </div>
                    <div className='col-span-9 flex flex-col gap-1'>
                      <div className='flex flex-row gap-3'>
                        <div className='flex-1 grid grid-cols-2 divide-x border-[2px] rounded-md overflow-hidden'>
                          <div className='bg-white p-1 flex items-center flex-row justify-between w-full'>
                            <div className='border-r-2 pr-2'>
                              <span className='text-md text-[#999999]'>₫</span>
                            </div>
                            <input
                              type='number'
                              className='text-sm text-[#333333] w-full border-none outline-none pl-2 appearance:textfield [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                              placeholder='Price'
                              onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                e.target.value = e.target.value.replace(/[^0-9]/g, '')
                              }}
                              onChange={(e) => {
                                setApplyPrice(Number.parseInt(e.target.value.replace(/[^0-9]/g, '')))
                              }}
                              value={applyPrice}
                            />
                          </div>
                          <div className='bg-white p-1 flex items-center flex-row justify-between w-full'>
                            <input
                              type='number'
                              className='text-sm text-[#333333] w-full border-none outline-none pl-2 appearance:textfield [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                              placeholder='Stock'
                              onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                e.target.value = e.target.value.replace(/[^0-9]/g, '')
                              }}
                              onChange={(e) => {
                                setApplyStock(Number.parseInt(e.target.value.replace(/[^0-9]/g, '')))
                              }}
                              value={applyStock}
                            />
                          </div>
                        </div>
                        <Button
                          className='text-white bg-blue font-medium text-sm h-9 w-36 flex items-center justify-center  rounded-md'
                          type='button'
                          onClick={() => handleApplyToAll()}
                        >
                          Apply To All
                        </Button>
                      </div>
                      <div className='w-full flex mt-3'>
                        <div className='rounded-md overflow-hidden w-full flex flex-col border-separate border-[1px] border-gray-300'>
                          <div className='flex w-full'>
                            <div className='relative'>
                              <div className='flex'>
                                {variantsGroupWatch &&
                                  variantsGroupWatch.map((item) => {
                                    if (item.isPrimary) {
                                      return (
                                        <div key={item.id} className='min-h-16 w-[115px] bg-[#F5F5F5F5]'>
                                          <div className='w-full h-full flex p-3 items-center justify-center gap-2 border-[1px] border-gray-300'>
                                            <span className='relative flex h-2 w-2'>
                                              <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-blue opacity-75' />
                                              <span className='relative inline-flex rounded-full h-2 w-2 bg-sky-500' />
                                            </span>
                                            <div className='text-sm text-[#333333]'>
                                              {item.name ? item.name : 'Variation 1'}
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    }

                                    if (!item.isPrimary) {
                                      return (
                                        <div
                                          key={item.id}
                                          className='min-h-16 w-[115px] bg-[#F5F5F5F5] border-[1px] border-gray-300'
                                        >
                                          <div className='w-full h-full flex p-3 items-center justify-center gap-2'>
                                            <div className='text-sm text-[#333333]'>
                                              {item.name ? item.name : 'Variation 2'}
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    }
                                  })}
                              </div>
                              {arraysVariant1 &&
                                arraysVariant1.map((itemPrimary) => {
                                  return (
                                    <div key={itemPrimary.id} className='flex'>
                                      <div className='min-h-16 w-[115px] px-3 py-5 text-sm flex items-center justify-center border-[1px] border-gray-300'>
                                        {itemPrimary.name}
                                      </div>
                                      <div className='flex flex-col'>
                                        {arraysVariant2 &&
                                          arraysVariant2.map((item: VariantsRequest) => (
                                            <div
                                              key={item.id}
                                              className='px-3 min-h-16 w-[115px] py-5 text-sm text-center border-[1px] border-gray-300'
                                            >
                                              {item.name}
                                            </div>
                                          ))}
                                      </div>
                                    </div>
                                  )
                                })}
                            </div>
                            <div className='relative  flex-1'>
                              <div className='grid grid-cols-2'>
                                <div className='bg-[#F5F5F5F5] border-[1px] border-gray-300 col-span-1 min-h-16 p-3 flex flex-row gap-1 justify-center items-center'>
                                  <span className='text-red-600 text-xs'>*</span>
                                  <div className='text-sm text-[#333333]'>Price</div>
                                </div>
                                <div className='border-[1px] border-gray-300 bg-[#F5F5F5F5] col-span-1 min-h-16 p-3 flex flex-row gap-1 justify-center items-center'>
                                  <span className='text-red-600 text-xs'>*</span>
                                  <div className='text-sm text-[#333333]'>Stock</div>
                                  <Popover width={320} position='bottom' withArrow shadow='md' opened={opened}>
                                    <Popover.Target>
                                      <div onMouseEnter={open} onMouseLeave={close}>
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
                                    </Popover.Target>
                                    <Popover.Dropdown style={{ pointerEvents: 'none' }}>
                                      <ul className='flex text-sm flex-col list-disc px-2'>
                                        <li className=''>
                                          Stock refers to the total stock that seller has in their own inventory,
                                          including those reserved for promotions.
                                        </li>
                                        <li className=''>
                                          Reserved refers to stock reserved for promotions, which can only be used
                                          during ongoing promotions.
                                        </li>
                                      </ul>
                                    </Popover.Dropdown>
                                  </Popover>
                                </div>
                              </div>
                              <div className='h-full w-full flex'>
                                <div className='relative h-full w-full'>
                                  {arraysVariant1 &&
                                    arraysVariant1.map((itemVariant1: VariantsRequest) => {
                                      if (arraysVariant2 && arraysVariant2.length > 0) {
                                        return arraysVariant2.map((itemVariant2: VariantsRequest) => {
                                          return productVariantsWatch?.map(
                                            (itemProductVariant, indexProductVariant) => {
                                              if (
                                                itemProductVariant.variant1Id === itemVariant1.id &&
                                                itemProductVariant.variant2Id === itemVariant2.id
                                              ) {
                                                return (
                                                  <div
                                                    key={itemProductVariant.id}
                                                    className='grid grid-cols-2 relative'
                                                  >
                                                    <div className='px-5 relative min-h-16 col-span-1 py-3 flex flex-col justify-center items-start text-sm text-center border-[1px] border-gray-300'>
                                                      <div
                                                        className={`${errors.productVariants?.[indexProductVariant]?.price?.message ? 'border-[#ff4742]' : 'hover:border-[#999999] border-gray-300'} bg-white rounded-sm border-[1px] p-1 flex items-center flex-row justify-between w-full`}
                                                      >
                                                        <div className='border-r-2 pr-2'>
                                                          <span className='text-md text-[#999999]'>₫</span>
                                                        </div>
                                                        <input
                                                          {...register(`productVariants.${indexProductVariant}.price`)}
                                                          type='number'
                                                          className='text-sm text-[#333333] w-full border-none outline-none pl-2 appearance:textfield [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                                                          placeholder='Input'
                                                          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                            e.target.value = e.target.value.replace(/[^0-9]/g, '')
                                                          }}
                                                          value={itemProductVariant.price}
                                                        />
                                                      </div>
                                                      <div
                                                        className={`${errors.productVariants?.[indexProductVariant]?.price?.message ? 'visible' : 'invisible'} absolute w-full bottom-0 left-0 text-center mt-1 px-1 h-4 text-[10px] text-[#ff4742] line-clamp-1`}
                                                      >
                                                        {errors.productVariants?.[indexProductVariant]?.price?.message}
                                                      </div>
                                                    </div>
                                                    <div className='px-5 relative min-h-16 col-span-1 py-3 flex flex-col justify-center items-start text-sm text-center border-[1px] border-gray-300'>
                                                      <div
                                                        className={`${errors.productVariants?.[indexProductVariant]?.stockQuantity?.message ? 'border-[#ff4742]' : 'hover:border-[#999999] border-gray-300'} bg-white rounded-sm border-[1px] p-1 flex items-center flex-row justify-between w-full`}
                                                      >
                                                        <input
                                                          type='number'
                                                          {...register(
                                                            `productVariants.${indexProductVariant}.stockQuantity`
                                                          )}
                                                          className='text-sm text-[#333333] w-full border-none outline-none pl-2 appearance:textfield [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                                                          placeholder='Input'
                                                          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                            e.target.value = e.target.value.replace(/[^0-9]/g, '')
                                                          }}
                                                          value={itemProductVariant.stockQuantity}
                                                        />
                                                      </div>
                                                      <div
                                                        className={`${errors.productVariants?.[indexProductVariant]?.stockQuantity?.message ? 'visible' : 'invisible'} absolute w-full bottom-0 left-0 text-center mt-1 px-1 h-4 text-[10px] text-[#ff4742] line-clamp-1`}
                                                      >
                                                        {
                                                          errors.productVariants?.[indexProductVariant]?.stockQuantity
                                                            ?.message
                                                        }
                                                      </div>
                                                    </div>
                                                  </div>
                                                )
                                              }
                                            }
                                          )
                                        })
                                      } else {
                                        return productVariantsWatch?.map((itemProductVariant, indexProductVariant) => {
                                          if (itemProductVariant.variant1Id === itemVariant1.id) {
                                            return (
                                              <div key={itemProductVariant.id} className='grid grid-cols-2 relative'>
                                                <div className='px-5 relative min-h-16 col-span-1 py-3 flex flex-col justify-center items-start text-sm text-center border-[1px] border-gray-300'>
                                                  <div
                                                    className={`${errors.productVariants?.[indexProductVariant]?.price?.message ? 'border-[#ff4742]' : 'hover:border-[#999999] border-gray-300'} bg-white rounded-sm border-[1px] p-1 flex items-center flex-row justify-between w-full`}
                                                  >
                                                    <div className='border-r-2 pr-2'>
                                                      <span className='text-md text-[#999999]'>₫</span>
                                                    </div>
                                                    <input
                                                      type='number'
                                                      {...register(`productVariants.${indexProductVariant}.price`)}
                                                      className='text-sm text-[#333333] w-full border-none outline-none pl-2 appearance:textfield [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                                                      placeholder='Input'
                                                      onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                        e.target.value = e.target.value.replace(/[^0-9]/g, '')
                                                      }}
                                                      value={itemProductVariant.price}
                                                    />
                                                  </div>
                                                  <div
                                                    className={`${errors.productVariants?.[indexProductVariant]?.price?.message ? 'visible' : 'invisible'} absolute w-full bottom-0 left-0 text-center mt-1 px-1 h-4 text-[10px] text-[#ff4742] line-clamp-1`}
                                                  >
                                                    {errors.productVariants?.[indexProductVariant]?.price?.message}
                                                  </div>
                                                </div>
                                                <div className='px-5 relative min-h-16 col-span-1 py-3 flex flex-col justify-center items-start text-sm text-center border-[1px] border-gray-300'>
                                                  <div
                                                    className={`${errors.productVariants?.[indexProductVariant]?.stockQuantity?.message ? 'border-[#ff4742]' : 'hover:border-[#999999] border-gray-300'} bg-white rounded-sm border-[1px] p-1 flex items-center flex-row justify-between w-full`}
                                                  >
                                                    <input
                                                      type='number'
                                                      {...register(
                                                        `productVariants.${indexProductVariant}.stockQuantity`
                                                      )}
                                                      className='text-sm text-[#333333] w-full border-none outline-none pl-2 appearance:textfield [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                                                      placeholder='Input'
                                                      onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                        e.target.value = e.target.value.replace(/[^0-9]/g, '')
                                                      }}
                                                      value={itemProductVariant.stockQuantity}
                                                    />
                                                  </div>
                                                  <div
                                                    className={`${errors.productVariants?.[indexProductVariant]?.stockQuantity?.message ? 'visible' : 'invisible'} absolute w-full bottom-0 left-0 text-center mt-1 px-1 h-4 text-[10px] text-[#ff4742] line-clamp-1`}
                                                  >
                                                    {
                                                      errors.productVariants?.[indexProductVariant]?.stockQuantity
                                                        ?.message
                                                    }
                                                  </div>
                                                </div>
                                              </div>
                                            )
                                          }
                                        })
                                      }
                                    })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {getValues('isVariant') === false && (
                  <div className='grid grid-cols-11 mb-3 items-start'>
                    <div className='col-span-2 h-10 flex flex-row justify-end items-center gap-1 mr-5'>
                      <span className='text-red-600 text-xs'>*</span>
                      <div className='text-sm text-[#333333]'>Price</div>
                    </div>

                    <div className='col-span-9'>
                      <div
                        className={`w-80 px-2 border h-10 rounded-md flex items-center p-1 ${errors.price?.message ? 'border-[#ff4742]' : 'hover:border-[#999999]'}`}
                      >
                        <div className='bg-white rounded-sm p-1 flex items-center flex-row justify-between w-full'>
                          <div className='border-r-2 pr-2'>
                            <span className='text-md text-[#999999]'>₫</span>
                          </div>
                          <input
                            type='number'
                            {...register('price')}
                            className='text-sm text-[#333333] w-full border-none outline-none pl-2 appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                            placeholder='Input'
                            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                              e.target.value = e.target.value.replace(/[^0-9]/g, '')
                            }}
                          />
                        </div>
                      </div>
                      <div
                        className={`${errors.price?.message ? 'visible' : 'invisible'} mt-1 h-4 text-xs px-2 text-[#ff4742]`}
                      >
                        {errors.price?.message}
                      </div>
                    </div>
                  </div>
                )}

                {getValues('isVariant') === false && (
                  <div className='grid grid-cols-11 mb-3 items-start'>
                    <div className='col-span-2 h-10 flex flex-row justify-end items-center gap-1 mr-5'>
                      <span className='text-red-600 text-xs'>*</span>
                      <div className='text-sm text-[#333333]'>Stock</div>
                      <Popover width={320} position='bottom' withArrow shadow='md' opened={opened}>
                        <Popover.Target>
                          <div onMouseEnter={open} onMouseLeave={close}>
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
                        </Popover.Target>
                        <Popover.Dropdown style={{ pointerEvents: 'none' }}>
                          <ul className='flex text-sm flex-col list-disc px-2'>
                            <li className=''>
                              Stock refers to the total stock that seller has in their own inventory, including those
                              reserved for promotions.
                            </li>
                            <li className=''>
                              Reserved refers to stock reserved for promotions, which can only be used during ongoing
                              promotions.
                            </li>
                          </ul>
                        </Popover.Dropdown>
                      </Popover>
                    </div>

                    <div className='col-span-9'>
                      <div
                        className={`w-80 px-2 border h-10 rounded-md flex items-center p-1 ${errors.stockQuantity?.message ? 'border-[#ff4742]' : 'hover:border-[#999999]'}`}
                      >
                        <div className='bg-white rounded-sm p-1 flex items-center w-full'>
                          <input
                            type='number'
                            {...register('stockQuantity')}
                            className='text-sm text-[#333333] w-full border-none outline-none pl-2 appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                            placeholder='Input'
                            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                              e.target.value = e.target.value.replace(/[^0-9]/g, '')
                            }}
                          />
                        </div>
                      </div>
                      <div
                        className={`${errors.stockQuantity?.message ? 'visible' : 'invisible'} mt-1 h-4 text-xs px-2 text-[#ff4742]`}
                      >
                        {errors.stockQuantity?.message}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Other */}
            <div className='p-6 rounded-md bg-white shadow mb-6'>
              <div className='text-xl text-[#333333] font-bold mb-6'>Others</div>
              <div className='mb-3'>
                <div className='grid grid-cols-11 mb-3 items-start'>
                  <div className='col-span-2 h-10 flex flex-row justify-end items-center gap-1 mr-5'>
                    <span className='text-red-600 text-xs'>*</span>
                    <div className='text-sm text-[#333333]'>Brand</div>
                  </div>

                  <div className='col-span-9'>
                    <div
                      className={`px-5 border w-80 h-10 rounded-md flex items-center p-1 ${errors.name?.message ? 'border-[#ff4742]' : 'hover:border-[#999999]'}`}
                    >
                      <div className='bg-white rounded-sm p-1 flex items-center flex-row justify-between w-full'>
                        <input
                          type='text'
                          {...register('brand')}
                          maxLength={20}
                          placeholder='Your brand'
                          className='text-sm text-[#333333] w-full border-none outline-none pr-3'
                        />
                        <div className='text-sm text-[#999999]'>{watch().brand?.length}/20</div>
                      </div>
                    </div>
                    <div
                      className={`${errors.name?.message ? 'visible' : 'invisible'} mt-1 h-4 text-xs px-2 text-[#ff4742]`}
                    >
                      {errors.name?.message}
                    </div>
                  </div>
                </div>
              </div>
              <div className='mb-6'>
                <div className='grid grid-cols-11 mb-3 items-start'>
                  <div className='col-span-2 h-10 flex flex-row justify-end items-center gap-1 mr-5'>
                    <div className='text-sm text-[#333333]'>Condition</div>
                  </div>

                  <div className='col-span-9'>
                    <Controller
                      name='conditionProduct'
                      control={control}
                      defaultValue='New'
                      render={({ field }) => (
                        <Select
                          {...field}
                          placeholder='Pick value'
                          data={['New', 'Used']}
                          defaultValue='New'
                          className={`w-80 ${errors.conditionProduct?.message ? 'border-[#ff4742]' : 'hover:border-[#999999]'}`}
                          allowDeselect={false}
                        />
                      )}
                    />
                    <div
                      className={`${errors.conditionProduct?.message ? 'visible' : 'invisible'} mt-1 h-4 text-xs px-2 text-[#ff4742]`}
                    >
                      {errors.conditionProduct?.message}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* submit */}
            <div className='px-6 py-4 shadow-inner flex justify-end sticky bg-[#fff] bottom-0  z-10'>
              <div className='flex flex-row gap-4'>
                <ButtonCancel />
                <ButtonDelist onSubmitDelist={onSubmitDelist} handleSubmitSaveProduct={handleSubmitSaveProduct} />
                <ButtonPublish onSubmitPublish={onSubmitPublish} handleSubmitSaveProduct={handleSubmitSaveProduct} />
              </div>
            </div>
          </form>
        </FormProvider>

        {/* Filling Suggestion */}
        <div className='col-span-2'>
          <div className='rounded-md bg-white shadow sticky top-20'>
            <div className='h-14 bg-[#E5EEFB] flex flex-row items-center justify-center'>Filling Suggestion</div>
            <div className='py-4'>
              <div className='flex flex-row items-start text-[#333333] py-2 px-4'>
                <div className='w-5 h-5'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className={`w-5 h-5 ${images.length >= 3 && 'text-[#2fdf35]'}`}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z'
                    />
                  </svg>
                </div>
                <div className='text-sm h-fit pl-3'>Add at least 3 images</div>
              </div>
              <div className='flex flex-row items-start text-[#333333] py-2 px-4'>
                <div className='w-5 h-5'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className={`w-5 h-5 ${getValues('name') && getValues('name').length >= 25 && 'text-[#2fdf35]'}`}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z'
                    />
                  </svg>
                </div>
                <div className='text-sm h-fit pl-3'>Add characters for name to 25~100</div>
              </div>
              <div className='flex flex-row items-start text-[#333333] py-2 px-4'>
                <div className='w-5 h-5'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className={`w-5 h-5 ${getValues('description') && getValues('description').length >= 100 && 'text-[#2fdf35]'}`}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z'
                    />
                  </svg>
                </div>
                <div className='text-sm h-fit pl-3'>Add at least 100 characters for description</div>
              </div>
              <div className='flex flex-row items-start text-[#333333] py-2 px-4'>
                <div className='w-5 h-5'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className={`w-5 h-5 ${getValues('brand') && getValues('brand').length >= 1 && 'text-[#2fdf35]'}`}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z'
                    />
                  </svg>
                </div>
                <div className='text-sm h-fit pl-3'>Add brand info</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
