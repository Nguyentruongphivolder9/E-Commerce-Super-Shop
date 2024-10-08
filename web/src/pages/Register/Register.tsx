import React, { useState } from 'react';
import Registers from 'src/components/RegisterForms/Registers';
import Stepper from 'src/components/Stepper';

export default function Register() {
    const messages = ['Nhập Email', 'Xác thực Email', 'Thông tin cá nhân', 'Tạo tài khoản'];
    const subMessages = ['Nhập Email cá nhận của bạn để chúng tôi gửi form xác thực', 'Hãy nhấn vào nút xác nhận được đính kèm bên trong Email', 'Nhập thông tin cá nhân của bạn', 'Đang tạo tài khoản']
    const steps = messages.length;
    const [currentStep, setCurrentStep] = useState(1);
    const [isCompleted, setIsCompleted] = useState(false);

    return (
        <div className="mx-auto p-3 bg-blue pb-20">
            <Stepper
                current_step={currentStep}
                subMessages={subMessages}
                steps={steps}
                messages={messages}
                is_complete={isCompleted}
                goToNextStep={() => setCurrentStep(prev => prev + 1)}
                goToPrevStep={() => setCurrentStep(prev => prev - 1)}
            >
                <div className="bg-white rounded-md shadow-lg p-8 w-full max-w-lg">
                    <Registers
                        current_step={currentStep}
                        is_complete={isCompleted}
                        steps={steps}
                        goToNextStep={() => setCurrentStep(prev => prev + 1)}
                        goToPrevStep={() => setCurrentStep(prev => prev - 1)}
                    />
                </div>
            </Stepper>
        </div>
    );
}
