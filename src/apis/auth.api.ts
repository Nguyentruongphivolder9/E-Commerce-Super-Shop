import {
  Account_Return,
  AuthResponse,
  Device_Return,
  google_Success_Request_Url_Authorization,
  Previous_Device_login,
  RefreshTokenResponse,
  TypingEmailResponse,
  WaitingForEmailResponse
} from 'src/types/auth.type'
import http from 'src/utils/http'
import { FormWaitingForEmailVerify } from 'src/components/RegisterForms/Registers'
import { toast } from 'react-toastify'
import { Schema, UserSchema } from 'src/utils/rules'
import { DeviceInfo } from 'src/hooks/useDeviceInfo'
import { FormDataConversation } from 'src/contexts/chat.context'
export const URL_LOGIN = 'auth/login'
export const URl_REGISTER = 'auth/register'
export const URL_LOGOUT = 'account/account-logout'
export const URL_REFRESH_TOKEN = 'auth/refresh-access-token'
export const URL_EMAIL_VERIFICATION = 'auth/send-email'
export const URL_WAITING_FOR_EMAIL_RESPONSE = 'auth/waiting-for-email-response'
export const URL_GOOGLE_AUTHORIZATION_URL_REQUEST = 'oauth/oauth-2-user/google/url'
export const URL_FACEBOOK_AUTHORIZATION_URL_REQUEST = 'oauth/oauth-2-user/facebook/url'
export const URL_GOOGLE_LOGIN_WITHOUT_PASSWORDDD = 'auth/google-login-without-password'
export const URL_MERGE_ACCOUNT_GOOGLE = 'auth/merge-google-account'
export const URL_UPDATE_ACCOUNT_USER_INFO = 'account/update-user-account-info'
export const URL_UPDATE_ACCOUNT_DEVICE_INFO = 'auth/assign-device-to-account'
export const URL_GET_DEVICE_PREVIOUS_LOGIN = 'auth/device-previous-login'
export const URL_HIDE_PREVIOUS_ACCOUNT = 'auth/device-hide-account'
export const URL_SET_ACCOUNT_OFFLINE = 'account/set-account-offline'
export const URL_SET_ACCOUNT_ONLINE = 'account/set-account-online'
export const URL_GET_ALL_DEVICES_BY_ACCESSTOKEN = 'account/get-all-devices-by-accessToken'
export const URL_QRLOGIN = "auth/get-qr-token"

export type FormUserInfoUpdate = Pick<
  UserSchema,
  'user_name' | 'full_name' | 'birth_day' | 'email' | 'gender' | 'phone_number'
> & { avatar?: File }

export type FinalRegisterForm = {
  email?: string | undefined
  password: string
  user_name: string
  full_name: string
  gender: string
  address?: string | undefined
  phone_number: string
  birth_day: string
}
type FormData = Pick<Schema, 'email' | 'password'> & { setUpdate?: string }
type LogoutRequest = {
  email: string
}
type MergeFormData = Pick<UserSchema, 'avatar' | 'user_name'> & { email?: string }

const deviceInfo = localStorage.getItem("deviceInfo")
const deviceFingerPrint = localStorage.getItem('deviceFingerPrintId')

