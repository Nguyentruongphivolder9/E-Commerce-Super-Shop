import { useContext } from 'react'
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
function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

const AdminRoutes = [
  {
    path: '',
    element: <ProtectedRouteAdmin></ProtectedRouteAdmin>,
    children: [
      {
        path: path.adminSuperShop,
        element: <AdminLayout />,
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
                <ProductApproval></ProductApproval>
              </ProductTabsProcessProvider>
            ),
            children: [
              {
                path: path.adminProductAll,
                element: <ProductStatusAll></ProductStatusAll>
              },
              {
                path: path.adminProductPendingApproval,
                element: <ProductPendingApproval></ProductPendingApproval>
              },
              {
                path: path.adminProductForSale,
                element: <ProductForSale></ProductForSale>
              },
              {
                path: path.adminProductTemporarilyLocked,
                element: <ProductTemporarilyLocked></ProductTemporarilyLocked>
              },
              {
                path: path.adminProductDeleted,
                element: <ProductDeleted></ProductDeleted>
              }
            ]
          },
          {
            path: path.adminAdvertises,
            element: <AdvertiseShopManagement></AdvertiseShopManagement>
          },
          {
            path: path.adminDetailAdvertises,
            element: <AdvertiseDetail></AdvertiseDetail>
          },
          {
            path: path.adminDeletedAdvertise,
            element: <DeletedAdvertises></DeletedAdvertises>
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
