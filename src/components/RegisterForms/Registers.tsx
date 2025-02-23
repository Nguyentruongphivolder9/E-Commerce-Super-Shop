import React, { useContext, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import Input from '../Input/Input';
import Button from '../Button/Button';
import { userSchema, schema, Schema, UserSchema } from '../../utils/rules';
import authApi, { FinalRegisterForm } from '../../apis/auth.api';
import google from "../../assets/logoSvg/googleSvg.svg";
import facebook from "../../assets/logoSvg/faceBookSvg.svg";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User } from 'src/types/user.type';
import { parseJwt } from 'src/utils/auth';
import planeGif from '../../assets/gifs/plane.gif';
import { AppContext } from 'src/contexts/app.context';
import useDeviceInfo, { DeviceInfo } from 'src/hooks/useDeviceInfo';
import Bowser from 'bowser';


type FormData = Pick<Schema, 'email' | 'password'> & { setUpdate?: string };
const emailVerification = schema.pick(['email']);
type FormDataEmail = Pick<Schema, 'email'>;
const userRegister = userSchema.pick(['user_name', 'full_name', 'gender', 'phone_number', 'email', 'birth_day', 'new_password', 'confirm_password'])
export type FormDataRegister = Pick<UserSchema, 'user_name' | 'full_name' | 'gender' | 'phone_number' | 'email' | 'birth_day' | 'new_password' | 'confirm_password'>;
export type FormWaitingForEmailVerify = {
    email: string;
    token: string | undefined;
}


type SubRegisterProps = {
    current_step: number;
    steps: number;
    is_complete: boolean;
    goToNextStep: () => void;
    goToPrevStep: () => void;
    handleSetEmail?: React.Dispatch<React.SetStateAction<FormDataEmail>>;
    email?: FormDataEmail;
    is_form_completed?: boolean;
    handleSetIsFormCompleted?: React.Dispatch<React.SetStateAction<boolean>>;
    userInfor?: FormDataRegister;
    handleSetUserInfo?: React.Dispatch<React.SetStateAction<FormDataRegister>>;
    verifyToken?: string;
    handleSetVeifyToken?: React.Dispatch<React.SetStateAction<string>>;
    handleSetIsAuthenticated?: React.Dispatch<React.SetStateAction<boolean>>;
    handleSetProfile?: React.Dispatch<React.SetStateAction<User | null>>;
    profile?: User | null;
    handleSetIsWaitingForRegistration?: React.Dispatch<React.SetStateAction<boolean>>
    deviceInfo?: DeviceInfo
};



