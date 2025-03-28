import React, { useState, useEffect } from 'react';
import {
  X,
  LayoutGrid,
  Palette,
  Users,
  Newspaper,
  LineChart,
  Gauge,
  RefreshCw,
  DollarSign,
  MessageSquare,
  TrendingUp,
  Twitter,
  MessageCircle,
  LockIcon
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { AppearanceSettings } from './AppearanceSettings';
import { ReferralSettings } from './ReferralModal';
import { SecuritySettings } from './SecurityModal';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsTab = 'widgets' | 'appearance' | 'referral' | 'security';

// Improved widget configurations with proper icons
const widgetConfigs = [
  { type: 'Portfolio Overview', icon: LayoutGrid, description: 'Display portfolio value and positions' },
  { type: 'Market News', icon: Newspaper, description: 'Latest crypto news and updates' },
  { type: 'Market Pulse', icon: LineChart, description: 'Live cryptocurrency price charts' },
  { type: 'Fear & Greed Index', icon: Gauge, description: 'Market sentiment indicator' },
  { type: 'Quick Swap', icon: RefreshCw, description: 'Instant token swaps' },
  { type: 'Price Converter', icon: DollarSign, description: 'Convert between tokens and fiat' },
  { type: 'Ask Anything', icon: MessageSquare, description: 'AI-powered crypto assistant' },
  { type: 'Trending', icon: TrendingUp, description: 'Top trending cryptocurrencies' },
  { type: 'Twitter Feed', icon: Twitter, description: 'Latest tweets from crypto influencers' },
  { type: 'Direct Messages', icon: MessageCircle, description: 'Chat with other traders' }
];

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('widgets');
  const [isMobile, setIsMobile] = useState(false);
  const { widgetVisibility, toggleWidgetVisibility, resetWidgetVisibility } = useStore();

  // Check if the screen is mobile sized
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    // Initial check
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (!isOpen) return null;

  const tabs = [
    { id: 'widgets', label: 'Widgets', icon: LayoutGrid },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'referral', label: 'Referral', icon: Users },
    { id: 'security', label: 'Security', icon: LockIcon }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="glass w-full max-w-5xl rounded-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content area */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Sidebar - responsive for mobile */}
          <div className="md:w-56 p-4 md:border-r border-white/10 flex md:flex-col overflow-x-auto md:overflow-x-visible">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SettingsTab)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors whitespace-nowrap mr-2 md:mr-0 md:w-full md:mb-2 
                  ${activeTab === tab.id ? 'bg-white/10' : 'hover:bg-white/5'}`}
              >
                <tab.icon className="w-5 h-5 flex-shrink-0" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Main content - scrollable container */}
          <div className="flex-1 p-4 md:p-6 overflow-y-auto settings-scrollbar">
            {activeTab === 'widgets' && (
              <>
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                  <div>
                    <h3 className="text-lg font-medium">Widget Visibility</h3>
                    <p className="text-sm text-white/60">
                      Choose which widgets to show in your workspace
                    </p>
                  </div>
                  <button
                    onClick={resetWidgetVisibility}
                    className="px-3 py-1 text-sm rounded-lg hover:bg-white/10 transition-colors self-start md:self-center"
                  >
                    Reset All
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {widgetConfigs.map(({ type, icon: Icon, description }) => (
                    <div
                      key={type}
                      className="flex items-center justify-between p-3 md:p-4 rounded-lg glass"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="p-2 rounded-lg bg-white/5 flex-shrink-0">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-medium truncate">{type}</h4>
                          <p className="text-sm text-white/60 truncate">{description}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleWidgetVisibility(type)}
                        className={`w-12 h-6 rounded-full transition-colors ml-2 flex-shrink-0 ${widgetVisibility[type] ? 'bg-blue-500' : 'bg-white/10'
                          } relative`}
                        aria-label={`Toggle ${type}`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${widgetVisibility[type] ? 'left-7' : 'left-1'
                            }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'appearance' && <AppearanceSettings />}
            {activeTab === 'referral' && <ReferralSettings />}
            {activeTab === 'security' && <SecuritySettings />}
          </div>
        </div>
      </div>
    </div>
  );
};