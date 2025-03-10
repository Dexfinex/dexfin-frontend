import React, { useState, useEffect, useRef } from 'react';
import {
  X, Filter, Clock, ExternalLink, Bell,
  RefreshCw, ArrowRightLeft, Wallet,
  Coins, Landmark, CheckCircle2, XCircle,
  ChevronDown, AlertTriangle, Info, Award
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useWebSocket } from '../providers/WebSocketProvider';
import type { Notification } from '../providers/WebSocketProvider';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose
}) => {
  const {
    isConnected,
    notifications,
    unreadCount,
    markAsRead,
    fetchAllNotifications
  } = useWebSocket();

  const [selectedType, setSelectedType] = useState<string>('all');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const isTopbarBottom = useStore((state) => state.isTopbarBottom);
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelWidth, setPanelWidth] = useState(400);
  const [loading, setLoading] = useState(false);
  const [allNotifications, setAllNotifications] = useState<Notification[]>([] as Notification[]);

  // Load initial data when panel opens
  useEffect(() => {
    if (isOpen) {
      refreshData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (notifications && Array.isArray(notifications)) {
      setAllNotifications(notifications as Notification[]);
    }
  }, [notifications]);

  const refreshData = async () => {
    setLoading(true);
    try {
      await fetchAllNotifications();
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setAllNotifications([] as Notification[]);
    } finally {
      setLoading(false);
    }
  };

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

  const formatRelativeTime = (date: Date | string | number) => {
    try {
      const now = new Date();
      let timestamp: number;

      if (date instanceof Date) {
        timestamp = date.getTime();
      } else if (typeof date === 'string') {
        timestamp = new Date(date).getTime();
      } else {
        timestamp = date;
      }

      const diffInSeconds = Math.floor((now.getTime() - timestamp) / 1000);

      if (diffInSeconds < 60) return 'Just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Unknown time";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'TRANSACTION':
        return <ArrowRightLeft className="w-5 h-5" />;
      case 'SWAP':
        return <ArrowRightLeft className="w-5 h-5" />;
      case 'DEPOSIT':
        return <Wallet className="w-5 h-5" />;
      case 'REWARD':
        return <Coins className="w-5 h-5" />;
      case 'ORDER':
        return <RefreshCw className="w-5 h-5" />;
      case 'LOAN':
        return <Landmark className="w-5 h-5" />;
      case 'ALERT':
        return <AlertTriangle className="w-5 h-5" />;
      case 'SYSTEM':
        return <Info className="w-5 h-5" />;
      case 'ACHIEVEMENT':
        return <Award className="w-5 h-5" />;
      case 'SECURITY':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'TRANSACTION':
        return 'bg-blue-500/20 text-blue-400';
      case 'SWAP':
        return 'bg-blue-500/20 text-blue-400';
      case 'DEPOSIT':
        return 'bg-green-500/20 text-green-400';
      case 'REWARD':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'ORDER':
        return 'bg-purple-500/20 text-purple-400';
      case 'LOAN':
        return 'bg-orange-500/20 text-orange-400';
      case 'ALERT':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'SYSTEM':
        return 'bg-gray-500/20 text-gray-400';
      case 'ACHIEVEMENT':
        return 'bg-indigo-500/20 text-indigo-400';
      case 'SECURITY':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-white/20 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    if (!status) return <Info className="w-4 h-4 text-blue-400" />;

    switch (status) {
      case 'SUCCESS':
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'ERROR':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'INFO':
        return <Info className="w-4 h-4 text-blue-400" />;
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      default:
        return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    if (!status) return 'text-white/60';

    switch (status) {
      case 'SUCCESS': return 'text-green-400';
      case 'ERROR': return 'text-red-400';
      case 'WARNING': return 'text-yellow-400';
      case 'INFO': return 'text-blue-400';
      case 'PENDING': return 'text-yellow-400';
      default: return 'text-white/60';
    }
  };

  const allNotificationTypes = React.useMemo(() => ['all', ...new Set(
    Array.isArray(allNotifications)
      ? allNotifications.map(n => n.type).filter(Boolean)
      : []
  )], [allNotifications]);

  const sortedNotifications = React.useMemo(() => {
    if (!Array.isArray(allNotifications)) return [];

    return [...allNotifications].sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return sortBy === 'newest' ? bTime - aTime : aTime - bTime;
    });
  }, [allNotifications, sortBy]);

  const filteredNotifications = React.useMemo(() => {
    if (selectedType === 'all') return sortedNotifications;
    return sortedNotifications.filter(n => n.type === selectedType);
  }, [selectedType, sortedNotifications]);

  const groupedNotifications = React.useMemo(() => {
    return filteredNotifications.reduce((acc, notification) => {
      if (!notification || typeof notification !== 'object') {
        return acc;
      }

      const type = notification.type || 'unknown';
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(notification);
      return acc;
    }, {} as Record<string, Notification[]>);
  }, [filteredNotifications]);

  const markAllNotificationsAsRead = async () => {
    setLoading(true);
    try {
      if (!Array.isArray(allNotifications) || allNotifications.length === 0) {
        return;
      }

      const unreadIds = allNotifications
        .filter(n => !n.isRead)
        .map(n => n.id);

      if (unreadIds.length > 0) {
        await markAsRead(unreadIds);
        const updatedNotifications = allNotifications.map(notification => ({
          ...notification,
          isRead: true
        }));

        setAllNotifications(updatedNotifications as Notification[]);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    } finally {
      setLoading(false);
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    if (!notificationId) return;

    setLoading(true);
    try {
      await markAsRead([notificationId]);

      const updatedNotifications = allNotifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      );

      setAllNotifications(updatedNotifications as Notification[]);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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
      className="bg-black/90 border border-white/10 rounded-md shadow-xl z-50"
      style={mobileStyles}
    >
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <Bell className="w-5 h-5" />
          <h2 className="text-base font-medium">Notifications</h2>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded bg-blue-600 text-xs font-medium">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={markAllNotificationsAsRead}
            className={`text-sm text-white/80 hover:text-white transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            Mark all as read
          </button>
          <button
            onClick={onClose}
            className="hover:text-white/80 transition-colors"
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
          <div className="relative">
            <button
              onClick={() => setShowTypeDropdown(!showTypeDropdown)}
              className="flex items-center justify-between h-9 px-3 bg-black/40 hover:bg-black/60 rounded transition-colors"
            >
              <div className="flex items-center gap-2">
                {selectedType === 'all' ? (
                  <Filter className="w-4 h-4" />
                ) : (
                  getTypeIcon(selectedType)
                )}
                <span>All Types</span>
              </div>
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showTypeDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showTypeDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowTypeDropdown(false)}
                />
                <div className="absolute top-full left-0 mt-0.5 py-0 rounded z-20 border border-white/10 min-w-full bg-black/80 overflow-hidden">
                  <button
                    onClick={() => {
                      setSelectedType('all');
                      setShowTypeDropdown(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-blue-500 text-left"
                  >
                    <Filter className="w-4 h-4" />
                    <span>All Types</span>
                  </button>
                  {allNotificationTypes.map(type => {
                    if (type === 'all') return null;
                    return (
                      <button
                        key={type}
                        onClick={() => {
                          setSelectedType(type);
                          setShowTypeDropdown(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-blue-500 text-left"
                      >
                        {getTypeIcon(type)}
                        <span>{type.charAt(0) + type.slice(1).toLowerCase()}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <div className="flex-1"></div>

          <div className="flex items-center gap-2">
            <button
              onClick={refreshData}
              className={`p-1.5 hover:bg-black/60 rounded transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <div className="relative">
              <button
                onClick={() => setSortBy(sortBy === 'newest' ? 'oldest' : 'newest')}
                className="flex items-center justify-between h-9 px-3 bg-black/40 hover:bg-black/60 rounded transition-colors"
              >
                <span>{sortBy === 'newest' ? 'Newest First' : 'Oldest First'}</span>
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-white/60" />
            <span className="text-sm text-white/60">
              Showing {filteredNotifications.length} notifications
            </span>
          </div>
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {loading && filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <RefreshCw className="w-8 h-8 text-white/40 mb-2 animate-spin" />
            <p className="text-white/60">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Bell className="w-8 h-8 text-white/40 mb-2" />
            <p className="text-white/60">No notifications found</p>
          </div>
        ) : (
          <div>
            {selectedType === 'all' ? (
              Object.entries(groupedNotifications).map(([type, typeNotifications]) => (
                <div key={type}>
                  <div className="flex items-center gap-2 px-4 py-1.5 text-sm text-white/70">
                    {getTypeIcon(type)}
                    <span>{type}</span>
                    <span className="text-xs text-white/60">({typeNotifications.length})</span>
                  </div>
                  <div>
                    {typeNotifications.map((notification) => renderNotification(notification))}
                  </div>
                </div>
              ))
            ) : (
              <div>
                {filteredNotifications.map((notification) => renderNotification(notification))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  function renderNotification(notification: Notification) {
    if (!notification || !notification.id) {
      return null;
    }

    // Calculate appropriate icon based on notification type
    let notificationIcon;
    if (notification.type === 'TRANSACTION') {
      notificationIcon = <ArrowRightLeft className="w-5 h-5 text-blue-500" />;
    } else if (notification.type === 'ALERT') {
      notificationIcon = <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    } else if (notification.type === 'SECURITY') {
      notificationIcon = <AlertTriangle className="w-5 h-5 text-red-500" />;
    } else if (notification.type === 'REWARD') {
      notificationIcon = <Coins className="w-5 h-5 text-yellow-500" />;
    } else if (notification.type === 'SYSTEM') {
      notificationIcon = <Info className="w-5 h-5 text-gray-500" />;
    } else {
      notificationIcon = <Bell className="w-5 h-5" />;
    }

    // Calculate appropriate background color
    let bgColorClass = 'bg-gray-800/30';
    if (notification.type === 'TRANSACTION') {
      bgColorClass = 'bg-blue-700/30';
    } else if (notification.type === 'ALERT') {
      bgColorClass = 'bg-yellow-700/30';
    } else if (notification.type === 'SECURITY') {
      bgColorClass = 'bg-red-700/30';
    } else if (notification.type === 'REWARD') {
      bgColorClass = 'bg-yellow-700/30';
    } else if (notification.type === 'SYSTEM') {
      bgColorClass = 'bg-gray-700/30';
    }

    return (
      <div
        key={notification.id}
        onClick={() => markNotificationAsRead(notification.id)}
        className="p-4 hover:bg-black/40 transition-colors cursor-pointer"
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${bgColorClass}`}>
            {notificationIcon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{notification.type}</h3>
                {!notification.isRead && (
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-600 text-white">
                    NEW
                  </span>
                )}
              </div>
              <span className="text-sm text-white/60 whitespace-nowrap">
                {formatRelativeTime(notification.createdAt)}
              </span>
            </div>
            <p className="text-white/80 mt-1 break-words">{notification.message}</p>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-white/40" />
                <span className="text-xs text-white/60">
                  {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} AM
                </span>
              </div>

              <span className={`flex items-center gap-1 ${getStatusColor(notification.status)}`}>
                {getStatusIcon(notification.status)}
                <span className="text-xs">{notification.status}</span>
              </span>
            </div>
            
            {/* Display metadata based on notification type */}
            {notification.type === 'ALERT' && notification.metadata && (
              <div className="mt-2 text-xs text-white/60">
                {notification.metadata.name && (
                  <div>Alert Name: {notification.metadata.name}</div>
                )}
                {notification.metadata.threshold && (
                  <div>Threshold: {notification.metadata.threshold}</div>
                )}
                {notification.metadata.currentPrice && (
                  <div>Current Price: {notification.metadata.currentPrice}</div>
                )}
              </div>
            )}
            
            {notification.type === 'TRANSACTION' && notification.metadata && (
              <div className="mt-2 text-xs text-white/60">
                {notification.metadata.tokenIn && (
                  <div>Token In: {notification.metadata.tokenIn}</div>
                )}
                {notification.metadata.tokenOut && (
                  <div>Token Out: {notification.metadata.tokenOut}</div>
                )}
                {notification.metadata.amountIn && (
                  <div>Amount In: {notification.metadata.amountIn}</div>
                )}
                {notification.metadata.amountOut && (
                  <div>Amount Out: {notification.metadata.amountOut}</div>
                )}
                {notification.metadata.chainId && (
                  <div>Chain ID: {notification.metadata.chainId}</div>
                )}
                {notification.metadata.walletAddress && (
                  <div className="truncate">
                    Wallet: {notification.metadata.walletAddress}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
};