import { Suspense, useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import path from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'
import MainLayout from 'src/layouts/MainLayout'
import RegisterLayout from 'src/layouts/RegisterLayout'
import Login from 'src/pages/Login'
import NotFound from 'src/pages/NotFound'
import Register from 'src/pages/Register'
import ProductDetail from 'src/pages/ProductDetail'
import ProductList from 'src/pages/ProductList'
import UserLayout from 'src/pages/User/layouts/UserLayout'
import ChangePassword from 'src/pages/User/components/ChangePassword'
import HistoryPurchase from 'src/pages/User/pages/HistoryPurchase'
import Profile from 'src/pages/User/pages/Profile'
import ShopLayout from 'src/layouts/ShopLayout'
import ShopChannel from 'src/pages/Shop/page/ShopChannel'
import cartRouter from './cartRouter'
import VoucherShop from 'src/pages/Shop/page/VoucherShop'
import ProductManagement from 'src/pages/Shop/page/ProductManagement'
import ProductsListActive from 'src/pages/Shop/page/ProductManagement/ProductsListActive'
import ProductAll from 'src/pages/Shop/page/ProductManagement/ProductsAll'
import ProductAdd from 'src/pages/Shop/page/ProductManagement/ProductAdd'
import Home from 'src/pages/Home'
import VoucherWallet from 'src/pages/User/pages/VoucherWallet'
import VoucherAdd from 'src/pages/Shop/page/VoucherShop/pages/VoucherAdd'

import AdvertiseManagement from 'src/pages/Shop/page/AdvertiseManagement'
import AdvertiseAdd from 'src/pages/Shop/page/AdvertiseManagement/AdvertiseAdd'
import { ProductAddProvider } from 'src/contexts/productAdd.context'
import RecommendationDaily from 'src/pages/RecommendationDaily'

import VoucherEdit from 'src/pages/Shop/page/VoucherShop/pages/VoucherEdit'
import { VoucherProvider } from 'src/contexts/voucher.context'
import ProductEdit from 'src/pages/Shop/page/ProductManagement/ProductEdit'
import { ProductEditProvider } from 'src/contexts/productEdit.context'
import Checkout from 'src/pages/Checkout'
import CheckoutCallback from 'src/pages/Checkout/CheckoutCallback/CheckoutCallback'
import ProductReviewing from 'src/pages/Shop/page/ProductManagement/ProductReviewing'
import ProductUnlisted from 'src/pages/Shop/page/ProductManagement/ProductUnlisted'
import ProductViolationBanned from 'src/pages/Shop/page/ProductManagement/ProductViolationBanned'
import ChatLayout from 'src/layouts/ChatLayout'
import Chat from 'src/pages/Chat'
import Conversation from 'src/pages/Chat/conversations'
import { ProductTabsProcessProvider } from 'src/contexts/productTabsProcess.context'
import ShopDetail from 'src/pages/ShopDetail'
import CartLayout from 'src/layouts/CartLayout'

import AdvertisePaymentStatus from 'src/pages/Shop/page/AdvertiseManagement/AdvertisePaymentStatus'
import HistoryPurchaseDetail from 'src/pages/User/pages/HistoryPurchase/pages/HistoryPurchaseDetail'
import PurchaseRefund from 'src/pages/User/pages/HistoryPurchase/pages/PurchaseRefund'
import OrderShop from 'src/pages/Shop/page/OrderShop'

import LoginSession from 'src/pages/User/components/LoginSession'
import RefundOrderShop from 'src/pages/Shop/page/OrderShop/ReturnOrderShop'
import DeletedAdvertisesShop from 'src/pages/Shop/page/AdvertiseManagement/DeletedAdvertiseShop'
import AdvertiseDetailShop from 'src/pages/Shop/page/AdvertiseManagement/AdvertiseDetail/AdvertiseDetail'
import socialRouter from './socialRouter'
import MyShopCategory from 'src/pages/Shop/page/MyShopCategory'
function ProtectedRoute() {
  const { isAuthenticated, profile } = useContext(AppContext)
  if (profile?.role) {
    console.log('Role: ' + profile?.role)
  }
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}
function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}
const ClientRoutes = [
  {
    path: '',
    element: <RejectedRoute />,
    children: [
      {
        path: path.login,
        element: (
          <RegisterLayout>
            <Suspense>
              <Login></Login>
            </Suspense>
          </RegisterLayout>
        )
      },
      {
        path: path.loginMutaion,
        element: (
          <RegisterLayout>
            <Suspense>
              <Login></Login>
            </Suspense>
          </RegisterLayout>
        )
      },
      {
        path: path.register,
        element: (
          <RegisterLayout>
            <Suspense>
              <Register></Register>
            </Suspense>
          </RegisterLayout>
        )
      }
    ]
  },

  {
    path: '',
    element: <ProtectedRoute />,
    children: [
      cartRouter,
      socialRouter,
      {
        path: path.user,
        element: (
          <MainLayout>
            <UserLayout></UserLayout>
          </MainLayout>
        ),
        children: [
          {
            path: path.profile,
            element: <Profile></Profile>
          },
          {
            path: path.changePassword,
            element: (
              <Suspense>
                <ChangePassword></ChangePassword>
              </Suspense>
            )
          },
          {
            path: path.loginSession,
            element: (
              <Suspense>
                <LoginSession></LoginSession>
              </Suspense>
            )
          },
          {
            path: path.historyPurchase,
            element: (
              <Suspense>
                <HistoryPurchase></HistoryPurchase>
              </Suspense>
            )
          },
          {
            path: path.historyPurchaseDetail,
            element: (
              <Suspense>
                <HistoryPurchaseDetail></HistoryPurchaseDetail>
              </Suspense>
            )
          },
          {
            path: path.purchaseRefund,
            element: (
              <Suspense>
                <PurchaseRefund></PurchaseRefund>
              </Suspense>
            )
          },
          {
            path: path.voucher,
            element: (
              <Suspense>
                <VoucherWallet></VoucherWallet>
              </Suspense>
            )
          }
        ]
      },
      {
        path: path.shopChannel,
        element: <ShopLayout />,
        children: [
          {
            path: '',
            element: <ShopChannel></ShopChannel>
          },
          {
            path: path.productManagement,
            element: (
              <ProductTabsProcessProvider>
                <ProductManagement></ProductManagement>
              </ProductTabsProcessProvider>
            ),
            children: [
              {
                path: path.productManagementAll,
                element: <ProductAll></ProductAll>
              },
              {
                path: path.productManagementForSale,
                element: <ProductsListActive></ProductsListActive>
              },
              {
                path: path.productReviewing,
                element: <ProductReviewing></ProductReviewing>
              },
              {
                path: path.productUnlisted,
                element: <ProductUnlisted></ProductUnlisted>
              },
              {
                path: path.productViolationBanned,
                element: <ProductViolationBanned></ProductViolationBanned>
              }
            ]
          },
          {
            path: path.productAdd,
            element: (
              <ProductAddProvider>
                <ProductAdd></ProductAdd>
              </ProductAddProvider>
            )
          },
          {
            path: path.myShopCategories,
            element: (
              <ProductAddProvider>
                <MyShopCategory></MyShopCategory>
              </ProductAddProvider>
            )
          },
          {
            path: path.advertiseAdd,
            element: <AdvertiseAdd></AdvertiseAdd>
          },
          {
            path: path.advertiseManagement,
            element: <AdvertiseManagement></AdvertiseManagement>
          },
          {
            path: path.paymentAdvertiseStatus,
            element: <AdvertisePaymentStatus></AdvertisePaymentStatus>
          },
          {
            path: path.shopDeletedAdvertise,
            element: <DeletedAdvertisesShop></DeletedAdvertisesShop>
          },
          {
            path: path.shopDetailAdvertise,
            element: <AdvertiseDetailShop></AdvertiseDetailShop>
          },
          {
            path: path.voucherShop,
            element: (
              <VoucherProvider>
                <VoucherShop></VoucherShop>
              </VoucherProvider>
            )
          },
          {
            path: path.voucherShopAdd,
            element: <VoucherAdd></VoucherAdd>
          },
          {
            path: path.voucherShopEdit,
            element: <VoucherEdit></VoucherEdit>
          },
          {
            path: path.productEdit,
            element: (
              <ProductEditProvider>
                <ProductEdit></ProductEdit>
              </ProductEditProvider>
            )
          },
          {
            path: path.orderShop,
            element: <OrderShop></OrderShop>
          },
          {
            path: path.returnOrderShop,
            element: <RefundOrderShop></RefundOrderShop>
          }
        ]
      },
      {
        path: path.recommendationDaily,
        element: (
          <MainLayout>
            <Suspense>
              <RecommendationDaily></RecommendationDaily>
            </Suspense>
          </MainLayout>
        )
      },
      {
        path: path.shopDetailById,
        element: (
          <MainLayout>
            <Suspense>
              <ShopDetail></ShopDetail>
            </Suspense>
          </MainLayout>
        )
      },
      {
        path: path.checkout,
        element: (
          <CartLayout>
            <Suspense>
              <Checkout></Checkout>
            </Suspense>
          </CartLayout>
        )
      },
      {
        path: path.checkoutCallBack,
        element: (
          <MainLayout>
            <CheckoutCallback></CheckoutCallback>
          </MainLayout>
        )
      }
    ]
  },
  {
    path: path.category,
    element: (
      <MainLayout>
        <Suspense>
          <ProductList></ProductList>
        </Suspense>
      </MainLayout>
    )
  },
  {
    path: path.productDetail,
    element: (
      <MainLayout>
        <Suspense>
          <ProductDetail></ProductDetail>
        </Suspense>
      </MainLayout>
    )
  },
  {
    index: true,
    path: path.home,
    element: (
      <MainLayout>
        <Suspense>
          <Home></Home>
        </Suspense>
      </MainLayout>
    )
  },
  {
    path: path.chat,
    element: <ChatLayout />,
    children: [
      {
        path: '',
        element: (
          <Suspense>
            <Chat></Chat>
          </Suspense>
        )
      },
      {
        path: path.conversations,
        element: (
          <Suspense>
            <Chat></Chat>
          </Suspense>
        )
      },
      {
        path: path.conversationId,
        element: (
          <Suspense>
            <Conversation></Conversation>
          </Suspense>
        )
      }
    ]
  },
  {
    path: '*',
    element: (
      <MainLayout>
        <Suspense>
          <NotFound></NotFound>
        </Suspense>
      </MainLayout>
    )
  }
]

export default ClientRoutes
