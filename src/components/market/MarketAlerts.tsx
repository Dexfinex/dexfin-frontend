// File: src/components/MarketAlerts.tsx
import React, {useContext, useEffect, useState} from 'react';
import {Bell, Edit, Plus, RefreshCw, Trash2} from 'lucide-react';
import {alertApiService} from '../../services/alert.service';
import {Alert, alertTypes, CreateAlertDto, UpdateAlertDto} from '../../types/alert.types';
import {Web3AuthContext} from '../../providers/Web3AuthContext';
import {useWebSocket} from '../../providers/WebSocketProvider';

type AlertTypeId =
    'PRICE_ALERT' |
    'VOLUME_ALERT' |
    'TVL_ALERT' |
    'SOCIAL_ALERT' |
    'MARKET_CAP_ALERT' |
    'TREND_ALERT' |
    'WHALE_ALERT';

const TYPE_MAPPING: Record<string, AlertTypeId> = {
    'price': 'PRICE_ALERT',
    'volume': 'VOLUME_ALERT',
    'tvl': 'TVL_ALERT',
    'social': 'SOCIAL_ALERT',
    'marketcap': 'MARKET_CAP_ALERT',
    'trend': 'TREND_ALERT',
    'whale': 'WHALE_ALERT'
};

// Reverse mapping for edit functionality
const REVERSE_TYPE_MAPPING: Record<string, string> = {
    'PRICE_ALERT': 'price',
    'VOLUME_ALERT': 'volume',
    'TVL_ALERT': 'tvl',
    'SOCIAL_ALERT': 'social',
    'MARKET_CAP_ALERT': 'marketcap',
    'TREND_ALERT': 'trend',
    'WHALE_ALERT': 'whale'
};

