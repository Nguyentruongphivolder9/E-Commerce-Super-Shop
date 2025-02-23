import { Suspense, useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import path from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'
import { ProductAddProvider } from 'src/contexts/productAdd.context'
import { ProductEditProvider } from 'src/contexts/productEdit.context'
import { ProductTabsProcessProvider } from 'src/contexts/productTabsProcess.context'
import { VoucherProvider } from 'src/contexts/voucher.context'
import ShopLayout from 'src/layouts/ShopLayout'
import AdvertiseManagement from 'src/pages/Shop/page/AdvertiseManagement'
import AdvertiseAdd from 'src/pages/Shop/page/AdvertiseManagement/AdvertiseAdd'
import AdvertiseDetailShop from 'src/pages/Shop/page/AdvertiseManagement/AdvertiseDetail/AdvertiseDetail'
import AdvertisePaymentStatus from 'src/pages/Shop/page/AdvertiseManagement/AdvertisePaymentStatus'
import DeletedAdvertisesShop from 'src/pages/Shop/page/AdvertiseManagement/DeletedAdvertiseShop'
import MyShopCategory from 'src/pages/Shop/page/MyShopCategory'
import OrderShop from 'src/pages/Shop/page/OrderShop'
import RefundOrderShop from 'src/pages/Shop/page/OrderShop/ReturnOrderShop'
import ProductManagement from 'src/pages/Shop/page/ProductManagement'
import ProductAdd from 'src/pages/Shop/page/ProductManagement/ProductAdd'
import ProductEdit from 'src/pages/Shop/page/ProductManagement/ProductEdit'
import ProductReviewing from 'src/pages/Shop/page/ProductManagement/ProductReviewing'
import ProductAll from 'src/pages/Shop/page/ProductManagement/ProductsAll'
import ProductsListActive from 'src/pages/Shop/page/ProductManagement/ProductsListActive'
import ProductUnlisted from 'src/pages/Shop/page/ProductManagement/ProductUnlisted'
import ProductViolationBanned from 'src/pages/Shop/page/ProductManagement/ProductViolationBanned'
import ShopChannel from 'src/pages/Shop/page/ShopChannel'
import VoucherShop from 'src/pages/Shop/page/VoucherShop'
import VoucherEdit from 'src/pages/Shop/page/VoucherShop/pages/VoucherEdit'
import VoucherAdd from 'src/pages/Shop/page/VoucherShop/pages/VoucherEdit/VoucherEdit'

function ProtectedRoute() {
  const { isAuthenticated, profile } = useContext(AppContext)
  if (profile?.role) {
    console.log('Role: ' + profile?.role)
  }
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}

const ShopRoutes = [
  {
    path: '',
    element: <ProtectedRoute />,
    children: [
      {
        path: path.shopChannel,
        element: (
          <Suspense>
            <ShopLayout />
          </Suspense>
        ),
        children: [
          {
            path: '',
            element: <ShopChannel />
          },
          {
            path: path.productManagement,
            element: (
              <ProductTabsProcessProvider>
                <ProductManagement />
              </ProductTabsProcessProvider>
            ),
            children: [
              {
                path: path.productManagementAll,
                element: <ProductAll />
              },
              {
                path: path.productManagementForSale,
                element: <ProductsListActive />
              },
              {
                path: path.productReviewing,
                element: <ProductReviewing />
              },
              {
                path: path.productUnlisted,
                element: <ProductUnlisted />
              },
              {
                path: path.productViolationBanned,
                element: <ProductViolationBanned />
              }
            ]
          },
          {
            path: path.productAdd,
            element: (
              <ProductAddProvider>
                <ProductAdd />
              </ProductAddProvider>
            )
          },
          {
            path: path.myShopCategories,
            element: (
              <ProductAddProvider>
                <MyShopCategory />
              </ProductAddProvider>
            )
          },
          {
            path: path.advertiseAdd,
            element: <AdvertiseAdd />
          },
          {
            path: path.advertiseManagement,
            element: <AdvertiseManagement />
          },
          {
            path: path.paymentAdvertiseStatus,
            element: <AdvertisePaymentStatus />
          },
          {
            path: path.shopDeletedAdvertise,
            element: <DeletedAdvertisesShop />
          },
          {
            path: path.shopDetailAdvertise,
            element: <AdvertiseDetailShop />
          },
          {
            path: path.voucherShop,
            element: (
              <VoucherProvider>
                <VoucherShop />
              </VoucherProvider>
            )
          },
          {
            path: path.voucherShopAdd,
            element: <VoucherAdd />
          },
          {
            path: path.voucherShopEdit,
            element: <VoucherEdit />
          },
          {
            path: path.productEdit,
            element: (
              <ProductEditProvider>
                <ProductEdit />
              </ProductEditProvider>
            )
          },
          {
            path: path.orderShop,
            element: <OrderShop />
          },
          {
            path: path.returnOrderShop,
            element: <RefundOrderShop />
          }
        ]
      }
    ]
  }
]

export default ShopRoutes
