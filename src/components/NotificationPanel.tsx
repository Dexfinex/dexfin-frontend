import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  X, Filter, Clock, ExternalLink, Bell,
  RefreshCw, ArrowRightLeft, Wallet,
  Coins, Landmark, CheckCircle2, XCircle,
  ChevronDown, AlertTriangle, Info, Award,
  Shield, CreditCard, Upload, Download
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useWebSocket } from '../providers/WebSocketProvider';
import type { Notification } from '../providers/WebSocketProvider';

// Define notification types as a constant for better type safety
export const NOTIFICATION_TYPES = {
  TRANSACTION: 'TRANSACTION',
  SWAP: 'SWAP',
  DEPOSIT: 'DEPOSIT',
  WITHDRAWAL: 'WITHDRAWAL',
  REWARD: 'REWARD',
  ORDER: 'ORDER',
  LOAN: 'LOAN',
  ALERT: 'ALERT',
  SYSTEM: 'SYSTEM',
  ACHIEVEMENT: 'ACHIEVEMENT',
  SECURITY: 'SECURITY',
  PAYMENT: 'PAYMENT',
  ALL: 'all'
} as const;

// Define notification statuses as a constant
export const NOTIFICATION_STATUSES = {
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  WARNING: 'WARNING',
  INFO: 'INFO',
  PENDING: 'PENDING'
} as const;