const authApi = {
  getAllDevicesByAccessToken(accountId: string){
    return http.post<Device_Return>(`${URL_GET_ALL_DEVICES_BY_ACCESSTOKEN}`, null, {
      headers: {
        'Account-Id': accountId
      }
    })
  },
  qrLogin(token:string){
    return http.post<AuthResponse>(`${URL_QRLOGIN}`, null, {
      headers: {
        'Token': token
      }
    })
  },
  devicePreviousLogin() {
    return http.post<Previous_Device_login>(`${URL_GET_DEVICE_PREVIOUS_LOGIN}`, null, {
      headers: {
        'Device-Finger-Print': deviceFingerPrint
      }
    })
  },
  accountOffline(email: string) {
    const token = localStorage.getItem('accessToken')
    if (token === null) {
      toast.error('Thất bại trong việc cập nhật thông tin người dùng, vui lòng thử lại trong giây lác')
      return Promise.reject(new Error('No access token found'))
    }
    return http.post<Previous_Device_login>(`${URL_SET_ACCOUNT_OFFLINE}`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
        Email: email,
        'Device-Info': deviceInfo
      }
    })
  },
  accountOnline(email: string) {
    const token = localStorage.getItem('accessToken')
    if (token === null) {
      toast.error('Thất bại trong việc cập nhật thông tin người dùng, vui lòng thử lại trong giây lác')
      return Promise.reject(new Error('No access token found'))
    }
    return http.post<Previous_Device_login>(`${URL_SET_ACCOUNT_ONLINE}`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
        Email: email,
        'Device-Info': deviceInfo
      }
    })
  },
  hidePreviousAccount(email: string) {
    return http.post<WaitingForEmailResponse>(`${URL_HIDE_PREVIOUS_ACCOUNT}`, null, {
      headers: {
        Email: email,
        'Device-Finger-Print': deviceFingerPrint
      }
    })
  },
  assignDeviceToAccount(data: {email: string }) {
    return http.post<WaitingForEmailResponse>(`${URL_UPDATE_ACCOUNT_DEVICE_INFO}`, null, {
      headers: {
        'Device-Info': deviceInfo,
        'Account-Email': data.email
      }
    })
  },
  updateUserInfo(body: FormUserInfoUpdate) {
    const token = localStorage.getItem('accessToken')
    if (token === null) {
      toast.error('Thất bại trong việc cập nhật thông tin người dùng, vui lòng thử lại trong giây lát')
      return Promise.reject(new Error('No access token found'))
    }
    
    return http.post<AuthResponse>(`${URL_UPDATE_ACCOUNT_USER_INFO}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Device-Info': deviceInfo,
        'Content-Type': 'multipart/form-data' 
      }
    })
  },
  mergeAccountUrl(body: MergeFormData) {
    return http.post<AuthResponse>(`${URL_MERGE_ACCOUNT_GOOGLE}`, body)
  },
  googleLoginWithoutPassword(body: { email: string }) {
    return http.post<AuthResponse>(`${URL_GOOGLE_LOGIN_WITHOUT_PASSWORDDD}`, body, {
      headers: {
        'Device-Finger-Print': deviceFingerPrint,
        'Device-Info': deviceInfo
      }
    })
  },
  requestGoogleAuthorizationUrl() {
    return http.get<google_Success_Request_Url_Authorization>(`${URL_GOOGLE_AUTHORIZATION_URL_REQUEST}`)
  },
  requestFaceBookAuthorization () {
    return http.get<google_Success_Request_Url_Authorization>(`${URL_FACEBOOK_AUTHORIZATION_URL_REQUEST}`)
  },

  waitingForEmailResponse(body: FormWaitingForEmailVerify) {
    return http.post<WaitingForEmailResponse>(`${URL_WAITING_FOR_EMAIL_RESPONSE}`, body)
  },
  verifyEmail(body: { email: string }) {
    return http.post<TypingEmailResponse>(`${URL_EMAIL_VERIFICATION}`, body)
  },
  registerAccount(body: FinalRegisterForm) {
    return http.post<AuthResponse>(`${URl_REGISTER}`, body);
  },
  login(body: FormData) {
    return http.post<AuthResponse>(`${URL_LOGIN}`, body, {
      headers: {
        'Device-Finger-Print': deviceFingerPrint,
        'Device-Info': deviceInfo
      }
    })
  },
  logout(body: LogoutRequest) {
    const token = localStorage.getItem('accessToken')
    if (token === null) {
      toast.error('Thất bại trong việc đăng suất, thử lại trong giây lát')
      return Promise.reject(new Error('No access token found'))
    }
    return http.post<AuthResponse>(`${URL_LOGOUT}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Device-Finger-Print': deviceFingerPrint
      }
    })
  }
}

export default authApi
