import React, { useState } from 'react';
import { 
  X, 
  LayoutGrid, 
  Palette, 
  Newspaper, 
  LineChart, 
  Gauge, 
  RefreshCw, 
  DollarSign, 
  MessageSquare,
  TrendingUp,
  Twitter,
  MessageCircle
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { AppearanceSettings } from './AppearanceSettings';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsTab = 'widgets' | 'appearance';

const widgetConfigs = [
  { type: 'Portfolio Overview', icon: LayoutGrid, description: 'Display portfolio value and positions' },
  { type: 'Market News', icon: Newspaper, description: 'Latest crypto news and updates' },
  { type: 'Market Pulse', icon: LineChart, description: 'Live cryptocurrency price charts' },
  { type: 'Fear & Greed Index', icon: Gauge, description: 'Market sentiment indicator' },
  { type: 'Quick Swap', icon: RefreshCw, description: 'Instant token swaps', comingSoon: true },
  { type: 'Price Converter', icon: DollarSign, description: 'Convert between tokens and fiat' },
  { type: 'Ask Anything', icon: MessageSquare, description: 'AI-powered crypto assistant' },
  { type: 'Trending', icon: TrendingUp, description: 'Top trending cryptocurrencies' },
  { type: 'Twitter Feed', icon: Twitter, description: 'Latest tweets from crypto influencers' },
  { type: 'Direct Messages', icon: MessageCircle, description: 'Chat with other traders' }
];

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('widgets');
  const { widgetVisibility, toggleWidgetVisibility, resetWidgetVisibility } = useStore();

  if (!isOpen) return null;

  const tabs = [
    { id: 'widgets', label: 'Widgets', icon: LayoutGrid },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="glass w-full max-w-5xl rounded-xl">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex">
          {/* Sidebar */}
          <div className="w-56 p-4 border-r border-white/10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SettingsTab)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
          {/* Content */}
          <div className="flex-1 p-6 max-h-[calc(100vh-200px)] overflow-y-auto settings-scrollbar">
            {activeTab === 'widgets' ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium">Widget Visibility</h3>
                    <p className="text-sm text-white/60">
                      Choose which widgets to show in your workspace
                    </p>
                  </div>
                  <button
                    onClick={resetWidgetVisibility}
                    className="px-3 py-1 text-sm rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Reset All
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {widgetConfigs.map(({ type, icon: Icon, description, comingSoon }) => (
                    <div
                      key={type}
                      className="flex items-center justify-between p-4 rounded-lg glass"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/5">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-medium">{type}</h4>
                          {comingSoon && (
                            <span className="text-xs text-blue-400 font-medium">Coming soon</span>
                          )}
                          {/* <p className="text-sm text-white/60">{description}</p> */}
                        </div>
                      </div>
                      <button
                        onClick={() => !comingSoon && toggleWidgetVisibility(type)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          widgetVisibility[type] && !comingSoon ? 'bg-blue-500' : 'bg-white/10'
                        } relative ${comingSoon ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={comingSoon}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                            widgetVisibility[type] && !comingSoon ? 'left-7' : 'left-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <AppearanceSettings />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};