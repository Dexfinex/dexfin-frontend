// File: src/components/MarketAlerts.tsx
import React, { useState, useEffect, useContext } from 'react';
import {
    Bell, Settings, Plus, Trash2, RefreshCw,
    DollarSign, LineChart, BarChart2, Users,
    Wallet, TrendingUp, Ship, Send, MessageSquare,
    Volume2, Search, ChevronDown, Info
} from 'lucide-react';
import { alertApiService, configureAlertApiAuth } from '../../services/alert.service';
import { Alert, CreateAlertDto, UpdateAlertDto, alertTypes } from '../../types/alert.types';
import { Web3AuthContext } from '../../providers/Web3AuthContext';

interface NotificationSettings {
    email: {
        enabled: boolean;
        address: string;
    };
    desktop: {
        enabled: boolean;
    };
    telegram: {
        enabled: boolean;
    };
    discord: {
        enabled: boolean;
    };
    emailPreference: 'instant' | 'hourly' | 'daily';
    sound: boolean;
}

export const MarketAlerts: React.FC = () => {
    // Access Web3Auth context
    const { userData, isConnected, checkWalletAndUsername } = useContext(Web3AuthContext);

    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateAlert, setShowCreateAlert] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
        email: {
            enabled: true,
            address: ''
        },
        desktop: {
            enabled: true
        },
        telegram: {
            enabled: false
        },
        discord: {
            enabled: false
        },
        emailPreference: 'instant',
        sound: true
    });

    const [newAlert, setNewAlert] = useState<{
        type: string;
        name: string;
        condition: 'above' | 'below';
        value: string;
        customData: Record<string, any>;
    }>({
        type: '',
        name: '',
        condition: 'above',
        value: '',
        customData: {}
    });

    useEffect(() => {
        if (userData) {
            configureAlertApiAuth(userData.accessToken);
        }
    }, [userData]);

    useEffect(() => {
        if (isConnected) {
            fetchAlerts();
        } else {
            setAlerts([]);
            setLoading(false);
        }
    }, [isConnected]);

    // Fetch alerts from API
    const fetchAlerts = async () => {
        if (!isConnected) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await alertApiService.getAllAlerts();
            setAlerts(data);
        } catch (err) {
            setError('Failed to load alerts. Please try again later.');
            console.error('Error fetching alerts:', err);
        } finally {
            setLoading(false);
        }
    };

    // Refresh alerts
    const handleRefresh = async () => {
        try {
            setRefreshing(true);
            await fetchAlerts();
        } catch (err) {
            
        } finally {
            setRefreshing(false);
        }
    };

    const handleConnectWallet = async () => {
        try {
            await checkWalletAndUsername();
        } catch (err) {
            console.error('Failed to connect wallet:', err);
        }
    };

    const handleCreateAlert = async () => {
        if (!isConnected) {
            return;
        }

        if (!newAlert.type || !newAlert.name || !newAlert.value) {
            return;
        }

        try {
            const alertData: CreateAlertDto = {
                name: newAlert.name,
                type: newAlert.type,
                condition: newAlert.condition,
                value: parseFloat(newAlert.value),
                customData: newAlert.customData,
                isActive: true
            };

            const createdAlert = await alertApiService.createAlert(alertData);

            // Add the new alert to the list
            setAlerts(prev => [...prev, createdAlert]);

            // Reset form and close modal
            setShowCreateAlert(false);
            setNewAlert({ type: '', name: '', condition: 'above', value: '', customData: {} });

        } catch (err) {
            console.error('Error creating alert:', err);
        }
    };

    // Toggle alert status
    const toggleAlertStatus = async (id: string) => {
        if (!isConnected) {
            return;
        }

        try {
            const updatedAlert = await alertApiService.toggleAlertStatus(id);

            // Update the alert in the list
            setAlerts(prev => prev.map(alert =>
                alert.id === id ? updatedAlert : alert
            ));

        } catch (err) {
            console.error('Error toggling alert status:', err);
        }
    };

    // Delete alert
    const deleteAlert = async (id: string) => {
        if (!isConnected) {
            return;
        }

        try {
            await alertApiService.deleteAlert(id);

            // Remove the alert from the list
            setAlerts(prev => prev.filter(alert => alert.id !== id));

        } catch (err) {
            console.error('Error deleting alert:', err);
        }
    };

    // Get alert type configuration
    const getTypeConfig = (type: string) => {
        return alertTypes.find(t => t.id === type);
    };

    // Get alert type label with styling
    const getTypeLabel = (type: string) => {
        const config = getTypeConfig(type);
        return config ? (
            <span className={`px-3 py-1 rounded-full text-sm ${config.color}`}>
                {config.label.toUpperCase()}
            </span>
        ) : null;
    };

    // Handle custom field changes
    const handleCustomFieldChange = (fieldName: string, value: string) => {
        setNewAlert(prev => ({
            ...prev,
            customData: {
                ...prev.customData,
                [fieldName]: value
            }
        }));
    };

    // Render custom fields based on selected alert type
    const renderCustomFields = () => {
        const selectedType = alertTypes.find(type => type.id === newAlert.type);
        if (!selectedType?.customFields) return null;

        return (
            <div className="space-y-4">
                {selectedType.customFields.map(field => (
                    <div key={field.name}>
                        <label className="block text-sm text-white/60 mb-2">{field.label}</label>
                        {field.type === 'select' ? (
                            <select
                                value={(newAlert.customData as any)[field.name] || ''}
                                onChange={e => handleCustomFieldChange(field.name, e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-white/20"
                            >
                                <option value="">{field.placeholder || `Select ${field.label.toLowerCase()}`}</option>
                                {field.options?.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type={field.type}
                                value={(newAlert.customData as any)[field.name] || ''}
                                onChange={e => handleCustomFieldChange(field.name, e.target.value)}
                                placeholder={field.placeholder}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-white/20"
                            />
                        )}
                    </div>
                ))}
            </div>
        );
    };

    // Save notification settings
    const saveNotificationSettings = () => {
        setShowSettings(false);
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold">Alerts</h2>
                    {isConnected && (
                        <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-sm">
                            {alerts.filter(a => a.isActive).length} Active
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {isConnected ? (
                        <>
                            <button
                                onClick={handleRefresh}
                                className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${refreshing ? 'animate-spin' : ''}`}
                                disabled={refreshing}
                            >
                                <RefreshCw className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setShowSettings(true)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <Settings className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setShowCreateAlert(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Create Alert</span>
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleConnectWallet}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                        >
                            <Wallet className="w-4 h-4" />
                            <span>Connect Wallet</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Error message */}
            {error && (
                <div className="bg-red-500/20 text-red-400 p-4 rounded-lg mb-4">
                    {error}
                </div>
            )}

            {/* Not connected state */}
            {!isConnected && !loading && (
                <div className="flex flex-col items-center justify-center py-12 bg-white/5 rounded-xl">
                    <Wallet className="w-16 h-16 text-white/20 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Connect Your Wallet</h3>
                    <p className="text-white/60 mb-4 text-center max-w-md">
                        Connect your wallet to view and manage your market alerts
                    </p>
                    <button
                        onClick={handleConnectWallet}
                        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                    >
                        Connect Now
                    </button>
                </div>
            )}

            {/* Loading state */}
            {loading && (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                </div>
            )}

            {/* Alerts table (only show when connected and not loading) */}
            {isConnected && !loading && (
                <div className="bg-white/5 rounded-xl overflow-hidden">
                    {alerts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Bell className="w-12 h-12 text-white/20 mb-4" />
                            <p className="text-white/60">No alerts found</p>
                            <button
                                onClick={() => setShowCreateAlert(true)}
                                className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                            >
                                Create Your First Alert
                            </button>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-3 px-4 text-white/60">TYPE</th>
                                    <th className="text-left py-3 px-4 text-white/60">NAME</th>
                                    <th className="text-left py-3 px-4 text-white/60">CONDITION</th>
                                    <th className="text-left py-3 px-4 text-white/60">CREATED</th>
                                    <th className="text-left py-3 px-4 text-white/60">LAST TRIGGERED</th>
                                    <th className="text-left py-3 px-4 text-white/60">STATUS</th>
                                    <th className="text-left py-3 px-4 text-white/60">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {alerts.map(alert => (
                                    <tr key={alert.id} className="border-b border-white/5 last:border-0">
                                        <td className="py-3 px-4">
                                            {getTypeLabel(alert.type)}
                                        </td>
                                        <td className="py-3 px-4 font-medium">{alert.name}</td>
                                        <td className="py-3 px-4">
                                            <span className="text-white/60">{alert.condition}</span>{' '}
                                            <span>${alert.value.toLocaleString()}</span>
                                        </td>
                                        <td className="py-3 px-4 text-white/60">{alert.createdAt}</td>
                                        <td className="py-3 px-4 text-white/60">
                                            {alert.lastTriggered || 'Never'}
                                        </td>
                                        <td className="py-3 px-4">
                                            <button
                                                onClick={() => toggleAlertStatus(alert.id)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${alert.isActive ? 'bg-green-500' : 'bg-white/10'
                                                    }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${alert.isActive ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                />
                                            </button>
                                        </td>
                                        <td className="py-3 px-4">
                                            <button
                                                onClick={() => deleteAlert(alert.id)}
                                                className="p-1 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-red-400"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* Create Alert Modal */}
            {showCreateAlert && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCreateAlert(false)} />
                    <div className="relative glass border border-white/10 rounded-xl p-6 w-[500px]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold">Create New Alert</h3>
                            <button
                                onClick={() => setShowCreateAlert(false)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <Plus className="w-4 h-4 rotate-45" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-white/60 mb-2">Select Alert Type</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {alertTypes.map(type => (
                                        <button
                                            key={type.id}
                                            onClick={() => setNewAlert(prev => ({ ...prev, type: type.id }))}
                                            className={`p-3 rounded-lg transition-colors text-left ${newAlert.type === type.id
                                                ? 'bg-blue-500'
                                                : 'bg-white/5 hover:bg-white/10'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <type.icon className="w-4 h-4" />
                                                <span className="font-medium">{type.label}</span>
                                            </div>
                                            <p className="text-xs text-white/60">{type.description}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {newAlert.type && (
                                <>
                                    <div>
                                        <label className="block text-sm text-white/60 mb-2">Alert Name</label>
                                        <input
                                            type="text"
                                            value={newAlert.name}
                                            onChange={e => setNewAlert(prev => ({ ...prev, name: e.target.value }))}
                                            placeholder="Enter alert name"
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-white/20"
                                        />
                                    </div>

                                    {renderCustomFields()}

                                    <div>
                                        <label className="block text-sm text-white/60 mb-2">Condition</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <select
                                                value={newAlert.condition}
                                                onChange={e => setNewAlert(prev => ({ ...prev, condition: e.target.value as 'above' | 'below' }))}
                                                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-white/20"
                                            >
                                                <option value="above">Above</option>
                                                <option value="below">Below</option>
                                            </select>
                                            <input
                                                type="text"
                                                value={newAlert.value}
                                                onChange={e => setNewAlert(prev => ({ ...prev, value: e.target.value }))}
                                                placeholder="Enter value"
                                                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-white/20"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-white/60">
                                        <Bell className="w-4 h-4" />
                                        <span>You'll receive notifications when your conditions are met</span>
                                    </div>
                                </>
                            )}

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setShowCreateAlert(false)}
                                    className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateAlert}
                                    className={`px-4 py-2 rounded-lg transition-colors ${!newAlert.type || !newAlert.name || !newAlert.value
                                            ? 'bg-blue-500/50 cursor-not-allowed'
                                            : 'bg-blue-500 hover:bg-blue-600'
                                        }`}
                                    disabled={!newAlert.type || !newAlert.name || !newAlert.value}
                                >
                                    Create Alert
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Settings Modal */}
            {showSettings && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowSettings(false)} />
                    <div className="relative glass border border-white/10 rounded-xl p-6 w-[500px]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold">Notification Settings</h3>
                            <button
                                onClick={() => setShowSettings(false)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <Plus className="w-4 h-4 rotate-45" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Notification Channels */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Send className="w-5 h-5" />
                                        <div>
                                            <div className="font-medium">Email Alerts</div>
                                            <div className="text-sm text-white/60">Receive alerts via email</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setNotificationSettings(prev => ({
                                            ...prev,
                                            email: { ...prev.email, enabled: !prev.email.enabled }
                                        }))}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notificationSettings.email.enabled ? 'bg-green-500' : 'bg-white/10'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notificationSettings.email.enabled ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>

                                {notificationSettings.email.enabled && (
                                    <input
                                        type="email"
                                        value={notificationSettings.email.address}
                                        onChange={e => setNotificationSettings(prev => ({
                                            ...prev,
                                            email: { ...prev.email, address: e.target.value }
                                        }))}
                                        placeholder="Enter your email"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-white/20"
                                    />
                                )}

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Bell className="w-5 h-5" />
                                        <div>
                                            <div className="font-medium">Desktop Notifications</div>
                                            <div className="text-sm text-white/60">Get browser notifications</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setNotificationSettings(prev => ({
                                            ...prev,
                                            desktop: { enabled: !prev.desktop.enabled }
                                        }))}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notificationSettings.desktop.enabled ? 'bg-green-500' : 'bg-white/10'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notificationSettings.desktop.enabled ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <MessageSquare className="w-5 h-5" />
                                        <div>
                                            <div className="font-medium">Telegram Alerts</div>
                                            <div className="text-sm text-white/60">Get alerts on Telegram</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setNotificationSettings(prev => ({
                                            ...prev,
                                            telegram: { enabled: !prev.telegram.enabled }
                                        }))}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notificationSettings.telegram.enabled ? 'bg-green-500' : 'bg-white/10'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notificationSettings.telegram.enabled ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <MessageSquare className="w-5 h-5" />
                                        <div>
                                            <div className="font-medium">Discord Alerts</div>
                                            <div className="text-sm text-white/60">Get alerts on Discord</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setNotificationSettings(prev => ({
                                            ...prev,
                                            discord: { enabled: !prev.discord.enabled }
                                        }))}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notificationSettings.discord.enabled ? 'bg-green-500' : 'bg-white/10'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notificationSettings.discord.enabled ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* Email Preferences */}
                            {notificationSettings.email.enabled && (
                                <div>
                                    <h4 className="text-lg font-medium mb-4">Email Preferences</h4>
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                checked={notificationSettings.emailPreference === 'instant'}
                                                onChange={() => setNotificationSettings(prev => ({
                                                    ...prev,
                                                    emailPreference: 'instant'
                                                }))}
                                                className="form-radio text-blue-500"
                                            />
                                            <span>Send instantly</span>
                                        </label>
                                        <label className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                checked={notificationSettings.emailPreference === 'hourly'}
                                                onChange={() => setNotificationSettings(prev => ({
                                                    ...prev,
                                                    emailPreference: 'hourly'
                                                }))}
                                                className="form-radio text-blue-500"
                                            />
                                            <span>Hourly digest</span>
                                        </label>
                                        <label className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                checked={notificationSettings.emailPreference === 'daily'}
                                                onChange={() => setNotificationSettings(prev => ({
                                                    ...prev,
                                                    emailPreference: 'daily'
                                                }))}
                                                className="form-radio text-blue-500"
                                            />
                                            <span>Daily digest</span>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* Sound & Display */}
                            <div>
                                <h4 className="text-lg font-medium mb-4">Sound & Display</h4>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Volume2 className="w-5 h-5" />
                                        <div>
                                            <div className="font-medium">Alert Sounds</div>
                                            <div className="text-sm text-white/60">Play sound for new alerts</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setNotificationSettings(prev => ({
                                            ...prev,
                                            sound: !prev.sound
                                        }))}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notificationSettings.sound ? 'bg-green-500' : 'bg-white/10'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notificationSettings.sound ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowSettings(false)}
                                    className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={saveNotificationSettings}
                                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarketAlerts;