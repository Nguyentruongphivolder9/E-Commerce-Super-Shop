import VariantGroup from 'src/pages/Shop/page/ProductManagement/ProductAdd/VariantGroup'
import { VariantsGroupRequest } from 'src/types/product.type'

interface Props {
  handlerAddVariations: () => void
  handlerRemoveVariations: (index: number) => void
  variantsGroup?: VariantsGroupRequest[]
}

export default function VariationsForm({ handlerAddVariations, handlerRemoveVariations, variantsGroup }: Props) {
  return (
    <div className='col-span-9 flex flex-col gap-1'>
      {variantsGroup &&
        variantsGroup.map((variantGroup, index) => (
          <VariantGroup
            key={variantGroup.id}
            indexVariantsGroup={index}
            data={variantGroup}
            isPrimary={variantGroup.isPrimary}
            handlerRemoveVariations={handlerRemoveVariations}
          />
        ))}
      {(variantsGroup?.length == undefined || variantsGroup.length < 2) && (
        <div className='p-4 bg-[#f6f6f6] rounded-md'>
          <div
            onClick={handlerAddVariations}
            aria-hidden={true}
            className='w-48 px-5 h-10 rounded-md flex items-center p-1 hover:border-blue hover:bg-sky-100 border-dashed border-[1px] border-[#999999] cursor-pointer'
          >
            <div className=' rounded-sm p-1 flex items-center flex-row justify-between w-full text-blue bg-transparent'>
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
              <span className='text-sm'>Add Variation 2</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
