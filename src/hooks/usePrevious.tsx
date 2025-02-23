import { useEffect, useRef } from 'react'

export default function usePrevious(value: any) {
  const ref = useRef<any>()
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}
