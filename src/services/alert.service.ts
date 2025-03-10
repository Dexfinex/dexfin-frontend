import { Alert, CreateAlertDto, UpdateAlertDto, AlertTypeConfig } from '../types/alert.types';
import { AlertBaseApi } from './api.service';

export const alertApiService = {
    getAllAlerts: async (): Promise<Alert[]> => {
        try {
            const { data } = await AlertBaseApi.get('/all');
            return data;
        } catch (error) {
            console.error('Error fetching alerts:', error);
            throw error;
        }
    },

    getAlertById: async (id: string): Promise<Alert> => {
        try {
            const { data } = await AlertBaseApi.get(`/${id}`);
            return data.data;
        } catch (error) {
            console.error(`Error fetching alert ${id}:`, error);
            throw error;
        }
    },

    createAlert: async (alertData: CreateAlertDto): Promise<Alert> => {
        try {
            const { data } = await AlertBaseApi.post('/', alertData);
            return data;
        } catch (error) {
            console.error('Error creating alert:', error);
            throw error;
        }
    },

    updateAlert: async (id: string, alertData: UpdateAlertDto): Promise<Alert> => {
        try {
            const { data } = await AlertBaseApi.put(`/${id}`, alertData);
            return data;
        } catch (error) {
            console.error(`Error updating alert ${id}:`, error);
            throw error;
        }
    },

    deleteAlert: async (id: string): Promise<void> => {
        try {
            await AlertBaseApi.delete(`/${id}`);
        } catch (error) {
            console.error(`Error deleting alert ${id}:`, error);
            throw error;
        }
    },

    toggleAlertStatus: async (id: string): Promise<Alert> => {
        try {
            const { data } = await AlertBaseApi.patch(`/${id}/toggle-status`);
            return data.data;
        } catch (error) {
            console.error(`Error toggling alert status ${id}:`, error);
            throw error;
        }
    },

    markAlertAsRead: async (id: string): Promise<Alert> => {
        try {
            const { data } = await AlertBaseApi.patch(`/${id}/mark-read`);
            return data.data;
        } catch (error) {
            console.error(`Error marking alert ${id} as read:`, error);
            throw error;
        }
    },

    markAllAlertsAsRead: async (): Promise<number> => {
        try {
            const { data } = await AlertBaseApi.patch('/mark-all-read');
            return data.data;
        } catch (error) {
            console.error('Error marking all alerts as read:', error);
            throw error;
        }
    },

    formatAlertResponse: (backendAlert: any, alertTypeConfigs: AlertTypeConfig[]): Alert => {
        const typeConfig = alertTypeConfigs.find(config => config.id === backendAlert.type);

        return {
            id: backendAlert.id,
            name: backendAlert.name,
            type: backendAlert.type,
            condition: backendAlert.condition,
            value: backendAlert.value,
            createdAt: new Date(backendAlert.createdAt).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            }),
            lastTriggered: backendAlert.lastTriggered ?
                new Date(backendAlert.lastTriggered).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                }) : null,
            isActive: backendAlert.isActive,
            isRead: backendAlert.isRead,
            config: backendAlert.config || {},
        };
    }
};