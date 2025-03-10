import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { WS_BASE_URL } from '../services/api.service';
import { useToast } from '@chakra-ui/react';
import { Web3AuthContext } from './Web3AuthContext';
import { useUserData } from '../providers/UserProvider';
import { NotificationApi } from '../services/api.service';

// Type definitions based on your backend model
export interface Notification {
    id: string;
    userId: string;
    sourceId: string;
    type: 'ALERT' | 'TRANSACTION' | 'SECURITY' | 'REWARD' | 'SYSTEM';
    status: 'SUCCESS' | 'ERROR' | 'WARNING' | 'INFO';
    message: string;
    isRead: boolean;
    metadata?: any;
    createdAt: string;
    updatedAt: string;
}

interface WebSocketContextType {
    isConnected: boolean;
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (notificationIds: string[]) => Promise<void>;
    fetchNotifications: (limit?: number) => Promise<void>;
    fetchAllNotifications: (page?: number, limit?: number) => Promise<any>;
}

// Audio notification settings
const ALERT_SOUND_PATH = '/notification.wav';

// Create context
export const WebSocketContext = createContext<WebSocketContextType>({
    isConnected: false,
    notifications: [],
    unreadCount: 0,
    markAsRead: async () => { },
    fetchNotifications: async () => { },
    fetchAllNotifications: async () => ({}),
});

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Context and state hooks
    const { isConnected: isAuthConnected } = useContext(Web3AuthContext);
    const { userData } = useUserData();
    const toast = useToast();

    // State variables
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    // Refs to maintain state between renders
    const socketRef = useRef<Socket | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const reconnectAttemptsRef = useRef<number>(0);
    const reconnectTimerRef = useRef<any>(null);
    const maxReconnectAttempts = 5;
    const reconnectDelay = 3000;

    // Helper function to play notification sound
    const playAlertSound = useCallback(() => {
        if (!audioRef.current) return;
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => {
            console.warn('Could not play alert sound:', e);
        });
    }, []);

    // Initialize audio element
    useEffect(() => {
        if (typeof window !== 'undefined') {
            audioRef.current = new Audio(ALERT_SOUND_PATH);
            audioRef.current.volume = 0.5;
        }
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    // Helper function to show toast notification
    const showToastNotification = useCallback((notification: Notification) => {
        let status: 'info' | 'warning' | 'success' | 'error' = 'info';

        switch (notification.status) {
            case 'SUCCESS':
                status = 'success';
                break;
            case 'ERROR':
                status = 'error';
                break;
            case 'WARNING':
                status = 'warning';
                break;
            case 'INFO':
            default:
                status = 'info';
        }

        toast({
            title: getNotificationTitle(notification.type),
            description: notification.message,
            status,
            duration: 5000,
            isClosable: true,
            position: 'top-right'
        });
    }, [toast]);

    // Get a title for the notification based on its type
    const getNotificationTitle = (type: string): string => {
        switch (type) {
            case 'ALERT':
                return 'Price Alert';
            case 'TRANSACTION':
                return 'Transaction Update';
            case 'SECURITY':
                return 'Security Alert';
            case 'REWARD':
                return 'Reward';
            case 'SYSTEM':
                return 'System Notification';
            default:
                return 'Notification';
        }
    };

    // Connect to the WebSocket server
    const connect = useCallback(() => {
        if (!userData?.accessToken) {
            console.log('Missing access token for WebSocket connection');
            return;
        }

        // Close existing connection if any
        if (socketRef.current) {
            socketRef.current.close();
        }

        try {
            console.log('Connecting to WebSocket server...');

            // Configure socket options - no userId needed
            const socketOptions = {
                transports: ['websocket'],
                autoConnect: true,
                reconnection: true,
                reconnectionAttempts: maxReconnectAttempts,
                reconnectionDelay: reconnectDelay
            };

            // Create socket instance
            socketRef.current = io(WS_BASE_URL, socketOptions);

            // Connection handlers
            socketRef.current.on('connect', () => {
                console.log('WebSocket connected');
                reconnectAttemptsRef.current = 0;
                setIsConnected(true);

                // Subscribe with token for authentication
                // Backend will extract userId from the token
                socketRef.current?.emit('subscribe', userData.accessToken);
            });

            socketRef.current.on('disconnect', (reason) => {
                console.log(`WebSocket disconnected: ${reason}`);
                setIsConnected(false);

                // Attempt to reconnect
                if (reconnectAttemptsRef.current < maxReconnectAttempts) {
                    clearTimeout(reconnectTimerRef.current);
                    reconnectTimerRef.current = setTimeout(() => {
                        reconnectAttemptsRef.current++;
                        connect();
                    }, reconnectDelay);
                }
            });

            socketRef.current.on('connect_error', (error) => {
                console.error(`WebSocket connection error: ${error.message}`);
                reconnectAttemptsRef.current++;
            });

            // Listen for new notifications
            socketRef.current.on('newNotification', (notification: Notification) => {
                console.log('Received new notification:', notification);

                // Add notification to state
                setNotifications(prev => [notification, ...prev]);

                // Update unread count
                if (!notification.isRead) {
                    setUnreadCount(prev => prev + 1);
                }

                // Play sound and show toast
                playAlertSound();
                showToastNotification(notification);
            });

            // Listen for transaction updates
            socketRef.current.on('transactionUpdate', (data: any) => {
                console.log('Received transaction update:', data);

                playAlertSound();
            });

            // Listen for price alerts
            socketRef.current.on('alertTriggered', (data: any) => {
                console.log('Received price alert:', data);

                playAlertSound();
            });

        } catch (error) {
            console.error('Error connecting to WebSocket:', error);
        }
    }, [userData?.accessToken, playAlertSound, showToastNotification]);

    const disconnect = useCallback(() => {
        if (socketRef.current) {
            console.log('Disconnecting from WebSocket server');
            socketRef.current.emit('unsubscribe');
            socketRef.current.disconnect();
            socketRef.current = null;
            setIsConnected(false);
        }

        if (reconnectTimerRef.current) {
            clearTimeout(reconnectTimerRef.current);
            reconnectTimerRef.current = null;
        }
    }, []);

    const fetchNotifications = useCallback(async () => {
        if (!userData?.accessToken) {
            console.warn('Missing access token for fetching notifications');
            return;
        }

        try {
            setLoading(true);

            const response = await NotificationApi.get(`/all`, {
                headers: {
                    'Authorization': `Bearer ${userData.accessToken}`
                }
            });

            const latestNotifications = response.data.notifications;

            setNotifications(latestNotifications);
            setUnreadCount(latestNotifications.filter((n: Notification) => !n.isRead).length);

        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    }, [userData?.accessToken]);

    const fetchAllNotifications = useCallback(async (page = 1, limit = 10) => {
        if (!userData?.accessToken) {
            return { notifications: [], total: 0, page, limit, totalPages: 0 };
        }

        try {
            setLoading(true);

            const response = await NotificationApi.get(`/all`, {
                headers: {
                    'Authorization': `Bearer ${userData.accessToken}`
                }
            });

            const result = response.data.notifications;

            const unreadNotifications = result.notifications.filter((n: Notification) => !n.isRead);
            setUnreadCount(unreadNotifications.length);

            return result;

        } catch (error) {
            console.error('Error fetching all notifications:', error);
            return { notifications: [], total: 0, page, limit, totalPages: 0 };
        } finally {
            setLoading(false);
        }
    }, [userData?.accessToken]);

    const markAsRead = useCallback(async (notificationIds: string[]) => {
        if (!userData?.accessToken || !notificationIds.length) {
            return;
        }
    
        try {
            setLoading(true);
            
            await NotificationApi.put(`/mark-read`, 
                { notificationIds },
                {
                    headers: {
                        'Authorization': `Bearer ${userData.accessToken}`
                    }
                }
            );
    
            setNotifications(prev =>
                prev.map(notification =>
                    notificationIds.includes(notification.id)
                        ? { ...notification, isRead: true }
                        : notification
                )
            );
    
            setUnreadCount(prev => Math.max(0, prev - notificationIds.length));
    
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        } finally {
            setLoading(false);
        }
    }, [userData?.accessToken]);

    useEffect(() => {
        if (isAuthConnected && userData?.accessToken) {
            connect();
            fetchNotifications();
        } else {
            disconnect();
        }

        return () => {
            disconnect();
        };
    }, [isAuthConnected, userData?.accessToken, connect, disconnect, fetchNotifications]);

    useEffect(() => {
        if (!isConnected && isAuthConnected && userData?.accessToken) {
            const timeoutId = setTimeout(() => {
                connect();
            }, 5000);

            return () => clearTimeout(timeoutId);
        }
    }, [isConnected, isAuthConnected, userData?.accessToken, connect]);

    useEffect(() => {
        if (isAuthConnected && userData?.accessToken) {
            const intervalId = setInterval(() => {
                fetchNotifications();
            }, 3 * 60 * 1000); // every 3 minutes

            return () => clearInterval(intervalId);
        }
    }, [isAuthConnected, userData?.accessToken, fetchNotifications]);

    return (
        <WebSocketContext.Provider
            value={{
                isConnected,
                notifications,
                unreadCount,
                markAsRead,
                fetchNotifications,
                fetchAllNotifications
            }}
        >
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);