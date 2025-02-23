import * as yup from 'yup'

const MAX_PRICE_VALUE = 120000000
const MIN_PRICE_VALUE = 1000
const MAX_STOCK_VALUE = 10000000
const MIN_STOCK_VALUE = 1

const handlePriceProductYup = (refBoolean: string) => {
  return yup
    .number()
    .transform((value, originalValue) => {
      return originalValue == '' ? null : value
    })
    .when(refBoolean, {
      is: true,
      then: (schema) => schema.notRequired().nullable(),
      otherwise: (schema) =>
        schema
          .required('This field cannot be empty')
          .max(MAX_PRICE_VALUE, 'Price has exceeded maximum value: ' + MAX_PRICE_VALUE)
          .min(MIN_PRICE_VALUE, 'The value should be at least: ' + MIN_PRICE_VALUE)
    })
}
const handleStockQuantityProductYup = (refString: string) => {
  return yup
    .number()
    .transform((value, originalValue) => {
      return originalValue == '' ? null : value
    })
    .when(refString, {
      is: true,
      then: (schema) => schema.notRequired().nullable(),
      otherwise: (schema) =>
        schema
          .required('This field cannot be empty')
          .max(MAX_STOCK_VALUE, 'Stock has exceeded maximum value: ' + MAX_STOCK_VALUE)
          .min(MIN_STOCK_VALUE, 'The value should be at least: ' + MIN_STOCK_VALUE)
    })
}
const handleEditStockQuantityProductYup = (refString: string) => {
  return yup
    .number()
    .transform((value, originalValue) => {
      return originalValue == '' ? null : value
    })
    .when(refString, {
      is: true,
      then: (schema) => schema.notRequired().nullable(),
      otherwise: (schema) =>
        schema
          .required('This field cannot be empty')
          .max(MAX_STOCK_VALUE, 'Stock has exceeded maximum value: ' + MAX_STOCK_VALUE)
          .min(0, 'The value should be at least: ' + 0)
    })
}

