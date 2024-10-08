import { FileButton, Group, Image, Input, Textarea } from '@mantine/core'
import { useEffect, useState } from 'react'
import config from 'src/constants/config'
import { OrderItem } from 'src/types/order.type'
import { RatingRequest } from 'src/types/rating.type'
import { imageFileConvertToUrl } from 'src/utils/utils'

interface Props {
  orderItem: OrderItem
  onRatingChange: (rating: RatingRequest) => void
}

const formRating: RatingRequest = {
  imageFiles: [],
  productId: '',
  orderItemId: '',
  ratingStar: 5,
  productQuality: '',
  trueDescription: '',
  comment: ''
}

export default function RatingForm({ orderItem, onRatingChange }: Props) {
  const [ratingOrderItem, setRatingOrderItem] = useState<RatingRequest>(formRating)

  useEffect(() => {
    if (orderItem) {
      const newRatingOrderItem: RatingRequest = {
        imageFiles: [],
        productId: orderItem.productId,
        orderItemId: orderItem.id!,
        ratingStar: 5,
        productQuality: '',
        trueDescription: '',
        comment: ''
      }
      setRatingOrderItem(newRatingOrderItem)
    }
  }, [orderItem])

  useEffect(() => {
    if (ratingOrderItem.orderItemId !== '' && ratingOrderItem.productId !== '') {
      onRatingChange(ratingOrderItem)
    }
  }, [ratingOrderItem])

  return (
    <div className='item-container mt-8'>
      <div className='flex items-center mb-4'>
        <img src={`${config.awsURL}products/${orderItem.imageUrl}`} alt='e' className='w-14 h-14 mr-4' />
        <div className='text-sm'>
          <h3 className='font-medium'>{orderItem.productName}</h3>
          {orderItem.variantName && <p>{orderItem.variantName}</p>}
        </div>
      </div>
      <div className='flex items-center mb-4'>
        <span className='text-md text-gray-500 mr-14'>Product Quality:</span>
        <div className='ml-2 flex'>
          {[...Array(5)].map((_, i) => (
            <div key={i}>
              <svg
                className={`w-6 h-7 cursor-pointer ${i + 1 <= ratingOrderItem.ratingStar ? 'fill-yellow-400' : 'fill-slate-300'}`}
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 256 256'
                onClick={() =>
                  setRatingOrderItem((prev) => {
                    return {
                      ...prev,
                      ratingStar: i + 1
                    }
                  })
                }
              >
                <path d='M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z'></path>
              </svg>
            </div>
          ))}
        </div>
      </div>
      <div className='p-4 mx-auto bg-gray-100'>
        <div className='bg-white flex flex-col gap-3 shadow-md rounded px-4 pt-6 pb-8 mb-4'>
          <Input.Wrapper label='Accurate description' error=''>
            <Input
              onChange={(event) => {
                const value = event.target.value
                setRatingOrderItem((prev) => ({
                  ...prev,
                  trueDescription: value
                }))
              }}
            />
          </Input.Wrapper>
          <Input.Wrapper label='Product quality' error=''>
            <Input
              onChange={(event) => {
                const value = event.target.value
                setRatingOrderItem((prev) => ({
                  ...prev,
                  productQuality: value
                }))
              }}
            />
          </Input.Wrapper>
          <Textarea
            maxLength={500}
            maxRows={6}
            minRows={6}
            autosize
            placeholder='Share more thoughts on the product to help other buyers.'
            error=''
            onChange={(event) => {
              const value = event.target.value
              setRatingOrderItem((prev) => ({
                ...prev,
                comment: value
              }))
            }}
          />
        </div>
        <div className='photoButton flex gap-3'>
          {ratingOrderItem.imageFiles.length > 0 &&
            ratingOrderItem.imageFiles.map((item, index) => (
              <div key={index} className='w-14 h-14 flex'>
                <Image h={56} w={56} fit='cover' src={imageFileConvertToUrl(item)} />
              </div>
            ))}
          <Group justify='start'>
            <FileButton
              onChange={(file) => {
                const files = file
                if (!files) return

                const maxImages = 5
                const newFiles = [...files]
                const currentImageCount = ratingOrderItem.imageFiles.length
                const remainingSlots = maxImages - currentImageCount
                const filesToAdd = newFiles.slice(0, remainingSlots)

                const validFiles = filesToAdd.filter((file: File) => {
                  const fileExtension = file.name.split('.').pop()?.toLowerCase()
                  const validExtensions = ['png', 'jpg', 'jpeg']
                  return (
                    fileExtension &&
                    validExtensions.includes(fileExtension) &&
                    file.type.startsWith('image') &&
                    file.size <= 2097152
                  )
                })
                setRatingOrderItem((prev) => {
                  return {
                    ...prev,
                    imageFiles: [...prev.imageFiles, ...validFiles]
                  }
                })
              }}
              accept='image/png,image/jpeg'
              multiple
            >
              {(props) =>
                ratingOrderItem.imageFiles.length < 5 &&
                (ratingOrderItem.imageFiles.length === 0 ? (
                  <button
                    {...props}
                    className='flex items-center justify-start gap-x-2 w-32 min-w-30 bg-[#fff0ed] hover:bg-blue-700 text-[#ee4d2d] text-sm py-1 px-4 rounded border border-[#ee4d2d]'
                    type='button'
                  >
                    <svg xmlns='http://www.w3.org/2000/svg' className='w-5 h-5 fill-[#ee4d2d]' viewBox='0 0 256 256'>
                      <path d='M208,56H180.28L166.65,35.56A8,8,0,0,0,160,32H96a8,8,0,0,0-6.65,3.56L75.71,56H48A24,24,0,0,0,24,80V192a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V80A24,24,0,0,0,208,56Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8H80a8,8,0,0,0,6.66-3.56L100.28,48h55.43l13.63,20.44A8,8,0,0,0,176,72h32a8,8,0,0,1,8,8ZM128,88a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,88Zm0,72a28,28,0,1,1,28-28A28,28,0,0,1,128,160Z'></path>
                    </svg>
                    <span className='flex-1'>Add photo</span>
                  </button>
                ) : (
                  <button
                    {...props}
                    className='flex flex-col gap-1 text-[#00000042] items-center justify-center h-14 w-14 border-dashed border-[1px] border-[#00000042]'
                  >
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='size-5'>
                      <path d='M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z' />
                      <path
                        fillRule='evenodd'
                        d='M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 0 0 1.11-.71l.822-1.315a2.942 2.942 0 0 1 2.332-1.39ZM6.75 12.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Zm12-1.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z'
                        clipRule='evenodd'
                      />
                    </svg>
                    <span className='text-xs'>{ratingOrderItem.imageFiles.length}/5</span>
                  </button>
                ))
              }
            </FileButton>
          </Group>
        </div>
      </div>
    </div>
  )
}
