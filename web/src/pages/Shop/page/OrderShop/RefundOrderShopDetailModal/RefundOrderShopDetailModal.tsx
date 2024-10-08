import { Button, Modal, ScrollArea } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format, parseISO } from 'date-fns'
import { Flip, toast } from 'react-toastify'
import { orderApi } from 'src/apis/order.api'
import config from 'src/constants/config'
import { formatCurrency } from 'src/utils/utils'

interface Props {
  refundId: string
}
export default function RefundOrderShopDetailModal({ refundId }: Props) {
  const queryClient = useQueryClient()
  const [opened, { open, close }] = useDisclosure(false)
  const { data } = useQuery({
    queryKey: ['RefundDetailByUserOnshop'],
    queryFn: () => orderApi.getRefund(refundId as string),
    enabled: opened
  })

  const processRefundMutation = useMutation({
    mutationFn: orderApi.processRefundOrder
  })

  const refund = data?.data.body

  const handleSubmit = async () => {
    const response = await processRefundMutation.mutateAsync(refundId)
    if (response.data.statusCode === 200) {
      close()
      toast.success('Refund Sucessfully', {
        position: 'top-center',
        autoClose: 1500,
        transition: Flip
      })
      queryClient.invalidateQueries({ queryKey: ['RefundOrdersByShopId'] })
    }
  }

  return (
    <div className='p-6'>
      <Modal
        size={1500}
        yOffset='15vh'
        opened={opened}
        onClose={close}
        title='Refund detail'
        overlayProps={{
          backgroundOpacity: 0.4
        }}
        scrollAreaComponent={ScrollArea.Autosize}
      >
        <div className='grid grid-cols-12 rounded-sm bg-gray-100 py-3 px-9 text-sm capitalize text-gray-500 shadow'>
          <div className='col-span-5'>
            <div className='flex items-center'>
              <div className='flex flex-shrink-0 items-center justify-center pr-3'></div>
              <div className='flex-grow text-black'>Product</div>
            </div>
          </div>
          <div className='col-span-7'>
            <div className='grid grid-cols-7 text-center'>
              <div className='col-span-1'>Price</div>
              <div className='col-span-2'>Total</div>
              <div className='col-span-2'>Refund date</div>
              <div className='col-span-2'>Actions</div>
            </div>
          </div>
        </div>
        {refund && (
          <>
            <div className='bg-white my-4 border border-gray-200 rounded-sm'>
              <div className='flex items-center justify-between gap-x-3 px-4 py-3 border-b  border-gray-200'>
                <div className='flex items-center gap-x-2'>
                  <img
                    src={refund.user && refund.user.avatarUrl}
                    alt='avatar'
                    className='w-8 h-8 rounded-full object-cover'
                  />
                  <p className='text-sm'>{refund.user.userName}</p>
                  {/* chat icon */}
                  <svg className='w-6 h-6 fill-blue' viewBox='0 0 256 256'>
                    <path d='M216,80H184V48a16,16,0,0,0-16-16H40A16,16,0,0,0,24,48V176a8,8,0,0,0,13,6.22L72,154V184a16,16,0,0,0,16,16h93.59L219,230.22a8,8,0,0,0,5,1.78,8,8,0,0,0,8-8V96A16,16,0,0,0,216,80ZM66.55,137.78,40,159.25V48H168v88H71.58A8,8,0,0,0,66.55,137.78ZM216,207.25l-26.55-21.47a8,8,0,0,0-5-1.78H88V152h80a16,16,0,0,0,16-16V96h32Z'></path>
                  </svg>
                </div>
                <div className='text-sm'>Refund ID: {refund.id?.split('-').join('_').toLocaleUpperCase()}</div>
              </div>

              <div className='totalEntireWidthForSpoilerIncluedFullItems'>
                <div className={`${refund.refundItems.length > 1 ? 'rounded-sm' : 'px-5'}`}>
                  {refund.refundItems.map((item, indexOrderItem) => (
                    <div key={item.id}>
                      <div className='px-4 grid grid-cols-12 items-center rounded-sm bg-white text-center text-sm text-gray-500'>
                        <div className='col-span-5 border-r border-gray-300 py-2'>
                          <div className='flex-grow'>
                            <div className='flex'>
                              <div className='h-20 w-20 flex-shrink-0'>
                                <img
                                  className='h-full w-full object-cover'
                                  alt={item.orderItem.imageUrl}
                                  src={`${config.awsURL}products/${item.orderItem.imageUrl}`}
                                />
                              </div>
                              <div className='flex-1'>
                                <div className='w-full flex items-center flex-row h-full'>
                                  <div className='w-7/12 pt-[5px] pl-[10px] pr-4'>
                                    <div className='line-clamp-3 text-[#000000DE] text-left'>
                                      <p>{item.orderItem.productName}</p>
                                      <p className='text-gray-400'>Variant: {item.orderItem.variantName}</p>
                                    </div>
                                  </div>
                                  <div className='w-5/12 flex items-center justify-center h-full'>
                                    <p>x{item.refundQuantity}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='col-span-7 h-full'>
                          <div className='grid grid-cols-7 items-center h-full'>
                            <div className='col-span-1 h-full'>
                              <div className='h-full flex items-center justify-center'>
                                <span className='ml-3 text-[#000000DE]'>
                                  {'₫' + formatCurrency(item.orderItem.price)}
                                </span>
                              </div>
                            </div>
                            <div className='col-span-2 h-full'>
                              <div className='h-full flex items-center justify-center'>
                                <span className=''>{formatCurrency(item.orderItem.price * item.refundQuantity)}</span>
                              </div>
                            </div>
                            <div className='col-span-2 h-full'>
                              <div className='h-full flex items-center justify-center'>
                                <span className=''>{format(parseISO(refund.refundDate), 'dd/MM/yyyy, HH:mm')}</span>
                              </div>
                            </div>
                            <div className='col-span-2 h-full'>
                              <div className=''>
                                {/* {indexOrderItem >= 1 ? (
                            ''
                          ) : (
                            <div className='absolute z-10 top-full -translate-y-1/2 flex flex-col gap-y-3 justify-center'>
                              <OrderShopDetailModal orderId={order.id as string} />
                            </div>
                          )} */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* {indexCartItem < order.orderItems.length - 1 && (
                        <div className='h-[1px] mr-5 ml-10 bg-gray-200'></div>
                      )} */}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div>
                <div className='border-b border-gray-200'>Reason: {refund.reason}</div>
                <div className='text-sm my-3'>
                  Description:
                  <textarea
                    className='w-full p-3 border border-gray-300 outline-none rounded-sm'
                    rows={5}
                    readOnly
                    placeholder='No description'
                    value={refund.description ?? ''}
                  ></textarea>
                </div>
              </div>
              <div className='flex items-center'>
                <span>Photos: </span>
                {refund.refundImages.map((image) => (
                  <div key={image.id} className='ml-5'>
                    <img
                      className='w-20 h-20 object-cover aspect-square'
                      src={`${config.awsURL}refunds/${image.imageUrl}`}
                      alt={image.id}
                    />
                  </div>
                ))}
              </div>
            </div>
            {/* <div className='bg-white border border-dashed border-gray-300'>
              <div className='flex justify-end items-center border-b border-dashed border-gray-200 px-6 text-right'>
                <div className='text-xs py-[13px] px-[10px]'>
                  <span>Merchandise Subtotal</span>
                </div>
                <div className='w-60 border-l border-dashed border-gray-200 py-[13px] break-words'>
                  <span>
                    ₫{formatCurrency(order.orderTotal + calculateAmountOffVoucher(order.voucherUsed, order.orderTotal))}
                  </span>
                </div>
              </div>
              <div className='flex justify-end items-center border-b border-dashed border-gray-200 px-6 text-right'>
                <div className='text-xs py-[13px] px-[10px]'>
                  <span>Shopee Voucher Applied</span>
                </div>
                <div className='w-60 border-l border-dashed border-gray-200 py-[13px] break-words'>
                  <span>-₫{formatCurrency(calculateAmountOffVoucher(order.voucherUsed, order.orderTotal))}</span>
                </div>
              </div>
              <div className='flex justify-end items-center px-6 border-b border-dashed border-gray-200  text-right'>
                <div className='text-xs py-[13px] px-[10px]'>
                  <span>Order Total</span>
                </div>
                <div className='w-60 border-l border-dashed border-gray-200 py-[13px] break-words'>
                  <span className='text-lg text-[#ee4d2d]'>₫{formatCurrency(order.orderTotal)}</span>
                </div>
              </div>
              <div className='flex justify-end items-center px-6 text-right'>
                <div className='text-xs py-[13px] px-[10px]'>
                  <span>Payment Method</span>
                </div>
                <div className='w-60 border-l border-dashed border-gray-200 py-[13px] break-words'>
                  <span className='text-xs'>
                    {order.paymentMethod === 'cod' ? 'Cash on delivery' : order.paymentMethod}
                  </span>
                </div>
              </div>
            </div> */}
            <div className='flex justify-end mt-5 gap-x-4'>
              {/* <Button color='red' miw={120} onClick={close}>
                Rejected
              </Button> */}
              <Button miw={120} onClick={handleSubmit}>
                Accept
              </Button>
            </div>
          </>
        )}
      </Modal>
      <Button miw={120} onClick={open}>
        View Detail
      </Button>
    </div>
  )
}
