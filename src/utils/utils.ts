import axios, { AxiosError } from 'axios'
import config from 'src/constants/config'
import HttpStatusCode from 'src/constants/httpStatusCode.enum'
import { ErrorResponse, ParamsConfig } from 'src/types/utils.type'
import { format } from 'date-fns'
import { Product, ProductVariantsResponse } from 'src/types/product.type'
import { ErrorServerRes } from 'src/types/utils.type'
import { darken, defaultVariantColorsResolver, parseThemeColor, rem, rgba, VariantColorsResolver } from '@mantine/core'
import statusProduct from 'src/constants/status'
export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  // eslint-disable-next-line import/no-named-as-default-member
  return axios.isAxiosError(error)
}

export function isAxiosUnprocessableEntityError<FormError>(error: unknown): error is AxiosError<FormError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}
export function isAxiosUnauthorizedError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized
}
export function isAxiosExpiredTokenError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return (
    isAxiosUnauthorizedError<ErrorResponse<{ name: string; message: string }>>(error) &&
    error.response?.data.data?.name === 'EXPIRED_TOKEN'
  )
}
export function isAxiosBadRequestNotFoundError<ErrorServer>(error: unknown): error is AxiosError<ErrorServer> {
  return isAxiosError<ErrorServerRes>(error) && error.response?.data?.statusCode === HttpStatusCode.NotFound
}

export function isAxiosConflictError<ErrorServer>(error: unknown): error is AxiosError<ErrorServer> {
  return isAxiosError<ErrorServerRes>(error) && error.response?.data?.statusCode === HttpStatusCode.Conflict
}

export function formatCurrency(currency: number) {
  return Intl.NumberFormat('de-DE').format(currency)
}

export function formatNumbertoSocialStyle(value: number) {
  return Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1
  })
    .format(value)
    .replace(',', '.')
    .toLowerCase()
}

export const rateSale = (original: number, sale: number) => Math.round(((original - sale) / original) * 100) + '%'

const removeSpecialCharacter = (str: string) => {
  // eslint-disable-next-line no-useless-escape
  return str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, '')
}

// export const removeBakcSpaceCharacter = (str: string)

export const generateNameId = ({ name, id, shopId }: { name: string; id: string; shopId: string }) => {
  return removeSpecialCharacter(name).replace(/\s/g, '-') + `-i.${id}.${shopId}`
}

export const getIdFromNameId = (nameId: string) => {
  const arr = nameId.split('-i.')
  const productInfo = arr[1].split('.')
  return { id: productInfo[0], shopId: productInfo[1] }
}

export const generateCategoryNameId = ({ name, stringIds }: { name: string; stringIds: string }) => {
  return removeSpecialCharacter(name).replace(/\s/g, '-') + `-cat.${stringIds}`
}

export const getIdFromCategoryNameId = (nameId: string) => {
  const arr = nameId.split('-cat.')
  return { name: arr[0], stringIds: arr[1] }
}

export const getAvatarUrl = (avatarName?: string) => {
  return avatarName ? `${config.baseURL}images/${avatarName}` : ''
}

export const generateUniqueId = () => {
  return '_' + Math.random().toString(36).substr(2, 9)
}

export const imageFileConvertToUrl = (file: File) => {
  return URL.createObjectURL(file)
}

export const formatDateTime = (date: string) => {
  const convertDate = new Date(date)
  return format(convertDate, 'yyyy-MM-dd kk:mm')
}
export const formatDateMonth = (date: string) => {
  const convertDate = new Date(date)
  return format(convertDate, 'dd/MM')
}

export const formatText = (text: string) => {
  let value
  if (text.trim().length < 1) {
    value = text.trim()
  } else {
    value = text.replace(/\s\s+/g, ' ')
  }
  return value
}

export const calculateLowestPrice = (productVariants: ProductVariantsResponse[]): number => {
  return productVariants.reduce((lowestPrice, variant) => {
    return variant.price < lowestPrice ? variant.price : lowestPrice
  }, productVariants[0]?.price || 0)
}

export const calculateHighestPrice = (productVariants: ProductVariantsResponse[]): number => {
  return productVariants.reduce((highestPrice, variant) => {
    return variant.price > highestPrice ? variant.price : highestPrice
  }, productVariants[0]?.price || 0)
}

export const calculateFromToPrice = (productVariants: ProductVariantsResponse[]): string => {
  const highestPrice = calculateHighestPrice(productVariants)
  const lowestPrice = calculateLowestPrice(productVariants)
  if (highestPrice == lowestPrice) {
    return '₫' + `${formatCurrency(lowestPrice)}`
  }

  return '₫' + `${formatCurrency(lowestPrice)}` + ' - ₫' + `${formatCurrency(highestPrice)}`
}

export const calculateTotalStockQuantity = (productVariants: ProductVariantsResponse[]): number => {
  return productVariants.reduce((total, variant) => total + variant.stockQuantity, 0)
}