export const productSchema = yup.object({
  id: yup.string().nullable(),
  name: yup
    .string()
    .trim()
    .required('This field cannot be empty')
    .min(10, 'Your product title is too short. Please input at least 10 characters.'),
  brand: yup.string().trim().required('This field cannot be empty'),
  categoryId: yup.string().required('This field cannot be empty'),
  shopId: yup.string().nullable(),
  price: handlePriceProductYup('isVariant') as yup.NumberSchema<number | undefined, yup.AnyObject, undefined, ''>,
  stockQuantity: handleStockQuantityProductYup('isVariant') as yup.NumberSchema<
    number | undefined,
    yup.AnyObject,
    undefined,
    ''
  >,
  description: yup
    .string()
    .required('This field cannot be empty')
    .max(3000)
    .min(100, 'Your product description is too short. Please input at least 100 characters.'),
  conditionProduct: yup.string().required('This field cannot be empty').max(10),
  isVariant: yup.boolean().required('This field cannot be empty'),
  isActive: yup.boolean().nullable(),
  productImages: yup
    .array()
    .of(
      yup.object({
        id: yup.string().required('This field cannot be empty'),
        imageUrl: yup.string().required('This field cannot be empty')
      })
    )
    .min(3, 'Product images must have at least 3 images.'),
  productVariants: yup.array().of(
    yup.object({
      id: yup.string().required('This field cannot be empty'),
      price: yup
        .number()
        .transform((value, originalValue) => (originalValue === '' ? null : value))
        .required('This field cannot be empty')
        .max(MAX_PRICE_VALUE, 'Price has exceeded maximum value: ' + MAX_PRICE_VALUE)
        .min(MIN_PRICE_VALUE, 'The value should be at least: ' + MIN_PRICE_VALUE),
      stockQuantity: yup
        .number()
        .transform((value, originalValue) => (originalValue === '' ? null : value))
        .required('This field cannot be empty')
        .max(MAX_STOCK_VALUE, 'Stock has exceeded maximum value: ' + MAX_STOCK_VALUE)
        .min(MIN_STOCK_VALUE, 'The value should be at least: ' + MIN_STOCK_VALUE),
      variantsGroup1Id: yup.string().required('This field cannot be empty'),
      variant1Id: yup.string().required('This field cannot be empty'),
      variantsGroup2Id: yup.string().nullable(),
      variant2Id: yup.string().nullable()
    })
  ),
  variantsGroup: yup
    .array()
    .of(
      yup.object({
        id: yup.string().required('This field cannot be empty'),
        name: yup.string().trim().required('This field cannot be empty'),
        isPrimary: yup.boolean().required('This field cannot be empty'),
        variants: yup
          .array()
          .of(
            yup.object({
              id: yup.string().required('This field cannot be empty'),
              name: yup.string().trim().required('This field cannot be empty'),
              variantImage: yup.object({
                id: yup.string().nullable(),
                imageUrl: yup.string().nullable()
              })
            })
          )
          .max(50, 'Variations List has exceeded maximum value: 50')
          .test({
            test: function (values) {
              if (!values) return true

              let hasDuplicate = false
              const errors: yup.ValidationError[] = []

              values.forEach((variant, index) => {
                const { name } = variant

                if (name !== null && name !== undefined && name !== '') {
                  values.forEach((otherVariant, otherIndex) => {
                    if (index !== otherIndex && otherVariant.name === name) {
                      hasDuplicate = true
                      errors.push(
                        this.createError({
                          path: `${this.path}[${index}].name`,
                          message: 'Options of variations should be different.'
                        })
                      )
                    }
                  })
                }
              })

              if (hasDuplicate) {
                return new yup.ValidationError(errors)
              } else {
                return true
              }
            }
          })
      })
    )
    .max(2, 'Variations has exceeded maximum value: 2')
    .test({
      test: function (this: yup.TestContext<yup.AnyObject>, values) {
        if (!values) return true
        let hasDuplicate = false

        const errors: yup.ValidationError[] = []

        values.forEach((variant, index) => {
          const { name } = variant

          if (name !== null && name !== undefined && name !== '') {
            values.forEach((otherVariant, otherIndex) => {
              if (index !== otherIndex && otherVariant.name === name) {
                hasDuplicate = true
                errors.push(
                  this.createError({
                    path: `${this.path}.${index}.name`,
                    message: 'Names of variations should be different.'
                  })
                )
              }
            })
          }
        })

        if (hasDuplicate) {
          return new yup.ValidationError(errors)
        } else {
          return true
        }
      }
    })
})

export const productEditSchema = productSchema.shape({
  id: yup.string().required('This field cannot be empty'),
  shopId: yup.string().required('This field cannot be empty'),
  stockQuantity: handleEditStockQuantityProductYup('isVariant') as yup.NumberSchema<
    number | undefined,
    yup.AnyObject,
    undefined,
    ''
  >,
  productVariants: yup.array().of(
    yup.object({
      id: yup.string().required('This field cannot be empty'),
      price: yup
        .number()
        .transform((value, originalValue) => (originalValue === '' ? null : value))
        .required('This field cannot be empty')
        .max(MAX_PRICE_VALUE, 'Price has exceeded maximum value: ' + MAX_PRICE_VALUE)
        .min(MIN_PRICE_VALUE, 'The value should be at least: ' + MIN_PRICE_VALUE),
      stockQuantity: yup
        .number()
        .transform((value, originalValue) => (originalValue === '' ? null : value))
        .required('This field cannot be empty')
        .max(MAX_STOCK_VALUE, 'Stock has exceeded maximum value: ' + MAX_STOCK_VALUE)
        .min(0, 'The value should be at least: ' + 0),
      variantsGroup1Id: yup.string().required('This field cannot be empty'),
      variant1Id: yup.string().required('This field cannot be empty'),
      variantsGroup2Id: yup.string().nullable(),
      variant2Id: yup.string().nullable()
    })
  )
})

export type ProductSchema = yup.InferType<typeof productSchema>
export type ProductEditSchema = yup.InferType<typeof productEditSchema>
