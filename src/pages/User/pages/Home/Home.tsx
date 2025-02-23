import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import productApi from 'src/apis/product.api'
import BannerSlider from 'src/components/BannerBigSlider'
import CategoriesSlider from 'src/components/CategoriesSlider'
import Product from 'src/components/Product'
import ProductsInterestSlider from 'src/components/ProductsInterestSlider'
import path from 'src/constants/path'

export default function Home() {
  const { data: productsData } = useQuery({
    queryKey: ['dailyDiscoverProduct'],
    queryFn: () => productApi.getListProductRecommendation()
  })

  console.log(productsData?.data.body)

  return (
    <div className='bg-[#efefef]'>
      <div className='w-full pt-6'>
        <BannerSlider />
      </div>
      <div className='bg-transparent container py-5'>
        <div className='flex flex-col bg-white'>
          <div className='px-4 flex items-center uppercase text-[#333333] h-14 border-b-[1px]'>Categories</div>
          <CategoriesSlider />
        </div>
      </div>
      <div className='bg-transparent container pb-5'>
        <div
          className='flex flex-col rounded-lg overflow-hidden bg-white'
          // style={{
          //   background:
          //     'linear-gradient(rgba(255, 255, 255, 0) 22.49%, rgb(255, 255, 255) 73.49%), linear-gradient(264.03deg, rgb(220, 229, 251) -10.27%, rgb(234, 236, 255) 35.65%, rgb(213, 236, 253) 110.66%)'
          // }}
        >
          <div className='px-4 flex items-center justify-between text-[#333333] h-14'>
            <div className='text-xl font-bold text-blue'>Products you have shown interest in recently</div>
            {/* <Link to={'#'} className='text-sm font-medium text-blue mr-4'>
              View all
            </Link> */}
          </div>
          {/* <div className='flex items-center mb-5'>
            <ChipTabs />
          </div> */}
          <ProductsInterestSlider />
        </div>
      </div>
      <div className='bg-transparent container pb-5'>
        <div className='flex flex-col'>
          <div className='px-4 flex items-center uppercase font-bold text-blue h-14 border-b-[1px] bg-white'>
            Daily Discover
          </div>
          <div className='h-1 w-full bg-blue'></div>
          <div className='w-full bg-transparent mt-2'>
            <div className='grid grid-cols-12 gap-2'>
              {productsData?.data.body?.content &&
                productsData?.data.body?.content.map((product, index) => (
                  <div key={index} className='relative group h-[360px] col-span-2 rounded-sm overflow-hidden'>
                    <Product product={product} />
                    <div className='absolute z-10 group-hover:flex h-7 w-full bottom-0 left-0 bg-blue hidden'>
                      <Link
                        className='h-full w-full flex justify-center items-center text-white'
                        to={path.recommendationDaily}
                      >
                        Find Similar
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className='w-full h-10 flex items-center justify-center mt-4'>
            <button
              type='button'
              className='border border-blue hover:bg-sky-100 rounded-md text-md text-blue px-9 py-2'
            >
              See more
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
