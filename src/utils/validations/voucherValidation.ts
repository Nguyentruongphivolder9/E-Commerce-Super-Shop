import * as yup from 'yup'
import { addHours } from 'date-fns'
import { StatusVoucher } from 'src/pages/Shop/page/VoucherShop/enums/voucherInfo.enum'
function emptyStringToNull(value: any, originalValue: any) {
  if (typeof originalValue === 'string' && originalValue === '') {
    return null
  }
  return value
}

function checkNullAndEmpty(...args: number[] | any[]) {
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg == null || arg === '' || arg === undefined) {
      return true
    }
  }
  return false
}

function createDiscountError(
  this: yup.TestContext<yup.AnyObject>,
  path: string,
  maximumDiscount: number,
  value: number,
  percentageAmount: number
) {
  const recommmendMinimumTotalOrder = Math.ceil(maximumDiscount / (percentageAmount / 100))
  const recommmendPercentageAmount = Math.floor((maximumDiscount / value) * 100)
  const recommmendMaximumDiscount = (percentageAmount / 100) * value

  return this.createError({
    path: path,
    message: `User can’t enjoy full discount percentage, please adjust with the following options: 
                1. Reduce minimum total order to ₫${recommmendMinimumTotalOrder}
                2. Reduce discount percentage to ${recommmendPercentageAmount}%
                3. Increase max discount to ₫${recommmendMaximumDiscount}`
  })
}

