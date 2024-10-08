import ModalChanger from 'src/components/AvatarChanger/ModelChanger';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from 'src/contexts/app.context';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from 'src/components/Input';
import { userSchema, UserSchema } from 'src/utils/rules';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import authApi, { FormUserInfoUpdate } from 'src/apis/auth.api';
import { toast } from 'react-toastify';
import { parseJwt } from 'src/utils/auth';
import useDeviceInfo, { DeviceInfo } from 'src/hooks/useDeviceInfo';

const updateUserSchema = userSchema.pick(["user_name", "full_name", "birth_day", "email", "gender", "phone_number"]);

export default function Profile() {
  const { isAuthenticated, setIsAuthenticated, profile, setProfile } = useContext(AppContext);
  const [closeModal, setCloseModal] = useState<boolean>(true);
  const {deviceInfo} = useDeviceInfo();
  const [birthDateValue, setBirthDayValue] = useState<Date | null>(new Date());
  const [avatarDetail, setAvatarDetail] = useState<File>();
  //Context for avatar IMG
  const [avatarUrl, setAvatarUrl] = useState<string>(profile?.avatarUrl ? profile?.avatarUrl : "");
  const handleCutUpEmail = (email?: string): string => {
    if (typeof email === 'string') {
      let result: string = "";
      const skipElements = [2, 3, 4, 5, 6, 7, 8];
      const emailNamePart = email.slice(0, email.indexOf('@'));
      const emailDomainPart = email.slice(email.indexOf('@'));

      for (let i = 0; i < emailNamePart.length; i++) {
        if (skipElements.includes(i)) {
          result += "*";
        } else {
          result += emailNamePart[i];
        }
      }

      return result + emailDomainPart;
    } else {
      return "";
    }
  };



  const [userUpdate, setUserUpdate] = useState<FormUserInfoUpdate>({
    user_name: profile?.userName || "",
    full_name: profile?.fullName || "",
    gender: profile?.gender === "male" ? "Nam" : (profile?.gender === 'female' ? "Nữ" : ""),
    phone_number: profile?.phoneNumber ? profile.phoneNumber : "",
    email: profile?.email ? profile.email : "",
    birth_day: profile?.birthDay ? new Date(profile.birthDay) : new Date(),
  });

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormUserInfoUpdate>({
    resolver: yupResolver(updateUserSchema),
    defaultValues: {
      user_name: userUpdate.user_name,
      full_name: userUpdate.full_name,
      gender: profile?.gender,
      phone_number: userUpdate.phone_number,
      email: userUpdate.email,
      birth_day: userUpdate.birth_day
    }
  });

  const updateUserInfo = useMutation({
    mutationFn: (formUserUpdate: FormUserInfoUpdate) => authApi.updateUserInfo(formUserUpdate),
    onSuccess: (data) => {
      if(data.data.message = "Account updated successfully"){
        toast.success("Cập nhật tài khoản thành công!")
      }
    },
    onError: (error) => {
      toast.error("Cập nhật thông tin người dùng chưa thành công. Hãy thử lại sau ít phút!")
      console.log(error)
    }

  });

  const getFormattedDateAndAge = (dateString: Date) => {
    const birthDate = new Date(dateString);
    if (!isNaN(birthDate.getTime()) && (birthDate.getFullYear() - new Date().getFullYear()) >= 0) {
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return `${birthDate.toLocaleDateString()} (${age} tuổi)`;
    }
    return "_______";
  };

  const urlToFile = async (url: string, filename: string): Promise<File> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  };

  const onSubmit = handleSubmit(async (data) => {
     if (avatarUrl !== profile?.avatarUrl && avatarUrl) {
      try {
        const file = await urlToFile(avatarUrl, 'avatar.jpg');
        setAvatarDetail(file);
        data.avatar = avatarDetail;
        setValue('avatar', avatarDetail);
      } catch (error) {
        console.error('Error creating file from URL:', error);
      }
    }
    updateUserInfo.mutate(data);
  });

  useEffect(() => {
    if (birthDateValue !== null && !isNaN(new Date(birthDateValue).getTime())) {
      setValue('birth_day', birthDateValue);
    }
  }, [birthDateValue]);

  return (
    <div className="rounded-lg shadow-md bg-white px-6 py-8 md:px-8 md:py-10">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Hồ Sơ Của Tôi</h1>
        <p className="mt-1 text-sm text-gray-600">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
      </div>
      <div className="flex flex-col space-y-6 md:flex-row md:space-y-0 md:space-x-6">
        <div className="flex-1 space-y-4">
          <form className='space-y-4' onSubmit={onSubmit}>
            <div>
              <b>Tên đầy đủ</b>
              <p className='text-sm font-extralight text-red-400'>{profile?.fullNameChanges === 1 ? "Số lần thay đổi còn 1" : (profile?.fullNameChanges === 2 ? "Số lần thay đổi tối đa là 2" : "Hết lượt thay đổi")}</p>
              <Input
                rightClearButton
                placeholder="Họ tên đầy đủ của bạn"
                name="full_name"
                register={register}
                rules={{ required: 'Họ tên đầy đủ là bắt buộc' }}
                errorMessage={errors.full_name?.message}
                onChange={(event) => setUserUpdate(prev => ({ ...prev, full_name: event.target.value }))}
              />
            </div>
            <div>
              <b>Tên tài khoản:</b>
              <Input
                rightClearButton
                placeholder="Tên tài khoản của bạn"
                type="text"
                name="user_name"
                register={register}
                rules={{ required: 'Tên tài khoản là bắt buộc' }}
                errorMessage={errors.user_name?.message}
                onChange={(event) => setUserUpdate(prev => ({ ...prev, user_name: event.target.value }))}
              />
            </div>
            <div>
              <b>Địa chỉ Email</b>
              <Input
                valueHolder={handleCutUpEmail(watch('email'))}
                rightClearButton
                placeholder="Email của bạn"
                name="email"
                register={register}
                rules={{ required: 'Email là bắt buộc' }}
                errorMessage={errors.email?.message}
                onChange={(event) => setUserUpdate(prev => ({ ...prev, email: event.target.value }))}
                disabled={true}
              />
            </div>
            <div>
              <b>Số điện thoại</b>
              <Input
                rightClearButton
                placeholder="Số điện thoại của bạn"
                name="phone_number"
                register={register}
                errorMessage={errors.phone_number?.message}
                onChange={(event) => {
                  setUserUpdate(prev => ({ ...prev, phoneNumber: event.target.value }));
                }}
                type="profile_phone_number"
              />
            </div>
            <div>
              <b>Giới tính</b>
              <Input
                type="genderSelect"
                name="gender"
                register={register}
                value={watch('gender')}
                onChange={(e) => setUserUpdate(prev => ({ ...prev, gender: e.target.value }))}
                errorMessage={errors.gender?.message}
              />
            </div>
            <div>
              <b>Ngày sinh</b>
              <Input
                defaultValueForDateInput={profile?.birthDay ? new Date(profile.birthDay) : null}
                handleSetBirthDateValue={setBirthDayValue}
                name="birth_day"
                type='date'
                register={register}
                rules={{ required: 'Ngày sinh là bắt buộc' }}
                errorMessage={errors.birth_day?.message}
              />
            </div>
            <button
              className="border-2 border-green-700 py-2 hover:bg-green-200 px-6 text-slate-800 transition-colors duration-200 bg-green-400"
              type='submit'
            >
              Cập nhật thông tin cá nhân
            </button>
          </form>
        </div>
        <div className="flex-shrink-0 flex items-center">
          <div className="bg-slate-100 h-full rounded-lg p-10 relative border-2 border-black w-full">
            <div className='relative w-48 m-8'>
              <img
                src={avatarUrl}
                className="w-48 h-48 p-2 rounded-full ring-2 ring-gray-200 dark:ring-gray-500 object-cover"
                alt="Profile Avatar"
              />
              <button
                className="border-2 border-black rounded-full bg-blue-500 text-white bg-black transition-colors duration-200 absolute top-3 right-3"
                onClick={() => setCloseModal(!closeModal)}
              >
                <div className='m-1'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 4.828l3.536 3.536m-2.036-5.036a2.25 2.25 0 113.182 3.182L7.5 18.75H4v-3.75l11.232-11.232z" />
                  </svg>
                </div>
              </button>

              <div className="pt-3 -mr-6 -ml-6 text-center">
                <hr className="border-gray-300 mb-6" />
                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between items-center">
                    <b className="whitespace-nowrap text-lg">Họ tên:</b>
                    <span className="whitespace-nowrap text-lg">{userUpdate?.full_name || "_______"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <b className="whitespace-nowrap text-lg">Tên tk:</b>
                    <span className="whitespace-nowrap text-lg">{userUpdate?.user_name || "______"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <b className="whitespace-nowrap text-lg">Ngày sinh:</b>
                    <span className="whitespace-nowrap text-lg">
                      {profile?.birthDay ? getFormattedDateAndAge(profile?.birthDay ? new Date(profile.birthDay) : new Date()) : "_______"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <b className="whitespace-nowrap text-lg">Giới tính:</b>
                    <span className="whitespace-nowrap text-lg">{userUpdate?.gender === "Nam" ? "Nam" : userUpdate?.gender === "Nữ" ? "Nữ" : "_______"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalChanger avatarUrl={avatarUrl} handleSetAvatarUrl={setAvatarUrl} closeModal={closeModal} handleCloseModal={setCloseModal} />
    </div>
  );
}
