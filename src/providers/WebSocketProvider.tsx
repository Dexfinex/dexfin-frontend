import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { WS_BASE_URL } from '../services/api.service';
import { useToast } from '@chakra-ui/react';
import { Web3AuthContext } from './Web3AuthContext';
import { useUserData } from '../providers/UserProvider';
import { NotificationApi } from '../services/api.service';

export interface Notification {
    id: string;
    userId: string;
    sourceId: string;
    type: 'ALERT' | 'TRANSACTION' | 'SECURITY' | 'REWARD' | 'SYSTEM' | 'SWAP' | 'DEPOSIT' | 'WITHDRAWAL' | 'ORDER' | 'LOAN' | 'ACHIEVEMENT' | 'PAYMENT';
    status: 'SUCCESS' | 'ERROR' | 'WARNING' | 'INFO' | 'PENDING';
    message: string;
    isRead: boolean;
    metadata?: any;
    createdAt: string;
    updatedAt: string;
}

interface WebSocketContextType {
    isConnected: boolean;
    loading: boolean;
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (notificationIds: string[]) => Promise<void>;
    fetchNotifications: (limit?: number) => Promise<void>;
    fetchAllNotifications: () => Promise<void>;
}

const NOTIFICATION_SOUNDS = {
    DEFAULT: '/sounds/notification.wav',
    PRICE_ALERT: '/sounds/price-alert-triggered.wav',
    TRANSACTION: '/sounds/swap-completed.wav',
    SWAP: '/sounds/swap-completed.wav',
    DEPOSIT: '/sounds/deposit-received.wav',
    WITHDRAWAL: '/sounds/withdrawal-completed.wav',
    VOLUME_ALERT: '/sounds/volume-alert-trigger.wav',
    MARKET_CAP_ALERT: '/sounds/market-cap-alert.wav',
    SECURITY: '/sounds/security-alert.wav',
    REWARD: '/sounds/reward-received.wav',
    SYSTEM: '/sounds/system-notification.wav',
    ORDER: '/sounds/order-update.wav',
    LOAN: '/sounds/loan-update.wav',
    ACHIEVEMENT: '/sounds/achievement-unlocked.wav',
    PAYMENT: '/sounds/payment-update.wav',
    TVL_ALERT: '/sounds/tvl-alert-triggered',
    BADGE_UNLOCKED: '/sounds/new_adge_unlocked.wav',
};

