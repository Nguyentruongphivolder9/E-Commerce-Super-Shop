import axios, { AxiosError, AxiosInstance } from 'axios'
import HttpStatusCode from 'src/constants/httpStatusCode.enum'
import { toast } from 'react-toastify'
import { AuthResponse, RefreshTokenResponse } from 'src/types/auth.type'
import {
  clearLS,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  parseJwt,
  setAccessTokenToLS,
  setProfileToLS,
  setRefreshTokenToLS
} from './auth'
import config from 'src/constants/config'
import {
  URL_GOOGLE_LOGIN_WITHOUT_PASSWORDDD,
  URL_LOGIN,
  URL_LOGOUT,
  URL_MERGE_ACCOUNT_GOOGLE,
  URL_QRLOGIN,
  URL_REFRESH_TOKEN,
  URl_REGISTER,
  URL_UPDATE_ACCOUNT_USER_INFO
} from 'src/apis/auth.api'
import { isAxiosExpiredTokenError, isAxiosUnauthorizedError } from './utils'
import { ErrorResponse } from 'src/types/utils.type'

export class Http {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  private refreshTokenRequest: Promise<string> | null

  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.refreshToken = getRefreshTokenFromLS()
    this.refreshTokenRequest = null
    this.instance = axios.create({
      baseURL: config.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'expire-access-token': 3 * 24 * 60 * 60 * 1000, // 3 days
        'expire-refresh-token': 7 * 24 * 60 * 60 * 1000 // 7 days
      }
    })
    //Setup Authorization header nếu có Accesstoken.
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.authorization = `Bearer ${this.accessToken}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (
          url === URL_LOGIN ||
          // url === URl_REGISTER ||
          url === URL_GOOGLE_LOGIN_WITHOUT_PASSWORDDD ||
          url === URL_MERGE_ACCOUNT_GOOGLE || 
          url === URL_QRLOGIN
        ) {
          const data = response.data as AuthResponse
          this.accessToken = data.body.accessToken
          this.refreshToken = data.body.refreshToken
          setAccessTokenToLS(this.accessToken)
          setRefreshTokenToLS(this.refreshToken)
          setProfileToLS(parseJwt(data.body.accessToken))
        } else if (url === URL_LOGOUT) {
          this.accessToken = ''
          this.refreshToken = ''
          clearLS()
        }
        return response
      },
      async (error: AxiosError) => {
        if (
          ![
            HttpStatusCode.UnprocessableEntity,
            HttpStatusCode.Unauthorized,
            HttpStatusCode.NotFound,
            HttpStatusCode.Conflict
          ].includes(error.response?.status as number)
        ) {
          const data: any | undefined = error.response?.data
          const message = data?.message || error.message
          // toast.error(message) // => Khi demo thì xoá đi
        }

        if (isAxiosUnauthorizedError<ErrorResponse<{ name: string; message: string }>>(error)) {
          const config = error.response?.config || { headers: {}, url: '' }
          const { url } = config

          if (isAxiosExpiredTokenError(error) && url !== URL_REFRESH_TOKEN) {
            if (!this.refreshTokenRequest) {
              this.refreshTokenRequest = this.handleRefreshToken().finally(() => {
                setTimeout(() => {
                  this.refreshTokenRequest = null
                }, 2000)
              })
            }

            try {
              const access_token = await this.refreshTokenRequest
              return this.instance({
                ...config,
                headers: { ...config.headers, authorization: `Bearer ${access_token}` }
              })
            } catch (refreshError) {
              return Promise.reject(refreshError)
            }
          }

          clearLS()
          this.accessToken = ''
          this.refreshToken = ''
          toast.error(error.response?.data.data?.message || error.response?.data.message)
        }

        return Promise.reject(error)
      }
    )
  }

  private async handleRefreshToken(): Promise<string> {
    try {
      const res = await this.instance.post<RefreshTokenResponse>(URL_REFRESH_TOKEN, {
        refresh_token: this.refreshToken
      })
      const { accessToken } = res.data.data
      setAccessTokenToLS(accessToken)
      this.accessToken = accessToken
      return accessToken
    } catch (error) {
      clearLS()
      this.accessToken = ''
      this.refreshToken = ''
      throw error
    }
  }
}

const http = new Http().instance
export default http
