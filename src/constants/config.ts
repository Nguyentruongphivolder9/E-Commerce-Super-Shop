const config = {
  baseURL: 'http://localhost:8080/api/v1/',
  maxSizeUploadAvatar: 1048576, // bytes,
  awsURL: 'https://super-shop.s3.ap-south-1.amazonaws.com/',
  GET_CATEGORIES_QUERY_KEY: 'getCategories',
  GET_LIST_CART_QUERY_KEY: 'listCartItemQuery',
  GET_LIST_PRODUCT_INTEREST_QUERY_KEY: 'listProductInterestQuery',
  GET_LIST_PRODUCT_OF_SHOP_QUERY_KEY: 'listProductOfShopQuery',
  GET_LIST_CATEGORIES_OF_SHOP_QUERY_KEY: 'getListCategoriesOfShop',

  CHAT_WEBSOCKET_URL: 'http://localhost:8080/ws-endpoint',
  GET_LIST_PRODUCT_ACTIVE_OF_SHOP_QUERY_KEY: 'listProductaCTIVEOfShopQuery',
  GET_LIST_TYPE_OF_VIOLATION_QUERY_KEY: 'listProductOfShopQuery'
}

export default config