function Registers({ current_step, steps, is_complete, goToNextStep, goToPrevStep }: SubRegisterProps) {
    //Register với Google 
    const { deviceInfo } = useDeviceInfo();
    const googleRequestAuthorizationUrlMutation = useMutation({
        mutationFn: () => authApi.requestGoogleAuthorizationUrl(),
        onSuccess: (data) => {
            const authorizationUrl = data.data.body.Url;
            window.location.href = authorizationUrl;
        },
        onError: (error) => {
            console.log(error);
        }
    });

    const handleGoogleRequestAuthorization = async () => {
        try {
            await googleRequestAuthorizationUrlMutation.mutateAsync();
        } catch (error) {
            console.error('Error requesting Google authorization URL:', error);
        }
    };
    const { setIsAuthenticated, setProfile, profile } = useContext(AppContext);
    const [email, setEmail] = useState<FormDataEmail>({
        email: ''
    });
    const [userInfo, setUserInfo] = useState<FormDataRegister>({
        user_name: "",
        full_name: "",
        gender: "",
        phone_number: "",
        email: email.email,
        birth_day: new Date(),
        new_password: "",
        confirm_password: ""
    })
    const [verifyToken, setVerifyToken] = useState<string>("");
    const [isVerifyEmailCompleted, setIsVerifyEmailCompleted] = useState<boolean>(false);
    const [isWaitingForEmailResponse, setIsWaitingForEmailResponse] = useState<boolean>(false);
    const [isUserInforCompleted, setIsUserInforCompleted] = useState<boolean>(false);
    const [isWaitingForRegistration, setIsWaitingForRegistration] = useState<boolean>(false);
    return (
        <>
            <h2 className="text-2xl mb-4">Đăng ký</h2>
            {current_step === 1 && (
                <TypingEmail
                    goToNextStep={goToNextStep}
                    goToPrevStep={goToPrevStep}
                    current_step={current_step}
                    steps={steps}
                    //Attribute của riếng form
                    handleSetEmail={setEmail}
                    is_complete={is_complete}
                    email={email}
                    handleSetVeifyToken={setVerifyToken}
                    is_form_completed={isVerifyEmailCompleted}
                    handleSetIsFormCompleted={setIsVerifyEmailCompleted}
                />
            )}
            {current_step === 2 && (
                <WaitingEmailVerifyCation
                    goToNextStep={goToNextStep}
                    goToPrevStep={goToPrevStep}
                    current_step={current_step}
                    steps={steps}
                    //Attributes cuar rieeng form
                    verifyToken={verifyToken}
                    handleSetEmail={setEmail}
                    email={email}
                    is_complete={is_complete}
                    is_form_completed={isWaitingForEmailResponse}
                    handleSetIsFormCompleted={setIsWaitingForEmailResponse}
                    handleSetUserInfo={setUserInfo}
                />
            )}
            {current_step === 3 && (
                <UserInformation
                    goToNextStep={goToNextStep}
                    goToPrevStep={goToPrevStep}
                    current_step={current_step}
                    is_complete={is_complete}
                    steps={steps}
                    //Attributes của riêng form.
                    email={email}
                    userInfor={userInfo}
                    handleSetUserInfo={setUserInfo}
                    handleSetIsFormCompleted={setIsUserInforCompleted}
                    is_form_completed={isUserInforCompleted}
                />
            )}
            {current_step === 4 && (
                <WatingForVerifyCation
                    goToNextStep={goToNextStep}
                    goToPrevStep={goToPrevStep}
                    current_step={current_step}
                    is_complete={is_complete}
                    steps={steps}
                    //Attribute của riêng form
                    deviceInfo={deviceInfo}
                    handleSetIsAuthenticated={setIsAuthenticated}
                    handleSetProfile={setProfile}
                    profile={profile}
                    userInfor={userInfo}
                    is_form_completed={isWaitingForRegistration}
                    handleSetIsFormCompleted={setIsWaitingForRegistration}
                />
            )}
            <div className="flex items-center justify-between mt-6 mb-6">
                <hr className="w-4/12 border-gray-300" />
                <span className="text-gray-500 text-md">Hoặc</span>
                <hr className="w-4/12 border-gray-300" />
            </div>

            <div className="flex space-x-2 mt-2">
                <button className="flex items-center justify-center w-full py-2 border border-gray-300 rounded hover:bg-gray-100">
                    <img src={facebook} alt="Facebook" className="w-7 h-7" />
                    <span className="ml-1 text-gray-700 text-md">Facebook</span>
                </button>
                <a
                    className='flex items-center justify-center w-full py-2 border border-gray-300 rounded hover:bg-gray-100 cursor-pointer'
                    onClick={handleGoogleRequestAuthorization}
                >
                    <img src={google} alt='Google' className='w-7 h-7' />
                    <span className='ml-1 text-gray-700 text-md'>Google</span>
                </a>
            </div>

            <div className='mt-8 text-center'>
                <div className='flex items-center justify-center'>
                    <span className='text-gray-400'>Bạn đã có tài khoản?</span>
                    <Link to={'/login'} className='text-red-400 ml-1'>
                        Đăng nhập
                    </Link>
                </div>
            </div>
        </>
    );
}

export default Registers;




