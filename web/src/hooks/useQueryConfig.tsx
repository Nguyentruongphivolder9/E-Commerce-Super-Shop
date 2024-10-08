import isUndefined from 'lodash/isUndefined'
import omitBy from 'lodash/omitBy'
import useQueryParams from './useQueryParams'
import { ParamsConfig } from 'src/types/utils.type'

export type QueryConfig = {
  [key in keyof ParamsConfig]: string
}

export default function useQueryConfig() {
  const queryParams: QueryConfig = useQueryParams()
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit || 15,
      sort_by: queryParams.sort_by,
      category: queryParams.category,
      name: queryParams.name,
      order: queryParams.order,
      price_max: queryParams.price_max,
      price_min: queryParams.price_min,
      rating_filter: queryParams.rating_filter,
      exclude: queryParams.exclude,
      search: queryParams.search,
      status: queryParams.status,
      violationType: queryParams.violationType
    },
    isUndefined
  )

  return queryConfig
}
