import React, { useState } from 'react'
import advertiseApi from 'src/apis/advertise.api'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { Select } from '@mantine/core'

const MAX_IMAGES = 2
const REQUIRED_WIDTH = 308
const REQUIRED_HEIGHT = 180

const AdvertiseForm = () => {
  const [showPriceEstimate, setShowPriceEstimate] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [esBanner, setEsBanner] = useState(0)
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [message, setMessage] = useState('')

  const navigate = useNavigate()

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length + images.length > MAX_IMAGES) {
      toast.error(`You can only upload a maximum of ${MAX_IMAGES} images.`)
      return
    }

    const validImages: File[] = []
    const invalidImages: File[] = []
    const previews: string[] = []

    files.forEach((file) => {
      const img = new Image()
      img.src = URL.createObjectURL(file)
      img.onload = () => {
        if (img.width > REQUIRED_WIDTH && img.height > REQUIRED_HEIGHT) {
          validImages.push(file)
          previews.push(img.src)
        } else {
          invalidImages.push(file)
        }

        if (validImages.length + images.length <= MAX_IMAGES && validImages.length > 0) {
          setImages((prevImages) => [...prevImages, ...validImages])
          setImagePreviews((prevPreviews) => [...prevPreviews, ...previews])
        }

        if (invalidImages.length > 0) {
          toast.error(`Some images do not meet the required dimensions of ${REQUIRED_WIDTH}x${REQUIRED_HEIGHT} pixels.`)
        }
      }
    })
  }

  const handleImageDelete = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index))
    setImagePreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index))
  }

  const calculateBannerQuantity = () => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0
    const diffInMs = end.getTime() - start.getTime()
    const hours = Math.floor(diffInMs / (1000 * 60 * 60))
    return hours
  }

  const bannerQuantity = calculateBannerQuantity()
  const costAdsBanner = esBanner
  const amountForBanner = costAdsBanner * bannerQuantity * images.length

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!paymentMethod) {
      toast('Payment method is required.')
      return
    }

    if (esBanner <= 30000) {
      toast.error('Bidding Banner (hour/VND) must be greater than 30,000.')
      return
    }

    const hours = calculateBannerQuantity() // Recalculate the hours or reuse bannerQuantity

    if (hours < 24) {
      toast.error('Duration of Ads must be greater than 24 hour')
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('startDate', startDate)
    formData.append('endDate', endDate)
    formData.append('status', 'Created')
    formData.append('esBanner', esBanner.toString())
    formData.append('costBanner', amountForBanner.toString())
    formData.append('paymentMethod', paymentMethod)

    images.forEach((image, index) => {
      formData.append('imageFiles', image, `image-${index}.jpeg`)
    })

    try {
      const response = await advertiseApi.createAdvertise(formData)
      if (response.data) {
        // toast('Advertisement created successfully!')
        if (response?.data?.body?.paymentUrl) {
          window.location.href = response.data.body.paymentUrl
        }
      }
    } catch (error) {
      setMessage('Failed to create advertisement.')
    }
  }

  if (error) return <div>{error}</div>

  return (
    <div>
      <h2 className='text-2xl font-bold text-blue-600 mb-4'>Add New Advertisement</h2>

      <div className='mb-4'>
        <label className='block text-gray-700 font-medium mb-2'>Settings:</label>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-gray-600'>Start date:</label>
            <input
              type='datetime-local'
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className='w-full py-2.5 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
          </div>
          <div>
            <label className='block text-gray-600'>End date:</label>
            <input
              type='datetime-local'
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className='w-full py-2.5 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
          </div>
        </div>
      </div>

      <div className='mb-4'>
        <label className='block text-gray-700 font-medium mb-2'>Title:</label>
        <input
          type='text'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='w-full py-2.5 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
        />
      </div>

      <div className='mb-4'>
        <label className='block text-gray-700 font-medium mb-2'>Estimate:</label>
        <div className='grid grid-cols-3 gap-4'>
          <div>
            <label className='block text-gray-600'>Bidding Banner(hour/VND) :</label>
            <input
              type='text'
              value={esBanner}
              onChange={(e) => setEsBanner(parseInt(e.target.value) || 0)}
              className='w-full py-2.5 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
          </div>
        </div>
      </div>

      <div className='mb-4'>
        <label className='block text-gray-700 font-medium mb-2'>Upload Image:</label>
        <input type='file' accept='image/jpeg, image/png' multiple onChange={handleImageChange} className='mb-4' />
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {imagePreviews.map((preview, index) => (
            <div key={index} className='relative'>
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className='w-full h-auto rounded-lg border border-gray-300'
              />
              <button
                onClick={() => handleImageDelete(index)}
                className='absolute top-0 right-0 bg-red-500 text-white rounded-full p-1.5 m-1'
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className='w-full mx-auto p-6 bg-white shadow-lg rounded-lg border border-black'>
        <div className='mb-4'>
          <p className='text-xl font-semibold text-gray-700'>Estimate Cost:</p>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead>
              <tr>
                <th className='py-3 px-2 text-left text-l font-medium text-gray-500'>No</th>
                <th className='py-3 px-2 text-left text-l font-medium text-gray-500'>Description</th>
                <th className='py-3 px-2 text-left text-l font-medium text-gray-500'>Price per</th>
                <th className='py-3 px-2 text-left text-l font-medium text-gray-500'>Hours</th>
                <th className='py-3 px-2 text-left text-l font-medium text-gray-500'>Images</th>
                <th className='py-3 px-2 text-left text-l font-medium text-gray-500'>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className='py-2 px-2 text-gray-600'>1</td>
                <td className='py-2 px-2 text-gray-600'>Banner Cost</td>
                <td className='py-2 px-2 text-green-600'>{costAdsBanner} vnd </td>
                <td className='py-2 px-2 text-gray-600'>{bannerQuantity}</td>
                <td className='py-2 px-2 text-gray-600'>{images.length}</td>
                <td className='py-2 px-2 text-green-600'>{amountForBanner} vnd</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className='mb-4 w-1/2'>
          <label className='block text-gray-700 font-medium mb-2'>Payment Method:</label>
          <Select
            placeholder='Choose Payment Method'
            data={[
              { value: 'VNPAY', label: 'VNPAY' },
              { value: 'STRIPE', label: 'STRIPE' }
            ]}
            value={paymentMethod}
            onChange={setPaymentMethod}
          />
        </div>

        <button
          onClick={handleSubmit}
          className='p-3 w-full text-center bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-400 focus:ring-opacity-75'
        >
          Submit
        </button>
      </div>
    </div>
  )
}

export default AdvertiseForm