const UserInformation = ({ current_step, steps, is_complete, goToNextStep, goToPrevStep, userInfor, handleSetUserInfo, is_form_completed, handleSetIsFormCompleted }: SubRegisterProps) => {
    const { register, handleSubmit, formState: { errors }, setValue, getValues } = useForm<FormDataRegister>({
        resolver: yupResolver(userRegister),
        defaultValues: userInfor
    });
    const [birthDateValue, setBirthDayValue] = useState<Date | null>(new Date());
    const [selectedGender, setSelectedGender] = useState<string>(userInfor?.gender || '');
    const handleGenderSelect = (gender: string) => {
        setSelectedGender(gender);
        if (handleSetUserInfo && typeof gender !== 'undefined') {
            handleSetUserInfo(prev => ({ ...prev, gender }));
            setValue('gender', gender, { shouldValidate: true });
        }
    };
    const userInforMutation = useMutation({
        mutationFn: async (body: FormDataRegister) => {
            const { birth_day, confirm_password, phone_number, ...rest } = body;
            const dataToSend: FinalRegisterForm = {
                ...rest,
                password: body.new_password,
                phone_number: phone_number.toString(),
                birth_day: birth_day.toISOString()
            };
            return await authApi.registerAccount(dataToSend);
        }
    });
    const onSubmit = handleSubmit((data: FormDataRegister) => {
        const passwordToSave: string = data.new_password;
        const emailToSend: string | undefined = data.email;
        userInforMutation.mutate(data, {
            onSuccess: (data) => {
                const userResponse: User = parseJwt(data.data.body.accessToken);
                const {
                    avatarUrl,
                    email,
                    fullName,
                    gender,
                    isActive,
                    phoneNumber,
                    userName,
                    role,
                    birthDay,
                    ...rest
                } = userResponse;

                handleSetUserInfo?.({
                    user_name: userName,
                    full_name: fullName,
                    gender: gender,
                    phone_number: phoneNumber,
                    email: emailToSend,
                    birth_day: birthDay,
                    new_password: passwordToSave,
                    confirm_password: ""
                });

                handleSetIsFormCompleted?.(true);
                goToNextStep();
            },
            onError: (error: any) => {
                toast.error(`Error: ${error.message}`);
            }
        });
    });
    useEffect(() => {
        if (birthDateValue !== null && !isNaN(new Date(birthDateValue).getTime())) {
            setValue('birth_day', birthDateValue);
        }
    }, [birthDateValue]);


    return (
        <>
            <form className="bg-white pb-4 rounded-2" onSubmit={onSubmit} noValidate>
                <label className="text-gray-500 text-md font-semibold block mt-6 -mb-5">Họ tên đầy đủ : <b className='text-red-500'>(*)</b></label>
                <Input
                    name='full_name'
                    register={register}
                    type='text'
                    className='mt-6'
                    errorMessage={errors.full_name?.message}
                    placeholder='Nhập họ tên đầy đủ'
                />
                <label className="text-gray-500 text-md font-semibold block mt-6 -mb-5">Tên tài khoản : <b className='text-red-500'>(*)</b></label>
                <Input
                    name='user_name'
                    register={register}
                    type='text'
                    className='mt-6'
                    errorMessage={errors.user_name?.message}
                    placeholder='Nhập tên tài khoản'
                />

                <label className="text-gray-500 text-md font-semibold block mt-6 -mb-5">Số điện thoại : <b className='text-red-500'>(*)</b></label>

                <Input
                    name='phone_number'
                    register={register}
                    type='text'
                    className='mt-6'
                    errorMessage={errors.phone_number?.message}
                    placeholder='Nhập số điện thoại của bạn'
                />
                <label className="text-gray-500 text-md font-semibold block mt-6 -mb-5">Mật khẩu : <b className='text-red-500'>(*)</b></label>
                <Input
                    name='new_password'
                    register={register}
                    type='password'
                    className='mt-6'
                    errorMessage={errors.new_password?.message}
                    placeholder='Nhập mật khẩu của bạn'
                />
                <Input
                    name='confirm_password'
                    register={register}
                    type='password'
                    className='mt-6'
                    errorMessage={errors.confirm_password?.message}
                    placeholder='Nhập lại mật khẩu của bạn'
                />
                <label className="text-gray-500 text-md font-semibold block mt-6 -mb-5">Ngày sinh nhật : <b className='text-red-500'>(*)</b></label>
                <Input
                    handleSetBirthDateValue={setBirthDayValue}
                    name='birth_day'
                    register={register}
                    type='date'
                    className='mt-6'
                    errorMessage={errors.birth_day?.message}
                />
                <label className="text-gray-500 text-md font-semibold block mt-6 -mb-5">
                    Giới tính : <b className="text-red-500">(*)</b>
                </label>
                <div className="flex mt-6 justify-between">
                    <div
                        className={`flex items-center rounded-md p-3 w-full m-4 cursor-pointer transition-colors duration-300 ease-in-out ${selectedGender === 'male' ? 'bg-cyan-400 text-white' : 'bg-gray-300 text-black'
                            }`}
                        onClick={() => handleGenderSelect('male')}
                    >
                        <label className="font-bold ml-3">
                            Nam
                        </label>
                        <Input
                            name="gender"
                            register={register}
                            type="radio"
                            value="male"
                            errorMessage={errors.gender?.message}
                            className="hidden"
                        />
                    </div>
                    <div
                        className={`flex items-center rounded-md p-3 w-full m-4 cursor-pointer transition-colors duration-300 ease-in-out ${selectedGender === 'female' ? 'bg-pink-500 text-white' : 'bg-gray-300 text-black'
                            }`}
                        onClick={() => handleGenderSelect('female')}
                    >
                        <label className="font-bold ml-3">
                            Nữ
                        </label>
                        <Input
                            name="gender"
                            register={register}
                            type="radio"
                            value="female"
                            errorMessage={errors.gender?.message}
                            className="hidden"
                        />
                    </div>
                    <div>{errors.gender?.message}</div>
                </div>

                <Button
                    type='submit'
                    className='flex items-center justify-center w-full text-center py-2 px-2 uppercase bg-blue text-white text-sm hover:bg-cyan-400 mr-2 mt-10'
                >
                    Xác nhận tài khoản
                </Button>
                <div className='flex justify-between'>
                    <Button
                        className='flex items-center justify-center w-full text-center py-2 px-2 uppercase bg-blue text-white text-sm hover:bg-cyan-400 mr-2 mt-10'
                        disabled={is_form_completed === false}
                    >
                        Tiếp theo
                    </Button>
                    <Button
                        onClick={goToPrevStep}
                        className='flex items-center justify-center w-full text-center py-2 px-2 uppercase bg-blue text-white text-sm hover:bg-cyan-400  ml-2 mt-10'
                        disabled={current_step === 1}
                    >
                        Quay về
                    </Button>
                </div>
            </form>
        </>
    );
}



