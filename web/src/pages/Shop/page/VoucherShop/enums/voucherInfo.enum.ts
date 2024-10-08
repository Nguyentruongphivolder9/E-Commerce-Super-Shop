enum StatusVoucher {
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  EXPIRE = 'expire'
}

enum VoucherType {
  GLOBAL = 'global',
  SHOP = 'shop',
  SHIPPING = 'shipping'
}

enum DiscountType {
  FIXED = 'fixed',
  PERCENTAGE = 'percentage'
}

export { StatusVoucher, VoucherType, DiscountType }
