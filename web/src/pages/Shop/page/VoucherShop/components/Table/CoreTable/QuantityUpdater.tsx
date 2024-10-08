import { Loader, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Cell, Row } from '@tanstack/react-table'
import classNames from 'classnames'
import { VoucherRequest, VoucherResponse } from 'src/types/voucher.type'
import { StatusVoucher } from '../../../enums/voucherInfo.enum'
import { voucherUpdateSchema, VoucherUpdateShema } from 'src/utils/validations/voucherValidation'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import voucherApi from 'src/apis/voucher.api'
import { GMTToLocalStingTime } from '../../../utils/date.utils'
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react'
import omit from 'lodash/omit'

interface CellContextProps {
  cell: Cell<VoucherResponse, unknown>
  row: Row<VoucherResponse>
  getValue: () => any
}
type FormData = VoucherUpdateShema
export default function QuantityUpdaterCell({ cell, row }: CellContextProps) {
  const [opened, { open, close }] = useDisclosure(false)
  const [rowData, setRowData] = useState(row.original)
  const [quantityError, setQuantityError] = useState('')
  const queryClient = useQueryClient()
  const updateMutaion = useMutation({
    mutationFn: ({ id, body }: { id: string; body: VoucherRequest }) => voucherApi.updateVoucher({ id, body }),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] })
      close()
    }
  })

  useEffect(() => {
    setRowData(row.original)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row.original])

  useEffect(() => {
    if (!opened) {
      setRowData((prev) => ({ ...prev, quantity: Number(row.original.quantity) }))
      setQuantityError('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = Number(e.target.value)
    if (rowData.status === StatusVoucher.ONGOING) {
      if (inputValue < row.original.quantity) {
        setQuantityError(`Please input the number more than ${row.original.quantity}`)
      } else {
        setQuantityError('')
      }
    }
    setRowData((prev) => ({ ...prev, quantity: Number(e.target.value) }))
  }

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (rowData.quantity === row.original.quantity) {
      close() // closeModal
      return
    }
    try {
      await updateMutaion.mutateAsync({
        id: row.original.id,
        body: {
          ...omit(rowData, ['shopId', 'status'])
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <div className='flex items-center justify-center'>
        <Modal.Root opened={opened} onClose={close} size='500px' centered>
          <Modal.Overlay />
          <Modal.Content>
            <Modal.Header p={24}>
              <Modal.Title className='text-xl font-medium'>Edit Usage Quantity</Modal.Title>
              <Modal.CloseButton />
            </Modal.Header>
            <Modal.Body px={24}>
              <form></form>
              <div className='grid grid-cols-12 mb-5 items-center'>
                <span className='col-span-4 w-32 text-sm text-gray-500'>Voucher Name:</span>
                <div className='col-span-8'>
                  <span className='text-sm text-gray-700'>{row.original.name}</span>
                </div>
              </div>
              <div className='grid grid-cols-12 mb-5 items-center'>
                <span className='col-span-4 w-32 text-sm text-gray-500'>Voucher Code:</span>
                <div className='col-span-8'>
                  <span className='text-sm text-gray-700'>{row.original.code}</span>
                </div>
              </div>
              <div className='grid grid-cols-12 mb-5 items-center'>
                <span className='col-span-4 w-32 text-sm text-gray-500'>Voucher Status:</span>
                <div className='col-span-8'>
                  <span
                    className={classNames('px-1 rounded-sm capitalize text-xs', {
                      'bg-red-200 text-red-500': row.original.status === StatusVoucher.UPCOMING,
                      'bg-green-200 text-green-500': row.original.status === StatusVoucher.ONGOING
                    })}
                  >
                    {row.original.status}
                  </span>
                </div>
              </div>
              <div className='grid grid-cols-12'>
                <span className='col-span-4 w-32 text-sm text-gray-500'>Usage quantity</span>
                <div className='col-span-8'>
                  <div className='flex items-center h-[30px] w-[80px] px-3 bg-white border text-sm rounded boder-gray-300 hover:border-gray-400'>
                    <input
                      type='number'
                      name='quantity'
                      value={rowData.quantity}
                      onChange={handleChange}
                      placeholder='Input quantity'
                      className='w-full h-full outline-none border-none appearance:textfield [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                    />
                  </div>
                  <span className='text-xs text-red-500'>{quantityError}</span>
                  <p className='text-sm text-gray-700'>
                    You only can increase the voucher quantity because the voucher status is on-going
                  </p>
                </div>
              </div>
              <div className='footermodal'>
                <div className='flex gap-x-2 justify-end py-4'>
                  <button
                    onClick={close}
                    className='bg-white text-sm py-1 px-4 min-w-[76px] min-h-[32px] rounded-[4px] border border-gray-300'
                  >
                    <span>Cancel</span>
                  </button>
                  <button
                    className={classNames(
                      'flex items-center text-white text-sm py-1 px-4 min-w-[76px] min-h-[32px] rounded-[4px] ',
                      {
                        'cursor-not-allowed bg-blue/70': quantityError.length > 0,
                        'cursor-pointer bg-blue': !quantityError.length
                      }
                    )}
                    onClick={handleSubmit}
                  >
                    {updateMutaion.isPending ? <Loader color='white' size={17} mr={8} /> : ''}
                    Submit
                  </button>
                </div>
              </div>
            </Modal.Body>
          </Modal.Content>
        </Modal.Root>
      </div>
      <div className='flex items-center'>
        <span className='ml-5'>{row.original.quantity}</span>
        {row.original.status !== StatusVoucher.EXPIRE ? (
          <button onClick={open}>
            <svg
              className='w-4 h-4'
              xmlns='http://www.w3.org/2000/svg'
              width='32'
              height='32'
              fill='#000000'
              viewBox='0 0 256 256'
            >
              <path d='M227.32,73.37,182.63,28.69a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H216a8,8,0,0,0,0-16H115.32l112-112A16,16,0,0,0,227.32,73.37ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.69,147.32,64l24-24L216,84.69Z'></path>
            </svg>
          </button>
        ) : (
          ''
        )}
      </div>
    </>
  )
}
