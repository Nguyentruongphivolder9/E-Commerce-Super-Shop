import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useContext, useState, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import authApi from 'src/apis/auth.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { AppContext } from 'src/contexts/app.context'
import { ErrorResponse } from 'src/types/utils.type'
import { schema, Schema, userSchema, UserSchema } from 'src/utils/rules'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { parseJwt } from 'src/utils/auth'
import facebookSvg from 'src/assets/logoSvg/faceBookSvg.svg'
import googleSvg from 'src/assets/logoSvg/googleSvg.svg'
import { toast } from 'react-toastify'
import { User } from 'src/types/user.type'
import { useDisclosure } from '@mantine/hooks'
import { Modal } from '@mantine/core'
import QrCode from 'src/components/QrCode'
import { BackgroundImage, Center, Text, Box, Checkbox, Group, Avatar } from '@mantine/core'
import SuperShopIcon from 'src/assets/images/logo_white.png'
import { HoverCard } from '@mantine/core'
import useDeviceInfo, { DeviceInfo } from 'src/hooks/useDeviceInfo'
import { StompSessionProvider } from 'react-stomp-hooks'

type FormData = Pick<Schema, 'email' | 'password'> & { setUpdate?: string }
type MergeFormData = Pick<UserSchema, 'avatar' | 'user_name'> & { email?: string }
interface qrCodeInterface {
  deviceInfo: DeviceInfo
  createdAt: string
  code: string
}
const loginSchema = schema.pick(['email', 'password'])

