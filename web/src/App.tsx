import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useRouteElement from './useRouteElement'
import { useContext, useEffect, useRef } from 'react'
import { localStorageEventTarget } from './utils/auth'
import { AppContext } from './contexts/app.context'
import 'react-image-crop/dist/ReactCrop.css'
import authApi from '../src/apis/auth.api'
import useDeviceInfo from './hooks/useDeviceInfo'

import './globals.css'

function App() {
  const routeElement = useRouteElement()
  const { reset, profile } = useContext(AppContext)
  const { deviceInfo } = useDeviceInfo()
  const inactivityTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    localStorageEventTarget.addEventListener('clearLS', reset)
    return () => {
      localStorageEventTarget.removeEventListener('clearLS', reset)
    }
  }, [reset])

  // useEffect(() => {
  //   if (profile) {
  //     const handleVisibilityChange = () => {
  //       if (document.visibilityState === 'hidden') {
  //         // Người dùng rời khỏi tab trong 15 phút
  //         inactivityTimeoutRef.current = setTimeout(
  //           () => {
  //             setInactiveStatus()
  //           },
  //           15 * 60 * 1000
  //         ) // 15 phút
  //       } else {
  //         clearTimeout(inactivityTimeoutRef.current)
  //         setActiveStatus()
  //       }
  //     }
  //     const handleBeforeUnload = () => {
  //       // Người dùng đóng tab
  //       setInactiveStatus()
  //     }
  //     // Đảm bảo rằng trạng thái online được thiết lập mỗi khi tab được mở lại
  //     setActiveStatus()
  //     document.addEventListener('visibilitychange', handleVisibilityChange)
  //     window.addEventListener('beforeunload', handleBeforeUnload)
  //     return () => {
  //       document.removeEventListener('visibilitychange', handleVisibilityChange)
  //       window.removeEventListener('beforeunload', handleBeforeUnload)
  //       clearTimeout(inactivityTimeoutRef.current)
  //     }
  //   }
  // }, [profile])

  // const setInactiveStatus = () => {
  //   authApi
  //     .accountOffline(profile!.email, deviceInfo)
  //     .then((response) => {
  //       console.log('User set to offline:', response)
  //     })
  //     .catch((error) => {
  //       console.error('Error setting user to offline:', error)
  //     })
  // }

  // const setActiveStatus = () => {
  //   authApi
  //     .accountOnline(profile!.email, deviceInfo)
  //     .then((response) => {
  //       console.log('User set to online:', response)
  //     })
  //     .catch((error) => {
  //       console.error('Error setting user to online:', error)
  //     })
  // }

  return (
    <div>
      {routeElement}
      <ToastContainer />
    </div>
  )
}

export default App
