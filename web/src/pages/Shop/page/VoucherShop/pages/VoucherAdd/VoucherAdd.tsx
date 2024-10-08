/* eslint-disable import/namespace */
import { useContext, useEffect, useState } from 'react'
import { format, addHours, addMinutes, getTime, getYear, getMonth, getHours, getMinutes } from 'date-fns'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
/* eslint-disable jsx-a11y/label-has-associated-control */
import { vi } from 'date-fns/locale/vi'
import { Controller, useForm } from 'react-hook-form'
import { VoucherSchema, voucherShema } from 'src/utils/validations/voucherValidation'
import { yupResolver } from '@hookform/resolvers/yup'
import Button from 'src/components/Button'
import classNames from 'classnames'
import { useMutation, useQuery } from '@tanstack/react-query'
import voucherApi from 'src/apis/voucher.api'
import { GMTToLocalStingTime } from '../../utils/date.utils'
import useQueryParams from 'src/hooks/useQueryParams'
import { AppContext } from 'src/contexts/app.context'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import path from 'src/constants/path'
registerLocale('vi', vi)
const range = (start: number, end: number) => {
  return new Array(end - start + 1).fill(null).map((d, i) => i + start)
}
const years = range(1990, getYear(new Date()) + 1)
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]
const isThreeMonthsAhead = (date: Date) => {
  const today = new Date()

  const threeMonthsAhead = new Date()
  threeMonthsAhead.setMonth(today.getMonth() + 3)

  return date <= threeMonthsAhead
}

