export interface SuccessResponse<Data> {
  body?: Data
  message: string
  statusCode: number
  timeStamp: string
}
export interface ErrorResponse<Data> {
  message: string
  data?: Data
}

export interface ErrorServerRes {
  error: string
  message: string
  statusCode: number
}

export type NoUndefinedField<T> = {
  [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>>
}

export type Omit2<T, K extends keyof T | (string & object) | (number & object) | (symbol | object)> = {
  [P in Exclude<keyof T, K>]: T[P]
}

export type Pagination<Data> = {
  content: Data
  pageable: Pageable
  last: boolean
  totalPages: number
  totalElements: number
  size: number
  number: number
  sort: Sort
  first: boolean
  numberOfElements: number
  empty: boolean
  nextPage?: number
}

interface Pageable {
  pageNumber: number
  pageSize: number
  sort: Sort
  offset: number
  paged: boolean
  unpaged: boolean
}
interface Sort {
  empty: boolean
  sorted: boolean
  unsorted: boolean
}

export interface ParamsConfig {
  page?: number | string
  limit?: number | string
  sort_by?: 'ctime' | 'view' | 'sold' | 'price' | 'withPhoto' | 'withComment' | 'stock' | 'sales' | 'pop' | ''
  order?: 'asc' | 'desc' | ''
  exclude?: string
  rating_filter?: number | string
  price_max?: number | string
  price_min?: number | string
  name?: string
  category?: string
  search?: string
  status?: string
  violationType?: string
}
