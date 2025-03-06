import React, { useState, useEffect, useRef } from 'react';
import {
  X, Filter, Clock, ExternalLink, Bell,
  RefreshCw, ArrowRightLeft, Wallet,
  Coins, Landmark, CheckCircle2, XCircle,
  ChevronDown, AlertTriangle, Info
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useWebSocket } from '../providers/WebSocketProvider';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose
}) => {
  // Use the WebSocket context 
  const {
    isConnected,
    alerts,
    unreadCount: websocketUnreadCount,
    markAllAlertsAsRead,
    markAlertAsRead
  } = useWebSocket();

  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const isTopbarBottom = useStore((state) => state.isTopbarBottom);
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelWidth, setPanelWidth] = useState(400);
  const [loading, setLoading] = useState(false);

  // Handle panel width for responsive design
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        if (window.innerWidth <= 480) {
          setPanelWidth(window.innerWidth - 20);
        } else {
          setPanelWidth(400);
        }
      };

      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const formatRelativeTime = (date: Date | number) => {
    const now = new Date();
    const timestamp = date instanceof Date ? date.getTime() : date;
    const diffInSeconds = Math.floor((now.getTime() - timestamp) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'swap': return <ArrowRightLeft className="w-5 h-5" />;
      case 'deposit': return <Wallet className="w-5 h-5" />;
      case 'reward': return <Coins className="w-5 h-5" />;
      case 'order': return <RefreshCw className="w-5 h-5" />;
      case 'loan': return <Landmark className="w-5 h-5" />;
      case 'PRICE_ALERT':
      case 'price': return <AlertTriangle className="w-5 h-5" />;
      case 'transaction': return <RefreshCw className="w-5 h-5" />;
      case 'general': return <Info className="w-5 h-5" />;
      case 'security': return <AlertTriangle className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'swap': return 'bg-blue-500/20 text-blue-400';
      case 'deposit': return 'bg-green-500/20 text-green-400';
      case 'reward': return 'bg-yellow-500/20 text-yellow-400';
      case 'order': return 'bg-purple-500/20 text-purple-400';
      case 'loan': return 'bg-orange-500/20 text-orange-400';
      case 'PRICE_ALERT':
      case 'price': return 'bg-yellow-500/20 text-yellow-400';
      case 'transaction': return 'bg-blue-500/20 text-blue-400';
      case 'general': return 'bg-gray-500/20 text-gray-400';
      case 'security': return 'bg-red-500/20 text-red-400';
      default: return 'bg-white/20 text-white';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'success': return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'info': return <Info className="w-4 h-4 text-blue-400" />;
      default: return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'success': return 'Success';
      case 'error': return 'Error';
      case 'warning': return 'Warning';
      case 'info': return 'Info';
      default: return severity;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      case 'info': return 'text-blue-400';
      default: return 'text-white/60';
    }
  };

  // Get all notification types from WebSocket alerts only
  const allTypes = new Set(['all', ...alerts.map(a => a.type)]);

  // Set up the combined list of statuses
  const allStatuses = new Set(['all', 'success', 'failed', 'info', 'warning', 'error']);

  // Only use the WebSocket alerts for display
  const combinedNotifications = alerts.map(a => ({
    id: a.data?.id || a.timestamp.toString(),
    type: a.type,
    title: a.title,
    message: a.message,
    timestamp: a.timestamp,
    status: a.status,
    txHash: a.txHash || '',
    isRead: a.read || false,
    source: 'websocket' as const,
    severity: a.severity || 'info',
    data: a.data
  }));

  const filteredNotifications = combinedNotifications
    .filter(n => selectedType === 'all' || n.type === selectedType)
    .filter(n => selectedStatus === 'all' || n.status === selectedStatus || n.severity === selectedStatus)
    .sort((a, b) => {
      return sortBy === 'newest'
        ? b.timestamp - a.timestamp
        : a.timestamp - b.timestamp;
    });

  // Only count WebSocket unread notifications
  const totalUnreadCount = websocketUnreadCount;

  const markAllNotificationsAsRead = async () => {
    setLoading(true);
    try {
      await markAllAlertsAsRead();
    } finally {
      setLoading(false);
    }
  };

  const markNotificationAsRead = async (notification: any) => {
    if (notification.data?.id) {
      await markAlertAsRead(notification.data.id);
    } else if (notification.id && notification.id !== notification.timestamp.toString()) {
      await markAlertAsRead(notification.id);
    } else {
      await markAlertAsRead(notification.timestamp);
    }
  };

  const notificationTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'swap', label: 'Swaps', icon: ArrowRightLeft },
    { value: 'deposit', label: 'Deposits', icon: Wallet },
    { value: 'reward', label: 'Rewards', icon: Coins },
    { value: 'order', label: 'Orders', icon: RefreshCw },
    { value: 'loan', label: 'Loans', icon: Landmark },
    { value: 'PRICE_ALERT', label: 'Price Alerts', icon: AlertTriangle },
    { value: 'transaction', label: 'Transactions', icon: RefreshCw },
    { value: 'general', label: 'General', icon: Info },
    { value: 'security', label: 'Security', icon: AlertTriangle }
  ];

  const statusTypes = [
    { value: 'all', label: 'All Status' },
    { value: 'success', label: 'Success', icon: CheckCircle2 },
    { value: 'error', label: 'Error', icon: XCircle },
    { value: 'warning', label: 'Warning', icon: AlertTriangle },
    { value: 'info', label: 'Info', icon: Info }
  ];

  if (!isOpen) return null;

  // Positioning styles for mobile
  const mobileStyles = {
    width: `${panelWidth}px`,
    right: '10px',
    left: 'auto',
    position: 'fixed' as 'fixed',
    top: isTopbarBottom ? 'auto' : '60px',
    bottom: isTopbarBottom ? '60px' : 'auto'
  };

  return (
    <div
      ref={panelRef}
      className="glass border border-white/10 rounded-xl shadow-lg z-50"
      style={mobileStyles}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5" />
          <h2 className="text-lg font-medium">Notifications</h2>
          {totalUnreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-blue-500 text-xs font-medium">
              {totalUnreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={markAllNotificationsAsRead}
            className={`text-sm text-white/60 hover:text-white transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            Mark all as read
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isConnected && (
        <div className="p-2 bg-yellow-500/20 border-b border-yellow-500/30 flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 text-yellow-400 mr-2" />
          <span className="text-sm text-yellow-400">Connection lost. Reconnecting...</span>
        </div>
      )}

      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-4 mb-4">
          {/* Type Dropdown */}
          <div className="flex-1 relative">
            <label className="block text-sm text-white/60 mb-1">Type</label>
            <button
              onClick={() => {
                setShowTypeDropdown(!showTypeDropdown);
                setShowStatusDropdown(false);
              }}
              className="w-full flex items-center justify-between p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                {selectedType === 'all' ? (
                  <Filter className="w-4 h-4" />
                ) : (
                  getTypeIcon(selectedType)
                )}
                <span>{notificationTypes.find(t => t.value === selectedType)?.label || selectedType}</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${showTypeDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showTypeDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowTypeDropdown(false)}
                />
                <div className="absolute top-full left-0 right-0 mt-1 py-1 glass rounded-lg z-20 border border-white/10">
                  {notificationTypes.filter(type => allTypes.has(type.value)).map(type => (
                    <button
                      key={type.value}
                      onClick={() => {
                        setSelectedType(type.value);
                        setShowTypeDropdown(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-white/10 transition-colors ${selectedType === type.value ? 'bg-white/10' : ''
                        }`}
                    >
                      {type.icon ? <type.icon className="w-4 h-4" /> : null}
                      <span>{type.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="flex-1 relative">
            <label className="block text-sm text-white/60 mb-1">Status</label>
            <button
              onClick={() => {
                setShowStatusDropdown(!showStatusDropdown);
                setShowTypeDropdown(false);
              }}
              className="w-full flex items-center justify-between p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                {selectedStatus === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                ) : selectedStatus === 'error' || selectedStatus === 'failed' ? (
                  <XCircle className="w-4 h-4 text-red-400" />
                ) : selectedStatus === 'warning' ? (
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                ) : selectedStatus === 'info' ? (
                  <Info className="w-4 h-4 text-blue-400" />
                ) : (
                  <Filter className="w-4 h-4" />
                )}
                <span>{statusTypes.find(s => s.value === selectedStatus)?.label || selectedStatus}</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showStatusDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowStatusDropdown(false)}
                />
                <div className="absolute top-full left-0 right-0 mt-1 py-1 glass rounded-lg z-20 border border-white/10">
                  {statusTypes.filter(status => allStatuses.has(status.value)).map(status => (
                    <button
                      key={status.value}
                      onClick={() => {
                        setSelectedStatus(status.value);
                        setShowStatusDropdown(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-white/10 transition-colors ${selectedStatus === status.value ? 'bg-white/10' : ''
                        }`}
                    >
                      {status.icon && (
                        <status.icon className={`w-4 h-4 ${status.value === 'success' ? 'text-green-400' :
                          status.value === 'error' || status.value === 'failed' ? 'text-red-400' :
                            status.value === 'warning' ? 'text-yellow-400' :
                              status.value === 'info' ? 'text-blue-400' : ''
                          }`} />
                      )}
                      <span>{status.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-white/60" />
            <span className="text-sm text-white/60">
              Showing {filteredNotifications.length} notifications
            </span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
            className="bg-white/5 px-3 py-1.5 rounded-lg outline-none text-sm border border-white/10 hover:bg-white/10 transition-colors cursor-pointer appearance-none pr-8 relative"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255, 255, 255, 0.6)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 8px center',
              backgroundSize: '16px'
            }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-[300px] overflow-y-auto notification-scrollbar">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Bell className="w-8 h-8 text-white/40 mb-2" />
            <p className="text-white/60">No notifications found</p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.source + "-" + notification.id}
                onClick={() => markNotificationAsRead(notification)}
                className={`p-4 hover:bg-white/5 transition-colors cursor-pointer ${!notification.isRead ? 'bg-white/5' : ''
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{notification.title}</h3>
                        {!notification.isRead && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-500 text-xs font-medium">
                            NEW
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-white/60 whitespace-nowrap">
                        {formatRelativeTime(notification.timestamp)}
                      </span>
                    </div>
                    <p className="text-white/60 mt-1 break-words">{notification.message}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-white/40" />
                        <span className="text-sm text-white/60">
                          {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {/* Show transaction hash for transactions */}
                      {notification.txHash && (
                        <a
                          href={`https://etherscan.io/tx/${notification.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="truncate max-w-[80px]">{notification.txHash}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}

                      {/* Display severity/status */}
                      <span className={`flex items-center gap-1 ${getSeverityColor(notification.severity)}`}>
                        {getSeverityIcon(notification.severity)}
                        <span className="text-sm">{getSeverityText(notification.severity)}</span>
                      </span>

                      {/* For PRICE_ALERT, show the current price and condition if available */}
                      {notification.type === 'PRICE_ALERT' && notification.data && (
                        <div className="flex flex-wrap items-center gap-1 mt-1 w-full">
                          <span className="text-sm text-white/60">
                            {notification.data.token || 'Asset'}: ${notification.data.currentPrice?.toLocaleString()}
                            {notification.data.condition && ` (${notification.data.condition.toLowerCase()} $${notification.data.thresholdValue?.toLocaleString()})`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};