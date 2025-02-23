import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import advertiseApi from 'src/apis/advertise.api'
import { AdvertiseResponse } from 'src/types/advertise.type'
import { toast } from 'react-toastify'
import config from 'src/constants/config'
import { Select } from '@mantine/core'

const BASE_URL = config.awsURL

const AdvertiseDetailShop = () => {
  const { id } = useParams<{ id: string }>() // Get the ID from the route parameters
  const [advertise, setAdvertise] = useState<AdvertiseResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const [showModal, setShowModal] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null)

  const handleRetryPaymentClick = () => {
    setShowModal(true) // Show the modal when "Retry Payment" is clicked
  }

  const handleSubmitPayment = async () => {
    if (paymentMethod) {
      if (id) {
        try {
          const response = await advertiseApi.retryPaymentAdvertise(id, paymentMethod)
          if (response?.data?.body?.paymentUrl) {
            window.location.href = response.data.body.paymentUrl // Redirect to payment URL
          } else {
            toast.error('Payment URL is missing in the response.')
          }
        } catch (error) {
          toast.error('Failed to retry payment.')
        }
      } else {
        toast.error('Advertise ID is missing.')
      }
    } else {
      toast.error('Please choose a payment method.')
    }
  }

  useEffect(() => {
    if (id) {
      advertiseApi
        .getAdvertiseById(id)
        .then((response) => {
          if (response.data.body) {
            setAdvertise(response.data.body)
          } else {
            toast.error('No advertisement found')
          }
          setLoading(false)
        })
        .catch(() => {
          toast.error('Failed to fetch advertisement details')
          setLoading(false)
        })
    }
  }, [id])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!advertise) {
    return <div>No advertisement found.</div>
  }

  return (
    <div className='container mx-auto p-6'>
      <h2 className='text-2xl font-bold text-blue-600 mb-6 text-center'>Advertisement Details</h2>
      <div className='bg-white shadow-lg rounded-lg p-6'>
        <div className='flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6'>
          {/* Image Section */}
          <div className='w-full md:w-1/2'>
            <div className='border border-gray-300 rounded-lg shadow-md overflow-hidden'>
              {advertise.advertiseImages.length > 0 ? (
                <div className='flex flex-col'>
                  {advertise.advertiseImages.map((img) => (
                    <div key={img.id} className='mb-2'>
                      <img
                        src={`${BASE_URL}advertises/${img.imageUrl}`} // Use BASE_URL from config
                        alt='Advertise'
                        className='w-full h-80 object-cover rounded'
                        onError={() => console.error(`Image failed to load: ${img.imageUrl}`)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-center py-4 text-gray-500'>No images</div>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className='w-full md:w-1/2 space-y-4'>
            {advertise.click >= 1 && (
              <div>
                <label className='block font-bold text-blue font-medium mb-2'>Viewers:</label>
                <input
                  type='text'
                  value={advertise.click}
                  readOnly
                  className='w-full py-2 px-3 font-bold text-blue text-center text-3xl border border-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
                />
              </div>
            )}
            <div>
              <label className='block text-gray-700 font-medium mb-2'>Title:</label>
              <input
                type='text'
                value={advertise.title}
                readOnly
                className='w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-gray-700 font-medium mb-2'>Start Date:</label>
                <input
                  type='datetime-local'
                  value={new Date(advertise.startDate).toISOString().slice(0, 16)}
                  readOnly
                  className='w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
                />
              </div>
              <div>
                <label className='block text-gray-700 font-medium mb-2'>End Date:</label>
                <input
                  type='datetime-local'
                  value={new Date(advertise.endDate).toISOString().slice(0, 16)}
                  readOnly
                  className='w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
                />
              </div>
            </div>

            <div>
              <div>
                <label className='block text-gray-600'>Bidding Banner (hour/VND):</label>
                <input
                  type='text'
                  value={advertise.esBanner.toString()}
                  readOnly
                  className='w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
                />
              </div>
              <div>
                <label className='block text-gray-600'>Total Cost:</label>
                <input
                  type='text'
                  value={advertise.costBanner.toString()}
                  readOnly
                  className='w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
                />
              </div>
            </div>

            <div>
              <label className='block text-gray-700 font-medium mb-2'>Status:</label>
              <input
                type='text'
                value={advertise.status}
                readOnly
                className='w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
              />
            </div>

            <div>
              <label className='block text-gray-700 font-medium mb-2'>Process:</label>
              <div className='flex items-center space-x-2'>
                <span className='text-gray-700 font-medium'>{advertise.payed ? 'Paid' : 'Not Paid'}</span>
                {advertise.payed ? (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-6 h-6 text-green-600'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-6 h-6 text-red-700'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Retry Payment Button */}
        <div>
          {advertise.status === 'Pending Payment' && (
            <div className='flex justify-end mt-6'>
              <button
                className='py-2 px-6 bg-blue-500 text-white bg-rose-600 text-lg font-semibold rounded-full shadow-md hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400'
                onClick={handleRetryPaymentClick}
              >
                Retry Payment
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showModal && (
        <div className='fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center'>
          <div className='bg-white p-8 rounded-lg shadow-lg w-full md:w-1/3'>
            <h2 className='text-xl font-bold mb-4 text-center'>Select Payment Method</h2>
            <Select
              label='Payment Method'
              placeholder='Choose a payment method'
              data={[
                { value: 'VNPAY', label: 'VNPAY' },
                { value: 'STRIPE', label: 'STRIPE' }
              ]}
              value={paymentMethod}
              onChange={(value) => setPaymentMethod(value)} // Use Mantine's onChange handler
            />

            <div className='flex justify-end space-x-4 mt-4'>
              <button
                className='py-2 px-4 bg-gray-400 text-white rounded-lg hover:bg-gray-500'
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className='py-2 px-4 bg-blue-500 text-white bg-green-400 rounded-lg hover:bg-blue-400'
                onClick={handleSubmitPayment}
              >
                Submit Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdvertiseDetailShop
