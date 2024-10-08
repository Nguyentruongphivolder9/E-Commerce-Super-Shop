import { Link } from 'react-router-dom'
import ProductRatingStar from 'src/components/ProductRatingStar'
import config from 'src/constants/config'
import path from 'src/constants/path'
import { ProductImagesResponse, Product as ProductType } from 'src/types/product.type'
import { calculateLowestPrice, formatCurrency, formatNumbertoSocialStyle, generateNameId } from 'src/utils/utils'

interface Props {
  product: ProductType
}

export default function Product({ product }: Props) {
  return (
    <Link
      className='h-full w-full relative'
      to={`${path.home + 'products/'}${generateNameId({ name: product.name, id: product.id, shopId: product.shopId })}`}
    >
      <div className='absolute w-full h-full top-0 left-0 hover:border hover:border-blue z-10'></div>
      <div className='overflow-hidden w-full h-full border rounded-sm bg-white'>
        <div className='relative w-full pt-[100%]'>
          <img
            src={`${config.awsURL}products/${product.productImages.find((img: ProductImagesResponse) => img.isPrimary == true)?.imageUrl}`}
            alt={product.name}
            className='absolute left-0 top-0 h-full w-full bg-white object-cover'
          />
        </div>
        <div className='overflow-hidden p-2'>
          <div className='line-clamp-2 min-h-[2rem] text-sm'>{product.name}</div>
          <div className='mt-3 flex items-start justify-start'>
            {product.isVariant ? (
              <div className='ml-1 text-blue truncate text-orange'>
                <span className='text-xl'>₫</span>
                <span className='text-md'>{formatCurrency(calculateLowestPrice(product.productVariants))}</span>
              </div>
            ) : (
              <div className='ml-1 text-blue truncate text-orange'>
                <span className='text-xl'>₫</span>
                <span className='text-md'>{formatCurrency(product.price)}</span>
              </div>
            )}
          </div>
          {/* <div className='flex items-center justify-start gap-2 px-1'>
            <div className='text-sm text-red-600'>-35%</div>
            <div className='text-start  truncate text-gray-500'>
              <span className='text-sm'>₫</span>
              <span className='text-xs line-through'>{formatCurrency(2500000)}</span>
            </div>
          </div> */}
          <div className='flex mt-1 items-center justify-between px-1'>
            <ProductRatingStar rating={product.productFigure.ratingStar} />
            <div className='text-xs'>
              <span>{formatNumbertoSocialStyle(product.productFigure.sold ?? 0)}</span>
              <span className='ml-1'>sold</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
