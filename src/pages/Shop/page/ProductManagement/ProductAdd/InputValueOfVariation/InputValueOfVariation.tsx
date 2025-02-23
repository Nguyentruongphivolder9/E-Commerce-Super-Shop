import { Popover } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useMutation } from '@tanstack/react-query'
import { useContext, useRef, useState } from 'react'
import productApi from 'src/apis/product.api'
import config from 'src/constants/config'
import { AppContext } from 'src/contexts/app.context'
import { ProductAddContext } from 'src/contexts/productAdd.context'
import { PreviewImagesResponse } from 'src/types/product.type'

interface Props {
  indexVariants: number
  indexVariantsGroup: number
  handlerRemoveVariant: (index: number, variantId: string) => void
  isPrimary: boolean
  sizeVariants: number
}

interface ErrorModelImage {
  fileName: string
  errorType: string
  errorSize: string
}

export default function InputValueOfVariation({
  handlerRemoveVariant,
  indexVariants,
  isPrimary,
  indexVariantsGroup,
  sizeVariants
}: Props) {
  const fileInputImagesRef = useRef<HTMLInputElement>(null)
  const { productMethods } = useContext(ProductAddContext)
  const { setChildrenModal, setIsModal } = useContext(AppContext)
  const [imageVariant, setImageVariant] = useState<PreviewImagesResponse | null>(null)
  const [opened, { close, open }] = useDisclosure(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const {
    register,
    watch,
    setValue,
    getValues,
    formState: { errors }
  } = productMethods

  const preCheckImageCreateMutation = useMutation({
    mutationFn: productApi.preCheckImageInfoProCreate
  })
  const preCheckImageDeleteMutation = useMutation({
    mutationFn: productApi.preCheckImageInfoProRemove
  })

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const formData = new FormData()
    let isHasError = false
    const errorModel: ErrorModelImage = {
      fileName: files[0].name,
      errorType: '',
      errorSize: ''
    }

    const fileExtension = files[0].name.split('.').pop()?.toLowerCase()
    const validExtensions = ['png', 'jpg', 'jpeg']

    if (!fileExtension || !validExtensions.includes(fileExtension)) {
      isHasError = true
      errorModel.errorType = ''
    }
    if (files[0].type.split('/')[0] !== 'image') {
      isHasError = true
      errorModel.errorType = ''
    }

    if (files[0].size > 2097152) {
      isHasError = true
      errorModel.errorSize = '- File size exceeds 2.0 MB.'
    }

    if (isHasError) {
      setIsModal(true)
      setChildrenModal(
        <div className='w-[400px] bg-white border-dashed border-[1px] border-blue rounded-md shadow h-auto'>
          <div className='flex flex-col'>
            <div className='p-6 text-[#333333] flex justify-start items-center'>
              <span className='text-xl'>Notice</span>
            </div>
            <div className='px-6 text-[#333333] text-sm flex flex-col'>
              {errorModel.fileName && <div className='mb-2'>{errorModel.fileName}</div>}
              {errorModel.errorType && <div className='mb-1'>{errorModel.errorType}</div>}
              {errorModel.errorSize && <div className=''>{errorModel.errorSize}</div>}
            </div>
            <div className='p-6'>
              <button
                type='button'
                onClick={() => {
                  setIsModal(false)
                  setChildrenModal(null)
                }}
                className={`text-sm border border-solid border-gray-300 rounded-md px-4 py-2 bg-blue text-white`}
              >
                Confirm
              </button>
            </div>
          </div>
          <button
            onClick={() => {
              setIsModal(false)
              setChildrenModal(null)
            }}
            type='button'
            className='text-[#999999] h-6 p-1 absolute right-12 top-6 w-6'
          >
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
      )
    }

    formData.append('imageFiles', files[0])
    try {
      const responsePreCheckImage = await preCheckImageCreateMutation.mutateAsync(formData)
      const resultPreCheckImage = responsePreCheckImage.data.body
      if (resultPreCheckImage) {
        const variantImage: PreviewImagesResponse = resultPreCheckImage[0]
        setValue(`variantsGroup.${indexVariantsGroup}.variants.${indexVariants}.variantImage`, variantImage)
        setImageVariant(variantImage)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const deleteImage = async (id: string) => {
    try {
      const variantImage: PreviewImagesResponse = {
        id: '',
        imageUrl: ''
      }
      await preCheckImageDeleteMutation.mutateAsync(id)
      setValue(`variantsGroup.${indexVariantsGroup}.variants.${indexVariants}.variantImage`, variantImage)
      setImageVariant(null)
    } catch (error) {
      console.log(error)
    }
  }

  const handleUploadImage = () => {
    fileInputImagesRef.current?.click()
  }

  const handleMouseLeave = () => {
    const id = setTimeout(() => {
      close()
    }, 200)
    setTimeoutId(id)
  }

  const handleMouseEnter = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }
    open()
  }

  return (
    <div className='col-span-1'>
      <div className='col-span-1 flex flex-row gap-1 h-9'>
        {isPrimary ? (
          imageVariant ? (
            <Popover position='right' withArrow shadow='md' opened={opened} offset={3}>
              <Popover.Target>
                <div
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  className='w-9 h-full overflow-hidden border-dashed border-[1px] border-gray-400 bg-white rounded-sm flex items-center justify-center  '
                >
                  <img
                    className='object-cover h-full w-full'
                    src={`${config.awsURL}products/${imageVariant.imageUrl}`}
                    alt={'upload file'}
                  />
                </div>
              </Popover.Target>
              <Popover.Dropdown>
                <div
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  className='group w-32 h-32 relative border rounded-md overflow-hidden flex items-center'
                >
                  <img
                    className='object-cover h-full w-full cursor-pointer'
                    src={`${config.awsURL}products/${imageVariant.imageUrl}`}
                    alt={'upload file'}
                  />
                  <div className='absolute bottom-0 left-0 w-full h-6 bg-[#333333]'>
                    <div className='col-span-1'></div>
                    <div className='col-span-1 items-center justify-center flex'>
                      <button
                        type='button'
                        onClick={() => {
                          deleteImage(imageVariant.id)
                        }}
                        className='w-fit h-fit'
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='18'
                          height='18'
                          fill='#fff'
                          viewBox='0 0 256 256'
                        >
                          <path d='M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z'></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </Popover.Dropdown>
            </Popover>
          ) : (
            <div className='w-9 h-full border-dashed border-[1px] border-gray-400 bg-white rounded-sm flex items-center justify-center hover:border-blue hover:bg-sky-100'>
              <input
                className='hidden'
                type='file'
                accept='.jpg,.jpeg,.png'
                onChange={onFileChange}
                ref={fileInputImagesRef}
              />
              <button
                className='h-full w-full flex flex-col justify-center items-center'
                type='button'
                onClick={handleUploadImage}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='size-5 text-blue'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z'
                  />
                </svg>
              </button>
            </div>
          )
        ) : (
          ''
        )}
        <div
          className={`flex-1 h-full px-3 border bg-[#fff] rounded-sm flex items-center ${errors.variantsGroup?.[indexVariantsGroup]?.variants?.[indexVariants]?.name?.message ? 'border-[#ff4742]' : 'hover:border-[#999999]'}`}
        >
          <div className='p-1 flex items-center flex-row justify-between w-full'>
            <input
              {...register(`variantsGroup.${indexVariantsGroup}.variants.${indexVariants}.name`)}
              type='text'
              maxLength={20}
              className='text-sm text-[#333333] w-full border-none outline-none pr-3'
              placeholder='Input'
            />
            <div className='text-sm text-[#999999]'>
              {watch().variantsGroup?.[indexVariantsGroup]?.variants?.[indexVariants]?.name?.length}/20
            </div>
          </div>
        </div>
        <div className='flex flex-row gap-2'>
          <button
            className={`group ${sizeVariants === 1 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            type='button'
            onClick={() => {
              handlerRemoveVariant(
                indexVariants,
                getValues(`variantsGroup.${indexVariantsGroup}.variants.${indexVariants}.id`)
              )
            }}
          >
            <svg
              className='group-hover:fill-[#333333]'
              xmlns='http://www.w3.org/2000/svg'
              width='18'
              height='18'
              fill='#999999'
              viewBox='0 0 256 256'
            >
              <path d='M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z'></path>
            </svg>
          </button>
        </div>
      </div>
      <div
        className={`${errors.variantsGroup?.[indexVariantsGroup]?.variants?.[indexVariants]?.name?.message ? 'visible' : 'invisible'} mt-2 h-4 text-xs text-[#ff4742]`}
      >
        {errors.variantsGroup?.[indexVariantsGroup]?.variants?.[indexVariants]?.name?.message}
      </div>
    </div>
  )
}
