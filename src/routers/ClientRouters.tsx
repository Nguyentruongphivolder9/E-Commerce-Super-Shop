import { Suspense, useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import path from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'
import MainLayout from 'src/layouts/MainLayout'
import NotFound from 'src/pages/User/pages/NotFound'
import UserLayout from 'src/pages/User/layouts/UserLayout'
import ChangePassword from 'src/pages/User/components/ChangePassword'
import HistoryPurchase from 'src/pages/User/pages/HistoryPurchase'
import Profile from 'src/pages/User/pages/Profile'
import Home from 'src/pages/User/pages/Home'
import VoucherWallet from 'src/pages/User/pages/VoucherWallet'
import RecommendationDaily from 'src/pages/User/pages/RecommendationDaily'
import CartLayout from 'src/layouts/CartLayout'
import HistoryPurchaseDetail from 'src/pages/User/pages/HistoryPurchase/pages/HistoryPurchaseDetail'
import PurchaseRefund from 'src/pages/User/pages/HistoryPurchase/pages/PurchaseRefund'

import LoginSession from 'src/pages/User/components/LoginSession'
import ShopDetail from 'src/pages/User/pages/ShopDetail'
import Checkout from 'src/pages/User/pages/Checkout'
import CheckoutCallback from 'src/pages/User/pages/Checkout/CheckoutCallback/CheckoutCallback'
import ProductList from 'src/pages/User/pages/ProductList'
import ProductDetail from 'src/pages/User/pages/ProductDetail'
import Cart from 'src/pages/User/pages/Cart'
function ProtectedRoute() {
  const { isAuthenticated, profile } = useContext(AppContext)
  if (profile?.role) {
    console.log('Role: ' + profile?.role)
  }
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}

const ClientRoutes = [
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
    path: '',
    element: <ProtectedRoute />,
    children: [
      {
        path: path.cart,
        element: (
          <CartLayout>
            <Suspense>
              <Cart></Cart>
            </Suspense>
          </CartLayout>
        )
      },
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
