// import React, { useEffect, useState } from 'react';
// import { Stomp } from '@stomp/stompjs';
// import SockJS from 'sockjs-client';


// interface JwtResponse {
//     accessToken: string;
//     refreshToken?: string;
//     expireRefreshToken?: string;
//     expires?: number;
//     secretKey?: string;
//     account?: any;
// }

// const WebSocketComponent: React.FC = () => {
//     const [messages, setMessages] = useState<any[]>([]);
//     const [jwt, setJwt] = useState<JwtResponse | null>(null); 

//     useEffect(() => {
//         const socket = new SockJS('http://localhost:8080/ws');
//         const stompClient = Stomp.over(socket);

//         stompClient.connect({}, (frame: string) => {
//             console.log('Connected: ' + frame);
//             stompClient.subscribe('/topic/messages', (message) => {
//                 const receivedMessage: JwtResponse = JSON.parse(message.body);
//                 setMessages(prevMessages => [...prevMessages, receivedMessage]);

//                 // Kiểm tra xem có phải là JWT không
//                 if (receivedMessage.accessToken) {
//                     setJwt(receivedMessage);
//                     console.log('Received JWT:', receivedMessage.accessToken);
//                 }
//             });
//         });

//         return () => {
//             stompClient.disconnect();
//         };
//     }, []);

//     return (
//         <div>
//             <h2>Messages:</h2>
//             <ul>
//                 {messages.map((msg, index) => (
//                     <li key={index}>{JSON.stringify(msg)}</li> // Hiển thị dữ liệu nhận được
//                 ))}
//             </ul>
//             {jwt && <h3>Received JWT: {jwt.accessToken}</h3>} {/* Hiển thị JWT nếu có */}
//         </div>
//     );
// };

// export default WebSocketComponent;
