import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useWebSocketAlert, AlertData } from '../hooks/useWebsocket';
import { AlertBaseApi } from '../services/api.service';
import { Web3AuthContext } from './Web3AuthContext';
import { useUserData } from '../providers/UserProvider';

interface WebSocketContextType {
    isConnected: boolean;
    alerts: AlertData[];
    unreadCount: number;
    markAlertAsRead: (alertId: string | number) => Promise<void>;
    markAllAlertsAsRead: () => Promise<void>;
    refreshAlerts: () => void;
}

export const WebSocketContext = createContext<WebSocketContextType>({
    isConnected: false,
    alerts: [],
    unreadCount: 0,
    markAlertAsRead: async () => { },
    markAllAlertsAsRead: async () => { },
    refreshAlerts: () => { },
});

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isConnected } = useContext(Web3AuthContext);
    const { userData } = useUserData();
    const [userId, setUserId] = useState<string>('');
    const [token, setToken] = useState<string>('');
    const [refreshKey, setRefreshKey] = useState<number>(0);
    const [isReady, setIsReady] = useState<boolean>(false);

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (userData?.accessToken) {
                try {
                    setUserId(userData?.userId as string);
                    setToken(userData?.accessToken as string);
                } catch (error) {
                    console.error("Error fetching user info:", error);
                    setIsReady(false);
                }
            } else {
                setIsReady(false);
            }
        };

        fetchUserInfo();
    }, [userData, isConnected])

    const {
        isConnected: wsConnected,
        alerts,
        unreadCount,
        markAsRead,
        markAllAsRead,
        connect,
        fetchInitialAlerts
    } = useWebSocketAlert({
        userId: userId,
        token: token,
        autoConnect: false, 
        key: refreshKey
    });

    useEffect(() => {
        if (isReady && userId && token) {
            connect();
            fetchInitialAlerts();
        }
    }, [isReady, userId, token, connect, fetchInitialAlerts]);

    useEffect(() => {
        if (!wsConnected || !userId || !token) return;
        
        const intervalId = setInterval(() => {
            fetchInitialAlerts();
        }, 5 * 60 * 1000);
        
        return () => clearInterval(intervalId);
    }, [wsConnected, userId, token, fetchInitialAlerts]);

    useEffect(() => {
        if (!isReady || !userId || !token) return;
        
        if (!wsConnected) {
            const timeoutId = setTimeout(() => {
                connect();
            }, 5000);
            
            return () => clearTimeout(timeoutId);
        }
    }, [wsConnected, isReady, userId, token, connect]);

    const refreshAlerts = useCallback(() => {
        if (userId && token) {
            fetchInitialAlerts();
        }
    }, [userId, token, fetchInitialAlerts]);

    const markAlertAsRead = async (alertId: string | number) => {
        try {
            if (token) {
                await AlertBaseApi.put(`/${alertId}/read`, {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            }

            markAsRead(alertId);
        } catch (error) {
            console.error('Error marking alert as read:', error);
        }
    };

    const markAllAlertsAsRead = async () => {
        try {
            if (token) {
                await AlertBaseApi.put(`/mark-all-read`, {}, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            }
            markAllAsRead();
        } catch (error) {
            console.error('Error marking all alerts as read:', error);
        }
    };

    return (
        <WebSocketContext.Provider
            value={{
                isConnected: wsConnected,
                alerts,
                unreadCount,
                markAlertAsRead,
                markAllAlertsAsRead,
                refreshAlerts
            }}
        >
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);