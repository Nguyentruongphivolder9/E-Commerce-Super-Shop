import QRCode from "qrcode.react";
import { HoverCard, Text, Group } from '@mantine/core';
import shopeeIcon from "../../assets/images/shoppeBlue.jpg";
import React, { useContext, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import authApi from "src/apis/auth.api";
import { AppContext } from "src/contexts/app.context";
import { parseJwt } from "src/utils/auth";
import { User } from "src/types/user.type";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export type QrCodeProps = {
    value: string;
    containLogo: boolean;
    handleRefreshQrCode?: () => void;
    code: string
}

function QrCode({ value, containLogo, handleRefreshQrCode, code}: QrCodeProps) {
    const { setIsAuthenticated, setProfile } = useContext(AppContext);
    const qrRef = React.useRef<HTMLDivElement | null>(null);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
    const [isExpired, setIsExpired] = useState(false);
    const navigate = useNavigate();

    const downloadQrCode = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (qrRef.current) {
            const canvas = qrRef.current.querySelector('canvas');
            if (canvas) {
                const link = document.createElement('a');
                const borderedCanvas = document.createElement('canvas');
                const ctx = borderedCanvas.getContext('2d');

                // Set canvas size with a border
                const borderWidth = 20;
                borderedCanvas.width = canvas.width + borderWidth * 2; 
                borderedCanvas.height = canvas.height + borderWidth * 2; 

                // Draw white border
                ctx!.fillStyle = 'white';
                ctx!.fillRect(0, 0, borderedCanvas.width, borderedCanvas.height);

                // Draw the QR code in the center
                ctx!.drawImage(canvas, borderWidth, borderWidth);

                link.href = borderedCanvas.toDataURL('image/png');
                link.download = 'qr-code.png';
                link.click();
            } else {
                console.error("Canvas not found");
            }
        }
    }

    const qrLogin = useMutation({
        mutationFn: (body: string) => authApi.qrLogin(body),
        onSuccess: (data) => {
            console.log(data)
            setProfile(parseJwt(data.data.body.accessToken));
            const userLogin: User = parseJwt(data.data.body.accessToken);
            setIsAuthenticated(true);
            toast.success(`Logged in successfully. Welcome ${userLogin.userName}`);
            navigate('/');
        }
    });

    const fetchQrToken = async () => {
        try {
            qrLogin.mutate(code)
        } catch (error) {
            console.error("Error fetching QR token", error);
        }
    };

    useEffect(() => {
        if (!isExpired) {
            const intervalId = setInterval(fetchQrToken, 3000); // Poll every 3 seconds
            return () => clearInterval(intervalId); // Clean up interval on unmount
        }
    }, [isExpired]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);

            return () => clearInterval(timerId);
        } else {
            if (!isExpired) {
                setIsExpired(true);
                handleRefreshQrCode?.();
            }
        }
    }, [timeLeft, isExpired, handleRefreshQrCode]);

    return (
        <Group justify="center">
            <HoverCard width={280} shadow="md">
                <HoverCard.Target>
                    <div className="hover:cursor-pointer" ref={qrRef}>
                        <QRCode
                            size={300}
                            value={value}
                            level="H"
                            imageSettings={{
                                src: shopeeIcon,
                                excavate: true,
                                width: 300 * 0.2,
                                height: 300 * 0.2,
                            }}
                            renderAs="canvas"
                        />
                    </div>
                </HoverCard.Target>
                <HoverCard.Dropdown className="bg-cyan-200">
                    <Text className="bg-cyan-200">
                        Download QR Code?
                        <span
                            className={`text-blue hover:text-cyan-600 hover:cursor-pointer pl-3 ${isExpired ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={isExpired ? undefined : downloadQrCode}
                        >
                            Click me
                        </span>
                    </Text>
                </HoverCard.Dropdown>
            </HoverCard>
            {isExpired ? (
                <Text color="red" size="sm">
                    QR code expired, please scan a new code.
                </Text>
            ) : (
                <Text size="sm">
                    Time remaining: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    <b className="hover:cursor-pointer hover:text-red hover:underline" onClick={handleRefreshQrCode}>
                        Refresh code?
                    </b>
                </Text>
            )}
        </Group>
    );
}

export default QrCode;
