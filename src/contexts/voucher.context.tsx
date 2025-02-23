import { yupResolver } from '@hookform/resolvers/yup'
import { createContext } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { voucherUpdateSchema, VoucherUpdateShema } from 'src/utils/validations/voucherValidation'

interface VoucherContextInterface {
  voucherMehods: UseFormReturn<VoucherUpdateShema>
}

const initialVoucherContext: VoucherContextInterface = {
  voucherMehods: {} as UseFormReturn<VoucherUpdateShema>
}
export const VoucherContext = createContext<VoucherContextInterface>(initialVoucherContext)
export const VoucherProvider = ({ children }: { children: React.ReactNode }) => {
  const voucherMehods = useForm<VoucherUpdateShema>({
    mode: 'onChange',
    resolver: yupResolver(voucherUpdateSchema)
  })
  return (
    <VoucherContext.Provider
      value={{
        voucherMehods
      }}
    >
      {children}
    </VoucherContext.Provider>
  )
}
