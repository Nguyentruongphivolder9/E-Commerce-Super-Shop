import { yupResolver } from '@hookform/resolvers/yup'
import { createContext } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { ProductEditSchema, productEditSchema } from 'src/utils/validations/productValidation'

interface ProductEditContextInterface {
  productEditMethods: UseFormReturn<FormDataEditProduct>
}
export type FormDataEditProduct = Pick<
  ProductEditSchema,
  | 'name'
  | 'price'
  | 'stockQuantity'
  | 'description'
  | 'isVariant'
  | 'isActive'
  | 'conditionProduct'
  | 'variantsGroup'
  | 'productImages'
  | 'productVariants'
  | 'categoryId'
  | 'shopId'
  | 'id'
  | 'brand'
>

const editProductSchema = productEditSchema.pick([
  'name',
  'price',
  'stockQuantity',
  'description',
  'isVariant',
  'isActive',
  'conditionProduct',
  'variantsGroup',
  'productImages',
  'productVariants',
  'categoryId',
  'shopId',
  'id',
  'brand'
])

const initialProductEditContext: ProductEditContextInterface = {
  productEditMethods: {} as UseFormReturn<FormDataEditProduct>
}

export const ProductEditContext = createContext<ProductEditContextInterface>(initialProductEditContext)
export const ProductEditProvider = ({ children }: { children: React.ReactNode }) => {
  const productEditMethods = useForm<FormDataEditProduct>({
    defaultValues: {
      isVariant: false,
      productImages: [],
      variantsGroup: []
    },
    mode: 'onChange',
    resolver: yupResolver(editProductSchema)
  })

  return (
    <ProductEditContext.Provider
      value={{
        productEditMethods
      }}
    >
      {children}
    </ProductEditContext.Provider>
  )
}