export const WebSocketContext = createContext<WebSocketContextType>({
    isConnected: false,
    loading: false,
    notifications: [],
    unreadCount: 0,
    markAsRead: async () => { },
    fetchNotifications: async () => { },
    fetchAllNotifications: async () => { },
});

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isConnected: isAuthConnected } = useContext(Web3AuthContext);
    const { userData } = useUserData();
    const toast = useToast();

    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    const socketRef = useRef<Socket | null>(null);
    const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
    const reconnectAttemptsRef = useRef<number>(0);
    const reconnectTimerRef = useRef<any>(null);
    const maxReconnectAttempts = 5;
    const reconnectDelay = 3000;

    useEffect(() => {
        if (typeof window !== 'undefined') {
            Object.entries(NOTIFICATION_SOUNDS).forEach(([type, soundPath]) => {
                const audio = new Audio(soundPath);
                audio.volume = 0.5;
                audioRefs.current[type] = audio;
            });
        }

        return () => {
            Object.values(audioRefs.current).forEach(audio => {
                audio.pause();
            });
            audioRefs.current = {};
        };
    }, []);

    const getSoundKeyForNotification = (notification: Notification): string => {
        if (notification.type === 'ALERT' && notification.metadata) {
            try {
                const metadata = typeof notification.metadata === 'string'
                    ? JSON.parse(notification.metadata)
                    : notification.metadata;

                const type = metadata.alertType;

                if (type) {
                    const normalizedType = type.toString().toUpperCase();

                    if (normalizedType === 'VOLUME_ALERT') {
                        return 'VOLUME_ALERT';
                    } else if (normalizedType === 'MARKETCAP_ALERT' || normalizedType === 'MARKET_CAP_ALERT') {
                        console.log(normalizedType)
                        return 'MARKET_CAP_ALERT';
                    } else if (normalizedType === 'PRICE_ALERT') {
                        return 'PRICE_ALERT';
                    } else if (normalizedType === 'TVL_ALERT') {
                        return 'TVL_ALERT';
                    }
                }
            } catch (e) {
                console.warn('Could not parse notification metadata:', e);
                return 'PRICE_ALERT';
            }
        }

        if (notification.type === 'ACHIEVEMENT' && notification.metadata) {
            try {
                const metadata = typeof notification.metadata === 'string'
                    ? JSON.parse(notification.metadata)
                    : notification.metadata;
                
                if (metadata.badgeId || metadata.badgeName) {
                    return 'BADGE_UNLOCKED';
                }
            } catch (e) {
                console.warn('Could not parse achievement metadata:', e);
            }
        }

        if (audioRefs.current[notification.type]) {
            return notification.type;
        }

        return 'DEFAULT';
    };

    const playAlertSound = useCallback((notification: Notification) => {
        const soundKey = getSoundKeyForNotification(notification);
        console.log(soundKey)
        const audio = audioRefs.current[soundKey];

        if (!audio) {
            console.warn(`No audio found for sound key: ${soundKey}`);
            return;
        }

        audio.pause();
        audio.currentTime = 0;
        audio.play().catch(e => {
            console.warn(`Could not play ${soundKey} alert sound:`, e);
        });
    }, []);

    const getNotificationTitle = (notification: Notification): string => {
        if (notification.type === 'ALERT' && notification.metadata) {
            try {
                const metadata = typeof notification.metadata === 'string'
                    ? JSON.parse(notification.metadata)
                    : notification.metadata;

                const type = metadata.alertType;

                if (type) {
                    const normalizedType = type.toString().toUpperCase();

                    if (normalizedType === 'VOLUME_ALERT') {
                        return 'Volume Alert';
                    } else if (normalizedType === 'MARKETCAP_ALERT' || normalizedType === 'MARKET_CAP_ALERT') {
                        return 'Market Cap Alert';
                    } else if (normalizedType === 'PRICE_ALERT') {
                        return 'Price Alert';
                    } else if (normalizedType === 'TVL_ALERT') {
                        return 'TVL Alert';
                    }
                }
            } catch (e) {
                console.warn('Could not parse notification metadata for title:', e);
            }
        }
        
        // Add special handling for badge notifications
        if (notification.type === 'ACHIEVEMENT' && notification.metadata) {
            try {
                const metadata = typeof notification.metadata === 'string'
                    ? JSON.parse(notification.metadata)
                    : notification.metadata;
                
                if (metadata.badgeName) {
                    return `New Badge: ${metadata.badgeName}`;
                }
            } catch (e) {
                console.warn('Could not parse achievement metadata for title:', e);
            }
        }

        switch (notification.type) {
            case 'ALERT':
                return 'Alert';
            case 'TRANSACTION':
                return 'Transaction Update';
            case 'SWAP':
                return 'Swap Completed';
            case 'DEPOSIT':
                return 'Deposit Update';
            case 'WITHDRAWAL':
                return 'Withdrawal Update';
            case 'SECURITY':
                return 'Security Alert';
            case 'REWARD':
                return 'Reward';
            case 'SYSTEM':
                return 'System Notification';
            case 'ORDER':
                return 'Order Update';
            case 'LOAN':
                return 'Loan Update';
            case 'ACHIEVEMENT':
                return 'Achievement Unlocked';
            case 'PAYMENT':
                return 'Payment Update';
            default:
                return 'Notification';
        }
    };

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
            case 'PENDING':
            default:
                status = 'info';
        }

        toast({
            title: getNotificationTitle(notification),
            description: notification.message,
            status,
            duration: 5000,
            isClosable: true,
            position: 'top-right'
        });
    }, [toast]);

    const connect = useCallback(() => {
        if (!userData?.accessToken) {
            console.log('Missing access token for WebSocket connection');
            return;
        }

        if (socketRef.current) {
            socketRef.current.close();
        }

        try {
            console.log('Connecting to WebSocket server...');

            const socketOptions = {
                transports: ['websocket'],
                autoConnect: true,
                reconnection: true,
                reconnectionAttempts: maxReconnectAttempts,
                reconnectionDelay: reconnectDelay
            };

            socketRef.current = io(WS_BASE_URL, socketOptions);

            socketRef.current.on('connect', () => {
                console.log('WebSocket connected');
                reconnectAttemptsRef.current = 0;
                setIsConnected(true);

                socketRef.current?.emit('subscribe', userData.accessToken);
            });

            socketRef.current.on('disconnect', (reason) => {
                console.log(`WebSocket disconnected: ${reason}`);
                setIsConnected(false);

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

            socketRef.current.on('newNotification', (notification: Notification) => {
                console.log('Received new notification:', notification);

                setNotifications(prev => [notification, ...prev]);

                if (!notification.isRead) {
                    setUnreadCount(prev => prev + 1);
                }

                playAlertSound(notification);
                showToastNotification(notification);
            });

            socketRef.current.on('transactionUpdate', (data: any) => {
                console.log('Received transaction update:', data);

                const pseudoNotification: Notification = {
                    type: 'TRANSACTION',
                    status: 'INFO',
                    message: '',
                    isRead: false,
                    id: '',
                    userId: '',
                    sourceId: '',
                    createdAt: '',
                    updatedAt: '',
                    metadata: data
                };

                playAlertSound(pseudoNotification);
            });

            socketRef.current.on('alertTriggered', (data: any) => {
                console.log('Received price alert:', data);

                const pseudoNotification: Notification = {
                    type: 'ALERT',
                    status: 'INFO',
                    message: '',
                    isRead: false,
                    id: '',
                    userId: '',
                    sourceId: '',
                    createdAt: '',
                    updatedAt: '',
                    metadata: data
                };

                playAlertSound(pseudoNotification);
            });
            
            // Add handler specifically for badge unlocks
            socketRef.current.on('badgeUnlocked', (data: any) => {
                console.log('Received badge unlock:', data);
                
                const pseudoNotification: Notification = {
                    type: 'ACHIEVEMENT',
                    status: 'SUCCESS',
                    message: data.message || `You earned the "${data.badgeName}" badge and ${data.xpAmount || 0} XP!`,
                    isRead: false,
                    id: '',
                    userId: '',
                    sourceId: '',
                    createdAt: '',
                    updatedAt: '',
                    metadata: data
                };
                
                playAlertSound(pseudoNotification);
                showToastNotification(pseudoNotification);
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

    const fetchNotifications = useCallback(async (limit = 50) => {
        if (!userData?.accessToken) {
            console.warn('Missing access token for fetching notifications');
            return;
        }

        try {
            setLoading(true);

            const response = await NotificationApi.get(`/all?limit=${limit}`, {
                headers: {
                    'Authorization': `Bearer ${userData.accessToken}`
                }
            });

            if (response.data && response.data.notifications) {
                const latestNotifications = response.data.notifications;
                setNotifications(latestNotifications);
                const unreadCount = latestNotifications.filter((n: Notification) => !n.isRead).length;
                setUnreadCount(unreadCount);
            } else {
                console.warn('Invalid notification response format:', response.data);
                setNotifications([]);
                setUnreadCount(0);
            }

        } catch (error) {
            console.error('Error fetching notifications:', error);
            setNotifications([]);
            setUnreadCount(0);
        } finally {
            setLoading(false);
        }
    }, [userData?.accessToken]);

    const fetchAllNotifications = useCallback(async () => {
        if (!userData?.accessToken) {
            console.warn('Missing access token for fetching all notifications');
            return;
        }

        try {
            setLoading(true);

            const response = await NotificationApi.get(`/all?limit=100`, {
                headers: {
                    'Authorization': `Bearer ${userData.accessToken}`
                }
            });

            if (response.data && response.data.notifications) {
                const allNotifications = response.data.notifications;
                setNotifications(allNotifications);
                const unreadCount = allNotifications.filter((n: Notification) => !n.isRead).length;
                setUnreadCount(unreadCount);
            } else {
                console.warn('Invalid notification response format:', response.data);
                setNotifications([]);
                setUnreadCount(0);
            }

        } catch (error) {
            console.error('Error fetching all notifications:', error);
            setNotifications([]);
            setUnreadCount(0);
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
            setNotifications([]);
            setUnreadCount(0);
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
            }, 3 * 60 * 1000);

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
                fetchAllNotifications,
                loading
            }}
        >
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);