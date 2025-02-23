import { useRoutes } from 'react-router-dom'
import ClientRoutes from './routers/ClientRouters'
import AdminRoutes from './routers/AdminRouters'
import ShopRoutes from './routers/ShopRouter'
import AuthRoutes from './routers/AuthRouter'

export default function useRouteElement() {
  const routeElement = useRoutes([...ClientRoutes, ...AdminRoutes, ...ShopRoutes, ...AuthRoutes])
  return routeElement
}
