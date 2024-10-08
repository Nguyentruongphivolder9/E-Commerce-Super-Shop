import { useRef, useState } from 'react'
import Slider from 'react-slick'
import config from 'src/constants/config'
import { ProductImagesResponse } from 'src/types/product.type'

interface Props {
  images: ProductImagesResponse[]
  chooseActive: (image: string) => void
  activeImage: string
  size?: string
  slidesToShow?: number
}

export default function ImageSmallSlider({
  activeImage,
  images,
  chooseActive,
  slidesToShow = 5,
  size = 'h-24'
}: Props) {
  const sliderRef = useRef<Slider>(null)
  const [currentSlide, setCurrentSlide] = useState(0)

  const settings = {
    dots: false,
    infinite: false,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    autoplay: false,
    speed: 500,
    beforeChange: (oldIndex: number, newIndex: number) => setCurrentSlide(newIndex)
  }
  return (
    <div className='relative h-full overflow-hidden'>
      <Slider ref={sliderRef} {...settings}>
        {images.map((img, index) => {
          const isActive = img.imageUrl === activeImage
          return (
            <div className={`${size} relative w-full p-1`} key={index} onMouseEnter={() => chooseActive(img.imageUrl)}>
              <img
                src={`${config.awsURL}products/${img.imageUrl}`}
                alt={img.imageUrl}
                className='h-full w-full object-cover cursor-pointer'
              />
              {isActive && (
                <div className='absolute inset-0 z-10 p-1 h-full w-full flex items-center justify-center'>
                  <div className='border-2 border-blue h-full w-full'></div>
                </div>
              )}
            </div>
          )
        })}
      </Slider>
      {currentSlide > 0 && (
        <button
          className='absolute top-1/2 left-0 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
          type='button'
          onClick={() => sliderRef?.current?.slickPrev()}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-5 h-5'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
          </svg>
        </button>
      )}
      {currentSlide < images.length - settings.slidesToShow && (
        <button
          className='absolute top-1/2 right-0 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
          type='button'
          onClick={() => sliderRef?.current?.slickNext()}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-5 h-5'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
          </svg>
        </button>
      )}
    </div>
  )
}