const WatingForVerifyCation = ({ handleSetIsAuthenticated, handleSetProfile, userInfor, is_form_completed, handleSetIsWaitingForRegistration, deviceInfo }: SubRegisterProps) => {
    const navigate = useNavigate();
    const [isDeviceInfoUpdated, setIsDeviceInfoUpdated] = useState<boolean>(false);

    const setDeviceInfoMutation = useMutation({
        mutationFn: (body: { deviceInfo: DeviceInfo, email: string }) => authApi.assignDeviceToAccount(body),
        onSuccess: (data) => {
            if (data.data.body) {
                setIsDeviceInfoUpdated(true);
            }
        },
        onError: () => {
            toast.error("Đã có lỗi trong quá trình đăng ký, vui lòng thử lại sau giây lát.");
        }
    });

    const loginMutation = useMutation({
        mutationFn: (body: { email: string; password: string }) => authApi.login({ email: body.email, password: body.password, setUpdate: "No" }),
        onSuccess: (data) => {
            handleSetIsAuthenticated?.(true);
            const userProfile = parseJwt(data.data.body.accessToken);
            handleSetProfile?.(userProfile);
            handleSetIsWaitingForRegistration?.(true);
            toast.success("Đăng kí tài khoản thành công.");
            navigate('/');
        },
        onError: () => {
            toast.error("Đã có lỗi trong quá trình đăng ký, vui lòng thử lại sau giây lát.");
        }
    });

    useEffect(() => {
        if (isDeviceInfoUpdated && userInfor?.email && userInfor?.new_password) {
            loginMutation.mutate({ email: userInfor.email, password: userInfor.new_password });
        }
    }, [isDeviceInfoUpdated]);

    useEffect(() => {
        if (userInfor?.new_password && userInfor?.email) {
            const dataDevice = {
                deviceInfo: deviceInfo!,
                email: userInfor.email
            };
            setDeviceInfoMutation.mutate(dataDevice);
        }
    }, [userInfor]);

    return (
        <>
            {!is_form_completed ? (
                <div className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg shadow-md">
                    <img src={planeGif} alt="Loading" className="w-60 h-40 mb-4 rounded-lg" />
                    <p className="text-lg font-semibold mb-4 text-center">Tài khoản đang được xác thực...</p>
                    <p className="text-sm text-center">Vui lòng đợi trong giây lát</p>
                </div>
            ) : (
                <div className="bg-green-500 p-6 rounded-lg shadow-lg text-center">
                    <svg className="animate-bounce mx-auto w-20 h-20 bg-white rounded-full text-green-500 p-3 shadow-md" fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="16" stroke="currentColor" strokeWidth="12" fill="none" />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            stroke="currentColor"
                            d="M8 12l4 3 5-8"
                        />
                    </svg>
                    <div className="bg-white w-full rounded-lg p-4 mt-4">
                        <p className="text-lg text-green-500 font-semibold">Tài khoản đăng kí thành công</p>
                        <p className="text-sm text-green-500">Chuyển hướng về trang trước đó...</p>
                    </div>
                </div>
            )}
        </>
    );
};



