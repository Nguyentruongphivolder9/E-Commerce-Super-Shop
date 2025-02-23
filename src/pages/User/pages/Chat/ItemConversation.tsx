export default function ItemConversation() {
  return (
    // bg-stone-100
    <div className='flex h-15 p-3 items-center gap-2 bg-neutral-200'>
      <img
        className='rounded-full object-cover h-8 w-8'
        src='https://cf.shopee.vn/file/vn-11134216-7ras8-m1fttzaq85vjdc_tn'
        alt=''
      />
      <div className='flex flex-col justify-between'>
        <div className='flex justify-between items-center'>
          <div className='text-sm text-dark-3 line-clamp-1 font-semibold'>shop_kayan</div>
          <div className='text-xs text-dark-4'>chủ nhật</div>
        </div>
        <div className='line-clamp-1 text-xs text-dark-4'>
          Shopee KHÔNG cho phép các hành vi: Đặt cọc/Chuyển khoản riêng cho người bán/Giao dịch ngoài hệ thống
          Shopee/Cung cấp thông tin liên hệ cho người bán/Các hoạt động tuyển CTV/Tặng quà miễn phí, ... Vui lòng chỉ
          mua-bán trực tiếp trên ứng dụng Shopee để tránh nguy cơ bị lừa đảo bạn nhé!
        </div>
      </div>
    </div>
  )
}
