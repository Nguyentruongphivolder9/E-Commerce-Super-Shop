import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from 'src/contexts/app.context'
import NavHeader from '../NavHeader'
import Popover from '../Popover'
import { formatCurrency, generateNameId, handleImageProduct, handlePriceProduct } from 'src/utils/utils'
import path from 'src/constants/path'
import config from 'src/constants/config'
import logoWhite from 'src/assets/images/logo_white.png'
import noProduct from 'src/assets/images/no-product.png'
const MAX_PURCHASES = 5
export default function Header() {
  const { cartItems } = useContext(AppContext)

  return (
    <div className='sticky top-0 z-30 pb-5 bg-[linear-gradient(-180deg,#00BFFF,#0099FF)] text-white'>
      <div className='container'>
        <NavHeader />
        <div className='grid grid-cols-12 gap-4 mt-1 items-end'>
          <Link to={'/'} className='col-span-2'>
            <img src={logoWhite} alt='logo' className='h-14' />
          </Link>
          <form className='col-span-9'>
            <div className='bg-white rounded-sm p-1 flex'>
              <input
                type='text'
                className='text-black px-3 flex-grow border-none outline-none bg-transparent'
                placeholder='Free shipping for orders from 0 Vnd'
              />
              <button className='rounded-sm py-1 px-4 flex-shrink-0 bg-blue hover:opacity-95'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-5 h-5'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
                  />
                </svg>
              </button>
            </div>
          </form>
          <div className='col-span-1 justify-self-center'>
            <Popover
              renderPopover={
                <div className='relative w-[400px] text-sm rounded-sm border border-gray-200 bg-white shadow-md'>
                  {cartItems?.content && cartItems.content.length > 0 ? (
                    <div className='p-2'>
                      <div className='text-gray capitalize'>recently added products</div>
                      <div className='mt-5'>
                        {cartItems.content.slice(0, MAX_PURCHASES).map((item) => (
                          <Link
                            to={`${path.home + 'products/'}${generateNameId({ name: item.product.name, id: item.product.id, shopId: item.product.shopId })}`}
                            className='mt-2 py-2 flex hover:bg-gray-100'
                            key={item.id}
                          >
                            <div className='flex-shrink-0'>
                              <img
                                src={`${config.awsURL}products/${handleImageProduct(item.product, item.productVariantId)}`}
                                alt={item.product.name}
                                className='w-11 h-11 object-cover r'
                              />
                            </div>
                            <div className='flex-grow ml-2 overflow-hidden'>
                              <div className='line-clamp-1'>{item.product.name} sdfsdfsfs</div>
                            </div>
                            <div className='ml-2 flex-shrink-0'>
                              <span className='text-orange'>
                                ₫{formatCurrency(handlePriceProduct(item.product, item.productVariantId))}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>

                      <div className='flex mt-6 items-center justify-between'>
                        <div className='capitalize  text-xs text-gray-500'>
                          {cartItems.totalElements > MAX_PURCHASES ? cartItems.totalElements - MAX_PURCHASES : '0'} More
                          Products in Cart
                        </div>
                        <Link
                          to={path.cart}
                          className='bg-blue capitalize hover:opacity-[0.85] py-2 px-4 rounded-sm text-white'
                        >
                          View My Shopping Cart
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className='flex min-w-[400px] h-[300px] w-[400px] flex-col items-center justify-center p-2'>
                        <img src={noProduct} alt='no purchase' className='h-24 w-24' />
                        <div className='mt-3 capitalize'>No products yet</div>
                        <Link
                          to={path.cart}
                          className='capitalize bg-blue hover:opacity-[0.85] py-2 px-4 rounded-sm text-white'
                        >
                          View My Shopping Cart
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              }
            >
              <Link to={path.cart} className='relative'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='w-8 h-8'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z'
                  />
                </svg>
                {cartItems?.content && cartItems.content.length > 0 && (
                  <span className='absolute flex items-center justify-center top-0 right-0 translate-x-1/2 -translate-y-[30%] rounded-full py-[1px] px-[9px] text-xs bg-white text-blue'>
                    {cartItems.totalElements}
                  </span>
                )}
              </Link>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  )
}