const TypingEmail = ({ current_step, steps, is_complete, goToNextStep, goToPrevStep, handleSetEmail, email, is_form_completed, handleSetIsFormCompleted, handleSetVeifyToken }: SubRegisterProps) => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormDataEmail>({
        resolver: yupResolver(emailVerification),
        defaultValues: email
    });

    const emailVerificationMutation = useMutation({
        mutationFn: async (body: FormDataEmail) => await authApi.verifyEmail(body)
    });
    const onSubmit = handleSubmit((data) => {
        if (handleSetEmail && typeof data !== 'undefined') {
            handleSetEmail(data);
            emailVerificationMutation.mutate(data, {
                onSuccess: (data) => {
                    toast.success(`${data.data.message}`);
                    handleSetVeifyToken?.(data.data.body);
                    handleSetIsFormCompleted?.(true);
                    goToNextStep();
                },
                onError: () => {
                    toast.error("Đã có tài khoản đăng ký với email này")
                }
            });
        }


    })
    return (<>
        <form className="bg-white pb-4 rounded-2" onSubmit={onSubmit} noValidate>
            <Input
                name='email'
                register={register}
                type='email'
                className='mt-6'
                errorMessage={errors.email?.message}
                placeholder='Nhập Email của bạn'
            />
            <div className='mt-4'>
                <Button
                    type='submit'
                    className='flex items-center justify-center w-full text-center py-2 px-2 uppercase bg-blue text-white text-sm hover:bg-cyan-400'
                >
                    Gửi Email xác nhận
                </Button>
            </div>
            <div className='flex justify-between'>
                <Button
                    onClick={goToNextStep}
                    className='flex items-center justify-center w-full text-center py-2 px-2 uppercase bg-blue text-white text-sm hover:bg-cyan-400 mr-2 mt-10'
                    disabled={is_form_completed === false}
                >
                    Tiếp theo
                </Button>
                <Button
                    onClick={goToPrevStep}
                    className='flex items-center justify-center w-full text-center py-2 px-2 uppercase bg-blue text-white text-sm hover:bg-cyan-400  ml-2 mt-10'
                    disabled={current_step === 1}
                >
                    Quay về
                </Button>
            </div>
        </form>

    </>)
}

