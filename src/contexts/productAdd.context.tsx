import { yupResolver } from '@hookform/resolvers/yup'
import { createContext } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { productSchema, ProductSchema } from 'src/utils/validations/productValidation'

interface ProductAddContextInterface {
  productMethods: UseFormReturn<FormDataProduct>
}
export type FormDataProduct = Pick<
  ProductSchema,
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
  | 'brand'
>

const createProductSchema = productSchema.pick([
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
  'brand'
])

const initialProductAddContext: ProductAddContextInterface = {
  productMethods: {} as UseFormReturn<FormDataProduct>
}

export const ProductAddContext = createContext<ProductAddContextInterface>(initialProductAddContext)
export const ProductAddProvider = ({ children }: { children: React.ReactNode }) => {
  const productMethods = useForm<FormDataProduct>({
    defaultValues: {
      isVariant: false,
      shopId: null,
      productImages: [],
      variantsGroup: []
    },
    mode: 'onChange',
    resolver: yupResolver(createProductSchema)
  })

  return (
    <ProductAddContext.Provider
      value={{
        productMethods
      }}
    >
      {children}
    </ProductAddContext.Provider>
  )
}
