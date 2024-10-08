import { Button, Modal } from '@mantine/core'
import { useState } from 'react'
import { RatingRequest } from 'src/types/rating.type'
import RatingForm from './RatingForm'
import { OrderResponse } from 'src/types/order.type'
import { useMutation } from '@tanstack/react-query'
import ratingApi from 'src/apis/rating.api'
import { toast } from 'react-toastify'

interface RatingModalProps {
  order: OrderResponse
  opened: boolean
  open: () => void
  close: () => void
}

export default function RatingModal({ order, opened, open, close }: RatingModalProps) {
  const [ratings, setRatings] = useState<RatingRequest[]>([])

  const createRatingsMutation = useMutation({
    mutationFn: ratingApi.createRatings
  })

  const updateRating = (newRating: RatingRequest) => {
    setRatings((prevRatings) => {
      const updatedRatings = prevRatings.filter((rating) => rating.orderItemId !== newRating.orderItemId)
      return [...updatedRatings, newRating]
    })
  }

  // ratings.forEach((rating, index) => {
  //   // Append rating details
  //   formData.append('productIds', rating.productId )
  //   formData.append('orderItemIds', rating.orderItemId + '_rating_' + index)
  //   formData.append('ratingStars', rating.ratingStar.toString() + '_rating_' + index)
  //   formData.append('productQualities', rating.productQuality + '_rating_' + index)
  //   formData.append('trueDescriptions', rating.trueDescription + '_rating_' + index)
  //   formData.append('comments', rating.comment + '_rating_' + index)

  //   rating.imageFiles.forEach((file) => {
  //     const newFileName = `${file.name.replace(/\.[^/.]+$/, '')}_rating_${index}`
  //     const newFile = new File([file], newFileName, { type: file.type })
  //     formData.append('ratingFiles', newFile)
  //   })
  // })
  const handleSubmit = async () => {
    for (const rating of ratings) {
      const formData = new FormData()
      formData.append('productId', rating.productId)
      formData.append('orderItemId', rating.orderItemId)
      formData.append('ratingStar', rating.ratingStar.toString())
      formData.append('productQuality', rating.productQuality)
      formData.append('trueDescription', rating.trueDescription)
      formData.append('comment', rating.comment)

      rating.imageFiles.forEach((file) => {
        formData.append('ratingFiles', file)
      })

      try {
        const response = await createRatingsMutation.mutateAsync(formData)
        toast.success(response.data.message)
      } catch (error) {
        console.error('Error submitting ratings:', error)
        toast.error('Error submitting ratings')
      }
    }

    close()
  }

  return (
    <Modal
      size={800}
      withCloseButton={false}
      opened={opened}
      onClose={() => {
        close()
      }}
      centered
    >
      <div className=''>
        <div className='container mx-auto p-4'>
          <h2 className='text-2xl mb-4'>Rate Product</h2>
          <div className='overflow-y-auto rounded p-4'>
            {order &&
              order.orderItems.map((item, itemIndex) => (
                <RatingForm key={itemIndex} orderItem={item} onRatingChange={updateRating} />
              ))}
          </div>
        </div>

        <div className='flex bg-white sticky bottom-0 py-4 justify-end items-center gap-4 '>
          <Button
            onClick={() => {
              close()
            }}
            className='bg-transparent text-[#666666] hover:bg-slate-200 hover:text-[#666666]'
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleSubmit()
            }}
          >
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  )
}
