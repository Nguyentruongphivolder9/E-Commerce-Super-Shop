import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Slider from 'react-slick'
import { useEffect, useRef, useState } from 'react'
import advertiseApi from 'src/apis/advertise.api'
import { BannerRespone } from 'src/types/advertise.type'
import config from 'src/constants/config'
import { NavLink } from 'react-router-dom'

const BASE_URL = config.awsURL

export default function BannerSlider() {
  const sliderRef = useRef<Slider>(null)
  const [banners, setBanners] = useState<BannerRespone[]>([])

  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await advertiseApi.getActiveAdvertiseImages()
        if (response.data && response.data.body) {
          setBanners(response.data.body)
          console.log(response.data.body)
        } else {
          setBanners([]) // Set to empty array if body is null
        }
      } catch (error) {
        console.error('Failed to fetch active advertise images:', error)
        setBanners([]) // Set to empty array in case of error
      }
    }
    fetchImages()
  }, [])

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 3000,
    dotsClass: 'button__bar',
    arrows: false
  }

  const defaultImageUrl1 = 'https://hanhphucshop.com/wp-content/uploads/2022/04/tiki-12-12.jpg'
  const defaultImageUrl2 = 'https://simg.zalopay.com.vn/zlp-website/assets/loai_ma_giam_gia_tiki_1_1_8c21ac261a.jpg'

  const getImagesToShow = (images: { id: string; imageUrl: string }[]) => {
    const imagesToShow = [...images]
    if (imagesToShow.length === 0) {
      // Add 2 default images if none are available
      return [
        { id: '', imageUrl: defaultImageUrl1 },
        { id: '', imageUrl: defaultImageUrl2 }
      ]
    } else if (imagesToShow.length === 1) {
      // Add 1 default image if only 1 is available
      return [...imagesToShow, { id: '', imageUrl: defaultImageUrl1 }]
    } else {
      return imagesToShow
    }
  }

  const handleAdClick = async (banner: BannerRespone) => {
    try {
      // Call API to increment the click count
      await advertiseApi.incrementClick(banner.advertiseId)
      console.log('Click count incremented')
    } catch (error) {
      console.error('Error incrementing click count:', error)
    }
  }

  return (
    <div className='container relative group'>
      <div className='px-4 pt-4 pb-6 rounded-md overflow-hidden bg-white'>
        <Slider ref={sliderRef} {...settings}>
          {banners.length === 0
            ? // Show default images if there are no banners
              [
                { id: '', imageUrl: defaultImageUrl1 },
                { id: '', imageUrl: defaultImageUrl2 }
              ].map((image) => (
                <div key={image.id} className='h-[380px] w-full overflow-hidden px-2'>
                  <img
                    className='w-full h-full rounded-md object-cover'
                    src={image.imageUrl}
                    alt={`Default ${image.id}`}
                  />
                </div>
              ))
            : banners.flatMap((banner) => {
                const imagesToShow = getImagesToShow(banner.advertiseImages)
                return imagesToShow.map((image) =>
                  image.id ? (
                    <NavLink to={`/shop-detail/${banner.shopId}`} key={`${banner.shopId}-${image.id}`}>
                      <div className='h-[380px] w-full overflow-hidden px-2'>
                        <img
                          className='w-full h-full rounded-md object-cover'
                          alt='Advertise'
                          src={
                            image.imageUrl.startsWith('http')
                              ? image.imageUrl
                              : `${BASE_URL}advertises/${image.imageUrl}`
                          }
                          aria-hidden='true'
                          onClick={() => handleAdClick(banner)} // Pass the entire banner object
                        />
                      </div>
                    </NavLink>
                  ) : (
                    <div key={`${banner.shopId}-${image.id}`} className='h-[380px] w-full overflow-hidden px-2'>
                      <img
                        className='w-full h-full rounded-md object-cover'
                        alt='Advertise'
                        src={
                          image.imageUrl.startsWith('http') ? image.imageUrl : `${BASE_URL}advertises/${image.imageUrl}`
                        }
                      />
                    </div>
                  )
                )
              })}
        </Slider>
      </div>
      <div className='absolute top-[45%] left-0 ml-5 hidden group-hover:block'>
        <button
          className='p-2 bg-white rounded-full border'
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
      <div className='absolute top-[45%] right-0 mr-5 hidden group-hover:block'>
        <button
          className='p-2 bg-white rounded-full border'
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
    </div>
  )
}
