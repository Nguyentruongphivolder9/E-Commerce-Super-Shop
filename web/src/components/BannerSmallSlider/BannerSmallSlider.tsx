import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Slider from 'react-slick'
import { useRef } from 'react'

export default function BannerSmallSlider() {
  const sliderRef = useRef<Slider>(null)

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    speed: 1000,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    dotsClass: 'button__bar',
    arrows: false
  }

  return (
    <div className='relative group overflow-hidden'>
      <Slider ref={sliderRef} {...settings}>
        <div className='h-96 w-full overflow-hidden'>
          <img
            className='w-full h-full object-cover'
            src='https://thuvienmuasam.com/uploads/default/original/2X/e/ecebb2282f9348e42333185337a9b6514449b54a.jpeg'
            alt=''
          />
        </div>
        <div className='h-96 w-full overflow-hidden'>
          <img
            className='w-full h-full object-cover'
            src='https://scontent.fsgn5-9.fna.fbcdn.net/v/t1.6435-9/122847179_10158980773707769_622720227430348184_n.png?_nc_cat=105&ccb=1-7&_nc_sid=13d280&_nc_ohc=AQrL_xseHCUQ7kNvgEVqFIm&_nc_ht=scontent.fsgn5-9.fna&oh=00_AYCZsklJI0cYv08rWLZjYq3SC2OhtQPnHm6k6uvkKdbAYA&oe=6711F7D7'
            alt=''
          />
        </div>
      </Slider>
      <div className='absolute top-[45%] left-0 hidden group-hover:block'>
        <button
          className='p-2 bg-[#0000002e] w-9 h-12 hover:bg-[#0000004e]'
          type='button'
          onClick={() => sliderRef?.current?.slickPrev()}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={2.2}
            stroke='currentColor'
            className='size-5 text-white'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
          </svg>
        </button>
      </div>
      <div className='absolute top-[45%] right-0 hidden group-hover:block'>
        <button
          className='p-2 bg-[#0000002e] w-9 h-12 hover:bg-[#0000004e]'
          type='button'
          onClick={() => sliderRef?.current?.slickNext()}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={2.2}
            stroke='currentColor'
            className='size-5 text-white'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
          </svg>
        </button>
      </div>
    </div>
  )
}