export default function Login() {
  const { deviceInfo } = useDeviceInfo()

  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const [isGoogleAccountRegister, setIsGoogleAccountRegister] = useState<boolean>(false)
  const navigate = useNavigate()
  const location = useLocation()
  const [socialLoginDefault, setSocialLoginDefault] = useState<FormData>()
  const [isLoginWithQrCode, setislogginWithQrCode] = useState<boolean>(false)
  const [opened, { open: openModel1, close: closeModel1 }] = useDisclosure(false)
  const [mergeAccountReguest, { open: openModel2, close: closeModel2 }] = useDisclosure(false)
  const [qrCode, setQrCode] = useState<string>()
  const [mergeAccountLocal, setMergeAccountLocal] = useState<User>()
  const [mergeAccountGoogle, setMergeAccounGoogle] = useState<User>()
  const [code, setCode] = useState<string>(makeid(10))
  const [accountPreviousLogin, setAccountPreviousLogin] = useState<User[]>([])
  //Handle submit cho login
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema),
    context: { isGoogleAccountRegister }
  })

  //handle submit cho gợp account
  const {
    control: mergeControl,
    watch: mergeWatch,
    setValue: setMergeVale,
    handleSubmit: handleMergeSubmit
  } = useForm<MergeFormData>({})

  //Mutation cho việc lấy thôbng tin đăng nhập
  const devicePreviousLoginMutation = useMutation({
    mutationFn: () => authApi.devicePreviousLogin(),
    onSuccess: (data) => {
      if (data.data.body?.length > 0) {
        setAccountPreviousLogin(data.data.body)
      }
    },
    onError: (error) => {
      toast.error('Failed to retrieve some data : ' + error.message)
      console.log(error)
    }
  })
  const loginMutation = useMutation({
    mutationFn: (body: FormData) => authApi.login(body),
    onSuccess: (data) => {
      setProfile(parseJwt(data.data.body.accessToken))
      const userLogin: User = parseJwt(data.data.body.accessToken)
      setIsAuthenticated(true)
      toast.success(`Logged in successfully. Welcome ${userLogin.userName}`)
      navigate('/')
    },
    onError: (error) => {
      toast.error('Đăng nhập thất bại, hãy thử lại trong giây lác')
      if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormData, {
              message: formError[key as keyof FormData],
              type: 'Server'
            })
          })
        }
      }
    }
  })
  const mergeAccountMutaion = useMutation({
    mutationFn: (body: MergeFormData) => authApi.mergeAccountUrl(body),
    onSuccess: (data) => {
      setProfile(parseJwt(data.data.body.accessToken))
      const userLogin: User = parseJwt(data.data.body.accessToken)
      setIsAuthenticated(true)
      toast.success(`Logged in successfully. Welcome ${userLogin.userName}`)
      navigate('/')
    },
    onError: (error) => {
      if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormData, {
              message: formError[key as keyof FormData],
              type: 'Server'
            })
          })
        }
      }
    }
  })

  const faceBookRequestAuthorizationUrlMutation = useMutation({
    mutationFn: () => authApi.requestFaceBookAuthorization(),
    onSuccess: (data) => {
      const authorizationUrl = data.data.body.Url
      window.location.href = authorizationUrl
    },
    onError: (error) => {
      console.log(error)
    }
  })

  const googleRequestAuthorizationUrlMutation = useMutation({
    mutationFn: () => authApi.requestGoogleAuthorizationUrl(),
    onSuccess: (data) => {
      const authorizationUrl = data.data.body.Url
      window.location.href = authorizationUrl
    },
    onError: (error) => {
      console.log(error)
    }
  })
  const appceptGoogleLoginWithoutPasswpord = useMutation({
    mutationFn: (body: { email: string }) => authApi.googleLoginWithoutPassword(body),
    onSuccess: (data) => {
      setIsAuthenticated(true)
      setProfile(parseJwt(data.data.body.accessToken))
      const userLogin: User = parseJwt(data.data.body.accessToken)
      toast.success(`Logged in successfully. Welcome ${userLogin.userName}`)
      navigate('/')
    },
    onError: (error) => {
      toast.error('Đăng nhập thất bại, hãy thử lại trong giây lác')
      if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormData, {
              message: formError[key as keyof FormData],
              type: 'Server'
            })
          })
        }
      }
    }
  })
  const hidePreviousAccountMutation = useMutation({
    mutationFn: (email: string) => authApi.hidePreviousAccount(email),
    onSuccess: (data) => {
      console.log(data)
    },
    onError: (error) => {
      toast.error('Error hide previous account : ' + error.message)
    }
  })
  function makeid(length: number) {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    let counter = 0
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
      counter += 1
    }
    return result
  }

  const handleRefreshQrCode = () => {
    setQrCode(qrCodeGenerator(deviceInfo))
  }
  const qrCodeGenerator = (device: DeviceInfo): string => {
    const returnModel: qrCodeInterface = {
      deviceInfo: device,
      createdAt: new Date().toISOString(),
      code: code
    }
    return JSON.stringify(returnModel)
  }
  const handleHidePreviousAccount = (email: string) => {
    try {
      hidePreviousAccountMutation.mutateAsync(email)
    } catch (error) {
      console.error('Error hide previous account:', error)
    }
  }
  const handleGoogleRequestAuthorization = async () => {
    try {
      await googleRequestAuthorizationUrlMutation.mutateAsync()
    } catch (error) {
      console.error('Error requesting Google authorization URL:', error)
    }
  }

  const handleFacebookRequestAuthorization = async () => {
    try {
      await faceBookRequestAuthorizationUrlMutation.mutateAsync()
    } catch (error) {
      console.error('Error requesting Facebook authorization URL:', error)
    }
  }
  const onSubmit = handleSubmit((data) => {
    if (socialLoginDefault?.email !== null) {
      data.email = socialLoginDefault?.email || data.email
    }
    const formData = {
      ...data,
      setUpdate: socialLoginDefault?.email == null ? 'No' : 'Yes'
    }
    loginMutation.mutate(formData)
  })
  const onMergeSubmit = handleMergeSubmit((data) => {
    const merFormData = {
      ...data,
      email: mergeAccountGoogle?.email
    }
    mergeAccountMutaion.mutate(merFormData)
  })

  useEffect(() => {
    devicePreviousLoginMutation.mutate()
    setislogginWithQrCode(true)
    const urlParams = new URLSearchParams(location.search)
    //Login với tài khoản google chưa có passowrd.
    const token = urlParams.get('token')
    const refreshToken = urlParams.get('refreshToken')
    const hasPassword: boolean = urlParams.get('hasPassword') === 'true' ? true : false

    //Cho phép merge tài khoản google vào local account.
    const accountLocal = urlParams.get('code1')
    const accountGoogle = urlParams.get('code2')
    if (accountGoogle !== null && accountLocal !== null) {
      setMergeAccountLocal(parseJwt(accountLocal))
      setMergeAccounGoogle(parseJwt(accountGoogle))
      openModel2()
    } else if (accountGoogle === null && accountLocal !== null) {
      setMergeAccountLocal(parseJwt(accountLocal))
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      appceptGoogleLoginWithoutPasswpord.mutate({ email: mergeAccountLocal?.email })
    }

    if (token && refreshToken) {
      setIsGoogleAccountRegister(true)
      const userProfile = parseJwt(token)
      if (userProfile && !hasPassword) {
        setSocialLoginDefault({
          password: '',
          email: userProfile.email
        })
        setValue('email', userProfile.email)
      } else if (userProfile && hasPassword) {
        appceptGoogleLoginWithoutPasswpord.mutate({ email: userProfile.email })
      } else {
        toast.error('Failed to parse JWT token.')
      }
    }
  }, [])

  //Loggin với mật khẩu
  if (isLoginWithQrCode) {
    return (
      <div className='bg-blue '>
        <div className='container'>
          {/*Modal cho việc gợp thông tin*/}
          <Modal
            opened={mergeAccountReguest}
            onClose={closeModel2}
            size='50%'
            title={
              <div className='text-center text-xl font-semibold text-gray-800'>Gợp thông tin với tài khoản Local?</div>
            }
            className='rounded-lg shadow-2xl bg-white dark:bg-gray-800 space-y-4'
            padding='lg'
          >
            <div className='text-center text-gray-700 mb-4'>
              Email <u className='font-bold text-cyan-500'>{mergeAccountGoogle?.email}</u> đã được đăng ký trước đó với
              vai trò là tài khoản Local. Nếu bạn muốn gợp thông tin cho cả hai tài khoản thì hãy chọn các trường bạn
              muốn thay đổi.
            </div>
            <hr className='border-gray-300 dark:border-gray-600 mb-6' />

            <form onSubmit={onMergeSubmit} noValidate className='flex flex-col justify-between'>
              <div className='flex'>
                {/* Khối 1 */}
                <Box
                  maw={300}
                  mx='auto'
                  className='min-h-[300px] h-full shadow-xl rounded-lg overflow-hidden bg-gradient-to-r from-blue-500 bg-[#33A353]'
                >
                  <BackgroundImage
                    src='https://www.baltana.com/files/wallpapers-25/Google-Wallpaper-1920x1080-67341.jpg'
                    radius='md'
                    className='relative bg-cover bg-center'
                  >
                    <Center p='lg' className='h-full'>
                      <div className='flex flex-col space-y-6'>
                        {/* Ảnh đại diện */}
                        <Controller
                          name='avatar'
                          control={mergeControl}
                          render={({ field }) => (
                            <Checkbox.Card
                              {...field}
                              className={`relative p-6 bg-opacity-50 ${
                                field.value
                                  ? 'bg-green-600 bg-opacity-40 border-green-300 text-white'
                                  : 'bg-gray-200 text-gray-800'
                              } hover:bg-green-600 dark:hover:bg-blue-600 cursor-pointer rounded-lg transition-all duration-200 ease-in-out shadow-lg`}
                              radius='md'
                              checked={!!field.value}
                              onClick={() => {
                                field.onChange(!field.value)
                                setMergeVale('avatar', !field.value ? mergeAccountGoogle?.avatarUrl : '')
                              }}
                            >
                              <Group wrap='nowrap' align='flex-start'>
                                <Checkbox.Indicator />
                                <div className='flex items-center'>
                                  <Avatar
                                    src={mergeAccountGoogle?.avatarUrl}
                                    alt='Google Account Avatar'
                                    size='lg'
                                    className='mr-4 border-2 border-black'
                                  />
                                  <div>
                                    <Text className='font-mono font-bold text-lg leading-snug text-white'>Avatar</Text>
                                  </div>
                                </div>
                              </Group>
                            </Checkbox.Card>
                          )}
                        />

                        {/* Tên Tài khoản */}
                        <Controller
                          name='user_name'
                          control={mergeControl}
                          render={({ field }) => (
                            <Checkbox.Card
                              {...field}
                              className={`relative p-6 bg-opacity-50 ${
                                field.value ? 'bg-green-600 border-green-300 text-white' : 'bg-gray-200 text-gray-800'
                              } hover:bg-green-600 dark:hover:bg-blue-600 cursor-pointer rounded-lg transition-all duration-200 ease-in-out shadow-lg`}
                              radius='md'
                              checked={!!field.value}
                              onClick={() => {
                                field.onChange(!field.value)
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                //@ts-expect-error
                                setMergeVale('user_name', !field.value ? mergeAccountGoogle?.userName : '')
                              }}
                            >
                              <Group wrap='nowrap' align='flex-start'>
                                <Checkbox.Indicator />
                                <div>
                                  <Text className='font-mono font-bold text-lg leading-snug text-white'>
                                    Tên Tài Khoản
                                  </Text>
                                  <Text className='mt-2 text-gray-700 dark:text-gray-100 text-md'>
                                    {mergeAccountGoogle?.userName}
                                  </Text>
                                </div>
                              </Group>
                            </Checkbox.Card>
                          )}
                        />
                      </div>
                    </Center>
                  </BackgroundImage>
                </Box>

                {/* Khối 2 */}
                <Box
                  maw={300}
                  mx='auto'
                  className='flex-1 ml-auto min-h-[300px] h-full shadow-xl rounded-lg overflow-hidden bg-gradient-to-r bg-[#1648FF]'
                >
                  <BackgroundImage
                    src='https://www.conversion.com.br/wp-content/uploads/2022/07/SEO-da-Shopee.png'
                    radius='md'
                    className='relative bg-cover bg-center h-full'
                  >
                    <Center p='md' className='h-full'>
                      <div className='flex flex-col items-center p-6 bg-opacity-40 bg-white rounded-lg shadow-md space-y-4 h-full'>
                        {/* Avatar */}
                        <div className='relative'>
                          <Avatar
                            src={mergeAccountLocal?.avatarUrl}
                            size='xl'
                            radius='lg'
                            alt='Avatar'
                            className='border-4 border-cyan-500 shadow-lg'
                          />
                        </div>

                        {/* Tên Tài khoản */}
                        <Text className='text-lg font-semibold text-gray-900 bg-white p-2 rounded-md bg-opacity-60 shadow-md'>
                          {mergeAccountLocal?.userName}
                        </Text>

                        {/* Vai trò */}
                        <Text className='text-sm text-white shadow-md'>Email: {mergeAccountLocal?.email}</Text>
                      </div>
                    </Center>
                  </BackgroundImage>
                </Box>
              </div>

              <div>
                <br />
                <hr className='border-gray-300 dark:border-gray-600 mb-6' />
                <div className='flex ml-aut justify-end mt-6'>
                  <Button type='submit' className='bg-blue p-2 text-white border-2 rounded-md border-cyan-500'>
                    Xác nhận
                  </Button>
                </div>
              </div>
            </form>
          </Modal>

          <div className='grid grid-cols lg:grid-cols-5 py-12 lg:py-32 lg:pr-10'>
            <div className='flex flex-wrap'>
              <div className='flex flex-col items-center'>
                <b className='text-[50px] p-4 rounded-md shadow-lg w-[250px]'>
                  <img src={SuperShopIcon} alt='SuperShop Logo' className='' />
                </b>
                <b className='font-sans font-semibold text-[22px] text-gray-800 mt-6'>Recent Logins</b>
                <div
                  className={`flex ${accountPreviousLogin?.length >= 3 ? 'overflow-x-auto overflow-y-hidden' : 'justify-center'} mr-10 mt-6 space-x-6`}
                >
                  {accountPreviousLogin?.length === 0 ? (
                    <div className='text-gray-500 text-center italic'>No previous login ...</div>
                  ) : (
                    accountPreviousLogin.map((account, index) => (
                      <div
                        onClick={() => {
                          setValue('email', account.email)
                        }}
                        key={index}
                        className='relative hover:cursor-pointer min-w-[200px] max-w-[240px] bg-white border border-gray-200 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 dark:bg-gray-700 dark:border-gray-700'
                      >
                        <img
                          className='rounded-t-lg w-full h-40 object-cover'
                          src={account.avatarUrl}
                          alt={account.userName || 'User Avatar'}
                        />
                        <div className='p-4'>
                          <Link to={'/'} className='hover:underline'>
                            <h5 className='mb-1 text-xl font-bold tracking-tight text-gray-900 dark:text-white'>
                              {account.userName || 'Unknown User'}
                              <span
                                className={`absolute ml-2 mt-1 p-2 w-2 h-2  ${account.isActive ? 'bg-green-400' : 'bg-red-400'} border-2 border-white rounded-full ring-2 ring-white dark:ring-gray-500`}
                              ></span>
                            </h5>
                          </Link>
                          <p className='text-sm font-normal text-gray-700 dark:text-gray-400'>
                            {account.email || 'No email provided.'}
                          </p>
                        </div>
                        <Group justify='center'>
                          <HoverCard width={280} shadow='md'>
                            <HoverCard.Target>
                              <div className='hover:cursor-pointer'>
                                <button
                                  className='absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-all duration-300 ease-in-out transform hover:scale-105 z-10'
                                  onClick={() => {
                                    const confirmHide = window.confirm('Are you sure you want to hide this account?')
                                    if (confirmHide) {
                                      handleHidePreviousAccount(account.email)
                                    }
                                  }}
                                >
                                  <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    strokeWidth={2}
                                    stroke='currentColor'
                                    className='w-4 h-4'
                                  >
                                    <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                                  </svg>
                                </button>
                              </div>
                            </HoverCard.Target>
                            <HoverCard.Dropdown className='bg-white'>
                              <Text className='text-center'>Ẩn tài khoản khỏi trang?</Text>
                            </HoverCard.Dropdown>
                          </HoverCard>
                        </Group>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className='lg:col-span-2 lg:col-start-4'>
              <form className='p-10 rounded bg-white shadow-sm' onSubmit={onSubmit} noValidate>
                <div className='flex justify-between items-center p-4'>
                  <div className='text-2xl text-gray-800'>Đăng nhập</div>
                  <div className='flex items-center space-x-4'>
                    {/* Login with QR code */}
                    <div className='bg-cyan-300 p-3 border-2 text-sm border-cyan-800 rounded-sm relative inline-block'>
                      Login với QR Code
                      <div className='absolute top-1/2 transform -translate-y-1/2 right-0 translate-x-full'>
                        <div className='w-0 h-0 border-l-[14px] border-transparent border-l-cyan-800 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent'>
                          <div className='absolute inset-0 w-0 h-0 border-l-[12px] border-transparent border-l-cyan-300 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent'></div>
                        </div>
                      </div>
                    </div>
                    <div
                      className='p-2 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300 transition-all'
                      onClick={() => {
                        setislogginWithQrCode(false)
                      }}
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        fill='currentColor'
                        className='w-6 h-6'
                      >
                        <path
                          fillRule='evenodd'
                          d='M3 4.875C3 3.839 3.84 3 4.875 3h4.5c1.036 0 1.875.84 1.875 1.875v4.5c0 1.036-.84 1.875-1.875 1.875h-4.5A1.875 1.875 0 0 1 3 9.375v-4.5ZM4.875 4.5a.375.375 0 0 0-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 0 0 .375-.375v-4.5a.375.375 0 0 0-.375-.375h-4.5Zm7.875.375c0-1.036.84-1.875 1.875-1.875h4.5C20.16 3 21 3.84 21 4.875v4.5c0 1.036-.84 1.875-1.875 1.875h-4.5a1.875 1.875 0 0 1-1.875-1.875v-4.5Zm1.875-.375a.375.375 0 0 0-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 0 0 .375-.375v-4.5a.375.375 0 0 0-.375-.375h-4.5ZM6 6.75A.75.75 0 0 1 6.75 6h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75A.75.75 0 0 1 6 7.5v-.75Zm9.75 0A.75.75 0 0 1 16.5 6h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75ZM3 14.625c0-1.036.84-1.875 1.875-1.875h4.5c1.036 0 1.875.84 1.875 1.875v4.5c0 1.035-.84 1.875-1.875 1.875h-4.5A1.875 1.875 0 0 1 3 19.125v-4.5Zm1.875-.375a.375.375 0 0 0-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 0 0 .375-.375v-4.5a.375.375 0 0 0-.375-.375h-4.5Zm7.875-.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Zm6 0a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75ZM6 16.5a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Zm9.75 0a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Zm-3 3a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Zm6 0a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <Input
                  name='email'
                  register={register}
                  defaultValue={socialLoginDefault?.email || ''}
                  disabled={socialLoginDefault?.email !== null && socialLoginDefault?.email === ''}
                  type='email'
                  className='mt-8'
                  errorMessage={errors.email?.message}
                  placeholder='Nhập Email của bạn'
                />
                <div className='relative flex items-center mt-8 group'>
                  <div className='flex-1'>
                    <Input
                      name='password'
                      register={register}
                      type='password'
                      className='w-full'
                      errorMessage={errors.password?.message}
                      placeholder='Nhập mật khẩu của bạn'
                      autoComplete='on'
                    />
                  </div>
                  {socialLoginDefault?.email ? (
                    <div className='absolute left-0 top-full mt-2 bg-black text-white bg-opacity-60 p-3 rounded-lg transform opacity-0 group-hover:opacity-100 transition duration-300 ease-in z-50'>
                      <div className='relative'>
                        <div className='absolute left-1/2 -top-2 transform -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-black'></div>
                        <b>Chỉ cần 1 bước nữa thôi 🥳</b>
                        <div>
                          Hãy điền (✍️) 1 mật khẩu mạnh cho tài khoản của bạn và ấn nút Đăng nhập.
                          <br />
                          Hệ thống sẽ chuyển hướng bạn về trang trước đó.
                        </div>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
                <div className='flex justify-between'>
                  <div className='mt-3'>
                    <Link to={'/'} className='text-blue hover:text-cyan-400 hover:cursor-pointer'>
                      Quên mật khẩu?
                    </Link>
                  </div>
                  <div></div>
                </div>
                <div className='flex items-center justify-between mt-6 mb-6'>
                  <hr className='w-4/12 border-gray-300' />
                  <span className='text-gray-500 text-md'>Hoặc</span>
                  <hr className='w-4/12 border-gray-300' />
                </div>
                <div className='flex space-x-2 mt-2'>
                  <Link
                    to={'/'}
                    className='flex items-center justify-center w-full py-2 border border-gray-300 rounded hover:bg-gray-100 cursor-pointer'
                    onClick={handleFacebookRequestAuthorization}
                  >
                    <img src={facebookSvg} alt='Facebook' className='w-7 h-7' />
                    <span className='ml-1 text-gray-700 text-md'>Facebook</span>
                  </Link>
                  <Link
                    to={'/'}
                    className='flex items-center justify-center w-full py-2 border border-gray-300 rounded hover:bg-gray-100 cursor-pointer'
                    onClick={handleGoogleRequestAuthorization}
                  >
                    <img src={googleSvg} alt='Google' className='w-7 h-7' />
                    <span className='ml-1 text-gray-700 text-md'>Google</span>
                  </Link>
                </div>
                <div className='mt-3'>
                  <Button
                    type='submit'
                    className='flex items-center justify-center w-full text-center py-4 px-2 uppercase bg-blue text-white text-sm hover:bg-cyan-400'
                    isLoading={loginMutation.isPending}
                    disabled={loginMutation.isPaused}
                  >
                    Đăng nhập
                  </Button>
                </div>
                <div className='mt-8 text-center'>
                  <div className='flex items-center justify-center'>
                    <span className='text-gray-400'>Bạn chưa có tài khoản?</span>
                    <Link to={'/register'} className='text-red-400 ml-1'>
                      Đăng ký
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
  //Loggin với QR code
  return (
    <div className='bg-blue'>
      <div className='container'>
        <div className='grid grid-cols lg:grid-cols-5 py-12 lg:py-32 lg:pr-10'>
          {/*Account card*/}
          <div className='flex flex-wrap'>
            <div className='flex flex-col items-center'>
              <b className='text-[50px] p-4 rounded-md shadow-lg w-[250px]'>
                <img src={SuperShopIcon} alt='SuperShop Logo' className='' />
              </b>
              <b className='font-sans font-semibold text-[22px] text-gray-800 mt-6'>Recent Logins</b>
              <div
                className={`flex ${accountPreviousLogin?.length >= 3 ? 'overflow-x-auto overflow-y-hidden' : 'justify-center'} mr-10 mt-6 space-x-6`}
              >
                {accountPreviousLogin?.length === 0 ? (
                  <div className='text-gray-500 text-center italic'>No previous login ...</div>
                ) : (
                  accountPreviousLogin.map((account, index) => (
                    <div
                      key={index}
                      className='relative hover:cursor-pointer min-w-[200px] max-w-[240px] bg-white border border-gray-200 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 dark:bg-gray-700 dark:border-gray-700'
                    >
                      <img
                        className='rounded-t-lg w-full h-40 object-cover'
                        src={account.avatarUrl}
                        alt={account.userName || 'User Avatar'}
                      />
                      <div className='p-4'>
                        <Link to={'/'} className='hover:underline'>
                          <h5 className='mb-1 text-xl font-bold tracking-tight text-gray-900 dark:text-white'>
                            {account.userName || 'Unknown User'}
                            <span
                              className={`absolute ml-2 mt-1 p-2 w-2 h-2  ${account.isActive ? 'bg-green-400' : 'bg-red-400'} border-2 border-white rounded-full ring-2 ring-white dark:ring-gray-500`}
                            ></span>
                          </h5>
                        </Link>
                        <p className='text-sm font-normal text-gray-700 dark:text-gray-400'>
                          {account.email || 'No email provided.'}
                        </p>
                      </div>
                      <Group justify='center'>
                        <HoverCard width={280} shadow='md'>
                          <HoverCard.Target>
                            <div className='hover:cursor-pointer'>
                              <button
                                className='absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-all duration-300 ease-in-out transform hover:scale-105 z-10'
                                onClick={() => {
                                  const confirmHide = window.confirm('Are you sure you want to hide this account?')
                                  if (confirmHide) {
                                    handleHidePreviousAccount(account.email)
                                  }
                                }}
                              >
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  fill='none'
                                  viewBox='0 0 24 24'
                                  strokeWidth={2}
                                  stroke='currentColor'
                                  className='w-4 h-4'
                                >
                                  <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                                </svg>
                              </button>
                            </div>
                          </HoverCard.Target>
                          <HoverCard.Dropdown className='bg-white'>
                            <Text className='text-center'>Ẩn tài khoản?</Text>
                          </HoverCard.Dropdown>
                        </HoverCard>
                      </Group>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <div className='lg:col-span-2 lg:col-start-4'>
            <div className='p-10 rounded bg-white shadow-sm'>
              <div className='flex justify-between items-center p-4'>
                <div className='text-2xl text-gray-800'>Đăng nhập</div>
                <div className='flex items-center space-x-4'>
                  {/* Login with QR code */}
                  <div className='bg-cyan-300 p-3 border-2 text-sm border-cyan-800 rounded-sm relative'>
                    Login với mật khẩu
                    <div className='absolute top-1/2 transform -translate-y-1/2 right-0 translate-x-full'>
                      <div className='w-0 h-0 border-l-[14px] border-transparent border-l-cyan-800 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent'>
                        <div className='absolute inset-0 w-0 h-0 border-l-[12px] border-transparent border-l-cyan-300 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent'></div>
                      </div>
                    </div>
                  </div>
                  <div
                    className='p-2 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300 transition-all'
                    onClick={() => {
                      setislogginWithQrCode(true)
                    }}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth='1.5'
                      stroke='currentColor'
                      className='size-6'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25'
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <Modal opened={opened} onClose={closeModel1} title='How to do QR scan?'>
                <div className='flex flex-col items-center p-4'>
                  <img
                    src='https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/27eb1bc4f61803e6.png'
                    alt='QR Scan Illustration'
                    className='w-full h-full mb-4 rounded-md shadow-md'
                  />
                  <div className='text-center text-gray-700 font-medium'>
                    Nhấn vào biểu tượng quyét mã của ứng dụng ShupperShop để mở chức năng quyét mã
                  </div>
                </div>
              </Modal>

              <div className='flex flex-col items-center space-x-4 p-4 bg-white rounded-lg shadow-md'>
                {/*QR code scanner Component*/}
                <br />
                <QrCode
                  value={qrCodeGenerator(deviceInfo)}
                  handleRefreshQrCode={() => handleRefreshQrCode}
                  containLogo={true}
                  code={code}
                />
                <br />
                <div className='text-lg font-semibold text-gray-700'>Scan QR code with ShupperShop App</div>
                <div className='text-blue-600 font-medium cursor-pointer text-blue' onClick={openModel1}>
                  How To Scan
                </div>
              </div>
              <div className='flex items-center justify-between mt-6 mb-6'>
                <hr className='w-4/12 border-gray-300' />
                <span className='text-gray-500 text-md'>Hoặc</span>
                <hr className='w-4/12 border-gray-300' />
              </div>
              <div className='flex space-x-2 mt-2'>
                <Link
                  to={'/'}
                  className='flex items-center justify-center w-full py-2 border border-gray-300 rounded hover:bg-gray-100 cursor-pointer'
                  onClick={handleFacebookRequestAuthorization}
                >
                  <img src={facebookSvg} alt='Facebook' className='w-7 h-7' />
                  <span className='ml-1 text-gray-700 text-md'>Facebook</span>
                </Link>
                <Link
                  to={'/'}
                  className='flex items-center justify-center w-full py-2 border border-gray-300 rounded hover:bg-gray-100 cursor-pointer'
                  onClick={handleGoogleRequestAuthorization}
                >
                  <img src={googleSvg} alt='Google' className='w-7 h-7' />
                  <span className='ml-1 text-gray-700 text-md'>Google</span>
                </Link>
              </div>
              <div className='mt-3'>
                <Button
                  type='submit'
                  className='flex items-center justify-center w-full text-center py-4 px-2 uppercase bg-blue text-white text-sm hover:bg-cyan-400'
                  isLoading={loginMutation.isPending}
                  disabled={loginMutation.isPaused}
                >
                  Đăng nhập
                </Button>
              </div>
              <div className='mt-8 text-center'>
                <div className='flex items-center justify-center'>
                  <span className='text-gray-400'>Bạn chưa có tài khoản?</span>
                  <Link to={'/register'} className='text-red-400 ml-1'>
                    Đăng ký
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