// Define Chain IDs for better readability
export const CHAIN_IDS = {
  ETHEREUM: 1,
  ARBITRUM: 42161,
  BSC: 56,
  POLYGON: 137,
  OPTIMISM: 10,
  AVALANCHE: 43114
} as const;

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

  const [selectedType, setSelectedType] = useState<string>(NOTIFICATION_TYPES.ALL);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const isTopbarBottom = useStore((state) => state.isTopbarBottom);
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelWidth, setPanelWidth] = useState(400);
  const [loading, setLoading] = useState(false);
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);

  // Load initial data when panel opens
  useEffect(() => {
    if (isOpen) {
      refreshData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (notifications && Array.isArray(notifications)) {
      setAllNotifications(notifications);
    }
  }, [notifications]);

  const refreshData = async () => {
    setLoading(true);
    try {
      await fetchAllNotifications();
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setAllNotifications([]);
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

  // Improved getTypeIcon function with more comprehensive types
  const getTypeIcon = (type: string) => {
    switch (type) {
      case NOTIFICATION_TYPES.TRANSACTION:
        return <ArrowRightLeft className="w-5 h-5" />;
      case NOTIFICATION_TYPES.SWAP:
        return <ArrowRightLeft className="w-5 h-5" />;
      case NOTIFICATION_TYPES.DEPOSIT:
        return <Upload className="w-5 h-5" />;
      case NOTIFICATION_TYPES.WITHDRAWAL:
        return <Download className="w-5 h-5" />;
      case NOTIFICATION_TYPES.REWARD:
        return <Coins className="w-5 h-5" />;
      case NOTIFICATION_TYPES.ORDER:
        return <RefreshCw className="w-5 h-5" />;
      case NOTIFICATION_TYPES.LOAN:
        return <Landmark className="w-5 h-5" />;
      case NOTIFICATION_TYPES.ALERT:
        return <AlertTriangle className="w-5 h-5" />;
      case NOTIFICATION_TYPES.SYSTEM:
        return <Info className="w-5 h-5" />;
      case NOTIFICATION_TYPES.ACHIEVEMENT:
        return <Award className="w-5 h-5" />;
      case NOTIFICATION_TYPES.SECURITY:
        return <Shield className="w-5 h-5" />;
      case NOTIFICATION_TYPES.PAYMENT:
        return <CreditCard className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  // Improved getTypeColor function with better consistency
  const getTypeColor = (type: string) => {
    switch (type) {
      case NOTIFICATION_TYPES.TRANSACTION:
        return 'bg-blue-500/20 text-blue-400';
      case NOTIFICATION_TYPES.SWAP:
        return 'bg-blue-500/20 text-blue-400';
      case NOTIFICATION_TYPES.DEPOSIT:
        return 'bg-green-500/20 text-green-400';
      case NOTIFICATION_TYPES.WITHDRAWAL:
        return 'bg-red-500/20 text-red-400';
      case NOTIFICATION_TYPES.REWARD:
        return 'bg-yellow-500/20 text-yellow-400';
      case NOTIFICATION_TYPES.ORDER:
        return 'bg-purple-500/20 text-purple-400';
      case NOTIFICATION_TYPES.LOAN:
        return 'bg-orange-500/20 text-orange-400';
      case NOTIFICATION_TYPES.ALERT:
        return 'bg-yellow-500/20 text-yellow-400';
      case NOTIFICATION_TYPES.SYSTEM:
        return 'bg-gray-500/20 text-gray-400';
      case NOTIFICATION_TYPES.ACHIEVEMENT:
        return 'bg-indigo-500/20 text-indigo-400';
      case NOTIFICATION_TYPES.SECURITY:
        return 'bg-red-500/20 text-red-400';
      case NOTIFICATION_TYPES.PAYMENT:
        return 'bg-green-500/20 text-green-400';
      default:
        return 'bg-white/20 text-white';
    }
  };

  // Improved getStatusIcon function 
  const getStatusIcon = (status: string) => {
    if (!status) return <Info className="w-4 h-4 text-blue-400" />;

    switch (status) {
      case NOTIFICATION_STATUSES.SUCCESS:
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case NOTIFICATION_STATUSES.ERROR:
        return <XCircle className="w-4 h-4 text-red-400" />;
      case NOTIFICATION_STATUSES.WARNING:
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case NOTIFICATION_STATUSES.INFO:
        return <Info className="w-4 h-4 text-blue-400" />;
      case NOTIFICATION_STATUSES.PENDING:
        return <Clock className="w-4 h-4 text-yellow-400" />;
      default:
        return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  // Improved getStatusColor function
  const getStatusColor = (status: string) => {
    if (!status) return 'text-white/60';

    switch (status) {
      case NOTIFICATION_STATUSES.SUCCESS: 
        return 'text-green-400';
      case NOTIFICATION_STATUSES.ERROR: 
        return 'text-red-400';
      case NOTIFICATION_STATUSES.WARNING: 
        return 'text-yellow-400';
      case NOTIFICATION_STATUSES.INFO: 
        return 'text-blue-400';
      case NOTIFICATION_STATUSES.PENDING: 
        return 'text-yellow-400';
      default: 
        return 'text-white/60';
    }
  };

  // Get notification background color
  const getNotificationBgColor = (type: string) => {
    switch (type) {
      case NOTIFICATION_TYPES.TRANSACTION:
      case NOTIFICATION_TYPES.SWAP:
        return 'bg-blue-700/30';
      case NOTIFICATION_TYPES.ALERT:
        return 'bg-yellow-700/30';
      case NOTIFICATION_TYPES.SECURITY:
        return 'bg-red-700/30';
      case NOTIFICATION_TYPES.REWARD:
        return 'bg-yellow-700/30';
      case NOTIFICATION_TYPES.DEPOSIT:
        return 'bg-green-700/30';
      case NOTIFICATION_TYPES.WITHDRAWAL:
        return 'bg-red-700/30';
      case NOTIFICATION_TYPES.SYSTEM:
        return 'bg-gray-700/30';
      case NOTIFICATION_TYPES.ACHIEVEMENT:
        return 'bg-indigo-700/30';
      case NOTIFICATION_TYPES.PAYMENT:
        return 'bg-green-700/30';
      case NOTIFICATION_TYPES.LOAN:
        return 'bg-orange-700/30';
      case NOTIFICATION_TYPES.ORDER:
        return 'bg-purple-700/30';
      default:
        return 'bg-gray-800/30';
    }
  };

  // Get chain name from chain ID
  const getChainName = (chainId: number): string => {
    switch (chainId) {
      case CHAIN_IDS.ETHEREUM: 
        return 'Ethereum';
      case CHAIN_IDS.ARBITRUM: 
        return 'Arbitrum';
      case CHAIN_IDS.BSC: 
        return 'BSC';
      case CHAIN_IDS.POLYGON: 
        return 'Polygon';
      case CHAIN_IDS.OPTIMISM: 
        return 'Optimism';
      case CHAIN_IDS.AVALANCHE: 
        return 'Avalanche';
      default: 
        return `Chain ${chainId}`;
    }
  };

  // Shorten address helper
  const shortenAddress = (address: string): string => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Get explorer URL based on chain ID
  const getExplorerUrl = (chainId?: number): string => {
    if (!chainId) return 'https://etherscan.io/tx/';
    
    switch (chainId) {
      case CHAIN_IDS.ARBITRUM:
        return 'https://arbiscan.io/tx/';
      case CHAIN_IDS.BSC:
        return 'https://bscscan.com/tx/';
      case CHAIN_IDS.POLYGON:
        return 'https://polygonscan.com/tx/';
      case CHAIN_IDS.OPTIMISM:
        return 'https://optimistic.etherscan.io/tx/';
      case CHAIN_IDS.AVALANCHE:
        return 'https://snowtrace.io/tx/';
      case CHAIN_IDS.ETHEREUM:
      default:
        return 'https://etherscan.io/tx/';
    }
  };

  // Parse JSON metadata safely
  const parseMetadata = (metadataStr: string | object | undefined) => {
    if (!metadataStr) return {};
    
    if (typeof metadataStr === 'string') {
      try {
        return JSON.parse(metadataStr);
      } catch (e) {
        console.error('Error parsing metadata:', e);
        return {};
      }
    }
    
    return metadataStr || {};
  };

  const allNotificationTypes = useMemo(() => [
    NOTIFICATION_TYPES.ALL, 
    ...new Set(
      Array.isArray(allNotifications)
        ? allNotifications.map(n => n.type).filter(Boolean)
        : []
    )
  ], [allNotifications]);

  const sortedNotifications = useMemo(() => {
    if (!Array.isArray(allNotifications)) return [];

    return [...allNotifications].sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return sortBy === 'newest' ? bTime - aTime : aTime - bTime;
    });
  }, [allNotifications, sortBy]);

  const filteredNotifications = useMemo(() => {
    if (selectedType === NOTIFICATION_TYPES.ALL) return sortedNotifications;
    return sortedNotifications.filter(n => n.type === selectedType);
  }, [selectedType, sortedNotifications]);

  const groupedNotifications = useMemo(() => {
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

        setAllNotifications(updatedNotifications);
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

      setAllNotifications(updatedNotifications);
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
                {selectedType === NOTIFICATION_TYPES.ALL ? (
                  <Filter className="w-4 h-4" />
                ) : (
                  getTypeIcon(selectedType)
                )}
                <span>
                  {selectedType === NOTIFICATION_TYPES.ALL 
                    ? 'All Types' 
                    : selectedType.charAt(0) + selectedType.slice(1).toLowerCase()}
                </span>
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
                      setSelectedType(NOTIFICATION_TYPES.ALL);
                      setShowTypeDropdown(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-blue-500 text-left"
                  >
                    <Filter className="w-4 h-4" />
                    <span>All Types</span>
                  </button>
                  {allNotificationTypes.map(type => {
                    if (type === NOTIFICATION_TYPES.ALL) return null;
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
            {selectedType === NOTIFICATION_TYPES.ALL ? (
              Object.entries(groupedNotifications).map(([type, typeNotifications]) => (
                <div key={type}>
                  <div className="flex items-center gap-2 px-4 py-1.5 text-sm text-white/70">
                    {getTypeIcon(type)}
                    <span>{type.charAt(0) + type.slice(1).toLowerCase()}</span>
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

    // Parse metadata safely
    const metadata = parseMetadata(notification.metadata);
    
    // Get appropriate background color
    const bgColorClass = getNotificationBgColor(notification.type);

    const renderMetadata = () => {
      if (!metadata) return null;
    
      if (notification.type === NOTIFICATION_TYPES.ALERT) {
        // Base content for all alert types
        const alertContent = (
          <>
            {metadata.token && (
              <div className="flex items-center mb-1">
                <span className="font-medium mr-1">Token:</span> 
                <span>{metadata.symbol ? `${metadata.token} (${metadata.symbol})` : metadata.token}</span>
              </div>
            )}
            {metadata.name && (
              <div className="mb-1">
                <span className="font-medium mr-1">Alert:</span> {metadata.name}
              </div>
            )}
          </>
        );
    
        // Handle specific alert types
        switch (metadata.alertyType) {
          case 'PRICE_ALERT':
            return (
              <div className="mt-2 text-xs text-white/70 bg-yellow-900/20 p-2 rounded">
                {alertContent}
                {metadata.condition && metadata.thresholdValue && (
                  <div className="mb-1">
                    <span className="font-medium mr-1">Condition:</span> 
                    Price {metadata.condition} ${parseFloat(metadata.thresholdValue).toLocaleString()}
                  </div>
                )}
                {metadata.currentPrice && (
                  <div className="mb-1">
                    <span className="font-medium mr-1">Current Price:</span> 
                    ${parseFloat(metadata.currentPrice).toLocaleString()}
                  </div>
                )}
                <div className="mt-1 text-xs flex items-center">
                  <span className={`px-1.5 py-0.5 rounded ${
                    metadata.condition === 'above' ? 'bg-green-500/30 text-green-400' : 'bg-red-500/30 text-red-400'
                  }`}>
                    {metadata.condition === 'above' ? 'Price Increased' : 'Price Decreased'}
                  </span>
                </div>
              </div>
            );
    
          case 'VOLUME_ALERT':
            return (
              <div className="mt-2 text-xs text-white/70 bg-purple-900/20 p-2 rounded">
                {alertContent}
                {metadata.condition && metadata.volumeThreshold && (
                  <div className="mb-1">
                    <span className="font-medium mr-1">Volume Condition:</span> 
                    {metadata.condition} ${parseFloat(metadata.volumeThreshold).toLocaleString()}
                  </div>
                )}
                {metadata.currentVolume && (
                  <div className="mb-1">
                    <span className="font-medium mr-1">Current Volume:</span> 
                    ${parseFloat(metadata.currentVolume).toLocaleString()}
                  </div>
                )}
                {typeof metadata.priceChangePercent !== 'undefined' && (
                  <div className="mb-1">
                    <span className="font-medium mr-1">24h Change:</span> 
                    <span className={metadata.priceChangePercent >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {metadata.priceChangePercent >= 0 ? '+' : ''}{parseFloat(metadata.priceChangePercent).toFixed(2)}%
                    </span>
                  </div>
                )}
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className={`px-1.5 py-0.5 rounded bg-purple-500/30 text-purple-400`}>
                    Volume Alert
                  </span>
                  {typeof metadata.priceChangeThreshold !== 'undefined' && typeof metadata.priceChangePercent !== 'undefined' && (
                    <span className={`px-1.5 py-0.5 rounded ${
                      metadata.priceChangePercent < metadata.priceChangeThreshold ? 'bg-red-500/30 text-red-400' : 'bg-yellow-500/30 text-yellow-400'
                    }`}>
                      Price Change
                    </span>
                  )}
                </div>
              </div>
            );
    
          // default:
          //   // For unknown alert types or when alertType is not provided
          //   return (
          //     <div className="mt-2 text-xs text-white/60">
          //       {alertContent}
          //       {metadata.threshold && <div className="mb-1">Threshold: {metadata.threshold}</div>}
          //       {metadata.currentPrice && (
          //         <div className="mb-1">Current Price: ${parseFloat(metadata.currentPrice).toLocaleString()}</div>
          //       )}
          //       {metadata.changePercent && (
          //         <div>Change: {parseFloat(metadata.changePercent).toFixed(2)}%</div>
          //       )}
          //     </div>
          //   );
        }
      }
    
      if (notification.type === NOTIFICATION_TYPES.TRANSACTION || 
          notification.type === NOTIFICATION_TYPES.SWAP) {
        // Extract transaction hash from metadata
        let txHash = metadata.tradeHash || '';
        
        // Check if there are transactions in statusData
        if (metadata.statusData?.transactions?.length > 0) {
          txHash = metadata.statusData.transactions[0].hash || txHash;
        }
    
        // Get explorer URL based on chain ID
        const explorerUrl = getExplorerUrl(metadata.chainId);
    
        return (
          <div className="mt-2 text-xs text-white/60">
            {/* Display token information */}
            <div className="flex items-center mb-1">
              {metadata.tokenIn && (
                <>
                  <span>{metadata.tokenIn.symbol || metadata.tokenIn}</span>
                  <span className="mx-1">→</span>
                </>
              )}
              {metadata.tokenOut && (
                <span>{metadata.tokenOut.symbol || metadata.tokenOut}</span>
              )}
            </div>
    
            {/* Display amounts */}
            <div className="flex items-center mb-1">
              {metadata.tokenIn?.amount && (
                <>
                  <span>{metadata.tokenIn.amount}</span>
                  <span className="mx-1">→</span>
                </>
              )}
              {metadata.tokenOut?.amount && (
                <span>{metadata.tokenOut.amount}</span>
              )}
            </div>
    
            {/* Show chain ID if available */}
            {metadata.chainId && (
              <div className="mb-1">Chain: {getChainName(metadata.chainId)}</div>
            )}
    
            {/* Transaction Hash (clickable) */}
            {txHash && (
              <a
                href={`${explorerUrl}${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center mt-1 text-blue-400 hover:text-blue-300"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="truncate max-w-[200px]">{txHash}</span>
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            )}
            
            {/* Wallet address if available */}
            {metadata.walletAddress && (
              <div className="mt-1 truncate max-w-[200px]">
                From: {shortenAddress(metadata.walletAddress)}
              </div>
            )}
          </div>
        );
      }
    
      if (notification.type === NOTIFICATION_TYPES.DEPOSIT || 
          notification.type === NOTIFICATION_TYPES.WITHDRAWAL) {
        return (
          <div className="mt-2 text-xs text-white/60">
            {metadata.amount && (
              <div className="mb-1">
                Amount: {metadata.amount} {metadata.currency || metadata.token || ''}
              </div>
            )}
            {metadata.chainId && (
              <div className="mb-1">Chain: {getChainName(metadata.chainId)}</div>
            )}
            {metadata.txHash && (
              <a
                href={`${getExplorerUrl(metadata.chainId)}${metadata.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center mt-1 text-blue-400 hover:text-blue-300"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="truncate max-w-[200px]">{metadata.txHash}</span>
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            )}
          </div>
        );
      }
    
      return null;
    };

    return (
      <div
        key={notification.id}
        onClick={() => markNotificationAsRead(notification.id)}
        className="p-4 hover:bg-black/40 transition-colors cursor-pointer"
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${bgColorClass}`}>
            {getTypeIcon(notification.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">
                  {notification.type.charAt(0) + notification.type.slice(1).toLowerCase()}
                </h3>
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
                  {new Date(notification.createdAt).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>

              <span className={`flex items-center gap-1 ${getStatusColor(notification.status)}`}>
                {getStatusIcon(notification.status)}
                <span className="text-xs">{notification.status}</span>
              </span>
            </div>
            
            {/* Render metadata based on notification type */}
            {renderMetadata()}
          </div>
        </div>
      </div>
    );
  }
};