export const MarketAlerts: React.FC = () => {
    // Access Web3Auth context
    const { isConnected } = useContext(Web3AuthContext);
    const { refreshAlerts } = useWebSocket();
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateAlert, setShowCreateAlert] = useState(false);
    const [showEditAlert, setShowEditAlert] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [editingAlertId, setEditingAlertId] = useState<string | null>(null);

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

    const [editAlert, setEditAlert] = useState<{
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
        if (isConnected) {
            fetchAlerts();
        } else {
            setAlerts([]);
            setLoading(false);
        }
    }, [isConnected]);

    // Initialize alerts as an empty array
    useEffect(() => {
        setAlerts([]);
    }, []);

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
            console.log(data);
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
            // Error handling
        } finally {
            setRefreshing(false);
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
                type: TYPE_MAPPING[newAlert.type] || newAlert.type,
                condition: newAlert.condition,
                value: newAlert.value,
                config: newAlert.customData,
            };

            const createdAlert = await alertApiService.createAlert(alertData);
            console.log(createdAlert)
            // Add the new alert to the list
            setAlerts(prev => [...prev, createdAlert]);

            // Reset form and close modal
            setShowCreateAlert(false);
            setNewAlert({ type: '', name: '', condition: 'above', value: '', customData: {} });

        } catch (err) {
            console.error('Error creating alert:', err);
        }
    };

    // Edit alert function
    const handleEditAlert = async () => {
        if (!isConnected || !editingAlertId) {
            return;
        }

        if (!editAlert.name || !editAlert.value) {
            return;
        }

        try {
            const alertData: UpdateAlertDto = {
                name: editAlert.name,
                type: TYPE_MAPPING[editAlert.type] || editAlert.type,
                condition: editAlert.condition,
                value: editAlert.value,
                config: editAlert.customData,
            };

            const updatedAlert = await alertApiService.updateAlert(editingAlertId, alertData);

            // Update the alert in the list
            setAlerts(prev => prev.map(alert =>
                alert.id === editingAlertId ? updatedAlert : alert
            ));

            // Reset form and close modal
            setShowEditAlert(false);
            setEditingAlertId(null);
            setEditAlert({ type: '', name: '', condition: 'above', value: '', customData: {} });

        } catch (err) {
            console.error('Error updating alert:', err);
        }
    };

    // Start editing an alert
    const startEditAlert = (alert: Alert) => {
        // Convert the API alert type to the UI type
        const uiType = REVERSE_TYPE_MAPPING[alert.type] || '';

        setEditingAlertId(alert.id);
        setEditAlert({
            type: uiType,
            name: alert.name,
            condition: alert.condition as 'above' | 'below',
            value: alert.value.toString(),
            customData: alert.config || {}
        });
        setShowEditAlert(true);
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
            refreshAlerts();

            // Remove the alert from the list
            setAlerts(prev => prev.filter(alert => alert.id !== id));

        } catch (err) {
            console.error('Error deleting alert:', err);
        }
    };

    // Get alert type configuration
    const getTypeConfig = (type: string) => {
        // Map from uppercase to lowercase for finding in alertTypes
        const lowercaseType = type.toLowerCase().replace('_alert', '');
        return alertTypes.find(t => t.id === lowercaseType);
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

    // Handle custom field changes for new alert
    const handleCustomFieldChange = (fieldName: string, value: string) => {
        setNewAlert(prev => ({
            ...prev,
            customData: {
                ...prev.customData,
                [fieldName]: value
            }
        }));
    };

    // Handle custom field changes for edit alert
    const handleEditCustomFieldChange = (fieldName: string, value: string) => {
        setEditAlert(prev => ({
            ...prev,
            customData: {
                ...prev.customData,
                [fieldName]: value
            }
        }));
    };

    // Render custom fields based on selected alert type for new alert
    const renderCustomFields = (alert: typeof newAlert, changeHandler: (fieldName: string, value: string) => void) => {
        const selectedType = alertTypes.find(type => type.id === alert.type);
        if (!selectedType?.customFields) return null;

        return (
            <div className="space-y-4">
                {selectedType.customFields.map(field => (
                    <div key={field.name}>
                        <label className="block text-sm text-white/60 mb-2">{field.label}</label>
                        {field.type === 'select' ? (
                            <select
                                value={(alert.customData as any)[field.name] || ''}
                                onChange={e => changeHandler(field.name, e.target.value)}
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
                                value={(alert.customData as any)[field.name] || ''}
                                onChange={e => changeHandler(field.name, e.target.value)}
                                placeholder={field.placeholder}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-white/20"
                            />
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold">Alerts</h2>
                    {isConnected && alerts && Array.isArray(alerts) && alerts.length > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-sm">
                            {alerts.filter(a => a && a.isActive).length} Active
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <>
                        <button
                            onClick={handleRefresh}
                            className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${refreshing ? 'animate-spin' : ''}`}
                            disabled={refreshing}
                        >
                            <RefreshCw className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setShowCreateAlert(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Create Alert</span>
                        </button>
                    </>
                </div>
            </div>

            {/* Error message */}
            {error && (
                <div className="bg-red-500/20 text-red-400 p-4 rounded-lg mb-4">
                    {error}
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
                    {!alerts || alerts.length === 0 ? (
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
                                {Array.isArray(alerts) && alerts.map(alert => alert && (
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
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => startEditAlert(alert)}
                                                    className="p-1 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-blue-400"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => deleteAlert(alert.id)}
                                                    className="p-1 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-red-400"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
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

                                    {renderCustomFields(newAlert, handleCustomFieldChange)}

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

            {/* Edit Alert Modal */}
            {showEditAlert && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowEditAlert(false)} />
                    <div className="relative glass border border-white/10 rounded-xl p-6 w-[500px]">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-semibold mb-3">Edit Alert</h3>
                                {editAlert.type && (
                                    <div className="mt-1">
                                        {getTypeLabel(TYPE_MAPPING[editAlert.type] || editAlert.type)}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => setShowEditAlert(false)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <Plus className="w-4 h-4 rotate-45" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-white/60 mb-2">Alert Name</label>
                                <input
                                    type="text"
                                    value={editAlert.name}
                                    onChange={e => setEditAlert(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Enter alert name"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-white/20"
                                />
                            </div>

                            {editAlert.type && renderCustomFields(editAlert, handleEditCustomFieldChange)}

                            <div>
                                <label className="block text-sm text-white/60 mb-2">Condition</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <select
                                        value={editAlert.condition}
                                        onChange={e => setEditAlert(prev => ({ ...prev, condition: e.target.value as 'above' | 'below' }))}
                                        className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-white/20"
                                    >
                                        <option value="above">Above</option>
                                        <option value="below">Below</option>
                                    </select>
                                    <input
                                        type="text"
                                        value={editAlert.value}
                                        onChange={e => setEditAlert(prev => ({ ...prev, value: e.target.value }))}
                                        placeholder="Enter value"
                                        className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-white/20"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-white/60">
                                <Bell className="w-4 h-4" />
                                <span>You'll receive notifications when your conditions are met</span>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setShowEditAlert(false)}
                                    className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleEditAlert}
                                    className={`px-4 py-2 rounded-lg transition-colors ${!editAlert.name || !editAlert.value
                                        ? 'bg-blue-500/50 cursor-not-allowed'
                                        : 'bg-blue-500 hover:bg-blue-600'
                                        }`}
                                    disabled={!editAlert.name || !editAlert.value}
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