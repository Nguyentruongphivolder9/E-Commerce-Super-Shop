import { yupResolver } from '@hookform/resolvers/yup'
import { Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useMutation } from '@tanstack/react-query'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { orderApi } from 'src/apis/order.api'
import config from 'src/constants/config'
import { AppContext } from 'src/contexts/app.context'
import { OrderItem } from 'src/types/order.type'
import { formatCurrency, generateNameId, handleImageProduct, handlePriceProduct } from 'src/utils/utils'
import * as yup from 'yup'

const validationSchema = yup.object({
  recipientName: yup.string().required('Full Name is required').min(2, 'Full Name is too short'),
  recipientPhone: yup
    .string()
    .required('Phone Number is required')
    .matches(/^[0-9]{10}$/, 'Phone number must contain 9 digits'),
  recipientAddress: yup.string().required('Address is required')
})

export type FormAddress = yup.InferType<typeof validationSchema>

export default function Checkout() {
  const { profile, orders, setOrders } = useContext(AppContext)
  const [opened, handlersAdress] = useDisclosure(false)
  const [infoOrder, setInfoOrder] = useState({
    recipientName: 'Nguyen Van A',
    recipientPhone: '0999999999',
    recipientAddress: profile?.address || '12 Warwickshire Mansions'
  })
  const [selectPayMentMethod, setSelectPayMentMethod] = useState('cod')
  console.log(orders)
  console.log(profile)
  console.log('infoOrder', infoOrder)
  const {
    handleSubmit,
    control,
    register,
    clearErrors,
    formState: { errors }
  } = useForm<FormAddress>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      recipientName: infoOrder.recipientName,
      recipientPhone: infoOrder.recipientPhone.split('-').join(''),
      recipientAddress: infoOrder.recipientAddress
    }
  })

  const placeOrdersMutation = useMutation({
    mutationFn: orderApi.placeOrder
  })

  const merchandiseSubtotal = useMemo(() => {
    return orders?.reduce((acc, shop) => {
      return acc + shop.orderTotal + (shop.voucherOffPrice ?? 0)
    }, 0)
  }, [orders])

  const voucherTotal = useMemo(() => {
    return orders?.reduce((acc, shop) => {
      return acc + (shop.voucherOffPrice ?? 0)
    }, 0)
  }, [orders])

  const isSelectedPaymentMethod = (method: string) => {
    return selectPayMentMethod === method
  }

  useEffect(() => {
    if (profile) {
      setInfoOrder({
        recipientName: 'Nguyen Van A',
        // recipientName: profile.fullName,
        recipientPhone: '0999999999',
        // recipientPhone: profile.phoneNumber,
        recipientAddress: profile.address ?? '12 Warwickshire Mansions'
      })
    }
  }, [profile])

  useEffect(() => {
    setOrders(
      (prevOrders) =>
        prevOrders &&
        prevOrders.map((order) => ({
          ...order,
          paymentMethod: selectPayMentMethod,
          recipientName: infoOrder.recipientName,
          recipientPhone: infoOrder.recipientPhone,
          recipientAddress: infoOrder.recipientAddress
        }))
    )
  }, [selectPayMentMethod, infoOrder, setOrders])

  const handleCommentChange = (shopId: string, newComment: string) => {
    setOrders(
      (prevOrders) =>
        prevOrders &&
        prevOrders.map((orderShop) => (orderShop.shopId === shopId ? { ...orderShop, comment: newComment } : orderShop))
    )
  }

  const onSubmitChangeAddress = handleSubmit((data) => {
    setInfoOrder((prev) => ({ ...prev, ...data }))
    handlersAdress.close()
  })

  const handlePlaceOrder = async () => {
    try {
      if (orders) {
        const response = await placeOrdersMutation.mutateAsync(orders)
        window.open(response.data.body?.paymentUrl, '_self')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='bg-neutral-100'>
      <div className='container mx-auto p-6 rounded-lg my-8'>
        {/* Delivery Address */}
        <div className='flex items-center justify-between mb-4 p-7 bg-white'>
          <div>
            <p className='text-xl text-blue'>Delivery Address</p>
            <div className='flex items-center'>
              <div className='flex items-center '>
                <p className='text-gray-500 mr-5 min-w-52'>
                  {infoOrder.recipientName} - {infoOrder.recipientPhone}
                </p>
                <p className='text-gray-700 line-clamp-1'>{infoOrder.recipientAddress}</p>
              </div>
              <Modal size={500} opened={opened} onClose={handlersAdress.close} title='My Adress' centered>
                <div className='container mx-auto p-4'>
                  <h1 className='text-2xl mb-4'>Change to a new address</h1>
                  <form onSubmit={onSubmitChangeAddress}>
                    <div className='grid grid-cols-2 gap-4 mb-4'>
                      <div>
                        <label htmlFor='recipientName' className='block text-sm font-medium text-gray-700'>
                          Full Name
                        </label>
                        <input
                          type='text'
                          id='recipientName'
                          {...register('recipientName')}
                          className='mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none'
                        />
                        {errors.recipientName && (
                          <div className='text-red-500 text-xs'>{errors.recipientName.message}</div>
                        )}
                      </div>
                      <div>
                        <label htmlFor='recipientPhone' className='block text-sm font-medium text-gray-700'>
                          Phone Number
                        </label>
                        <input
                          type='text'
                          id='recipientPhone'
                          {...register('recipientPhone')}
                          className='mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none'
                        />
                        {errors.recipientPhone && (
                          <div className='text-red-500 text-xs'>{errors.recipientPhone.message}</div>
                        )}
                      </div>
                    </div>
                    <div className='mb-4'>
                      <label htmlFor='recipientAddress' className='block text-sm font-medium text-gray-700'>
                        City, District, Ward, Street Name
                      </label>
                      <input
                        type='text'
                        id='recipientAddress'
                        {...register('recipientAddress')}
                        className='mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none'
                      />
                      {errors.recipientAddress && (
                        <div className='text-red-500 text-xs'>{errors.recipientAddress.message}</div>
                      )}
                    </div>

                    <div className='flex justify-end mt-4'>
                      <button
                        type='button'
                        onClick={() => {
                          clearErrors()
                          handlersAdress.close()
                        }}
                        className='bg-gray-200 hover:bg-gray-300 text-gray-500 font-bold py-2 px-4 rounded mt-4'
                      >
                        Cancel
                      </button>
                      <button
                        type='submit'
                        className='hover:bg-blue/90 text-white bg-blue font-bold py-2 px-4 rounded mt-4 ml-4'
                      >
                        Add Location
                      </button>
                    </div>
                  </form>
                </div>
              </Modal>

              <button
                onClick={handlersAdress.open}
                className='font-medium ml-10 bg-blue/95 text-white px-3 py-2 rounded'
              >
                Change
              </button>
            </div>
          </div>
        </div>
        {/* Products Ordered */}
        <div className='rounded-lg'>
          <div className='grid grid-cols-12 rounded-sm bg-white py-5 px-9 text-sm capitalize text-gray-500 shadow'>
            <div className='col-span-8'>
              <div className='flex items-center'>
                <div className='flex-grow text-black text-lg'>Product Orders</div>
              </div>
            </div>
            <div className='col-span-4'>
              <div className='grid grid-cols-5 text-center'>
                <div className='col-span-2'>Unit Price</div>
                <div className='col-span-1'>Quantity</div>
                <div className='col-span-2'>Total Price</div>
              </div>
            </div>
          </div>
          {orders &&
            orders.map((orderShop, index) => {
              return (
                <div className='bg-white mb-4' key={index}>
                  <div className='flex items-center justify-start gap-x-3 px-9 py-6 border-b border-gray-200'>
                    <div className='inline-block bg-[#d0011b] leading-3 py-[2px] px-[3px] text-white rounded-sm'>
                      <svg className='w-6 h-[11px]' viewBox='0 0 24 11'>
                        <title>Mall</title>
                        <g className='fill-white' fillRule='evenodd'>
                          <path d='M19.615 7.143V1.805a.805.805 0 0 0-1.611 0v5.377H18c0 1.438.634 2.36 1.902 2.77V9.95c.09.032.19.05.293.05.444 0 .805-.334.805-.746a.748.748 0 0 0-.498-.69v-.002c-.59-.22-.885-.694-.885-1.42h-.002zm3 0V1.805a.805.805 0 0 0-1.611 0v5.377H21c0 1.438.634 2.36 1.902 2.77V9.95c.09.032.19.05.293.05.444 0 .805-.334.805-.746a.748.748 0 0 0-.498-.69v-.002c-.59-.22-.885-.694-.885-1.42h-.002zm-7.491-2.985c.01-.366.37-.726.813-.726.45 0 .814.37.814.742v5.058c0 .37-.364.73-.813.73-.395 0-.725-.278-.798-.598a3.166 3.166 0 0 1-1.964.68c-1.77 0-3.268-1.456-3.268-3.254 0-1.797 1.497-3.328 3.268-3.328a3.1 3.1 0 0 1 1.948.696zm-.146 2.594a1.8 1.8 0 1 0-3.6 0 1.8 1.8 0 1 0 3.6 0z' />
                          <path
                            d='M.078 1.563A.733.733 0 0 1 .565.89c.423-.15.832.16 1.008.52.512 1.056 1.57 1.88 2.99 1.9s2.158-.85 2.71-1.882c.19-.356.626-.74 1.13-.537.342.138.477.4.472.65a.68.68 0 0 1 .004.08v7.63a.75.75 0 0 1-1.5 0V3.67c-.763.72-1.677 1.18-2.842 1.16a4.856 4.856 0 0 1-2.965-1.096V9.25a.75.75 0 0 1-1.5 0V1.648c0-.03.002-.057.005-.085z'
                            fillRule='nonzero'
                          />
                        </g>
                      </svg>
                    </div>
                    <h2>{orderShop.shopName}</h2>
                    {/* chat icon */}
                    <svg className='w-6 h-6 fill-blue' viewBox='0 0 256 256'>
                      <path d='M216,80H184V48a16,16,0,0,0-16-16H40A16,16,0,0,0,24,48V176a8,8,0,0,0,13,6.22L72,154V184a16,16,0,0,0,16,16h93.59L219,230.22a8,8,0,0,0,5,1.78,8,8,0,0,0,8-8V96A16,16,0,0,0,216,80ZM66.55,137.78,40,159.25V48H168v88H71.58A8,8,0,0,0,66.55,137.78ZM216,207.25l-26.55-21.47a8,8,0,0,0-5-1.78H88V152h80a16,16,0,0,0,16-16V96h32Z'></path>
                    </svg>
                  </div>

                  <div>
                    <div
                      className={`${orderShop.orderItems.length > 1 ? 'border border-gray-200 mx-5 rounded-sm my-5' : 'px-5'}`}
                    >
                      {orderShop.orderItems.length > 1 && <div className='h-12 bg-sky-100 rounded-t-sm'></div>}
                      {orderShop.orderItems.map((item: OrderItem, indexItem: number) => (
                        <div key={item.productVariantId}>
                          <div className='mt-5 py-5 px-4 grid grid-cols-12 rounded-sm bg-white text-center text-sm text-gray-500'>
                            <div className='col-span-8'>
                              <div className='flex'>
                                <div className='flex-grow'>
                                  <div className='flex'>
                                    <div className='h-20 w-20 flex-shrink-0'>
                                      <img
                                        className='h-full w-full object-cover'
                                        alt={item.productName}
                                        src={`${config.awsURL}products/${item.imageUrl}`}
                                      />
                                    </div>
                                    <div className='flex-1'>
                                      <div className='w-full flex flex-row h-full'>
                                        <div className='w-7/12 h-full pt-[5px] pl-[10px] pr-4'>
                                          <div className='line-clamp-2 text-[#000000DE] text-left'>
                                            {item.productName}
                                          </div>
                                        </div>
                                        <div className='w-5/12 flex items-center justify-start h-full'>
                                          <div>Variation: {item.variantName}</div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className='col-span-4 flex items-center'>
                              <div className='grid grid-cols-5 items-center flex-1'>
                                <div className='col-span-2'>
                                  <div className='flex items-center justify-center'>
                                    {/* <span className='text-gray-300 line-through'>
                                              ₫{formatCurrency(item.product.price_before_discount)}
                                              đ450000
                                            </span> */}
                                    <span className='ml-3 text-[#000000DE]'>₫{formatCurrency(item.price)}</span>
                                  </div>
                                </div>
                                <div className='col-span-1'>{item.quantity}</div>
                                <div className='col-span-2'>
                                  <span className='text-blue'>₫{formatCurrency(item.price * item.quantity)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          {indexItem < orderShop.orderItems.length - 1 && (
                            <div className='h-[1px] mr-5 ml-10 bg-gray-200'></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className='bg-[#fafdff] mt-7'>
                    <div className='flex justify-between border border-gray-200 border-dashed'>
                      <div className='gap-4 p-6 border-r border-gray-200 border-dashed'>
                        <div className='flex items-center'>
                          <p className='text-sm text-gray-600 mr-3'>Message for Sellers</p>
                          <input
                            type='text'
                            className='flex-grow flex-1 p-4 h-[30px] border text-sm border-gray-300 outline-none'
                            placeholder='Leave message...'
                            maxLength={100}
                            value={orderShop.comment || ''}
                            onChange={(e) => handleCommentChange(orderShop.shopId, e.target.value)}
                          />
                        </div>
                      </div>
                      {/* Voucher and Shipping */}
                      <div className='flex-1'>
                        <div className='flex flex-col'>
                          <div className='flex items-center justify-between py-4'>
                            <p className='text-sm text-gray-600 pl-6'>Shop Voucher</p>
                            <button className='text-[#ee4d2d] pr-14'>
                              -₫{orderShop.voucherOffPrice ? formatCurrency(orderShop.voucherOffPrice) : 0}
                            </button>
                          </div>
                          <div className='h-[1px] border-t border-dashed border-gray-200'></div>
                          {/* <div>
                          <p className='text-sm text-gray-600'>Shipping Option</p>
                          <div className='flex items-center'>
                            <p className='font-semibold'>Standard Express</p>
                            <button className='ml-auto text-blue-500'>Change</button>
                          </div>
                          <p className='text-sm text-gray-500'>₫17.000</p>
                          <p className='text-sm text-gray-500'>Guaranteed to get by 22 Tháng 8 - 24 Tháng 8</p>
                        </div> */}
                        </div>
                        {/* Total */}
                        <div className='flex justify-between items-center py-4'>
                          <p className='text-base text-gray-500 pl-6'>
                            Order Total ({orderShop.orderItems.length}{' '}
                            {orderShop.orderItems.length > 1 ? 'Items' : 'Item'}):
                          </p>
                          <p className='text-xl text-[#ee4d2d] pr-14'>₫{formatCurrency(orderShop.orderTotal)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

          <div className='p-4 w-full mx-auto bg-white rounded-lg shadow-md'>
            <div className='flex p-5 justify-start items-center border-b border-gray-200'>
              <h2 className='text-xl'>Payment Method</h2>
              <div className='flex justify-end gap-x-3 ml-40'>
                {['stripe', 'vnpay', 'cod'].map((method) => (
                  <button
                    key={method}
                    onClick={() => setSelectPayMentMethod(method)}
                    className={`relative bg-white border ${isSelectedPaymentMethod(method) ? 'border-[#ee4d2d]' : 'border-[#00000017]'} hover:border-[#ee4d2d] text-sm p-2 mt-2 mr-2 flex items-center rounded-sm h-[34px] min-w-20 outline-0 justify-center capitalize`}
                  >
                    {method === 'cod' ? 'Cash on Delivery' : method}
                    {isSelectedPaymentMethod(method) && (
                      <div className="absolute w-[15px] h-[15px] bottom-0 right-0 overflow-hidden before:contents-[''] before:border-[15px] before:border-transparent before:bottom-0 before:absolute before:-right-[15px] before:border-b-[15px] before:border-b-[#ee4d2d]">
                        <div className='h-2 w-2 absolute bottom-0 right-0 flex items-center justify-center'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth={2.5}
                            stroke='currentColor'
                            className='size-2 text-white'
                          >
                            <path strokeLinecap='round' strokeLinejoin='round' d='m4.5 12.75 6 6 9-13.5' />
                          </svg>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className='grid grid-cols-12 bg-[#fffefb] px-4 py-8 rounded-lg my-4 gap-y-2 border-b border-gray-200'>
              <div className='col-span-8'></div>
              <div className='ml-auto col-span-4'>
                <div className='flex justify-between gap-x-7'>
                  <span className='text-gray-600'>Merchandise Subtotal:</span>
                  <span className='text-gray-900 font-semibold text-right'>
                    ₫{formatCurrency(merchandiseSubtotal ?? 0)}
                  </span>
                </div>
                {/* <span className="text-gray-600">Shipping Total:</span>
                  <span className="text-gray-900 font-semibold text-right">₫63.400</span> */}
                <div className='flex justify-between gap-x-7'>
                  <span className='text-gray-600'>Voucher Discount:</span>
                  <span className='text-red-600 font-semibold text-right'>
                    -₫{voucherTotal && formatCurrency(voucherTotal)}
                  </span>
                </div>
                <div className='flex justify-between gap-x-7'>
                  <span className='text-gray-900 font-bold text-xl'>Total Payment:</span>
                  <span className='text-red-600 font-bold text-xl text-right'>
                    ₫{merchandiseSubtotal && formatCurrency(merchandiseSubtotal - (voucherTotal ?? 0))}
                  </span>
                </div>
              </div>
            </div>
            <div className='flex justify-end items-center'>
              <button onClick={handlePlaceOrder} className='p-2 w-[210px] min-w-[210px] bg-blue text-white rounded-sm'>
                Place Order
              </button>
            </div>
          </div>

          {/* Product Details */}
          {/* <div className='border-t border-gray-200 pt-4'>
          <div className='flex justify-between items-center'>
            <img src='https://via.placeholder.com/50' alt='' className='w-14 h-14' />
            <div className='flex-1 ml-4'>
              <p className='font-medium'>Micro thu âm USB MAONO PM471TS dùng...</p>
              <p className='text-sm text-gray-500'>Variation: AU-PM471TS</p>
            </div>
            <div className='text-right'>
              <p className='font-bold'>₫920.000</p>
            </div>
          </div>
        </div> */}
        </div>
      </div>
    </div>
  )
}
