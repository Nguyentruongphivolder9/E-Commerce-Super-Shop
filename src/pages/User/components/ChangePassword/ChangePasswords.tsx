import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { profile } from 'console';
import { omit } from 'lodash';
import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { ErrorResponse } from 'react-router-dom';
import { toast } from 'react-toastify';
import userApi from 'src/apis/user.api';
import Input from 'src/components/Input';
import Stepper from 'src/components/Stepper';
import { AppContext } from 'src/contexts/app.context';
import { User } from 'src/types/user.type';
import { userSchema, UserSchema } from 'src/utils/rules';

type FormData = Pick<UserSchema, 'new_password' | 'confirm_password'>
const passwordSchema = userSchema.pick(['new_password', 'confirm_password'])
export type ChangePasswordProps = {
    current_step: number;
    steps: number;
    is_complete: boolean;
    goToNextStep: () => void;
    goToPrevStep: () => void;
    userProfile?: User | null
}
function ChangePasswords({ current_step, steps, is_complete, goToNextStep, goToPrevStep }: ChangePasswordProps) {
    const { profile } = useContext(AppContext);
    return (
        <>
            <div className='rounded-lg bg-white px-2 md:px-7 pb-12 shadow m-1'>
                {current_step == 1 && (
                    <ChooseVerificationMethod
                        current_step={current_step}
                        steps={steps}
                        is_complete={is_complete}
                        goToNextStep={goToNextStep}
                        goToPrevStep={goToPrevStep}
                        userProfile={profile}
                    />
                )}
                {current_step == 2 && (
                    ChangePasswordMethod()
                )}
            </div >

            <div className='rounded-lg mt-4 p-6 bg-white shadow-lg flex m-1'>
                <b className='text-2xl text-gray-800 w-[40%] mt-auto mb-auto'>Security Check</b>
                <div className='flex flex-col'>
                    <div className='flex flex-col space-y-4'>
                        <div className='text-gray-700'>
                            <p className='font-semibold'>Q: Why am I asked to verify my account?</p>
                            <p>A: Your account security is important to us. Shopee asks for additional verification to ensure that no one but you can access your account.</p>
                        </div>
                        <div className='text-gray-700'>
                            <p className='font-semibold'>Q: What can I do if I am unable to verify my account?</p>
                            <p>A: Please contact Shopee Customer Service for assistance with logging in to your account.</p>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

export default ChangePasswords;


const ChooseVerificationMethod = ({ current_step, steps, is_complete, goToNextStep, goToPrevStep, userProfile }: ChangePasswordProps) => {
    return (
        <>
            <div className='flex flex-col'>
                <div className='justify-center flex pt-10'>
                    <svg aria-hidden="true" width="100" height="100" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.348 54.153c-8.05-16.329-5.904-41.708-5.904-41.708 22.053.65 34.686-7.268 34.686-7.268v70.306c-13.094-5.7-20.277-11.185-20.277-11.185-5.076-3.943-8.505-10.145-8.505-10.145zM40.131 5.177s12.633 7.918 34.685 7.268c0 0 2.145 25.38-5.904 41.708 0 0-3.43 6.202-8.505 10.145 0 0-7.183 5.485-20.276 11.184V5.177z" fill="url(#paint0_linear)"></path>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M69.355 16.767c-18.593.548-29.245-6.127-29.245-6.127v59.277c11.04-4.806 17.097-9.43 17.097-9.43 4.279-3.325 7.17-8.554 7.17-8.554 6.787-13.768 4.978-35.166 4.978-35.166z" fill="#E0F7FF"></path>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.865 16.767s-1.809 21.398 4.978 35.166c0 0 2.891 5.23 7.17 8.554 0 0 6.057 4.624 17.097 9.43V10.64s-10.652 6.675-29.245 6.127z" fill="#fff"></path>
                        <path d="M51.808 29.967a2.273 2.273 0 113.334 3.09l-14.85 16.02c-.4.43-1.077.444-1.493.028l-1.749-1.75a1.037 1.037 0 01-.027-1.437l14.785-15.951z" fill="#2D9CFF"></path>
                        <path d="M28.377 36.8a2.27 2.27 0 013.105-.098l9.48 8.35a2.27 2.27 0 11-3 3.406l-9.48-8.349a2.27 2.27 0 01-.105-3.309z" fill="#2D9CFF"></path>
                        <defs>
                            <linearGradient id="paint0_linear" x1="5.185" y1="5.177" x2="5.185" y2="75.483" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#2D9CFF"></stop>
                                <stop offset="1" stop-color="#1E90FF"></stop>
                            </linearGradient>
                        </defs>
                    </svg>

                </div>

                <div className="flex flex-col justify-center font-medium text-lg text-center p-4">
                    <p className="text-gray-600 text-lg mb-9 leading-relaxed w-full max-w-md text-center mx-auto">
                        Để bảo vệ thông tin tài khoản của bạn, xin hãy chọn một trong những phương thức xác thực dưới đây.
                    </p>

                    <div className="flex justify-between space-x-4">
                        <div className="border border-gray-300 rounded-lg w-[40%] pt-5 pb-5 hover:bg-blue-50 hover:border-blue-300 shadow-lg transition transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:cursor-pointer">
                            <div className="flex space-x-5 items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="#3DB1FF" className="w-8 h-8 mb-2 ml-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                </svg>
                                <p className="text-gray-700 font-semibold">Xác thực bằng Gmail</p>
                            </div>
                        </div>

                        <div className="border border-gray-300 rounded-lg w-[40%] pt-5 pb-5 hover:bg-blue-50 hover:border-blue-300 shadow-lg transition transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:cursor-pointer"
                            onClick={() => {
                                if (typeof userProfile?.phoneNumber === "undefined") {
                                    toast.error("Tài khoản này hiện không có số điện thoại. Hãy thêm ở trang thông tin tài khoản")
                                }
                            }}>
                            <div className="flex space-x-5 items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="#3DB1FF" className="w-8 h-8 mb-2 ml-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75v-4.5m0 4.5h4.5m-4.5 0 6-6m-3 18c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 0 1 4.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 0 0-.38 1.21 12.035 12.035 0 0 0 7.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 0 1 1.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 0 1-2.25 2.25h-2.25Z" />
                                </svg>
                                <p className="text-gray-700 font-semibold">Xác thực bằng OTP</p>
                            </div>
                        </div>
                    </div>

                </div>


            </div>

        </>
    )
}

const ChangePasswordMethod = () => {

    const {
        register,
        formState: { errors },
        handleSubmit,
        setError,
        reset
    } = useForm<FormData>({
        defaultValues: {
            new_password: '',
            confirm_password: ''
        },
        resolver: yupResolver(passwordSchema)
    })

    const updateProfileMutation = useMutation({
        mutationFn: userApi.updateProfile
    })

    const onSubmit = handleSubmit(async (data) => {
        //   try {
        //     const res = await updateProfileMutation.mutateAsync(omit(data, ['confirm_password']))
        //     toast.success(res.data.message)
        //     reset()
        //   } catch (error) {
        //     console.log(error)
        //     if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
        //       const formError = error.response?.data.data
        //       if (formError) {
        //         Object.keys(formError).forEach((key) => {
        //           setError(key as keyof FormData, {
        //             message: formError[key as keyof FormData],
        //             type: 'Server'
        //           })
        //         })
        //       }
        //     }
        //   }
    })
    return (
        <>
            <div className='border-b text-center md:text-left border-b-gray-200 py-6'>
                <h1 className='text-lg font-medium capitalize text-gray-900'>Đổi mật khẩu</h1>
                <div className='mt-1 text-sm text-gray-700'>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
            </div>
            <form className='mt-8 mr-auto max-w-2xl' onSubmit={onSubmit}>
                <div className='mt-6 flex-grow md:pr-12 md:mt-0'>
                    <div className='mt-2 flex flex-wrap flex-col sm:flex-row'>
                        <div className='sm:w-[20%] truncate pt-3 capitalize'>Mật khẩu cũ</div>
                        <div className='sm:w-[80%] sm:pl-5'>
                            <Input
                                classNameInput='px-3 py-2 w-full rounded-sm outline-none border border-gray-300 focus:border-gray-500 focus:shadow-sm'
                                register={register}
                                name='password'
                                type='password'
                                placeholder='Mật khẩu cũ'
                            //   errorMessage={errors.password?.message}
                            />
                        </div>
                    </div>

                    <div className='mt-2 flex flex-wrap flex-col sm:flex-row'>
                        <div className='sm:w-[20%] truncate pt-3 capitalize'>Mật khẩu mới</div>
                        <div className='sm:w-[80%] sm:pl-5'>
                            <Input
                                classNameInput='px-3 py-2 w-full rounded-sm outline-none border border-gray-300 focus:border-gray-500 focus:shadow-sm'
                                className='relative'
                                register={register}
                                name='new_password'
                                type='password'
                                placeholder='Mật khẩu mới'
                                errorMessage={errors.new_password?.message}
                            />
                        </div>
                    </div>

                    <div className='mt-2 flex flex-wrap flex-col sm:flex-row'>
                        <div className='sm:w-[20%] truncate pt-3 capitalize'>Nhập lại mật khẩu</div>
                        <div className='sm:w-[80%] sm:pl-5'>
                            <Input
                                classNameInput='px-3 py-2 w-full rounded-sm outline-none border border-gray-300 focus:border-gray-500 focus:shadow-sm'
                                className='relative'
                                register={register}
                                name='confirm_password'
                                type='password'
                                placeholder='Nhập lại mật khẩu'
                                errorMessage={errors.confirm_password?.message}
                            />
                        </div>
                    </div>

                    <div className='mt-2 flex flex-wrap flex-col sm:flex-row'>
                        <div className='sm:w-[20%] truncate pt-3 capitalize'></div>
                        <div className='sm:w-[80%] sm:pl-5'>
                            <Button
                                className='flex items-center h-9 bg-orange px-5 text-center text-sm text-white hover:bg-orange/80'
                                type='submit'
                            >
                                Lưu
                            </Button>
                        </div>
                    </div>
                </div>
            </form></>

    )
}