type FormData = VoucherSchema
export default function VoucherAdd() {
  const { profile } = useContext(AppContext)
  const navigate = useNavigate()
  const [startDate, setStartDate] = useState(addMinutes(new Date(), 10))
  const [endDate, setEndDate] = useState(addHours(addMinutes(new Date(), 10), 1))
  const queryParams: { voucherType?: string; edit?: string } = useQueryParams()
  const {
    control,
    register,
    handleSubmit,
    setValue,
    trigger,
    getValues,
    clearErrors,
    formState: { errors },
    watch
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      code: '',
      voucherType: queryParams.voucherType,
      discountType: 'fixed',
      isLimit: true,
      startDate: startDate,
      endDate: endDate
    },
    mode: 'onChange',
    resolver: yupResolver(voucherShema)
  })

  const createVoucherMutaion = useMutation({
    mutationFn: voucherApi.createVoucher,
    onSuccess() {
      navigate(path.voucherShop)
    }
  })

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await createVoucherMutaion.mutateAsync({
        ...data,
        code: `${profile?.userName.slice(0, 5)}${data.code}`.toUpperCase(),
        startDate: GMTToLocalStingTime(data.startDate),
        endDate: GMTToLocalStingTime(data.endDate)
      })
      toast.success(res.data.message)
    } catch (error) {
      console.log(error)
    }
  })

  return (
    <div className='w-full'>
      <div className='grid grid-cols-12 gap-x-4'>
        <div className='col-span-9 '>
          <form onSubmit={onSubmit} noValidate>
            <div className='p-4 bg-white'>
              <h3 className='mb-6 text-[20px] font-medium text-[#333]'>Basic Information</h3>
              <div>
                <div className='grid grid-cols-12 mb-4 text-sm items-center'>
                  <div className='col-span-3 flex justify-end'>
                    <label className='min-w-[200px] w-[200px] max-w-[200px] h-[80px] text-right leading-[48px] py-2 mr-3'>
                      Voucher Type
                    </label>
                  </div>
                  <div className='col-span-9'>
                    <div className='inline-flex items-center h-[50px] py-3 pl-3 pr-7 mb-4 mr-4 rounded-md bg-white shadow-[0_0_17px_0_#e2e2e2]'>
                      <div className='mr-3 ml-2'>
                        <svg
                          viewBox='0 0 21 20'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                          className='fill-blue w-5 h-5'
                        >
                          <path
                            fillRule='evenodd'
                            clipRule='evenodd'
                            d='M14.875 5.625a2.183 2.183 0 01-2.188 2.188A2.183 2.183 0 0110.5 5.624a2.183 2.183 0 01-2.187 2.188 2.183 2.183 0 01-2.187-2.188 2.183 2.183 0 01-2.188 2.187 2.179 2.179 0 01-1.83-.99 2.174 2.174 0 01-.357-1.185v-.012l.62-2.481A2.5 2.5 0 014.796 1.25h11.408a2.5 2.5 0 012.426 1.894l.62 2.48V5.638a2.177 2.177 0 01-.357 1.186 2.18 2.18 0 01-1.83.99 2.183 2.183 0 01-2.188-2.187zM3 8.933V17.5c0 .69.56 1.25 1.25 1.25h12.5c.69 0 1.25-.56 1.25-1.25V8.933a3.44 3.44 0 01-3.125-.656 3.423 3.423 0 01-2.188.786 3.423 3.423 0 01-2.187-.786 3.424 3.424 0 01-2.188.786 3.423 3.423 0 01-2.187-.786A3.44 3.44 0 013 8.933zm8.208 6.066a.579.579 0 00-.22-.483 2.675 2.675 0 00-.768-.357 7.273 7.273 0 01-.899-.358c-.758-.371-1.137-.882-1.137-1.533a1.38 1.38 0 01.28-.856c.21-.263.488-.463.804-.579a3.121 3.121 0 011.166-.208c.388-.006.772.07 1.128.225.316.134.587.357.779.642.186.281.283.612.277.95h-1.405a.709.709 0 00-.222-.557.844.844 0 00-.589-.195.967.967 0 00-.607.168.508.508 0 00-.217.422.524.524 0 00.241.41c.262.167.548.294.847.377.346.104.68.244.996.417.632.364.949.866.949 1.506a1.43 1.43 0 01-.579 1.205c-.385.292-.914.438-1.586.438a3.186 3.186 0 01-1.289-.252 1.973 1.973 0 01-.868-.7A1.834 1.834 0 018 14.658h1.414a.91.91 0 00.241.695c.162.146.426.22.791.22a.91.91 0 00.55-.152.5.5 0 00.212-.422z'
                          />
                        </svg>
                      </div>
                      <span className='text-sm'>Shop Voucher</span>
                      <div className='check_part'></div>
                    </div>
                  </div>
                </div>
                <div className='grid grid-cols-12 mb-6 text-sm items-center'>
                  <div className='col-span-3 flex justify-end h-full'>
                    <label className='min-w-[200px] w-[200px] max-w-[200px] h-full text-right leading-[16px] py-2 mr-3'>
                      Voucher Name
                    </label>
                  </div>
                  <div className='col-span-9'>
                    <div
                      className={classNames(
                        'flex items-center px-3 bg-white border text-sm rounded has-[:focus]:border-gray-400',
                        {
                          'border-gray-200 hover:border-gray-500': !errors.name?.message,
                          'border-red-300': errors.name?.message
                        }
                      )}
                    >
                      <input
                        type='text'
                        {...register('name')}
                        className=' flex-grow flex-1 h-[30px] outline-none'
                        maxLength={100}
                      />
                      <div className='pl-2 text-gray-400'>{watch('name').length}/100</div>
                    </div>
                    <p className='text-red-500 text-xs'>{errors.name?.message}</p>
                    <p className='text-gray-400 text-xs'>Voucher name is not visible to buyers</p>
                  </div>
                </div>
                <div className='grid grid-cols-12 mb-6 text-sm items-center h-[88px]'>
                  <div className='col-span-3 flex justify-end h-full'>
                    <label className='mr-3 min-w-[200px] w-[200px] max-w-[200px] h-full text-right leading-[16px] py-3'>
                      Voucher Code From Seller
                    </label>
                  </div>
                  <div className='col-span-9'>
                    <div
                      className={classNames(
                        'flex items-center px-3 bg-white border text-sm rounded has-[:focus]:border-gray-400',
                        {
                          'border-gray-200 hover:border-gray-500': !errors.code?.message,
                          'border-red-300': errors.code?.message
                        }
                      )}
                    >
                      <div className='pr-2 text-sm uppercase'>{profile?.userName.slice(0, 5)}</div>
                      <div className='h-4 w-[1px] bg-gray-300'></div>
                      <input
                        type='text'
                        {...register('code', {
                          onChange(event) {
                            console.log(event)
                            event.target.value = event.target.value.toUpperCase()
                          }
                        })}
                        maxLength={5}
                        className=' flex-grow flex-1 px-3 h-[30px] outline-none '
                      />
                      <div className='pl-2 text-gray-400'>{getValues('code').length}/5</div>
                    </div>
                    <div className='text-sm text-gray-400'>
                      <p className='text-red-500 text-xs'>{errors.code?.message}</p>
                      <p>Please enter A-Z, 0-9; 5 characters maximum.</p>
                      <p>
                        Your complete voucher code is:{' '}
                        <span className='uppercase'>{profile?.userName.slice(0, 5)}</span>
                        {watch('code').toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className='grid grid-cols-12 mb-6 text-sm'>
                  <div className='col-span-3 flex justify-end'>
                    <label className='min-w-[200px] w-[200px] max-w-[200px] h-[56px] text-right leading-[16px] py-2 mr-3'>
                      Voucher Usage Period
                    </label>
                  </div>
                  <div className='col-span-9'>
                    <div className='flex items-start mr-auto'>
                      <div className='max-w-[184px]'>
                        <Controller
                          control={control}
                          name='startDate'
                          render={({ field }) => (
                            <DatePicker
                              className='h-8 border rounded w-full bg-gray-50 outline-none cursor-pointer hover:border-gray-400 transition-colors'
                              showIcon
                              toggleCalendarOnIconClick
                              icon={
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  fill='#000000'
                                  viewBox='0 0 256 256'
                                  className='h-4'
                                >
                                  <path d='M208,34H182V24a6,6,0,0,0-12,0V34H86V24a6,6,0,0,0-12,0V34H48A14,14,0,0,0,34,48V208a14,14,0,0,0,14,14H208a14,14,0,0,0,14-14V48A14,14,0,0,0,208,34ZM48,46H74V56a6,6,0,0,0,12,0V46h84V56a6,6,0,0,0,12,0V46h26a2,2,0,0,1,2,2V82H46V48A2,2,0,0,1,48,46ZM208,210H48a2,2,0,0,1-2-2V94H210V208A2,2,0,0,1,208,210Zm-70-78a10,10,0,1,1-10-10A10,10,0,0,1,138,132Zm44,0a10,10,0,1,1-10-10A10,10,0,0,1,182,132ZM94,172a10,10,0,1,1-10-10A10,10,0,0,1,94,172Zm44,0a10,10,0,1,1-10-10A10,10,0,0,1,138,172Zm44,0a10,10,0,1,1-10-10A10,10,0,0,1,182,172Z'></path>
                                </svg>
                              }
                              onChange={(event) => {
                                field.onChange(event)
                              }}
                              onBlur={field.onBlur}
                              selected={field.value ?? startDate}
                              shouldCloseOnSelect={true}
                              locale='vi'
                              showTimeSelect
                              filterTime={(time) => new Date().getTime() < new Date(time).getTime()}
                              timeFormat='HH:mm'
                              timeIntervals={1}
                              dateFormat='dd/MM/yyyy, p'
                              minDate={new Date()}
                              renderCustomHeader={({
                                date,
                                changeYear,
                                changeMonth,
                                decreaseMonth,
                                increaseMonth,
                                prevMonthButtonDisabled,
                                nextMonthButtonDisabled
                              }) => (
                                <div className='m-[10px] flex gap-2 justify-center'>
                                  <button
                                    type='button'
                                    className='text-lg'
                                    onClick={decreaseMonth}
                                    disabled={prevMonthButtonDisabled}
                                  >
                                    {'<'}
                                  </button>
                                  <select
                                    className='z-10 text-gray-700 no-scrollbar p-1 rounded-md border border-solid border-gray-300 bg-slate-100'
                                    value={getYear(date)}
                                    onChange={({ target: { value } }) => changeYear(parseInt(value))}
                                  >
                                    {years.map((option) => (
                                      <option key={option} value={option}>
                                        {option}
                                      </option>
                                    ))}
                                  </select>

                                  <select
                                    className='text-gray-700 p-1 rounded-md border border-solid border-gray-300 bg-slate-100'
                                    value={months[getMonth(date)]}
                                    onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
                                  >
                                    {months.map((option) => (
                                      <option key={option} value={option}>
                                        {option}
                                      </option>
                                    ))}
                                  </select>

                                  <button
                                    type='button'
                                    className='text-lg'
                                    onClick={increaseMonth}
                                    disabled={nextMonthButtonDisabled}
                                  >
                                    {'>'}
                                  </button>
                                </div>
                              )}
                            />
                          )}
                        />
                        <p className='text-red-500 text-xs'>{errors.startDate?.message}</p>
                      </div>

                      <div className='separator relative h-8 leading-8 '>
                        <div className='relative top-1/2 h-[1px] mx-2 w-4 bg-gray-400'></div>
                      </div>

                      <div className='max-w-[184px]'>
                        <Controller
                          control={control}
                          name='endDate'
                          render={({ field }) => (
                            <DatePicker
                              className='h-8 border rounded w-full bg-gray-50 outline-none cursor-pointer hover:border-gray-400 transition-colors'
                              showIcon
                              toggleCalendarOnIconClick
                              icon={
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  fill='#000000'
                                  viewBox='0 0 256 256'
                                  className='h-4'
                                >
                                  <path d='M208,34H182V24a6,6,0,0,0-12,0V34H86V24a6,6,0,0,0-12,0V34H48A14,14,0,0,0,34,48V208a14,14,0,0,0,14,14H208a14,14,0,0,0,14-14V48A14,14,0,0,0,208,34ZM48,46H74V56a6,6,0,0,0,12,0V46h84V56a6,6,0,0,0,12,0V46h26a2,2,0,0,1,2,2V82H46V48A2,2,0,0,1,48,46ZM208,210H48a2,2,0,0,1-2-2V94H210V208A2,2,0,0,1,208,210Zm-70-78a10,10,0,1,1-10-10A10,10,0,0,1,138,132Zm44,0a10,10,0,1,1-10-10A10,10,0,0,1,182,132ZM94,172a10,10,0,1,1-10-10A10,10,0,0,1,94,172Zm44,0a10,10,0,1,1-10-10A10,10,0,0,1,138,172Zm44,0a10,10,0,1,1-10-10A10,10,0,0,1,182,172Z'></path>
                                </svg>
                              }
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              selected={field.value ?? endDate}
                              shouldCloseOnSelect={true}
                              locale='vi'
                              showTimeSelect
                              filterTime={(time) => new Date().getTime() < new Date(time).getTime()}
                              filterDate={isThreeMonthsAhead}
                              timeFormat='HH:mm'
                              timeIntervals={1}
                              dateFormat='dd/MM/yyyy, p'
                              minDate={new Date()}
                              renderCustomHeader={({
                                date,
                                changeYear,
                                changeMonth,
                                decreaseMonth,
                                increaseMonth,
                                prevMonthButtonDisabled,
                                nextMonthButtonDisabled
                              }) => (
                                <div className='m-[10px] flex gap-2 justify-center'>
                                  <button
                                    type='button'
                                    className='text-lg'
                                    onClick={decreaseMonth}
                                    disabled={prevMonthButtonDisabled}
                                  >
                                    {'<'}
                                  </button>
                                  <select
                                    className='text-gray-700 no-scrollbar p-1 rounded-md border border-solid border-gray-300 bg-slate-100'
                                    value={getYear(date)}
                                    onChange={({ target: { value } }) => changeYear(parseInt(value))}
                                  >
                                    {years.map((option) => (
                                      <option key={option} value={option}>
                                        {option}
                                      </option>
                                    ))}
                                  </select>

                                  <select
                                    className='text-gray-700 p-1 rounded-md border border-solid border-gray-300 bg-slate-100'
                                    value={months[getMonth(date)]}
                                    onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
                                  >
                                    {months.map((option) => (
                                      <option key={option} value={option}>
                                        {option}
                                      </option>
                                    ))}
                                  </select>

                                  <button
                                    type='button'
                                    className='text-lg'
                                    onClick={increaseMonth}
                                    disabled={nextMonthButtonDisabled}
                                  >
                                    {'>'}
                                  </button>
                                </div>
                              )}
                            />
                          )}
                        />
                        <p className='text-red-500 text-xs'>{errors.endDate?.message}</p>
                      </div>
                    </div>
                    {/* <div className='flex items-center'>
                      <input type='checkbox' id='early' />
                      <label htmlFor='early' className='ml-3'>
                        Display voucher early
                      </label>
                    </div>
                    {true && (
                      <div>
                        <input type='date' />
                        <p>Once voucher starts displaying, this section can no longer be edited</p>
                      </div>
                    )} */}
                  </div>
                </div>
              </div>
            </div>
            <div className='p-4 mt-5 bg-white'>
              <h3 className='mb-6 text-[20px] font-medium text-[#333]'>Reward Settings</h3>
              <div>
                <div className='grid grid-cols-12 mb-3 text-sm'>
                  <div className='col-span-3 flex justify-end'>
                    <label className='min-w-[200px] w-[200px] max-w-[200px] h-[56px] text-right leading-[16px] py-2 mr-3'>
                      Discount Type | Amount
                    </label>
                  </div>
                  <div className='col-span-9'>
                    <div className='flex items-center h-[30px] bg-white text-sm rounded border-spacing-0 border-collapse'>
                      <div className='relative text-sm uppercase h-full rounded-l-md border boder-gray-200 border-r-0 border-r-transparent hover:border-gray-300 transition-colors'>
                        <select
                          {...register('discountType', {
                            required: true,
                            onChange(event) {
                              setValue('discountType', event.target.value)
                              clearErrors('fixedAmount')
                              clearErrors('percentageAmount')
                              clearErrors('minimumTotalOrder')
                            }
                          })}
                          defaultValue='fixed'
                          className='h-full w-[140px] text-sm rounded border-none focus:outline-none'
                        >
                          <option value='fixed'>Fix Amount</option>
                          <option value='percentage'>By Percentage</option>
                        </select>
                      </div>
                      {getValues('discountType') === 'fixed' ? (
                        <div className='h-full w-full'>
                          <div
                            className={classNames(
                              'relative flex items-center h-full w-full px-3 border has-[:focus]:border-gray-400',
                              {
                                ' boder-gray-200 hover:border-gray-400': !errors.fixedAmount?.message,
                                'border-red-300': errors.fixedAmount?.message
                              }
                            )}
                          >
                            <div className='text-sm text-gray-300'>₫</div>
                            <div className='h-4 w-[1px] mx-2 bg-gray-300'></div>
                            <input
                              type='text'
                              {...register('fixedAmount')}
                              className='flex-1 h-full outline-none border-none'
                            />
                          </div>
                          <p className='text-red-500 text-xs'>{errors.fixedAmount?.message}</p>
                        </div>
                      ) : (
                        <div className='h-full w-full'>
                          <div
                            className={classNames(
                              'relative flex items-center h-full w-full px-3 border has-[:focus]:border-gray-400',
                              {
                                'boder-gray-200 hover:border-gray-400': !errors.percentageAmount?.message,
                                'border-red-300': errors.percentageAmount?.message
                              }
                            )}
                          >
                            <input
                              type='text'
                              {...register('percentageAmount')}
                              className='flex-1 h-full outline-none border-none'
                            />
                            <div className='h-4 w-[1px] mx-2 bg-gray-300'></div>
                            <div className='text-sm text-gray-400'>%OFF</div>
                          </div>
                          <p className='text-red-500 text-xs'>{errors.percentageAmount?.message}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {watch('discountType') === 'percentage' && (
                  <div className='grid grid-cols-12 mb-6 text-sm '>
                    <div className='col-span-3 flex justify-end h-full'>
                      <label className='mr-3 min-w-[200px] w-[200px] max-w-[200px] h-full text-right leading-[16px] py-1'>
                        Maximum Discount Price
                      </label>
                    </div>
                    <div className='col-span-9'>
                      <div className='flex mb-2'>
                        <Controller
                          name='isLimit'
                          control={control}
                          render={({ field }) => {
                            return (
                              <>
                                <div className='flex items-center me-5'>
                                  <input
                                    id='inline-radio'
                                    type='radio'
                                    {...field}
                                    value='limit'
                                    onChange={() => field.onChange(true)}
                                    checked={field.value === true}
                                    className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 cursor-pointer'
                                  />
                                  <label htmlFor='inline-radio' className='ms-2 text-sm font-medium text-gray-90'>
                                    Set amount
                                  </label>
                                </div>
                                <div className='flex items-center me-4'>
                                  <input
                                    id='inline-2-radio'
                                    type='radio'
                                    {...field}
                                    value='noLimit'
                                    onChange={() => {
                                      field.onChange(false)
                                      clearErrors('maximumDiscount')
                                    }}
                                    checked={field.value === false}
                                    className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 cursor-pointer'
                                  />
                                  <label htmlFor='inline-2-radio' className='ms-2 text-sm font-medium text-gray-90'>
                                    No limit
                                  </label>
                                </div>
                              </>
                            )
                          }}
                        />
                      </div>
                      {getValues('isLimit') && (
                        <div>
                          <div
                            className={classNames(
                              'flex items-center px-3 mt-2 bg-white border text-sm rounded transition-colors has-[:focus]:border-gray-400',
                              {
                                'boder-gray-200 hover:border-gray-400': !errors.maximumDiscount?.message,
                                'border-red-300': errors.maximumDiscount?.message
                              }
                            )}
                          >
                            <div className='pr-2 text-sm uppercase text-gray-400'>₫</div>
                            <div className='h-4 w-[1px] bg-gray-300'></div>
                            <input
                              type='text'
                              {...register('maximumDiscount')}
                              className='flex-grow flex-1 px-3 h-[30px] outline-none'
                            />
                          </div>
                          <div className='text-sm text-gray-400'>
                            <p className='text-red-500'>{errors.maximumDiscount?.message}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <div className='grid grid-cols-12 mb-6 text-sm '>
                  <div className='col-span-3 flex justify-end h-full'>
                    <label className='mr-3 min-w-[200px] w-[200px] max-w-[200px] h-full text-right leading-[16px] py-2'>
                      Minimum Total Order
                    </label>
                  </div>
                  <div className='col-span-9'>
                    <div
                      className={classNames(
                        'flex items-center px-3 bg-white border text-sm rounded has-[:focus]:border-gray-400',
                        {
                          'boder-gray-200 hover:border-gray-400': !errors.minimumTotalOrder?.message,
                          'border-red-300': errors.minimumTotalOrder?.message
                        }
                      )}
                    >
                      <div className='pr-2 text-sm uppercase text-gray-400'>₫</div>
                      <div className='h-4 w-[1px] bg-gray-300'></div>
                      <input
                        type='text'
                        {...register('minimumTotalOrder')}
                        className=' flex-grow flex-1 px-3 h-[30px] outline-none '
                      />
                    </div>
                    <div className='text-sm text-gray-400'>
                      <p className='text-red-500 text-xs whitespace-pre-line'>{errors.minimumTotalOrder?.message}</p>
                    </div>
                  </div>
                </div>
                <div className='grid grid-cols-12 mb-3 text-sm  h-[88px]'>
                  <div className='col-span-3 flex justify-end h-full'>
                    <label className='mr-3 min-w-[200px] w-[200px] max-w-[200px] h-full text-right leading-[16px] py-2'>
                      Usage Quantity
                    </label>
                  </div>
                  <div className='col-span-9'>
                    <div
                      className={classNames(
                        'flex items-center px-3 bg-white border text-sm rounded has-[:focus]:border-gray-400',
                        {
                          'boder-gray-200 hover:border-gray-400': !errors.quantity?.message,
                          'border-red-300': errors.quantity?.message
                        }
                      )}
                    >
                      <input type='text' {...register('quantity')} className='flex-grow flex-1 h-[30px] outline-none' />
                    </div>
                    <div className='text-sm text-gray-400'>
                      <p className='text-red-500 text-xs'>{errors.quantity?.message}</p>
                      <p>Total usable voucher for all buyers</p>
                    </div>
                  </div>
                </div>
                <div className='grid grid-cols-12 mb-3 text-sm'>
                  <div className='col-span-3 flex justify-end h-full'>
                    <label className='mr-3 min-w-[200px] w-[200px] max-w-[200px] h-full text-right leading-[16px] py-2'>
                      Max Distribution per Buyer
                    </label>
                  </div>
                  <div className='col-span-9'>
                    <div
                      className={classNames(
                        'flex items-center px-3 bg-white border text-sm rounded has-[:focus]:border-gray-400',
                        {
                          'boder-gray-200 hover:border-gray-400': !errors.quantity?.message,
                          'border-red-300': errors.quantity?.message
                        }
                      )}
                    >
                      <input
                        type='text'
                        {...register('maxDistribution')}
                        className=' flex-grow flex-1 h-[30px] outline-none '
                      />
                    </div>
                    <div className='text-sm text-gray-400'>
                      <p className='text-red-500 text-xs'>{errors.maxDistribution?.message}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='sticky bottom-0 bg-white shadow-[0_0_17px_2px_#e2e2e2] mt-4'>
              <div className='flex gap-x-2 justify-end py-4 px-4'>
                <Button className='bg-white text-sm py-1 px-4 min-w-[76px] min-h-[32px] rounded-[4px] border border-gray-300'>
                  Cancel
                </Button>
                <Button
                  type='submit'
                  className='bg-blue text-white text-sm py-1 px-4 min-w-[76px] min-h-[32px] rounded-[4px]'
                >
                  Confirm
                </Button>
              </div>
            </div>
          </form>
        </div>
        <div className='col-span-3'>
          <div className='sticky top-[4.5rem] left-0 right-0'>
            <div className='flex flex-col w-[315px]'>
              <h3 className='text-sm p-5 bg-white'>Preview</h3>
              <div
                style={{
                  backgroundImage: `url(
                    'https://deo.shopeemobile.com/shopee/shopee-seller-live-sg/mmf_portal_seller_root_dir/static/modules/vouchers/image/multilang_voucher_illustration_vn.91c94ef.png'
                  )`
                }}
                className='h-[300px] w-full bg-no-repeat bg-cover object-cover'
              ></div>
              <div className='text-xs p-5 bg-white'>Buyers can use this voucher for all products in the shop.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
