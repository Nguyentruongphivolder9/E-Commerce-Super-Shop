import { useEffect, useState } from 'react'
import config from 'src/constants/config'
import { VariantsResponse } from 'src/types/product.type'

interface Props {
  variantData: VariantsResponse
  indexGroupVariant: number
  activeImage: string
  selectedVariants: string[]
  setActiveImage: (imageUrl: string) => void
  setSelectedVariants: (variants: string[]) => void
}

export default function VariantButton({
  variantData,
  indexGroupVariant,
  activeImage,
  setActiveImage,
  selectedVariants,
  setSelectedVariants
}: Props) {
  const [prevImage, setPrevImage] = useState<string>('')

  const handleMouseEnter = () => {
    setPrevImage(activeImage)
    setActiveImage(variantData.imageUrl as string)
  }

  const handleMouseLeave = () => {
    if (prevImage !== null) {
      setActiveImage(prevImage)
    }
  }

  const isSelectedVariants = (selectedVariant: string[], id: string): boolean => {
    return selectedVariant.filter((item) => item === id).length > 0
  }

  return (
    <div className='h-auto w-auto'>
      {variantData.imageUrl ? (
        <button
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => {
            if (indexGroupVariant == 1) {
              if (selectedVariants[0] == variantData.id) {
                setSelectedVariants(['', selectedVariants[1]])
              } else {
                setSelectedVariants([variantData.id, selectedVariants[1]])
              }
            }
          }}
          className={`relative bg-white  border ${isSelectedVariants(selectedVariants, variantData.id) ? 'border-[#ee4d2d]' : 'border-[#00000017]'} hover:border-[#ee4d2d] text-sm pl-10 p-2 mt-2 mr-2 flex items-center rounded-sm min-h-10 min-w-20 outline-0 justify-center`}
        >
          {variantData.name}
          <img
            className='h-6 w-6 absolute top-[50%] -translate-y-[50%] object-cover left-2'
            src={`${config.awsURL}products/${variantData.imageUrl}`}
            alt={variantData.name}
          />
          {isSelectedVariants(selectedVariants, variantData.id) && (
            <div className="absolute w-[15px] h-[15px] bottom-0 right-0 overflow-hidden before:contents-[''] before:border-[15px] before:border-transparent before:bottom-0 before:absolute before:-right-[15px] before:border-b-[15px] before:border-b-[#ee4d2d]">
              <div className='h-2 w-2 absolute bottom-0 right-0 flex items-center justify-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={2.5}
                  stroke='currentColor'
                  className='size-2 text-white'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='m4.5 12.75 6 6 9-13.5' />
                </svg>
              </div>
            </div>
          )}
        </button>
      ) : (
        <button
          onClick={() => {
            if (indexGroupVariant == 1) {
              if (selectedVariants[0] == variantData.id) {
                setSelectedVariants(['', selectedVariants[1]])
              } else {
                setSelectedVariants([variantData.id, selectedVariants[1]])
              }
            }

            if (indexGroupVariant == 2) {
              if (selectedVariants[1] == variantData.id) {
                setSelectedVariants([selectedVariants[0], ''])
              } else {
                setSelectedVariants([selectedVariants[0], variantData.id])
              }
            }
          }}
          className={`relative bg-white border ${isSelectedVariants(selectedVariants, variantData.id) ? 'border-[#ee4d2d]' : 'border-[#00000017]'} hover:border-[#ee4d2d] text-sm p-2 mt-2 mr-2 flex items-center rounded-sm min-h-10 min-w-20 outline-0 justify-center`}
        >
          {variantData.name}
          {isSelectedVariants(selectedVariants, variantData.id) && (
            <div className="absolute w-[15px] h-[15px] bottom-0 right-0 overflow-hidden before:contents-[''] before:border-[15px] before:border-transparent before:bottom-0 before:absolute before:-right-[15px] before:border-b-[15px] before:border-b-[#ee4d2d]">
              <div className='h-2 w-2 absolute bottom-0 right-0 flex items-center justify-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={2.5}
                  stroke='currentColor'
                  className='size-2 text-white'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='m4.5 12.75 6 6 9-13.5' />
                </svg>
              </div>
            </div>
          )}
        </button>
      )}
    </div>
  )
}
