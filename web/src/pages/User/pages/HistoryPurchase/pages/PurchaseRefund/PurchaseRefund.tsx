import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Checkbox, Modal, Select, Textarea } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useMutation, useQuery } from '@tanstack/react-query'
import { produce } from 'immer'
import keyBy from 'lodash/keyBy'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { Slide, toast } from 'react-toastify'
import { orderApi } from 'src/apis/order.api'
import QuantityController from 'src/components/QuantityController'
import config from 'src/constants/config'
import { OrderItemExtended } from 'src/types/order.type'
import { ErrorServerRes } from 'src/types/utils.type'
import { formatCurrency, isAxiosUnprocessableEntityError } from 'src/utils/utils'
import * as yup from 'yup'
const allowableReasons = [
  'Missing part of the order',
  'Empty Parcel',
  'Seller sent wrong item',
  'Damaged - Shattered/ Broken Products',
  'Damaged - Spilled Liquid/ Contents',
  'Damaged - Scratch/Dents',
  'Damaged - Other types of damage',
  'Product is defective or does not work',
  'Expired',
  'Counterfeit product'
]

const validationSchema = yup.object({
  reason: yup.string().required('Reason is required'),
  description: yup.string().max(2000, 'Description cannot exceed 2000 characters'),
  imageFiles: yup
    .mixed<File[]>()
    .test('File required', 'Please upload at least 2 image that clearly shows the product condition.', (value) => {
      return value && value.length >= 2
    })
    .test('fileSize', 'File size should be less than 2MB', (value) => {
      return value && [...value].every((file) => file.size <= 2097152)
    })
    .test('fileFormat', 'Unsupported file format', (value) => {
      const validFormats = ['image/png', 'image/jpeg', 'image/jpg']
      return value && [...value].every((file) => validFormats.includes(file.type))
    })
})

