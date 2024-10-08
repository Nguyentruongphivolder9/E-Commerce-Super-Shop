import { useMutation } from '@tanstack/react-query';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import authApi from 'src/apis/auth.api';
import { AppContext } from 'src/contexts/app.context';
import { DeviceInfo } from 'src/hooks/useDeviceInfo';

function LoginSession() {
  const { profile } = useContext(AppContext);
  const [deviceResponseList, setDeviceResponselist] = useState<DeviceInfo[]>();

  const getAllDevicesByAccessToken = useMutation({
    mutationFn: (accountId: string) => authApi.getAllDevicesByAccessToken(accountId),
    onSuccess: (data) => {
      console.log(data.data.body);
      setDeviceResponselist(data.data.body);
    },
    onError: (error) => {
      toast.error("Failed to retrieve some data: " + error.message);
      console.log(error);
    }
  });

  useEffect(() => {
    if (profile?._id) {
      getAllDevicesByAccessToken.mutate(profile._id);
    }
  }, [profile?._id]);

  console.log(deviceResponseList);

  return (
    <div className="rounded-lg shadow-md bg-white px-6 py-8 md:px-8 md:py-10">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Phiên đăng nhập hiện tại</h1>
        <p className="mt-1 text-sm text-gray-600">Quản lý các thiết bị đang đăng nhập trên tài khoản của bạn</p>
      </div>

      <div>
        {deviceResponseList?.map((device: DeviceInfo, index) => (
          <div key={index} className="relative border p-6 rounded-lg mb-6 bg-gray-50 shadow-sm">
            <div className="flex items-center space-x-4">
              {
                device.browserName == "Chrome" ?
                  (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-8 w-8 text-gray-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
                  </svg>) :
                  (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                    <path d="M10.5 18.75a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" />
                    <path fill-rule="evenodd" d="M8.625.75A3.375 3.375 0 0 0 5.25 4.125v15.75a3.375 3.375 0 0 0 3.375 3.375h6.75a3.375 3.375 0 0 0 3.375-3.375V4.125A3.375 3.375 0 0 0 15.375.75h-6.75ZM7.5 4.125C7.5 3.504 8.004 3 8.625 3H9.75v.375c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125-.504 1.125-1.125V3h1.125c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-6.75A1.125 1.125 0 0 1 7.5 19.875V4.125Z" clip-rule="evenodd" />
                  </svg>
                  )
              }
              <div>
                <p className="text-lg font-semibold text-gray-800">{device.browserName}</p>
                <p className="text-md font-medium text-gray-600">Device Type: {device.browserName == "Chrome" ? "Desktop" : "Mobile"}</p>
              </div>
            </div>
            <hr className='my-4 border-gray-300' />
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-700"><strong>IP Address:</strong> {device.ipAddress}</p>
              <p className="text-sm text-gray-700"><strong>Location:</strong> {device.city}, {device.region}, {device.country}</p>
              <p className="text-sm text-gray-700"><strong>Coordinates:</strong> {device.latitude}, {device.longitude}</p>
            </div>
            <div className="absolute bottom-4 right-4">
              <p className="text-xs text-gray-500">
                <strong className='text-gray-800'>Assigned Time: </strong>
                {device?.assignedTime ? `${new Date(device.assignedTime).toLocaleTimeString()} - ${new Date(device.assignedTime).toLocaleDateString()}` : 'No Date Available'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LoginSession;
