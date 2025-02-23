import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Slider from 'react-slick'
import { useContext, useRef, useState } from 'react'
import { AppContext } from 'src/contexts/app.context'
import config from 'src/constants/config'
import { Link } from 'react-router-dom'
import { generateCategoryNameId } from 'src/utils/utils'
import path from 'src/constants/path'

export default function CategoriesSlider() {
  const sliderRef = useRef<Slider>(null)
  const [currentSlide, setCurrentSlide] = useState(0)

  const { categories } = useContext(AppContext)

  const settings = {
    accessibility: true,
    dots: false,
    infinite: false,
    slidesToShow: 10,
    slidesToScroll: 10,
    rows: 2,
    speed: 1000,
    arrow: false,
    useTransform: true,
    className: 'categories-slider',
    beforeChange: (oldIndex: number, newIndex: number) => setCurrentSlide(newIndex)
  }

  return (
    <div className='w-full relative group'>
      <div className='overflow-hidden bg-white'>
        <Slider ref={sliderRef} {...settings}>
          {categories &&
            categories.map((category, i) => (
              <Link
                to={`${path.home + 'categories/'}${generateCategoryNameId({ name: `${category.name}`, stringIds: `${category.parentId ? category.parentId + '.' + category.id : category.id}` })}`}
                className='h-auto w-full'
                key={i}
              >
                <div className='h-40 w-full overflow-hidden flex flex-col bg-white border-r-[1px] border-b-[1px] hover:border-gray-300 hover:shadow'>
                  <div className='flex h-2/3 justify-center flex-1 items-end'>
                    <div className='h-[83px] w-[88px]'>
                      {category.categoryImages[0] && (
                        <img
                          className='w-full h-full object-cover'
                          src={`${config.awsURL}categories/${category.categoryImages[0].imageUrl}`}
                          alt={category.name}
                        />
                      )}
                    </div>
                  </div>
                  <div className='flex px-3 justify-center text-center h-1/3  items-start text-sm text-[#000000]'>
                    <p className='line-clamp-2'>{category.name}</p>
                  </div>
                </div>
              </Link>
            ))}
        </Slider>
      </div>
      {currentSlide > 0 && (
        <div className='absolute top-[42%] left-0 -ml-6 hidden group-hover:block'>
          <button
            className='p-4 bg-white rounded-full border'
            type='button'
            onClick={() => sliderRef?.current?.slickPrev()}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={2.2}
              stroke='currentColor'
              className='size-5 text-blue'
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
            </svg>
          </button>
        </div>
      )}
      {categories && currentSlide < categories?.length / 2 - settings.slidesToShow && (
        <div className='absolute top-[42%] right-0 -mr-6 hidden group-hover:block'>
          <button
            className='p-4 bg-white rounded-full border'
            type='button'
            onClick={() => sliderRef?.current?.slickNext()}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={2.2}
              stroke='currentColor'
              className='size-5 text-blue'
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
