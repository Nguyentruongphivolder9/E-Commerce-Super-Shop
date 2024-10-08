import CloseIcon from "src/assets/svgs/CloseIcon";
import ImageCropper from "./ImageCropper";
import { useState } from "react";
import { User } from "src/types/user.type";

export type ModalChangerProps = {
    avatarUrl: string,
    handleSetAvatarUrl: React.Dispatch<React.SetStateAction<string>>
    closeModal: boolean,
    handleCloseModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function ModalChanger({ closeModal, handleCloseModal, avatarUrl, handleSetAvatarUrl }: ModalChangerProps) {
    if (closeModal === true) return;
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            aria-labelledby="crop-image-dialog"
            role="dialog"
            aria-modal="true"
        >
            <div className="fixed inset-0 bg-cyan-100 bg-opacity-70 backdrop-blur-sm transition-opacity" onClick={() => { handleCloseModal(true) }}></div>
            <div className="relative z-10 w-full max-w-4xl p-6 sm:p-8 lg:p-10 bg-white rounded-2xl shadow-xl flex flex-col">
                <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
                    <h2 className="text-2xl font-semibold text-gray-700">Thay đổi ảnh đại diện</h2>
                    <button
                        type="button"
                        className="rounded-full p-2 text-gray-500 hover:bg-gray-200 focus:outline-none transition"
                        onClick={() => handleCloseModal(true)}
                    >
                        <CloseIcon />
                    </button>
                </div>
                <div className="flex-grow mt-4 sm:mt-6 lg:mt-8">
                    <ImageCropper avatarUrl={avatarUrl} handleSetAvatarUrl={handleSetAvatarUrl} handleCloseModel={handleCloseModal}/>
                </div>
            </div>
        </div>

    );
}

export default ModalChanger;
