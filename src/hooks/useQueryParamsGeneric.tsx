import { useSearchParams } from 'react-router-dom'

export default function useQueryParamsGeneric<T>(): T {
  const [searchParams] = useSearchParams()
  return Object.fromEntries([...searchParams]) as T
}
