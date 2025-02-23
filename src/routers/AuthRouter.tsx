import { Suspense, useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import path from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'
import RegisterLayout from 'src/layouts/RegisterLayout'
import Login from 'src/pages/User/pages/Login'
import Register from 'src/pages/User/pages/Register'

function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

const AuthRoutes = [
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
        path: path.loginMutation,
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
  }
]

export default AuthRoutes
