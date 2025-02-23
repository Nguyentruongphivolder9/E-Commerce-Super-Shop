import { omit } from 'lodash'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { QueryConfig } from 'src/hooks/useQueryConfig'
import { CategoryOfShopResponse } from 'src/types/categoryOfShop.type'

interface Props {
  queryConfig: QueryConfig
  categories: CategoryOfShopResponse[]
  selectedCategory: string
  pathCurrent: string
}

// export default function AsideFilter() {
export default function AsideFilter({ pathCurrent, queryConfig, categories, selectedCategory }: Props) {
  const navigate = useNavigate()

  return (
    <div className='py-4'>
      {categories && (
        <div>
          <div className='flex items-center text-[#000000CC] font-bold'>
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
            Category
          </div>
          <div className='my-4 h-[1px] bg-gray-300' />
          <ul className='w-full'>
            <li className='w-full h-fit relative flex items-center'>
              <button
                onClick={() => {
                  navigate({
                    pathname: pathCurrent,
                    search: createSearchParams(
                      omit(
                        {
                          ...queryConfig
                        },
                        ['category']
                      )
                    ).toString()
                  })
                }}
                className={`${selectedCategory == 'all' && 'font-semibold text-blue'} flex items-center h-fit w-full text-sm py-[5px] pr-[10px] pl-3`}
              >
                All Products
              </button>
              {selectedCategory == 'all' && (
                <div className='absolute top-0 left-0 h-full w-fit flex items-center justify-start'>
                  <div
                    className={
                      'bg-none border-0 border-l-4 border-r-4 border-t-[5px] border-transparent border-t-blue mx-0 my-0 p-0 -rotate-90'
                    }
                  ></div>
                </div>
              )}
            </li>
            {categories.map((categoryItem) => {
              const isActive = selectedCategory == categoryItem.id
              return (
                <li className='w-full h-fit relative flex items-center' key={categoryItem.id}>
                  <button
                    onClick={() => {
                      navigate({
                        pathname: pathCurrent,
                        search: createSearchParams({
                          ...queryConfig,
                          category: categoryItem.id
                        }).toString()
                      })
                    }}
                    className={`${isActive && 'font-semibold text-blue'} flex items-center h-fit w-full text-sm py-[5px] pr-[10px] pl-3`}
                  >
                    {categoryItem.name}
                  </button>
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
    </div>
  )
}