export type FormValues = yup.InferType<typeof validationSchema>
interface FileWithPreview extends File {
  preview?: string
}
export default function PurchaseRefund() {
  const { orderId } = useParams()
  const [extendedOrderItems, setExtendedOrderItems] = useState<OrderItemExtended[]>([])
  const [tempQuantities, setTempQuantities] = useState<Map<string, number>>(new Map())
  const fileInputImagesRef = useRef<HTMLInputElement>(null)
  const [fileInputReplaceIndex, setFileInputReplaceIndex] = useState<number | undefined>(undefined)
  const [opened, { open, close }] = useDisclosure(false)

  //prettier-ignore
  const {control, handleSubmit, formState: { errors }, setValue, watch} = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      reason: '',
      description: '',
      imageFiles: []
    }
  })

  const refundOrderMutation = useMutation({
    mutationFn: orderApi.refundOrder
  })
  const deleteFileOnCloudMutation = useMutation({
    mutationFn: orderApi.deleteRefundImages
  })

  const { data } = useQuery({
    queryKey: [],
    queryFn: () => orderApi.getOrder(orderId as string),
    enabled: orderId !== undefined
  })
  const order = data?.data.body
  const isAllChecked = useMemo(() => extendedOrderItems?.every((item) => item.checked), [extendedOrderItems])

  useEffect(() => {
    const initialTempQuantities = new Map<string, number>(
      extendedOrderItems.map((item) => [item.id as string, item.quantity])
    )
    setTempQuantities(initialTempQuantities)
  }, [extendedOrderItems])

  useEffect(() => {
    setExtendedOrderItems((prev) => {
      const extendedProductObject = keyBy(prev, 'id')

      return (
        order?.orderItems?.map((orderItem) => {
          return {
            ...orderItem,
            disabled: false,
            checked: Boolean(extendedProductObject[orderItem.id as string]?.checked)
          }
        }) || []
      )
    })
  }, [order?.orderItems])

  const checkedRefundItems = useMemo(() => {
    return extendedOrderItems.filter((refundItem) => refundItem.checked)
  }, [extendedOrderItems])

  const handleCheck = (itemIndex: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedOrderItems(
      produce((draft) => {
        draft[itemIndex].checked = e.target.checked
      })
    )
  }

  const handleCheckAll = () => {
    setExtendedOrderItems((prev) =>
      prev.map((item) => ({
        ...item,
        checked: !isAllChecked
      }))
    )
  }

  const handleTypeQuantity = (index: number, value: number) => {
    setTempQuantities((prevTempQuantities) => {
      const updatedTempQuantities = new Map(prevTempQuantities)
      const itemId = extendedOrderItems[index].id as string
      updatedTempQuantities.set(itemId, value)
      return updatedTempQuantities
    })
  }

  const handleQuantity = (index: number, value: number) => {
    setTempQuantities((prevTempQuantities) => {
      const updatedTempQuantities = new Map(prevTempQuantities)
      const itemId = extendedOrderItems[index].id as string
      updatedTempQuantities.set(itemId, value)
      return updatedTempQuantities
    })
  }

  const handleUploadImages = (index: number | undefined) => {
    index !== undefined ? setFileInputReplaceIndex(index) : setFileInputReplaceIndex(undefined)
    fileInputImagesRef.current?.click()
  }

  const imageFiles = watch('imageFiles') || []

  const handleDeleteImage = (index: number) => {
    //prettier-ignore
    setValue('imageFiles', imageFiles?.filter((_, i) => i !== index))
    const imageToDel = imageFiles[index] as FileWithPreview
    URL.revokeObjectURL(imageToDel.preview as string)
  }

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const maxImages = 5
    const newFiles = [...files] // convert FileList to File[]
    const currentImageCount = imageFiles.length
    const remainingSlots = maxImages - currentImageCount
    const filesToAdd = newFiles.slice(0, remainingSlots)

    const validFiles = filesToAdd.filter((file: FileWithPreview) => {
      file.preview = URL.createObjectURL(file)
      const fileExtension = file.name.split('.').pop()?.toLowerCase()
      const validExtensions = ['png', 'jpg', 'jpeg']
      return (
        fileExtension &&
        validExtensions.includes(fileExtension) &&
        file.type.startsWith('image') &&
        file.size <= 2097152
      )
    })

    if (fileInputReplaceIndex !== undefined && validFiles[0] != undefined) {
      if (fileInputReplaceIndex >= 0 && fileInputReplaceIndex < imageFiles.length) {
        const updatedImageFiles = [...imageFiles]
        const imageToDelete = updatedImageFiles[fileInputReplaceIndex]
        URL.revokeObjectURL((imageToDelete as FileWithPreview).preview as string)
        updatedImageFiles[fileInputReplaceIndex] = validFiles[0]
        setValue('imageFiles', updatedImageFiles)
      }
    } else {
      setValue('imageFiles', [...imageFiles, ...validFiles])
    }
  }

  const onSubmit = handleSubmit(async (data) => {
    const formData = new FormData()
    formData.append('orderId', order?.id as string)
    checkedRefundItems.forEach((orderItem) => {
      formData.append('orderItemIds', (orderItem.id as string) + '/' + tempQuantities.get(orderItem.id as string))
    })
    formData.append('shopId', order?.shopInfomation.id as string)
    formData.append('amount', order?.orderTotal.toString() as string)
    formData.append('description', data.description || '')
    formData.append('reason', data.reason)
    if (data.imageFiles) {
      data.imageFiles.forEach((file) => {
        formData.append(`imageFiles`, file)
      })
    }
    console.table([...formData])
    try {
      const response = await refundOrderMutation.mutateAsync(formData)
      if (response.data.statusCode === 201) {
        open()
      }
    } catch (error) {
      if (isAxiosUnprocessableEntityError<ErrorServerRes>(error)) {
        toast.warning('Your request Refund/Return is being processing', {
          autoClose: 1500,
          transition: Slide
        })
      }
    }
  })

  const deleteFilesOnCloud = async () => {
    deleteFileOnCloudMutation.mutate()
  }
  console.log('extendedOrderItems', extendedOrderItems)
  console.log('checkedRefundItems', checkedRefundItems)
  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        centered
        withCloseButton
        overlayProps={{
          backgroundOpacity: 0.4
        }}
      >
        <div className='flex justify-center flex-col items-center'>
          <div className='mb-6 flex items-center justify-center w-[80px] h-[80px] rounded-full shadow-md bg-blue'>
            <svg className='fill-white w-[50px] h-[50px]' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'>
              <path d='M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z'></path>
            </svg>
          </div>
          <span className='text-md'>Your refund request is being processing</span>
          <span>Please wait a couple of days</span>
        </div>
      </Modal>

      <form onSubmit={onSubmit}>
        <div className='bg-white px-5 py-10'>
          <h1 className='text-2xl mb-4'>Item(s) you want to return/refund</h1>
          <div className='border-b border-gray-200'></div>
          {extendedOrderItems &&
            extendedOrderItems?.map((orderItem, index) => (
              <div
                key={orderItem.id}
                className='flex items-center justify-between space-x-4 border-b border-gray-200 py-2'
              >
                <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                  <Checkbox key={orderItem.id} checked={orderItem.checked} onChange={handleCheck(index)} />
                </div>
                <img
                  src={`${config.awsURL}products/${orderItem.imageUrl}`}
                  alt='Sản phẩm'
                  className='w-16 h-16 object-cover'
                />
                <div className='flex-1 mr-auto space-y-1'>
                  <h4 className='text-lg'>{orderItem.productName}</h4>
                  <p className='flex items-center justify-start text-gray-500'>{orderItem.variantName}</p>
                  <button className='py-[2px] px-[4px] text-gray-600 border border-green-400 text-xs'>
                    Free return
                  </button>
                </div>
                <div className='space-y-4'>
                  <p className='text-right'>₫{orderItem.price}</p>
                  <p className='text-right'>x{orderItem.quantity}</p>
                  <div className='flex items-center gap-x-4'>
                    <p>Refund Qty:</p>
                    <QuantityController
                      max={orderItem.quantity}
                      value={tempQuantities.get(orderItem.id as string) || orderItem.quantity}
                      onIncrease={(value) => handleQuantity(index, value)}
                      onDecrease={(value) => handleQuantity(index, value)}
                      onType={(value) => handleTypeQuantity(index, value)}
                      onFocusOut={(value) => handleQuantity(index, value)}
                      classNameWrapper='flex items-center'
                      disabled={orderItem.disabled}
                    />
                  </div>
                </div>
              </div>
            ))}

          <div className='flex mt-5 gap-4 items-center'>
            <div className='flex flex-shrink-0 items-center justify-center pr-3'>
              <Checkbox checked={isAllChecked} onChange={handleCheckAll} />
            </div>
            <button type='button' className='border-none bg-none' onClick={handleCheckAll}>
              Select All
            </button>
          </div>
        </div>
        <div className='bg-white mt-3 px-5 py-7'>
          <div className='w-3/4'>
            <h1 className='text-2xl'>Reason for refund/return</h1>

            <div className='flex items-center mt-8'>
              <p className='basis-2/12 flex items-center'>
                <svg className='fill-[#ee4d2d] w-2 h-2 mb-2' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'>
                  <path d='M211,103.43l-70.13,28,49.47,63.61a8,8,0,1,1-12.63,9.82L128,141,78.32,204.91a8,8,0,0,1-12.63-9.82l49.47-63.61L45,103.43A8,8,0,0,1,51,88.57l69,27.61V40a8,8,0,0,1,16,0v76.18l69-27.61A8,8,0,1,1,211,103.43Z'></path>
                </svg>
                Reason:
              </p>
              <Controller
                name='reason'
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder='Select reason'
                    searchable
                    data={allowableReasons}
                    comboboxProps={{ transitionProps: { transition: 'scale-y', duration: 200 } }}
                    error={errors.reason ? errors.reason.message : null}
                    style={{ marginLeft: 20, flex: 1 }}
                  />
                )}
              />
            </div>
            <div className='flex items-center mt-8'>
              <span className='basis-2/12'>Description:</span>
              <div className='flex-1 ml-5'>
                <Controller
                  name='description'
                  control={control}
                  render={({ field }) => (
                    <>
                      <Textarea
                        {...field}
                        placeholder='Details of the problem (Optional)'
                        resize='vertical'
                        autosize
                        minRows={4}
                      />
                      {errors.description && <p className='text-red-500 text-sm'>{errors.description.message}</p>}
                    </>
                  )}
                />
                <p className='text-right mt-2'>2/2000</p>
              </div>
            </div>
            <div className='ml-[calc(16.666667%+20px)] mt-6'>
              <div className='flex item-center gap-x-1'>
                {imageFiles && imageFiles.length < 5 && (
                  <div className='w-24 h-24 border-dashed border border-gray-400 rounded-md flex items-center justify-center'>
                    <input
                      name='imageFiles'
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
                      onClick={() => handleUploadImages(undefined)}
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='28'
                        height='28'
                        fill='#0099FF'
                        viewBox='0 0 256 256'
                      >
                        <path d='M208,56H180.28L166.65,35.56A8,8,0,0,0,160,32H96a8,8,0,0,0-6.65,3.56L75.71,56H48A24,24,0,0,0,24,80V192a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V80A24,24,0,0,0,208,56Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8H80a8,8,0,0,0,6.66-3.56L100.28,48h55.43l13.63,20.44A8,8,0,0,0,176,72h32a8,8,0,0,1,8,8ZM128,88a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,88Zm0,72a28,28,0,1,1,28-28A28,28,0,0,1,128,160Z'></path>
                      </svg>
                      <div className='text-xs text-blue flex flex-col'>
                        <span>Add Photo</span>
                        <span>({imageFiles.length}/5)</span>
                      </div>
                    </button>
                  </div>
                )}
                {imageFiles &&
                  imageFiles.map((preViewImage, i) => (
                    <div
                      key={i}
                      className='group relative overflow-hidden w-24 h-24 border-dashed border border-gray-400 rounded-md flex items-center justify-center cursor-pointer'
                    >
                      <img
                        src={(preViewImage as FileWithPreview).preview}
                        alt='Imagge preview'
                        style={{ width: '100%', height: '100%' }}
                        className='object-cover aspect-square'
                      />
                      <div className='absolute w-full h-6 bottom-0 right-0 p-2 opacity-0 group-hover:bg-black/50 group-hover:opacity-100 transition-opacity duration-300'>
                        <svg
                          className='absolute bottom-[2px] right-3 w-5 h-5 fill-white'
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 256 256'
                          onClick={() => handleDeleteImage(i)}
                        >
                          <path d='M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z'></path>
                        </svg>
                        <svg
                          className='absolute bottom-[2px] left-3 w-5 h-5 fill-white'
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 256 256'
                          onClick={() => handleUploadImages(i)}
                        >
                          <path d='M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z'></path>
                        </svg>
                      </div>
                    </div>
                  ))}
              </div>
              <div className='mt-3'>
                <p className='text-red-500'>{errors.imageFiles ? errors.imageFiles.message : null}</p>
                Please upload pictures/videos that clearly show the condition of the product received.
              </div>
            </div>
          </div>
        </div>
        <div className='bg-white mt-3 px-5 py-7'>
          <div className='w-3/4'>
            <div className='flex items-center'>
              <p className='basis-2/12'>Solution:</p>
              <p>Return and Refund</p>
            </div>
          </div>
        </div>
        <div className='bg-white mt-3 px-5 py-7'>
          <div className='w-3/4'>
            <h1 className='text-2xl'>Refund Details</h1>

            <div className='flex items-center mt-8'>
              <p className='basis-2/12 flex items-center'>Refund Amount</p>
              <p>₫{order && formatCurrency(order.orderTotal)}</p>
            </div>
            <div className='flex items-center mt-8'>
              <p className='basis-2/12 flex items-center'>Refund To</p>
              <p>User Wallet</p>
            </div>
          </div>
          <div className='mt-5 bg-white border-t border-gray-100'>
            <div className='flex justify-end items-center border-b border-dashed border-gray-200 px-6 text-right'>
              <div className='text-xs py-[13px] px-[10px]'>
                <span>Refundable Item Price</span>
              </div>
              <div className='w-60 border-l border-dashed border-gray-200 py-[13px] break-words'>
                <span>₫{order && formatCurrency(order.orderTotal)}</span>
              </div>
            </div>
            <div className='flex justify-end items-center border-b border-dashed border-gray-200 px-6 text-right'>
              <div className='text-xs py-[13px] px-[10px]'>
                <span>Shipping Fee</span>
              </div>
              <div className='w-60 border-l border-dashed border-gray-200 py-[13px] break-words'>
                <span>₫{formatCurrency(8000)}</span>
              </div>
            </div>
            <div className='flex justify-end items-center px-6 text-right'>
              <div className='text-xs py-[13px] px-[10px]'>
                <span>Actual Refund Amount</span>
              </div>
              <div className='w-60 border-l border-dashed border-gray-200 py-[13px] break-words'>
                <span className='text-xl text-[#ee4d2d]'>₫{order && formatCurrency(order.orderTotal)}</span>
              </div>
            </div>
          </div>
          <div className='border-t border-gray-200 flex justify-end'>
            <button
              type='submit'
              className='px-4 py-2 mt-3 rounded-md bg-sky-200 text-gray-700 border border-gray-200 hover:bg-sky-300'
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </>
  )
}