const WaitingEmailVerifyCation = ({ current_step, steps, is_complete, goToNextStep, goToPrevStep, email, handleSetIsFormCompleted, handleSetEmail, is_form_completed, verifyToken, handleSetUserInfo }: SubRegisterProps) => {
    const waitingForEmailResponseMutation = useMutation({
        mutationFn: async (body: FormWaitingForEmailVerify) => await authApi.waitingForEmailResponse(body)
    });

    useEffect(() => {
        if (!is_form_completed && email?.email) {
            const interval = setInterval(async () => {
                try {
                    const data: FormWaitingForEmailVerify = { email: email?.email ?? "", token: verifyToken };
                    await waitingForEmailResponseMutation.mutateAsync(data, {
                        onSuccess: (data) => {
                            if (data.data.body === true) {
                                clearInterval(interval);
                                handleSetIsFormCompleted?.(true);
                                handleSetEmail?.(email);
                                handleSetUserInfo?.((prevUserInfo) => ({
                                    ...prevUserInfo,
                                    email: email.email
                                }));
                                goToNextStep();
                            }
                        },
                        onError: (error) => {
                            toast.error(`${error.message}`);
                        }
                    });
                } catch (error) {
                    console.error('API call failed:', error);
                }
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [email, is_form_completed, handleSetIsFormCompleted, handleSetEmail, goToNextStep, verifyToken, waitingForEmailResponseMutation]);

    return (
        <div className="verification-container bg-gray-100 p-6 shadow-lg max-w-md mx-auto mt-10">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Kiểm tra hòm thư của bạn</h2>
            {is_form_completed === false ? (<><div className="flex items-center justify-center mb-6">
                <button
                    type='button'
                    className='inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow text-white bg-red-500 hover:bg-red-400 transition ease-in-out duration-150 cursor-not-allowed'
                >
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Chờ đợi xác thực từ bạn...
                </button>
            </div>
                <ul className="text-center list-disc text-gray-700 bg-green-100 rounded-lg p-6">
                    <li className="mb-4">
                        Hãy vào Gmail <a href={`https://mail.google.com/mail/u/0/#inbox`} className='underline font-semibold text-indigo-700' target="_blank" >{email?.email}</a> và ấn vào nút xác nhận được đính kèm bên trong thư.
                    </li>
                    <li className="mb-4">
                        Nếu bạn không thấy email xác nhận, hãy nhấn
                    </li>
                    <a
                        className='py-2 px-4 uppercase bg-blue text-white text-sm font-medium hover:bg-cyan-400 inline-block'
                        href='/anhtien'>
                        Gửi lại
                    </a>
                </ul></>) : (
                <>
                    <div className="bg-green-500 p-6 rounded-lg shadow-lg text-center">
                        <svg className="animate-bounce mx-auto w-20 h-20 bg-white rounded-full text-green-500 p-3 shadow-md" fill="none" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="16" stroke="currentColor" strokeWidth="12" fill="none" />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="3"
                                stroke="currentColor"
                                d="M8 12l4 3 5-8"
                            />
                        </svg>
                        <div className="bg-white w-full rounded-lg p-4 mt-4">
                            <p className="text-lg text-green-500 font-semibold">Xác thực Email đã hoàn thành</p>
                            <p className="text-sm text-green-500">Bạn có thể qua bước tiếp theo</p>
                        </div>
                    </div>

                </>
            )}
            <div className="flex justify-between pt-7">
                <Button
                    onClick={goToNextStep}
                    disabled={is_form_completed === false}
                    className={`flex items-center justify-center w-full text-center py-3 px-5 uppercase bg-blue text-white text-sm font-medium hover:bg-cyan-400 mr-2`}
                >
                    Tiếp theo
                </Button>
                <Button
                    onClick={goToPrevStep}
                    className="flex items-center justify-center w-full text-center py-3 px-5 uppercase bg-blue text-white text-sm font-medium hover:bg-cyan-400 ml-2 "
                >
                    Quay về
                </Button>
            </div>
        </div>
    )
}