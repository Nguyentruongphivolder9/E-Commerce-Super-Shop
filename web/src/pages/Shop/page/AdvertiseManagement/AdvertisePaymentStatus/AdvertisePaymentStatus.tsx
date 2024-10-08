import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import path from 'src/constants/path'
import useQueryParamsGeneric from 'src/hooks/useQueryParamsGeneric'
import { StripeParams } from 'src/types/order.type'
import { VnpReturnParams } from 'src/types/advertise.type'
import advertiseApi from 'src/apis/advertise.api' // Ensure you have this import

type PaymentMethod = 'stripe' | 'vnp' | 'unknown'

const detectPaymentMethod = (params: VnpReturnParams | StripeParams): PaymentMethod => {
  if ('vnp_Amount' in params && 'vnp_ResponseCode' in params) {
    return 'vnp'
  } else if ('paymentIntentId' in params && 'stripeResponseCode' in params) {
    return 'stripe'
  } else {
    return 'unknown'
  }
}

export default function AdvertisePaymentStatus() {
  const params: VnpReturnParams | StripeParams = useQueryParamsGeneric()
  const [responseCode, setResponseCode] = useState<string>()
  const navigate = useNavigate()
  const paymentMethod = detectPaymentMethod(params)
  const [payed, setPayed] = useState(true) // Default value for payed

  // Extract adsId from params
  const adsId = (params as VnpReturnParams).adsId

  useEffect(() => {
    if (paymentMethod === 'stripe') {
      setResponseCode((params as StripeParams).stripeResponseCode)
    } else if (paymentMethod === 'vnp') {
      setResponseCode((params as VnpReturnParams).vnp_ResponseCode)
    }
  }, [paymentMethod, params])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('status', 'Wait Accept')
    formData.append('payed', String(payed))
    formData.append('adsId', adsId)

    try {
      const response = await advertiseApi.updatePayment_Advertise(formData)
      if (response.data) {
        navigate(path.advertiseManagement)
      }
    } catch (error) {
      console.error('Error updating advertisement:', error)
    }
  }

  return (
    <div className='h-[700px] flex justify-center items-center'>
      <div className='flex justify-center items-center w-[700px] h-[400px] bg-white shadow-[0_0_30px_rgba(0,0,0,0.2)]'>
        <div className='flex flex-col items-center justify-center'>
          {responseCode === '00' ? (
            <div className='mb-12 flex items-center justify-center w-[80px] h-[80px] rounded-full shadow-md bg-blue'>
              <svg className='fill-white w-[50px] h-[50px]' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'>
                <path d='M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z'></path>
              </svg>
            </div>
          ) : (
            <div className='mb-12 flex items-center justify-center w-[80px] h-[80px] rounded-full shadow-md bg-red'>
              <svg className='fill-white w-[40px] h-[40px]' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'>
                <path d='M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z'></path>
              </svg>
            </div>
          )}

          {responseCode === '00' ? (
            <div className='flex flex-col justify-center items-center'>
              <h2 className='text-2xl font-bold mb-2'>Thank you for your advertisement purchase!</h2>
              <p className='text-gray-500'>Your advertisement will be processed within 24 hours during working days.</p>
            </div>
          ) : (
            <h2 className='text-2xl font-bold mb-2'>Your advertisement payment has been cancelled</h2>
          )}
          <div className='mt-4'>
            {responseCode === '00' ? (
              <button
                onClick={handleSubmit}
                className='bg-gray-200 hover:bg-gray-300 text-gray-500 font-bold py-2 px-4 rounded transition-colors ease-linear'
              >
                Back To Advertisement
              </button>
            ) : (
              <NavLink
                to={path.advertiseManagement}
                className='bg-gray-200 hover:bg-gray-300 text-gray-500 font-bold py-2 px-4 rounded transition-colors ease-linear'
              >
                Back To Advertisement
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