export const handlePriceProduct = (product: Product, productVariantId: string): number => {
  if ((productVariantId && product.price == null) || product.price == 0) {
    const productVariant: ProductVariantsResponse = product.productVariants.find(
      (pv) => pv.id == productVariantId
    ) as ProductVariantsResponse

    if (productVariant) {
      return productVariant.price
    } else {
      return 0
    }
  } else {
    return product.price
  }
}

export const handleStockQuantityProduct = (product: Product, productVariantId: string): number => {
  if ((productVariantId && product.stockQuantity == null) || product.stockQuantity == 0) {
    const productVariant: ProductVariantsResponse = product.productVariants.find(
      (pv) => pv.id == productVariantId
    ) as ProductVariantsResponse

    if (productVariant) {
      return productVariant.stockQuantity
    } else {
      return 0
    }
  } else {
    return product.stockQuantity
  }
}

export const handleImageProduct = (product: Product, productVariantId: string): string => {
  if (productVariantId) {
    const productVariant: ProductVariantsResponse = product.productVariants.find(
      (pv) => pv.id == productVariantId
    ) as ProductVariantsResponse

    if (productVariant && productVariant.variant1.imageUrl) {
      return productVariant.variant1.imageUrl
    } else {
      return product.productImages.find((img) => img.isPrimary == true)?.imageUrl ?? ''
    }
  } else {
    return product.productImages.find((img) => img.isPrimary == true)?.imageUrl ?? ''
  }
}

export const variantColorResolver: VariantColorsResolver = (input) => {
  const defaultResolvedColors = defaultVariantColorsResolver(input)
  const parsedColor = parseThemeColor({
    color: input.color || input.theme.primaryColor,
    theme: input.theme
  })

  if (input.variant === statusProduct.FOR_SALE) {
    return {
      background: rgba(parsedColor.value, 0.1),
      hover: rgba(parsedColor.value, 0.15),
      border: `${rem(1)} solid ${parsedColor.value}`,
      color: darken(parsedColor.value, 0.1)
    }
  }

  if (input.variant === statusProduct.DELETE) {
    return {
      background: rgba('#DC3545', 0.1),
      hover: rgba(parsedColor.value, 0.15),
      border: `${rem(1)} solid ${'#DC3545'}`,
      color: darken('#DC3545', 0.1)
    }
  }

  if (input.variant === statusProduct.PENDING_APPROVAL) {
    return {
      background: rgba('#f4e60c', 0.1),
      hover: rgba(parsedColor.value, 0.15),
      border: `${rem(1)} solid ${'#f4e60c'}`,
      color: darken('#f4e60c', 0.1)
    }
  }

  if (input.variant === statusProduct.TEMPORARILY_LOCKED) {
    return {
      background: rgba('#f4800c', 0.1),
      hover: rgba(parsedColor.value, 0.15),
      border: `${rem(1)} solid ${'#f4800c'}`,
      color: darken('#f4800c', 0.1)
    }
  }

  return defaultResolvedColors
}

export function localToGMTStingTime(localTime: any) {
  const date = localTime ? new Date(localTime) : new Date()
  return new Date(date.getTime() + date.getTimezoneOffset() * 60000).toISOString()
}

export function GMTToLocalStingTime(GMTTime: any) {
  const date = GMTTime ? new Date(GMTTime) : new Date()
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 19)
}

export function timeAgo(joinDate: Date | string): string {
  const now = new Date()
  const joinTime = typeof joinDate === 'string' ? new Date(joinDate) : joinDate
  const timeDiff = Math.abs(now.getTime() - joinTime.getTime())
  const seconds = Math.floor(timeDiff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (years > 0) {
    return years === 1 ? '1 year ago' : `${years} years ago`
  } else if (months > 0) {
    return months === 1 ? '1 month ago' : `${months} months ago`
  } else if (weeks > 0) {
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`
  } else if (days > 0) {
    return days === 1 ? '1 day ago' : `${days} days ago`
  } else if (hours > 0) {
    return hours === 1 ? '1 hour ago' : `${hours} hours ago`
  } else if (minutes > 0) {
    return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`
  } else {
    return seconds === 1 ? '1 second ago' : `${seconds} seconds ago`
  }
}

export function calculatePercent(subTotal: number, total: number): string {
  if (total === 0 && subTotal === 0) {
    return '100%' // Có thể trả về 0% nếu cả hai đều bằng 0
  }
  return Math.ceil((subTotal / total) * 100) + '%'
}

export function generateURLAvatar(url: string): string {
  if (url.includes('https://lh3.googleusercontent.com')) {
    return url
  }

  if (url.includes('http://localhost:8080/api/v1/')) {
    return url
  }

  return config.awsURL + 'avatars/' + url
}

export const removeEmptyParams = (params: ParamsConfig): ParamsConfig => {
  return Object.entries(params).reduce((acc, [key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      acc[key as keyof ParamsConfig] = value
    }
    return acc
  }, {} as ParamsConfig)
}
