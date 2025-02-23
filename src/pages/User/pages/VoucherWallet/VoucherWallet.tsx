import classNames from 'classnames'
import { Link, createSearchParams } from 'react-router-dom'
import Button from 'src/components/Button'
import path from 'src/constants/path'
import useQueryParams from 'src/hooks/useQueryParams'
import VoucherBox from './VoucherBox'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { voucherDepotApi } from 'src/apis/voucher.api'
import { toast } from 'react-toastify'
import { ErrorServerRes } from 'src/types/utils.type'
import { isAxiosBadRequestNotFoundError } from 'src/utils/utils'
const voucherTypeTabs = [
  { type: 'all', name: 'All' },
  { type: 'global', name: 'Global' },
  { type: 'shop', name: 'Shop' },
  { type: 'shipping', name: 'Free ship' }
]

const schema = yup.object({
  code: yup.string()
})

export default function VoucherWallet() {
  const queryClient = useQueryClient()
  const queryParams: { type?: string } = useQueryParams()
  const type: string = queryParams.type || 'all'
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
    setError
  } = useForm({
    defaultValues: {
      code: ''
    },
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const fieldValues = watch()
  const isFieldFilled = Object.values(fieldValues).some((value) => value)

  const { data: vouchersData } = useQuery({
    queryKey: ['vouchersDepot'],
    queryFn: () => voucherDepotApi.getVouchersInDepot()
  })

  const addToDepotMutation = useMutation({
    mutationFn: voucherDepotApi.addVoucherToDepot,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['vouchersDepot'] })
    }
  })

  const onsubmit = handleSubmit(async (data) => {
    try {
      await addToDepotMutation.mutateAsync(data as { code: string })
      reset()
      toast.success('Success')
    } catch (error) {
      console.log(error)
      if (isAxiosBadRequestNotFoundError<ErrorServerRes>(error)) {
        setError('code', {
          message: error.response?.data.error,
          type: 'server'
        })
      }
    }
  })

  return (
    <div className='bg-white px-8 py-6'>
      <div className='flex justify-between items-center'>
        <span className='text-xl'>Vouchers</span>
        <div className='flex'>
          <Link to={''} className='text-blue/90'>
            Get more vouchers
          </Link>
          <div className='w-[1px] bg-gray-200 h-5 mx-3'></div>
          <Link to={''} className='text-blue/90'>
            View voucher history
          </Link>
        </div>
      </div>
      <div className='py-4 px-28 bg-gray-100 my-5'>
        <div className='relative flex justify-center items-center gap-2'>
          <span className='text-base'>Add voucher</span>
          <div className='relative'>
            <form className='relative' onSubmit={onsubmit}>
              <input
                {...register('code')}
                type='text'
                placeholder='Please enter voucher code'
                className='text-sx leading-none p-[0.8125rem] outline-none w-96 border border-gray-300 rounded-sm shadow-inner'
              />
              <Button
                disabled={!isFieldFilled}
                type='submit'
                className={classNames(
                  'h-[2.75rem] w-[6.25rem] text-sm py-[1px] px-[6px] ml-3 transition-colors duration-300',
                  {
                    'bg-blue text-white cursor-pointer': isFieldFilled,
                    'bg-gray-200 cursor-auto': !isFieldFilled
                  }
                )}
              >
                Save
              </Button>
            </form>
            {errors.code && (
              <div className='absolute flex items-center top-[100%] left-0 w-96 p-[0.625rem] bg-[#fff9fa] border border-red-500 text-red-500 rounded-sm'>
                <svg
                  className='w-5 h-5 fill-red-500'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='#000000'
                  viewBox='0 0 256 256'
                >
                  <path d='M164.24,100.24,136.48,128l27.76,27.76a6,6,0,1,1-8.48,8.48L128,136.48l-27.76,27.76a6,6,0,0,1-8.48-8.48L119.52,128,91.76,100.24a6,6,0,0,1,8.48-8.48L128,119.52l27.76-27.76a6,6,0,0,1,8.48,8.48ZM230,128A102,102,0,1,1,128,26,102.12,102.12,0,0,1,230,128Zm-12,0a90,90,0,1,0-90,90A90.1,90.1,0,0,0,218,128Z'></path>
                </svg>
                <span className='ml-[0.625rem] text-xs leading-[1.2] text-red-500'>{errors.code?.message}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className='h-[46px] border-b border-b-gray-300'>
        {voucherTypeTabs.map((tab, index) => {
          return (
            <div key={tab.type} className='inline-flex items-center flex-grow-1'>
              <Link
                to={{
                  pathname: path.voucher,
                  search: createSearchParams({
                    type: String(tab.type)
                  }).toString()
                }}
                className={classNames('flex items-center justify-center h-[46px] px-3 text-center', {
                  'border-b-2 border-b-blue text-blue': type === tab.type,
                  'border-b-black/10 text-gray-900': type !== tab.type
                })}
              >
                {tab.name} (467)
              </Link>
              {voucherTypeTabs.length - 1 - index !== 0 && <div className='h-[14px] w-[2px] bg-gray-300'></div>}
            </div>
          )
        })}
      </div>

      <div className='grid grid-cols-2 gap-5 mt-5'>
        {vouchersData?.data.body?.content?.map((vou) => {
          return (
            <div key={vou.voucher.id}>
              <VoucherBox voucher={vou.voucher} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
