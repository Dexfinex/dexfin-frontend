import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { WS_BASE_URL } from '../services/api.service';
import { AlertBaseApi } from '../services/api.service';
import { useToast } from '@chakra-ui/react';

export interface AlertData {
    userId: string;
    status: string;
    type: 'transaction' | 'price' | 'general' | 'security' | 'PRICE_ALERT' | 'swap' | 'deposit' | 'reward' | 'order' | 'loan';
    title: string;
    message: string;
    timestamp: number;
    txHash?: string;
    icon?: string;
    severity?: 'info' | 'success' | 'warning' | 'error';
    data?: any;
    read?: boolean;
}

export type AlertEventHandler = (data: AlertData) => void;

interface WebSocketAlertHookProps {
    userId: string;
    token?: string;
    autoConnect?: boolean;
    key?: number;
}

const ALERT_SOUND_PATH = '/notification.wav';

export const useWebSocketAlert = ({
    userId,
    token,
    autoConnect = true,
    key = 0
}: WebSocketAlertHookProps) => {
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [alerts, setAlerts] = useState<AlertData[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const socketRef = useRef<Socket | null>(null);
    const processedAlertsRef = useRef<Set<string>>(new Set());
    const alertHandlersRef = useRef<AlertEventHandler[]>([]);
    const reconnectAttemptsRef = useRef<number>(0);
    const maxReconnectAttempts = 5;
    const reconnectDelay = 3000;
    const reconnectTimerRef = useRef<any>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const toast = useToast();

    // Reset state when key changes
    useEffect(() => {
        setAlerts([]);
        setUnreadCount(0);
        processedAlertsRef.current.clear();
        if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
        }
        setIsConnected(false);
    }, [key]);

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

    // Play alert sound
    const playAlertSound = useCallback(() => {
        if (!audioRef.current) return;

        audioRef.current.pause();
        audioRef.current.currentTime = 0;

        audioRef.current.play().catch(e => {
            console.warn('Could not play alert sound:', e);
        });
    }, []);

    const showToastNotification = useCallback((data: AlertData) => {
        toast({
            title: data.title,
            description: data.message,
            status: data.severity || 'info',
            duration: 5000,
            isClosable: true,
            position: 'top-right'
        });
    }, [toast]);

    const triggerAlertEvent = useCallback((data: AlertData) => {
        // Check if the alert is for the current user
        if (data.userId && data.userId !== userId) {
            return;
        }
        
        const alertKey = data.data?.id || `${data.type}-${data.timestamp}`;

        if (processedAlertsRef.current.has(alertKey)) {
            return;
        }
        
        processedAlertsRef.current.add(alertKey);

        const alertWithTimestamp = {
            ...data,
            userId: data.userId || userId,
            timestamp: data.timestamp || Date.now(),
            read: false
        };
        
        setAlerts(prev => {
            const exists = prev.some(a => {
                if (data.data?.id && a.data?.id) {
                    return a.data.id === data.data.id;
                }
                return a.type === data.type &&
                    a.message === data.message &&
                    Math.abs(a.timestamp - data.timestamp) < 1000;
            });

            if (exists) {
                return prev;
            }

            return [alertWithTimestamp, ...prev];
        });

        setUnreadCount(prev => prev + 1);

        playAlertSound();
        showToastNotification(alertWithTimestamp);
        alertHandlersRef.current.forEach(handler => handler(alertWithTimestamp));
    }, [userId, playAlertSound, showToastNotification]);

    const subscribe = useCallback((id: string) => {
        if (!socketRef.current || !socketRef.current.connected) {
            return;
        }

        socketRef.current.emit('subscribe', id);
    }, []);

    // Define fetchInitialAlerts before connect so it can be used there
    const fetchInitialAlerts = useCallback(async () => {
        try {
            if (!token) {
                return;
            }
            
            const response = await AlertBaseApi.get('', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = response.data;
            
            setAlerts([]);
            processedAlertsRef.current.clear();

            if (!data || data.length === 0) {
                return;
            }

            const normalizedAlerts = data.map((alert: any) => ({
                userId: alert.userId || userId,
                status: 'TRIGGERED',
                type: 'PRICE_ALERT',
                title: alert.name || 'Price Alert',
                message: `${alert.token || 'Price'} is now ${alert.condition?.toLowerCase() || ''} ${alert.updatedPrice || ''}`,
                timestamp: alert.lastTriggered || alert.createdAt || Date.now(),
                severity: 'warning',
                read: alert.isRead || false,
                data: {
                    id: alert.id,
                    name: alert.name,
                    type: 'PRICE_ALERT',
                    message: `${alert.token || 'Price'} is now ${alert.condition?.toLowerCase() || ''} ${alert.updatedPrice || ''}`,
                    token: alert.token || alert.value,
                    currentPrice: parseFloat(alert.updatedPrice) || 0,
                    thresholdValue: parseFloat(alert.value) || 0,
                    condition: alert.condition,
                    isActive: alert.isActive
                }
            }));

            setAlerts(normalizedAlerts);
            setUnreadCount(normalizedAlerts.filter((alert: AlertData) => !alert.read).length);
            
            // Add all alert IDs to the processed set to avoid duplicates
            normalizedAlerts.forEach((alert: AlertData) => {
                if (alert.data?.id) {
                    processedAlertsRef.current.add(alert.data.id);
                }
            });
        } catch (error) {
            console.error('Error fetching initial alerts:', error);
        }
    }, [userId, token]);

    const connect = useCallback(() => {
        if (!userId) {
            return;
        }

        if (socketRef.current) {
            socketRef.current.close();
        }

        const authToken = token;

        // Set connection options with auth token
        const socketOptions = {
            transports: ['websocket'],
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: maxReconnectAttempts,
            reconnectionDelay: reconnectDelay,
            auth: {
                token: authToken
            },
            query: {
                userId,
                token: authToken
            }
        };

        socketRef.current = io(WS_BASE_URL, socketOptions);

        socketRef.current.on('connect', () => {
            reconnectAttemptsRef.current = 0;
            setIsConnected(true);
            subscribe(userId);
            fetchInitialAlerts();
        });

        socketRef.current.on('disconnect', (reason) => {
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
            reconnectAttemptsRef.current++;
        });

        socketRef.current.on('transactionUpdate', (data: any) => {
            const alert: AlertData = {
                userId: data.userId,
                status: data.status,
                type: 'transaction',
                title: `Transaction ${data.status === 'success' ? 'Successful' : 'Failed'}`,
                message: data.details?.message || `Transaction ${data.tradeHash} ${data.status}`,
                timestamp: Date.now(),
                txHash: data.tradeHash,
                severity: data.status === 'success' ? 'success' : 'error',
                data: data.details
            };
            triggerAlertEvent(alert);
        });

        socketRef.current.on('alertTriggered', (data: any) => {
            // Skip if not for this user and userId is specified
            if (data.userId && data.userId !== userId) {
                return;
            }
            
            if (data.id && processedAlertsRef.current.has(data.id)) {
                return;
            }
            
            if (data.type === 'PRICE_ALERT' || data.name) {
                triggerAlertEvent({
                    userId: data.userId || userId,
                    status: 'TRIGGERED',
                    type: 'PRICE_ALERT',
                    title: data.name || 'Price Alert',
                    message: data.message || `Alert triggered for ${data.token || 'your asset'}`,
                    timestamp: Date.now(),
                    severity: 'warning',
                    data: data
                });
            } else {
                // Standard price alert format
                triggerAlertEvent({
                    userId: data.userId || userId,
                    status: data.status || 'info',
                    type: 'price',
                    title: data.title || 'Price Alert',
                    message: data.message || `Alert triggered for ${data.asset || 'your asset'}`,
                    timestamp: Date.now(),
                    severity: data.severity || 'info',
                    data: data
                });
            }
        });

        socketRef.current.on('notification', (data: any) => {
            triggerAlertEvent({
                userId: data.userId || userId,
                status: data.status || 'info',
                type: data.type || 'general',
                title: data.title || 'Notification',
                message: data.message || 'You have a new notification',
                timestamp: Date.now(),
                severity: data.severity || 'info',
                data: data
            });
        });

        ['swap', 'deposit', 'reward', 'order', 'loan', 'security'].forEach(eventType => {
            socketRef.current?.on(eventType, (data: any) => {
                triggerAlertEvent({
                    userId: data.userId || userId,
                    status: data.status || 'info',
                    type: eventType as any,
                    title: data.title || `${eventType.charAt(0).toUpperCase() + eventType.slice(1)} Alert`,
                    message: data.message || `You have a new ${eventType} notification`,
                    timestamp: Date.now(),
                    txHash: data.txHash,
                    severity: data.severity || 'info',
                    data: data
                });
            });
        });

    }, [userId, token, subscribe, triggerAlertEvent, fetchInitialAlerts]);

    const unsubscribe = useCallback(() => {
        if (!socketRef.current || !socketRef.current.connected) {
            return;
        }

        socketRef.current.emit('unsubscribe', userId);
    }, [userId]);

    const disconnect = useCallback(() => {
        if (socketRef.current) {
            unsubscribe();
            socketRef.current.disconnect();
            socketRef.current = null;
            setIsConnected(false);
        }

        if (reconnectTimerRef.current) {
            clearTimeout(reconnectTimerRef.current);
            reconnectTimerRef.current = null;
        }
    }, [unsubscribe]);

    useEffect(() => {
        if (autoConnect && userId && token) {
            connect();
        }

        return () => {
            disconnect();
        };
    }, [connect, disconnect, autoConnect, userId, token, key]);

    const markAllAsRead = useCallback(() => {
        setAlerts(prev => prev.map(alert => ({ ...alert, read: true })));
        setUnreadCount(0);
        processedAlertsRef.current.clear();
    }, []);

    const markAsRead = useCallback((alertIdOrTimestamp: string | number) => {
        let alertId: string | null = null;
        setAlerts(prev =>
            prev.map(alert => {
                if (alert.data?.id === alertIdOrTimestamp || alert.data?.alertId === alertIdOrTimestamp) {
                    alertId = alert.data.id || alert.data.alertId;
                    return { ...alert, read: true };
                }
                if (alert.timestamp === alertIdOrTimestamp || alert.timestamp.toString() === alertIdOrTimestamp) {
                    if (alert.data?.id) alertId = alert.data.id;
                    return { ...alert, read: true };
                }
                return alert;
            })
        );
        if (alertId) {
            processedAlertsRef.current.delete(alertId);
        }
        setUnreadCount(prev => {
            const newCount = Math.max(0, prev - 1);
            return newCount;
        });
    }, []);

    return {
        isConnected,
        alerts,
        unreadCount,
        connect,
        disconnect,
        markAllAsRead,
        markAsRead,
        triggerAlertEvent,
        fetchInitialAlerts
    };
};

export default useWebSocketAlert;