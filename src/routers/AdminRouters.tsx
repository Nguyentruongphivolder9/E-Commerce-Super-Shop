import { Suspense, useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import path from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'
import { ProductTabsProcessProvider } from 'src/contexts/productTabsProcess.context'
import AdminLayout from 'src/layouts/AdminLayout/AdminLayout'

import CategoriesManagement from 'src/pages/Admin/pages/CategoriesManagement'
import DashBoard from 'src/pages/Admin/pages/Dashboard'
import ProductApproval from 'src/pages/Admin/pages/ProductApproval'
import ProductDeleted from 'src/pages/Admin/pages/ProductApproval/ProductDeleted'
import ProductForSale from 'src/pages/Admin/pages/ProductApproval/ProductForSale'
import ProductPendingApproval from 'src/pages/Admin/pages/ProductApproval/ProductPendingApproval'
import ProductStatusAll from 'src/pages/Admin/pages/ProductApproval/ProductStatusAll/ProductStatusAll'
import ProductTemporarilyLocked from 'src/pages/Admin/pages/ProductApproval/ProductTemporarilyLocked'
import KeywordAndViolation from 'src/pages/Admin/pages/KeywordAndViolation'
import AdvertiseShopManagement from 'src/pages/Admin/pages/AdvertiseManagement/AdvertiseManagement'
import AdvertiseDetail from 'src/pages/Admin/pages/AdvertiseManagement/AdvertiseDetail'
import DeletedAdvertises from 'src/pages/Admin/pages/AdvertiseManagement/AdvertiseIsDeleted'

function ProtectedRouteAdmin() {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}

const AdminRoutes = [
  {
    path: '',
    element: <ProtectedRouteAdmin />,
    children: [
      {
        path: path.adminSuperShop,
        element: (
          <Suspense>
            <AdminLayout />
          </Suspense>
        ),
        children: [
          {
            path: path.adminSuperShop,
            element: <DashBoard />
          },
          {
            path: path.adminCategories,
            element: <CategoriesManagement />
          },
          {
            path: path.adminProductApproval,
            element: (
              <ProductTabsProcessProvider>
                <ProductApproval />
              </ProductTabsProcessProvider>
            ),
            children: [
              {
                path: path.adminProductAll,
                element: <ProductStatusAll />
              },
              {
                path: path.adminProductPendingApproval,
                element: <ProductPendingApproval />
              },
              {
                path: path.adminProductForSale,
                element: <ProductForSale />
              },
              {
                path: path.adminProductTemporarilyLocked,
                element: <ProductTemporarilyLocked />
              },
              {
                path: path.adminProductDeleted,
                element: <ProductDeleted />
              }
            ]
          },
          {
            path: path.adminAdvertises,
            element: <AdvertiseShopManagement />
          },
          {
            path: path.adminDetailAdvertises,
            element: <AdvertiseDetail />
          },
          {
            path: path.adminDeletedAdvertise,
            element: <DeletedAdvertises />
          },
          {
            path: path.adminTypeOfViolation,
            element: <KeywordAndViolation />
          }
        ]
      }
    ]
  }
]

export default AdminRoutes
