import React, { useState } from 'react';
import Stepper from 'src/components/Stepper';
import ChangePasswords from './ChangePasswords';
import { Button } from '@mantine/core';



function ChangePassword() {
  const messages: string[] = ["Phương thức xác thực", "Nhập mật khẩu mới", "Đang xác thực"];
  const stepDescription: string[] = ["Bạn có thể chọn 1 trong 2 phương thức để tiến hành xác thực", "Để đảm bảo rằng tài khoản của bạn được an toàn, xin đừng cho người khác xem được mật khẩu của tài khoản", "Gần hoàn tấtatsf"]
  const steps: number = messages.length;
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);

  return (
    <div className="mx-auto p-3 bg-blue rounded-lg pb-20">
      <Stepper
        subMessages={stepDescription}
        current_step={currentStep}
        steps={steps}
        messages={messages}
        is_complete={isCompleted}
        goToNextStep={() => setCurrentStep(prev => prev + 1)}
        goToPrevStep={() => setCurrentStep(prev => prev - 1)}
      >
        <div className="bg-gray-300 rounded-xl shadow-lg w-full max-w-4xl p-2">
          <ChangePasswords
            current_step={currentStep}
            is_complete={isCompleted}
            steps={steps}
            goToNextStep={() => setCurrentStep(prev => prev + 1)}
            goToPrevStep={() => setCurrentStep(prev => prev - 1)}
          />
        </div>

      </Stepper>
      <div className='flex justify-between'>
        <Button onClick={() => { setCurrentStep(prev => prev - 1) }}>Previous</Button>
        <Button onClick={() => { setCurrentStep(prev => prev + 1) }}>Next</Button>
      </div>
    </div>
  )
}

export default ChangePassword;