export const voucherShema = yup.object({
  name: yup.string().required('This field cannot be empty'),
  code: yup
    .string()
    .required('This field cannot be empty')
    .matches(/^[A-Za-z0-9]{1,5}$/, 'Code is not allowed to have special characters')
    .required('Code is required'),
  voucherType: yup.string(),
  startDate: yup.date(),
  endDate: yup
    .date()
    .min(yup.ref('startDate'), 'End date must be after start date')
    .test('is-after-start', 'The end time must be greater than the start time by at least 1 hour.', function (value) {
      const { startDate } = this.parent
      if (startDate && value) {
        return value.getTime() >= addHours(new Date(startDate), 1).getTime()
      }
      return true
    }),
  discountType: yup.string().required(),
  isLimit: yup.boolean().when('discountType', {
    is: 'percentage',
    then: () => yup.boolean().required('This field cannot be empty')
  }),

  fixedAmount: yup
    .number()
    .transform(emptyStringToNull)
    .nullable()
    .when('discountType', ([discountType], schema) => {
      return discountType === 'fixed'
        ? schema
            .required('This field cannot be empty')
            .min(1000, 'The value should be at least 1.000')
            .max(120000000, 'Price has exceeded maximum value: 120.000.000')
            .test({
              test: function (this: yup.TestContext<yup.AnyObject>, value) {
                const { minimumTotalOrder } = this.parent
                if (value > minimumTotalOrder * 0.7 && !checkNullAndEmpty(minimumTotalOrder)) {
                  return this.createError({
                    path: 'fixedAmount',
                    message: 'Voucher discount cannot be greater than 70% of minimum total order'
                  })
                }
                if (isNaN(value)) return false
                return true
              }
            })
        : schema.transform(emptyStringToNull).nullable()
    })
    .typeError('Please enter a number'),

  percentageAmount: yup
    .number()
    .transform(emptyStringToNull)
    .nullable()
    .when('[discountType]', ([discountType], schema) => {
      return discountType === 'percentage'
        ? schema
            .required('This field cannot be empty')
            .min(1, 'Please enter a value between 1 and 99.')
            .max(99, 'Please enter a value between 1 and 99.')
            .test('is_number', 'Please enter a number', (value: any) => {
              return !isNaN(value)
            })
            .typeError('Please enter a number')
        : schema.transform(emptyStringToNull).nullable()
    }),

  maximumDiscount: yup
    .number()
    .transform(emptyStringToNull)
    .nullable()
    .when(['discountType', 'isLimit'], {
      is: (discountType: any, isLimit: any) => discountType === 'percentage' && isLimit,
      then: (schema) =>
        schema
          .required('This field cannot be empty')
          .min(1000, 'The value should be at least 1.000')
          .max(120000000, 'Price has exceeded maximum value: 120.000.000')
          .test({
            test: function (this: yup.TestContext<yup.AnyObject>, value) {
              const { minimumTotalOrder } = this.parent

              if (value > minimumTotalOrder * 0.7 && !checkNullAndEmpty(minimumTotalOrder)) {
                return this.createError({
                  path: 'maximumDiscount',
                  message: 'Maximum discount cannot be greater than 70% of minimum total order'
                })
              }
              if (isNaN(value)) return false
              return true
            }
          })
          .typeError('Please enter a number'),
      otherwise: (schema) => schema
    }),

  minimumTotalOrder: yup
    .number()
    .transform(emptyStringToNull)
    .nullable()
    .test('is_number', 'Please enter a number', (value: any) => {
      return !isNaN(value)
    })
    .typeError('Please enter a number')
    .required('This field cannot be empty')
    .test({
      test: function (this: yup.TestContext<yup.AnyObject>, value) {
        const { fixedAmount, percentageAmount, discountType, maximumDiscount } = this.parent

        if (discountType === 'fixed' && !checkNullAndEmpty(fixedAmount)) {
          const recommmendDiscountAmountFixed = value * 0.01
          const recommmendminimumTotalOrder = fixedAmount / 0.01
          if (fixedAmount < value * 0.01) {
            return this.createError({
              path: 'minimumTotalOrder',
              message: `The discount amount is too small compared to the min basket price(<1.00%), please either increase the discount amount to ₫${recommmendDiscountAmountFixed} or reduce the min basket price to ₫${recommmendminimumTotalOrder}`
            })
          }
        }

        if (discountType === 'percentage' && !checkNullAndEmpty(percentageAmount, maximumDiscount, value)) {
          if (maximumDiscount < value * 0.01 && maximumDiscount < value * (percentageAmount / 100)) {
            const recommmendMaxDiscountAmount = value * 0.01
            const recommmendminimumTotalOrder = maximumDiscount / 0.01 // just in case( < 1%)
            return this.createError({
              path: 'minimumTotalOrder',
              message: `The discount amount is too small compared to the min basket price(<1.00%), please either increase the max discount amount to ₫${recommmendMaxDiscountAmount} or reduce the min basket price to ₫${recommmendminimumTotalOrder}`
            })
          }
          if (maximumDiscount <= value * 0.01 && maximumDiscount <= value * (percentageAmount / 100)) {
            return createDiscountError.bind(this, 'minimumTotalOrder', maximumDiscount, value, percentageAmount)()
          }
          if (maximumDiscount > value * 0.01 && maximumDiscount < value * (percentageAmount / 100)) {
            return createDiscountError.bind(this, 'minimumTotalOrder', maximumDiscount, value, percentageAmount)()
          }
          if (maximumDiscount > value * 0.01 && maximumDiscount >= value * (percentageAmount / 100)) {
            return true
          }
        }
        return true
      }
    }),

  quantity: yup
    .number()
    .integer('Please enter an interger number')
    .transform(emptyStringToNull)
    .nullable()
    .min(1, 'The value should be at least 1')
    .max(200000, 'Price has exceeded maximum value: 200000')
    .required('This field cannot be empty')
    .test('is_number', 'Please enter a number', (value) => {
      return !isNaN(value)
    })
    .typeError('Please enter a number'),

  maxDistribution: yup
    .number()
    .integer('Please enter an interger number')
    .transform(emptyStringToNull)
    .nullable()
    .min(1, 'Please note that the max distribution per buyer must at least be 1')
    .max(2, 'Please note that the max distribution per buyer cannot be more than 2')
    .required('This field cannot be empty')
    .test('is_number', 'Please enter a number', (value) => {
      return !isNaN(value)
    })
    .typeError('Please enter a number')
})

export const voucherUpdateSchema = voucherShema.shape({
  status: yup.string(),
  oldQuantity: yup.number(),
  quantity: yup
    .number()
    .integer('Please enter an interger number')
    .transform(emptyStringToNull)
    .nullable()
    .min(1, 'The value should be at least 1')
    .max(200000, 'Price has exceeded maximum value: 200000')
    .required('This field cannot be empty')
    .test('is_number', 'Please enter a number', (value) => {
      return !isNaN(value)
    })
    .typeError('Please enter a number')
    .test({
      test: function (this: yup.TestContext<yup.AnyObject>, value) {
        const { status, oldQuantity: oldValue } = this.parent
        if (status === StatusVoucher.ONGOING && value < oldValue) {
          return this.createError({
            path: 'quantity',
            message: 'Quantities cannot be reduced in ongoing vouchers'
          })
        }
        return true
      }
    })
})
export const voucherUpdateArraySchema = yup.array().of(voucherUpdateSchema)

export type VoucherSchema = yup.InferType<typeof voucherShema>
export type VoucherUpdateShema = yup.InferType<typeof voucherUpdateSchema>
export type VoucherUpdateArraySchema = yup.InferType<typeof voucherUpdateArraySchema>
