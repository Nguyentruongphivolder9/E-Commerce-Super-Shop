import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useRouteElement from './useRouteElement'
import { useContext, useEffect, useRef } from 'react'
import { localStorageEventTarget } from './utils/auth'
import { AppContext } from './contexts/app.context'
import 'react-image-crop/dist/ReactCrop.css'
import { ScrollArea } from '@mantine/core'
import Chat from './pages/User/pages/Chat'

function App() {
  const routeElement = useRouteElement()
  const { reset } = useContext(AppContext)

  useEffect(() => {
    localStorageEventTarget.addEventListener('clearLS', reset)
    return () => {
      localStorageEventTarget.removeEventListener('clearLS', reset)
    }
  }, [reset])

  return (
    <div className=''>
      <ScrollArea className='h-auto min-w-[1100px]'>{routeElement}</ScrollArea>
      <ToastContainer />
      <Chat />
    </div>
  )
}

export default App
