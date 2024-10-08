import { ProductVariantsRequest, VariantsGroupRequest } from 'src/types/product.type'
import { useContext } from 'react'
import { generateUniqueId } from 'src/utils/utils'
import { useFieldArray, useWatch } from 'react-hook-form'
import InputUpdateVariation from '../InputUpdateVariation'
import { ProductEditContext } from 'src/contexts/productEdit.context'

interface Props {
  indexVariantsGroup: number
  handlerRemoveVariations: (index: number) => void
  data: VariantsGroupRequest
  isPrimary: boolean
}

export default function UpdateVariantGroup({ handlerRemoveVariations, isPrimary, data, indexVariantsGroup }: Props) {
  const { productEditMethods } = useContext(ProductEditContext)

  const {
    register,
    control,
    getValues,
    watch,
    formState: { errors }
  } = productEditMethods

  const {
    fields: arraysVariants,
    append: appendVariants,
    remove: removeVariants
  } = useFieldArray({
    control,
    name: `variantsGroup.${indexVariantsGroup}.variants`
  })

  const { append: appendProductVariants, replace: replaceProductVariants } = useFieldArray({
    control,
    name: 'productVariants'
  })

  const variantsGroup = watch().variantsGroup
  const productVariants = useWatch({
    control,
    name: 'productVariants'
  })

  const handlerAddNewAVariant = () => {
    const newVariant = {
      id: generateUniqueId(),
      name: '',
      variantImage: {},
      isActive: true
    }
    appendVariants(newVariant)

    const newObjectProductVariant: ProductVariantsRequest[] = []

    if (variantsGroup?.length === 1) {
      const newProductVariant = {
        id: generateUniqueId(),
        price: 0,
        stockQuantity: 0,
        variantsGroup1Id: variantsGroup?.[0]?.id,
        variant1Id: newVariant.id,
        variantsGroup2Id: null,
        variant2Id: null
      }
      appendProductVariants(newProductVariant)
    } else {
      if (data.isPrimary) {
        variantsGroup?.forEach((itemVariantGroup) => {
          if (!itemVariantGroup.isPrimary) {
            itemVariantGroup.variants?.forEach((item) => {
              const newProductVariant = {
                id: generateUniqueId(),
                price: 0,
                stockQuantity: 0,
                variantsGroup1Id: variantsGroup?.[0]?.id,
                variant1Id: newVariant.id,
                variantsGroup2Id: itemVariantGroup.id,
                variant2Id: item.id
              }
              newObjectProductVariant.push(newProductVariant)
            })
          }
        })
      } else if (!data.isPrimary) {
        variantsGroup?.forEach((itemVariantGroup) => {
          if (itemVariantGroup.isPrimary) {
            itemVariantGroup.variants?.forEach((itemVariant1) => {
              const newProductVariant = {
                id: generateUniqueId(),
                price: 0,
                stockQuantity: 0,
                variantsGroup1Id: itemVariantGroup.id,
                variant1Id: itemVariant1.id,
                variantsGroup2Id: variantsGroup?.[1]?.id,
                variant2Id: newVariant.id
              }
              newObjectProductVariant.push(newProductVariant)
            })
          }
        })
      }
    }

    appendProductVariants(newObjectProductVariant)
  }

  const handlerRemoveVariant = (index: number, variantId: string) => {
    if (arraysVariants === null || arraysVariants === undefined || arraysVariants.length === 0) {
      return
    } else {
      if (arraysVariants.length > 1) {
        removeVariants(index)

        if (data.isPrimary) {
          replaceProductVariants(
            productVariants?.filter((pv) => pv.variant1Id != variantId) as ProductVariantsRequest[]
          )
        }

        if (!data.isPrimary) {
          replaceProductVariants(
            productVariants?.filter((pv) => pv.variant2Id != variantId) as ProductVariantsRequest[]
          )
        }
      }
    }
  }

  return (
    <div className='p-4 bg-[#f6f6f6] rounded-md mb-4'>
      <div className='pb-8 flex flex-row justify-between items-start border-b-[1px] border-gray-300'>
        <div className='w-80'>
          <div
            className={`w-full px-3 border bg-[#fff] h-8 rounded-md ${errors.variantsGroup?.[indexVariantsGroup]?.name?.message ? 'border-[#ff4742]' : 'hover:border-[#999999]'}`}
          >
            <div className=' rounded-sm p-1 flex items-center flex-row justify-between w-full'>
              <input
                {...register(`variantsGroup.${indexVariantsGroup}.name` as any)}
                type='text'
                maxLength={14}
                value={getValues(`variantsGroup.${indexVariantsGroup}.name`)}
                className='text-sm text-[#333333] w-full border-none outline-none pr-3'
                placeholder='Input'
              />
              <div className='text-sm text-[#999999]'>
                {watch(`variantsGroup.${indexVariantsGroup}.name`).length}/14
              </div>
            </div>
            <div
              className={`${errors.variantsGroup?.[indexVariantsGroup]?.name?.message ? 'visible' : 'invisible'} mt-2 h-4 text-xs text-[#ff4742]`}
            >
              {errors.variantsGroup?.[indexVariantsGroup]?.name?.message}
            </div>
          </div>
          {/* validation */}
        </div>
        <button type='button' onClick={() => handlerRemoveVariations(indexVariantsGroup)}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='size-4 text-[#999999] hover:text-[#333333]'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M6 18 18 6M6 6l12 12' />
          </svg>
        </button>
      </div>
      <div className='mt-4 grid grid-cols-2 gap-3'>
        {arraysVariants.map((variant, index) => (
          <InputUpdateVariation
            key={index}
            indexVariantsGroup={indexVariantsGroup}
            indexVariants={index}
            isPrimary={isPrimary}
            sizeVariants={arraysVariants.length}
            handlerRemoveVariant={handlerRemoveVariant}
          />
        ))}
        {(arraysVariants.length == undefined || arraysVariants.length < 50) && (
          <div className='col-span-1 bg-[#f6f6f6] rounded-md flex justify-center'>
            <div
              onClick={handlerAddNewAVariant}
              aria-hidden={true}
              className='w-9/12 px-5 h-9 rounded-md flex items-center p-1 hover:border-blue hover:bg-sky-100 border-dashed border-[1px] border-[#999999] cursor-pointer'
            >
              <div className=' rounded-sm p-1 flex items-center flex-row justify-around w-full text-blue bg-transparent'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.3}
                  stroke='currentColor'
                  className='size-5'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
                </svg>
                <span className='text-sm'>Add new a variant</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
