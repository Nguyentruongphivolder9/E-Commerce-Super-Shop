const path = {
  home: '/',
  user: '/user',
  profile: '/user/profile',
  loginSession: '/user/loginSession',
  changePassword: '/user/password',
  historyPurchase: '/user/purchase',
  historyPurchaseDetail: '/user/purchase/:orderId',
  purchaseRefund: '/user/purchase/refund/:orderId',
  voucher: '/user/voucher-wallet',
  historyVoucher: '/user/voucher-wallet/history',
  login: '/login',
  loginMutation: '/login/:token/:refreshToken/:hasPassword',
  register: '/register',
  logout: '/logout',
  product: '/products',
  productDetail: '/products/:nameId',
  category: 'categories/:nameId',
  cart: '/cart',
  recommendationDaily: '/find_similar_products',
  shopDetail: '/shop-detail',
  shopDetailById: '/shop-detail/:nameId',

  //Chat feature
  chat: '/chat',
  conversations: '/chat/conversations',
  conversationId: '/chat/conversations/:conversationId',

  //Social Media feature
  social: '/social',
  explore: '/social/explore',
  saved: '/social/saved',
  allUsers: '/social/all-users',
  createPost: '/social/create-post',
  updatePost: '/social/update-post/:postId',
  postDetail: '/social/posts/:postId',
  socialProfile: '/social/profile/:userId/*',

  checkout: '/checkout',
  checkoutCallBack: '/payment/callback',
  // shop channels
  shopChannel: '/shopchannel',

  productManagement: '/shopchannel/portal/product/list',
  productManagementAll: '/shopchannel/portal/product/list/all',
  productManagementForSale: '/shopchannel/portal/product/list/live/all',
  productUnlisted: '/shopchannel/portal/product/list/unlisted',
  productViolationBanned: '/shopchannel/portal/product/list/violation/banned',
  productReviewing: '/shopchannel/portal/product/list/reviewing',
  productAdd: '/shopchannel/portal/product/new',
  productEdit: '/shopchannel/portal/product/:nameId',
  myShopCategories: '/shopchannel/portal/category',
  voucherShop: '/shopchannel/portal/marketing/vouchers/list',
  voucherShopAdd: '/shopchannel/portal/marketing/vouchers/new',
  voucherShopEdit: '/shopchannel/portal/marketing/vouchers/edit',
  orderShop: '/shopchannel/portal/sale/order',
  returnOrderShop: '/shopchannel/portal/sale/return',
  //Email verification.
  emailVerify: '/emailVerify',

  //advertise
  advertiseManagement: '/shopchannel/portal/advertise',
  advertiseAdd: '/shopchannel/portal/advertise/new',
  advertiseEstimate: '/shopchannel/portal/advertise/new/estimate',
  paymentAdvertiseStatus: '/shopchannel/portal/payment/advertise/callback/',
  shopDeletedAdvertise: '/shopchannel/portal/advertise/deleted',
  shopDetailAdvertise: '/shopchannel/portal/advertise/detail/:id',

  // admin
  adminSuperShop: '/admin-super-shop',
  adminCategories: '/admin-super-shop/categories',

  adminAdvertises: '/admin-super-shop/advertise',
  adminDetailAdvertises: '/admin-super-shop/advertise/detail/:id',
  adminDeletedAdvertise: '/admin-super-shop/advertise/deleted',

  adminProductApproval: '/admin-super-shop/product-approval',
  adminProductAll: '/admin-super-shop/product-approval/all',
  adminProductDeleted: '/admin-super-shop/product-approval/deleted',
  adminProductForSale: '/admin-super-shop/product-approval/for-sale',
  adminProductPendingApproval: '/admin-super-shop/product-approval/pending-approval',
  adminProductTemporarilyLocked: '/admin-super-shop/product-approval/temporarily-locked',
  adminTypeOfViolation: '/admin-super-shop/products/type-of-violation',

  adminAccountStatistic: '/admin-super-shop/users/common-statictic'
} as const

export default path
