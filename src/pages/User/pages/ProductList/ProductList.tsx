import { keepPreviousData, useQuery } from '@tanstack/react-query'
import categoryApi from 'src/apis/category.api'
import productApi from 'src/apis/product.api'
import Pagination from 'src/components/Pagination'
import useQueryConfig, { QueryConfig } from 'src/hooks/useQueryConfig'
import useQueryParams from 'src/hooks/useQueryParams'
import AsideFilter from './components/AsideFilter'
import SortProductList from './components/SortProductList'
import path from 'src/constants/path'
import { useParams } from 'react-router-dom'
import { getIdFromCategoryNameId } from 'src/utils/utils'
import { CategoryResponse } from 'src/types/category.type'
import { ParamsConfig } from 'src/types/utils.type'
import Product from 'src/components/Product'

export default function ProductList() {
  const queryParams: QueryConfig = useQueryParams()
  const queryConfig = useQueryConfig()
  queryConfig.limit = '60'
  const { nameId } = useParams()

  const cateInfo = getIdFromCategoryNameId(nameId as string)
  const { data: categoriesData } = useQuery({
    queryKey: ['listCategoriesOfExistProduct', cateInfo],
    queryFn: () => categoryApi.getListRelateCategory(cateInfo.stringIds)
  })

  const { data: productsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['getListProductOfCategoryForUser', queryParams, cateInfo],
    queryFn: () => {
      return productApi.getListProductOfCategoryForUser(cateInfo.stringIds, queryConfig as ParamsConfig)
    }
  })

  const categories = categoriesData?.data.body
  const productsRes = productsData?.data.body

  return (
    <div className='bg-[#f6f6f6] py-6'>
      <div className='container'>
        <div className='grid grid-cols-11 gap-6'>
          <div className='col-span-2'>
            <AsideFilter
              selectedCategory={cateInfo.stringIds.split('.')[cateInfo.stringIds.split('.').length - 1]}
              queryConfig={queryConfig}
              categories={categories as CategoryResponse[]}
              pathCurrent={`${path.home + 'categories/'}${nameId}`}
            />
          </div>
          {isLoadingProducts ? (
            <div className='col-span-9 flex items-center justify-center h-96'>
              <div className='w-16 h-16 border-8 border-dashed rounded-full animate-spin border-blue-600'></div>
            </div>
          ) : (
            <div className='col-span-9'>
              <SortProductList
                path={`${path.home + 'categories/'}${nameId}`}
                queryConfig={queryConfig}
                pageSize={Number(productsRes?.totalPages)}
              />
              <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 '>
                {productsRes?.content.map((product, index) => (
                  <div key={index} className='col-span-1'>
                    <Product product={product} />
                  </div>
                ))}
              </div>
              <Pagination
                queryConfig={queryConfig}
                pageSize={Number(productsRes?.totalPages)}
                path={`${path.home + 'categories/'}${nameId}`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
