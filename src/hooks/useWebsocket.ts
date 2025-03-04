// hooks/useWebSocketAlert.ts
import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { WS_BASE_URL } from '../services/api.service';

export interface AlertData {
    userId: string;
    status: string;
    type: 'transaction' | 'price' | 'general' | 'security' | 'PRICE_ALERT';
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
    autoConnect?: boolean;
}

export const useWebSocketAlert = ({
    userId,
    autoConnect = true
}: WebSocketAlertHookProps) => {
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [alerts, setAlerts] = useState<AlertData[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const socketRef = useRef<Socket | null>(null);
    const alertHandlersRef = useRef<AlertEventHandler[]>([]);
    const reconnectAttemptsRef = useRef<number>(0);
    const maxReconnectAttempts = 5;
    const reconnectDelay = 3000;

    const triggerAlertEvent = useCallback((data: AlertData) => {
        const alertWithTimestamp = {
            ...data,
            timestamp: data.timestamp || Date.now(),
            read: false
        };

        setAlerts(prev => [alertWithTimestamp, ...prev]);
        setUnreadCount(prev => prev + 1);

        alertHandlersRef.current.forEach(handler => handler(alertWithTimestamp));
    }, []);

    const subscribe = useCallback((id: string) => {
        if (!socketRef.current || !socketRef.current.connected) {
            console.error('Cannot subscribe, socket not connected');
            return;
        }

        socketRef.current.emit('subscribe', id);
        console.log(`Subscribed to alerts for user: ${id}`);
    }, []);

    const connect = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.close();
        }
        console.log("aaaa")
        socketRef.current = io(WS_BASE_URL, {
            transports: ['websocket'],
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: maxReconnectAttempts,
            reconnectionDelay: reconnectDelay,
        });

        socketRef.current.on('connect', () => {
            console.log('WebSocket connected');
            reconnectAttemptsRef.current = 0;
            setIsConnected(true);
            subscribe(userId);
        });

        socketRef.current.on('disconnect', (reason) => {
            console.log(`WebSocket disconnected: ${reason}`);
            setIsConnected(false);
        });

        socketRef.current.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error);
            reconnectAttemptsRef.current++;

            if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
                console.error('Max reconnection attempts reached');
            }
        });

        socketRef.current.on('transactionUpdate', (data: any) => {
            console.log('Transaction update received:', data);
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
            console.log('Alert triggered:', data);
            // Handle the special format from PriceAlertService
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
            console.log('Notification received:', data);
            triggerAlertEvent({
                userId: data.userId || userId,
                status: data.status || 'info',
                type: 'general',
                title: data.title || 'Notification',
                message: data.message || 'You have a new notification',
                timestamp: Date.now(),
                severity: data.severity || 'info',
                data: data
            });
        });

    }, [userId, subscribe, triggerAlertEvent]);

    const unsubscribe = useCallback(() => {
        if (!socketRef.current || !socketRef.current.connected) {
            console.error('Cannot unsubscribe, socket not connected');
            return;
        }

        socketRef.current.emit('unsubscribe', userId);
        console.log(`Unsubscribed from alerts for user: ${userId}`);
    }, [userId]);

    const disconnect = useCallback(() => {
        if (socketRef.current) {
            unsubscribe();
            socketRef.current.disconnect();
            socketRef.current = null;
            setIsConnected(false);
            console.log('WebSocket disconnected');
        }
    }, [unsubscribe]);

    useEffect(() => {
        if (autoConnect && userId) {
            connect();
        }

        return () => {
            disconnect();
        };
    }, [connect, disconnect, autoConnect, userId]);

    const onAlert = useCallback((callback: AlertEventHandler) => {
        alertHandlersRef.current.push(callback);

        return () => {
            alertHandlersRef.current = alertHandlersRef.current.filter(
                handler => handler !== callback
            );
        };
    }, []);

    const clearAlert = useCallback((timestamp: number) => {
        setAlerts(prev => prev.filter(alert => alert.timestamp !== timestamp));
    }, []);

    const markAllAsRead = useCallback(() => {
        setAlerts(prev => prev.map(alert => ({ ...alert, read: true })));
        setUnreadCount(0);
    }, []);

    const markAsRead = useCallback((timestamp: number) => {
        setAlerts(prev =>
            prev.map(alert =>
                alert.timestamp === timestamp
                    ? { ...alert, read: true }
                    : alert
            )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    }, []);

    return {
        isConnected,
        alerts,
        unreadCount,
        connect,
        disconnect,
        onAlert,
        clearAlert,
        markAllAsRead,
        markAsRead,
        triggerAlertEvent
    };
};

export default useWebSocketAlert;