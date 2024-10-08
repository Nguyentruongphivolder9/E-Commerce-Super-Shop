import { useRoutes } from 'react-router-dom'
import ClientRoutes from './routers/ClientRouters'
import AdminRoutes from './routers/AdminRouters'

export default function useRouteElement() {
  const routeElement = useRoutes([...ClientRoutes, ...AdminRoutes])
  return routeElement
}
