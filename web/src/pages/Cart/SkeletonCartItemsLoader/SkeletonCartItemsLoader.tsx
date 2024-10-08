export default function SkeletonCartItemsLoader() {
  return (
    <div className='bg-neutral-100 py-5'>
      <div className='container mx-auto'>
        <div>
          <div className='mb-4 grid grid-cols-12 gap-4 items-center bg-white p-4 px-9 text-sm capitalize text-gray-500 rounded-sm'>
            <div className='col-span-6 h-4 rounded'>
              <div className='flex items-center'>
                <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                  <input type='checkbox' className='h-[18px] w-[18px]' disabled />
                </div>
                <div className='flex-grow text-black'>Product</div>
              </div>
            </div>
            <div className='col-span-6'>
              <div className='grid grid-cols-5 text-center'>
                <div className='col-span-2'>Unit Price</div>
                <div className='col-span-1'>Quantity</div>
                <div className='col-span-1'>Total Price</div>
                <div className='col-span-1'>Actions</div>
              </div>
            </div>
          </div>
        </div>
        {Array(2)
          .fill(0)
          .map((_, i) => (
            <ItemsLoader key={i} />
          ))}
      </div>
    </div>
  )
}

function ItemsLoader() {
  return (
    <div className='bg-white mb-4'>
      <div className='grid grid-cols-12 gap-4 items-center bg-white py-4 px-9 rounded-sm border-b-[1px]'>
        <div className='col-span-6'>
          <div className='flex items-center justify-between'>
            <div className='flex flex-shrink-0 items-center justify-center pr-3'>
              <input type='checkbox' className='h-[18px] w-[18px]' disabled />
            </div>
            <div className='flex-grow'>
              <div className='h-4 bg-gray-300 rounded mb-2 animate-pulse' />
            </div>
          </div>
        </div>
        <div className='col-span-6 bg-white'></div>
      </div>
      <div className='px-5'>
        <div className='grid grid-cols-12 gap-4 items-center bg-white py-4 px-4 rounded-sm border-b-[1px]'>
          <div className='col-span-6'>
            <div className='flex items-center justify-between'>
              <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                <input type='checkbox' className='h-[18px] w-[18px]' disabled />
              </div>
              <div className='w-16 h-16 bg-gray-300 rounded animate-pulse mr-3' />
              <div className='flex-grow'>
                <div className='h-4 bg-gray-300 rounded mb-2 animate-pulse' />
                <div className='h-4 bg-gray-300 rounded animate-pulse' />
              </div>
            </div>
          </div>
          <div className='col-span-2 h-4 bg-gray-300 rounded animate-pulse' />
          <div className='col-span-1 h-4 bg-gray-300 rounded animate-pulse' />
          <div className='col-span-2 h-4 bg-gray-300 rounded animate-pulse' />
          <div className='col-span-1 h-4 bg-gray-300 rounded animate-pulse' />
        </div>
        <div className='grid grid-cols-12 gap-4 items-center bg-white py-4 px-4 rounded-sm border-b-[1px]'>
          <div className='col-span-6'>
            <div className='flex items-center justify-between'>
              <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                <input type='checkbox' className='h-[18px] w-[18px]' disabled />
              </div>
              <div className='w-16 h-16 bg-gray-300 rounded animate-pulse mr-3' />
              <div className='flex-grow'>
                <div className='h-4 bg-gray-300 rounded mb-2 animate-pulse' />
                <div className='h-4 bg-gray-300 rounded animate-pulse' />
              </div>
            </div>
          </div>
          <div className='col-span-2 h-4 bg-gray-300 rounded animate-pulse' />
          <div className='col-span-1 h-4 bg-gray-300 rounded animate-pulse' />
          <div className='col-span-2 h-4 bg-gray-300 rounded animate-pulse' />
          <div className='col-span-1 h-4 bg-gray-300 rounded animate-pulse' />
        </div>
        <div className='grid grid-cols-12 gap-4 items-center bg-white py-4 px-4 rounded-sm'>
          <div className='col-span-6'>
            <div className='flex items-center justify-between'>
              <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                <input type='checkbox' className='h-[18px] w-[18px]' disabled />
              </div>
              <div className='w-16 h-16 bg-gray-300 rounded animate-pulse mr-3' />
              <div className='flex-grow'>
                <div className='h-4 bg-gray-300 rounded mb-2 animate-pulse' />
                <div className='h-4 bg-gray-300 rounded animate-pulse' />
              </div>
            </div>
          </div>
          <div className='col-span-2 h-4 bg-gray-300 rounded animate-pulse' />
          <div className='col-span-1 h-4 bg-gray-300 rounded animate-pulse' />
          <div className='col-span-2 h-4 bg-gray-300 rounded animate-pulse' />
          <div className='col-span-1 h-4 bg-gray-300 rounded animate-pulse' />
        </div>
      </div>
      <div className='grid grid-cols-12 gap-4 items-center bg-white py-4 px-9 rounded-sm border-b-[1px] border-t-[1px]'>
        <div className='col-span-6'>
          <div className='flex items-center justify-between'>
            <div className='flex-grow'>
              <div className='h-4 bg-gray-300 rounded mb-2 animate-pulse' />
            </div>
          </div>
        </div>
        <div className='col-span-6 bg-white'></div>
      </div>
      <div className='grid grid-cols-12 gap-4 items-center bg-white py-4 px-9 rounded-sm border-b-[1px] border-t-[1px]'>
        <div className='col-span-6'>
          <div className='flex items-center justify-between'>
            <div className='flex-grow'>
              <div className='h-4 bg-gray-300 rounded mb-2 animate-pulse' />
            </div>
          </div>
        </div>
        <div className='col-span-6 bg-white'></div>
      </div>
    </div>
  )
}
