import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useWebSocket = (token: string | null) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (!token) return;

    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
      auth: { token }
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ WebSocket connected');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
      setIsConnected(false);
    });

    socket.on('notification', (notification) => {
      console.log('📬 New notification:', notification);
      setNotifications(prev => [notification, ...prev]);
      
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/logo.png'
        });
      }
    });

    socket.on('new_message', (message) => {
      console.log('💬 New message:', message);
      setMessages(prev => [message, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  return { isConnected, notifications, messages, socket: socketRef.current };
};
