import classNames from 'classnames'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import Button from 'src/components/Button'
import InputNumber from 'src/components/InputNumber'
import path from 'src/constants/path'
import { CategoryResponse } from 'src/types/category.type'
import { useForm, Controller } from 'react-hook-form'
import { Schema, schema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { NoUndefinedField } from 'src/types/utils.type'
import omit from 'lodash/omit'
import { ObjectSchema } from 'yup'
import { QueryConfig } from 'src/hooks/useQueryConfig'
import { useTranslation } from 'react-i18next'
import { generateCategoryNameId } from 'src/utils/utils'
import RatingStars from 'src/components/RatingStars'

interface Props {
  queryConfig: QueryConfig
  categories: CategoryResponse[]
  selectedCategory: string
  pathCurrent: string
}

type FormData = NoUndefinedField<Pick<Schema, 'price_max' | 'price_min'>>
/**
 * Rule validate
 * Nếu có price_min và price_max thì price_max >= price_min
 * Còn không thì có price_min thì không có price_max và ngược lại
 */

const priceSchema = schema.pick(['price_min', 'price_max'])
export default function AsideFilter({ pathCurrent, queryConfig, categories, selectedCategory }: Props) {
  const { t } = useTranslation('home')
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      price_min: '',
      price_max: ''
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(priceSchema as ObjectSchema<{ price_max: string; price_min: string }>)
  })
  const navigate = useNavigate()
  const onSubmit = handleSubmit((data) => {
    navigate({
      pathname: pathCurrent,
      search: createSearchParams({
        ...queryConfig,
        price_max: data.price_max,
        price_min: data.price_min
      }).toString()
    })
  })

  const handleRemoveAll = () => {
    navigate({
      pathname: pathCurrent,
      search: createSearchParams(
        omit(
          {
            ...queryConfig
          },
          ['price_min', 'price_max', 'rating_filter', 'category']
        )
      ).toString()
    })
  }

  return (
    <div className='py-4'>
      {categories && (
        <div>
          <Link
            to={pathCurrent}
            className={classNames('flex items-center text-[#000000CC] font-bold', {
              'text-blue': !selectedCategory
            })}
          >
            <svg viewBox='0 0 12 10' className='mr-3 h-4 w-3 fill-current'>
              <g fillRule='evenodd' stroke='none' strokeWidth={1}>
                <g transform='translate(-373 -208)'>
                  <g transform='translate(155 191)'>
                    <g transform='translate(218 17)'>
                      <path d='m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                      <path d='m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                      <path d='m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                    </g>
                  </g>
                </g>
              </g>
            </svg>
            {t('aside filter.all categories')}
          </Link>
          <div className='my-4 h-[1px] bg-gray-300' />
          <ul className='w-full'>
            {categories.map((categoryItem) => {
              const isActive = selectedCategory == categoryItem.id
              return (
                <li className='w-full h-fit relative flex items-center' key={categoryItem.id}>
                  <Link
                    to={{
                      pathname: `${path.home + 'categories/'}${generateCategoryNameId({ name: `${categoryItem.name}`, stringIds: `${categoryItem.parentId != null ? categoryItem.parentId + '.' + categoryItem.id : categoryItem.id}` })}`,
                      search: createSearchParams({
                        ...queryConfig
                      }).toString()
                    }}
                    className={`${isActive && 'font-semibold text-blue'} flex items-center h-fit w-full text-sm py-[5px] pr-[10px] pl-3`}
                  >
                    {categoryItem.name}
                  </Link>
                  {isActive && (
                    <div className='absolute top-0 left-0 h-full w-fit flex items-center justify-start'>
                      <div
                        className={
                          'bg-none border-0 border-l-4 border-r-4 border-t-[5px] border-transparent border-t-blue mx-0 my-0 p-0 -rotate-90'
                        }
                      ></div>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}
      <Link to={pathCurrent} className='mt-4 flex text-[#000000CC] items-center font-bold uppercase'>
        <svg
          enableBackground='new 0 0 15 15'
          viewBox='0 0 15 15'
          x={0}
          y={0}
          className='mr-3 h-4 w-3 fill-current stroke-current'
        >
          <g>
            <polyline
              fill='none'
              points='5.5 13.2 5.5 5.8 1.5 1.2 13.5 1.2 9.5 5.8 9.5 10.2'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeMiterlimit={10}
            />
          </g>
        </svg>
        {t('aside filter.filter search')}
      </Link>
      <div className='my-4 h-[1px] bg-gray-300' />
      <div className='my-5'>
        <div className='text-[#000000CC] text-sm'>Price Range</div>
        <form className='mt-2' onSubmit={onSubmit}>
          <div className='flex items-start'>
            <Controller
              control={control}
              name='price_min'
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    className='grow'
                    placeholder='₫ From'
                    classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                    classNameError='hidden'
                    {...field}
                    onChange={(event) => {
                      field.onChange(event)
                      trigger('price_max')
                    }}
                  />
                )
              }}
            />

            <div className='mx-2 mt-2 shrink-0'>-</div>
            <Controller
              control={control}
              name='price_max'
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    className='grow'
                    placeholder='₫ To'
                    classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                    classNameError='hidden'
                    {...field}
                    onChange={(event) => {
                      field.onChange(event)
                      trigger('price_min')
                    }}
                  />
                )
              }}
            />
          </div>
          <div className='mt-1 min-h-[1.25rem] text-center text-xs text-red-600'>{errors.price_min?.message}</div>
          <Button className='flex w-full items-center mt-2 justify-center bg-blue p-2 text-sm uppercase text-white hover:bg-orange/80'>
            APPLY
          </Button>
        </form>
      </div>
      <div className='my-4 h-[1px] bg-gray-300' />
      <div className='text-sm text-[#000000CC]'>Rating</div>
      <RatingStars queryConfig={queryConfig} pathCurrent={pathCurrent} />
      <div className='my-4 h-[1px] bg-gray-300' />
      <Button
        onClick={handleRemoveAll}
        className='flex w-full items-center justify-center bg-blue p-2 text-sm uppercase text-white hover:bg-orange/80'
      >
        CLEAR ALL
      </Button>
    </div>
  )
}
