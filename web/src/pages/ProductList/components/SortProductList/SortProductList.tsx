import { order, order as orderConstant, sortBy } from 'src/constants/product'
import { QueryConfig } from 'src/hooks/useQueryConfig'
import classNames from 'classnames'
import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import omit from 'lodash/omit'
import { Select } from '@mantine/core'
import { orderBy } from 'lodash'
import { ParamsConfig } from 'src/types/utils.type'

interface Props {
  queryConfig: QueryConfig
  pageSize: number
  path: string
}

export default function SortProductList({ queryConfig, pageSize, path }: Props) {
  const navigate = useNavigate()
  const page = Number(queryConfig.page)
  const { sort_by = sortBy.createdAt } = queryConfig
  const isActiveSortBy = (sortByValue: Exclude<ParamsConfig['sort_by'], undefined>) => {
    return sort_by === sortByValue
  }

  const handleSort = (sortByValue: Exclude<ParamsConfig['sort_by'], undefined>) => {
    navigate({
      pathname: path,
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            sort_by: sortByValue
          },
          ['order']
        )
      ).toString()
    })
  }

  const handlePriceOrder = (orderValue: Exclude<ParamsConfig['order'], undefined>) => {
    navigate({
      pathname: path,
      search: createSearchParams({
        ...queryConfig,
        sort_by: sortBy.price,
        order: orderValue
      }).toString()
    })
  }

  return (
    <div className='bg-gray-300/40 py-4 px-5'>
      <div className='flex flex-wrap items-centerr justify-between gap-2'>
        <div className='flex text-[#555555] text-sm items-center flex-wrap gap-2'>
          <div>Sort by</div>
          <button
            className={classNames('h-8 px-4 capitalize text-sm text-center rounded-sm', {
              'bg-blue text-white hover:bg-blue/80': isActiveSortBy(sortBy.view),
              'bg-white text-[#000000CC] hover:bg-slate-100': !isActiveSortBy(sortBy.view)
            })}
            onClick={() => handleSort(sortBy.view)}
          >
            Popular
          </button>
          <button
            className={classNames('h-8 px-4 capitalize text-sm text-center rounded-sm', {
              'bg-blue text-white hover:bg-blue/80': isActiveSortBy(sortBy.createdAt),
              'bg-white text-[#000000CC] hover:bg-slate-100': !isActiveSortBy(sortBy.createdAt)
            })}
            onClick={() => handleSort(sortBy.createdAt)}
          >
            Latest
          </button>
          <button
            className={classNames('h-8 px-4 capitalize text-sm text-center rounded-sm', {
              'bg-blue text-white hover:bg-blue/80': isActiveSortBy(sortBy.sold),
              'bg-white text-[#000000CC] hover:bg-slate-100': !isActiveSortBy(sortBy.sold)
            })}
            onClick={() => handleSort(sortBy.sold)}
          >
            Top Sales
          </button>
          <Select
            placeholder='Price'
            data={['Price: Low to High', 'Price: High to Low']}
            allowDeselect={false}
            checkIconPosition='right'
            onChange={(value) => {
              if (value === 'Price: Low to High') {
                handlePriceOrder(order.asc)
              }
              if (value === 'Price: High to Low') {
                handlePriceOrder(order.desc)
              }
            }}
          />
        </div>

        <div className='flex items-center'>
          <div className='text-sm'>
            <span className='text-blue'>{page}</span>
            <span>/{pageSize}</span>
          </div>
          <div className='ml-2 flex '>
            {page == 1 ? (
              <span className='flex items-center justify-center px-3 h-8 rounded-tl-sm rounded-bl-sm bg-white/60 hover:bg-slate-100 cursor-not-allowed shadow'>
                {' '}
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-3 h-3'>
                  <path
                    fillRule='evenodd'
                    d='M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z'
                    clipRule='evenodd'
                  />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: path,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page - 1).toString()
                  }).toString()
                }}
                className='flex items-center justify-center px-3 h-8 rounded-tl-sm rounded-bl-sm bg-white hover:bg-slate-100 shadow'
              >
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-3 h-3'>
                  <path
                    fillRule='evenodd'
                    d='M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z'
                    clipRule='evenodd'
                  />
                </svg>
              </Link>
            )}

            {page == pageSize ? (
              <span className='flex items-center justify-center px-3 h-8 rounded-tl-sm rounded-bl-sm bg-white/60 hover:bg-slate-100 cursor-not-allowed  shadow'>
                {' '}
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-3 h-3'>
                  <path
                    fillRule='evenodd'
                    d='M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z'
                    clipRule='evenodd'
                  />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: path,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page + 1).toString()
                  }).toString()
                }}
                className='flex items-center justify-center px-3 h-8 rounded-tl-sm rounded-bl-sm bg-white hover:bg-slate-100 shadow'
              >
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-3 h-3'>
                  <path
                    fillRule='evenodd'
                    d='M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z'
                    clipRule='evenodd'
                  />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
