export default function ShopChannel() {
  return (
    <div className='w-full'>
      <div className='w-full bg-white rounded-xl px-6 py-6 shadow-sm'>
        <div>
          <div className='ml-12 mt-3'>
            <h2 className='text-2xl font-bold text-[#333333]'>To-do list</h2>
            <p className='text-sm text-[#999999]'>Things your must do</p>
          </div>
          <div className='grid grid-cols-4 gap-3 mt-6'>
            <div className='px-2 mb-4 text-center'>
              <div className='text-lg text-[#2673DD] font-semibold mb-2'>0</div>
              <div className='text-[#333333] text-sm'>Wait For Confirmation</div>
            </div>
            <div className='px-2 mb-4 text-center'>
              <div className='text-lg text-[#2673DD] font-semibold mb-2'>0</div>
              <div className='text-[#333333] text-sm'>Wait For Delivery</div>
            </div>
            <div className='px-2 mb-4 text-center'>
              <div className='text-lg text-[#2673DD] font-semibold mb-2'>0</div>
              <div className='text-[#333333] text-sm'>Processed</div>
            </div>
            <div className='px-2 mb-4 text-center'>
              <div className='text-lg text-[#2673DD] font-semibold mb-2'>0</div>
              <div className='text-[#333333] text-sm'>Order Cancelation</div>
            </div>
            <div className='px-2 mb-4 text-center'>
              <div className='text-lg text-[#2673DD] font-semibold mb-2'>0</div>
              <div className='text-[#333333] text-sm'>Returns / Refunds Pending</div>
            </div>
            <div className='px-2 mb-4 text-center'>
              <div className='text-lg text-[#2673DD] font-semibold mb-2'>0</div>
              <div className='text-[#333333] text-sm'>Product Is Temporarily Locked</div>
            </div>
            <div className='px-2 mb-4 text-center'>
              <div className='text-lg text-[#2673DD] font-semibold mb-2'>0</div>
              <div className='text-[#333333] text-sm'>Product Is Out Of Stock</div>
            </div>
            <div className='px-2 mb-4 text-center'>
              <div className='text-lg text-[#2673DD] font-semibold mb-2'>0</div>
              <div className='text-[#333333] text-sm'>Promotion Pending</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
