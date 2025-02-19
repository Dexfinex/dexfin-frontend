import React from 'react';
import { Activity, BarChart2, Brain, Hash, MessageSquare, TrendingDown, TrendingUp, Zap } from 'lucide-react';

import useFearGreedStore from '../../store/useFearGreedStore';
import useDefillamaStore from '../../store/useDefillamaStore';
import { useGetDefillamaProtocols } from '../../hooks/useDefillama';
import { formatNumberByFrac } from '../../utils/common.util';
import useMarketSentimentStore from '../../store/useMarketSentimentStore';

export const MarketOverview: React.FC = () => {
  useGetDefillamaProtocols();

  const { data } = useFearGreedStore();
  const { getDeFiStats } = useDefillamaStore();
console.log(data)
  const defiStats = getDeFiStats();
  const {marketsentimentdata} = useMarketSentimentStore();

  // Mock data for demonstration
  const marketMetrics = {
    fearGreed: {
      value: data.value,
      change: data.dailyChange,
      label: 'GREED'
    },
    marketSentiment: {
      value: 75,
      change: 2.5,
      label: 'BULLISH'
    },
    volume24h: {
      value: 156.80,
      change: -3.2,
      label: 'B'
    },
    marketCap: {
      value: defiStats.defiMarketCap,
      change: formatNumberByFrac(defiStats.totalChange24h),
      label: 'B'
    }
  };

  const socialMetrics = {
    sentiment: {
      positive: 72,
      neutral: 20,
      negative: 8
    },
    activity: {
      mentions: '50K',
      timeframe: '24h'
    },
    trendingTopics: ['#DEFI', '#ETH2', '#LIQUIDSTAKING', '#L2', '#NFTS']
  };

  const topicHeatmap = [
    {
      name: 'DeFi',
      score: 90,
      change: 12.5,
      sentiment: 85
    },
    {
      name: 'NFTs',
      score: 60,
      change: -8.2,
      sentiment: 45
    },
    {
      name: 'Layer2',
      score: 75,
      change: 15.4,
      sentiment: 78
    },
    {
      name: 'Gaming',
      score: 55,
      change: 5.8,
      sentiment: 65
    },
    {
      name: 'Memecoins',
      score: 85,
      change: 25.4,
      sentiment: 72
    },
    {
      name: 'AI',
      score: 70,
      change: 18.2,
      sentiment: 88
    }
  ];

  return (
    <div className="h-full p-6 overflow-y-auto ai-chat-scrollbar">
      {/* Market Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-white/5 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-orange-400" />
            <span className="text-sm text-white/60">Fear & Greed</span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold">{marketMetrics.fearGreed.value}</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400">{marketMetrics.fearGreed.change}%</span>
            </div>
          </div>
          <div className="mt-1">
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full transition-all bg-orange-400"
                style={{ width: `${marketMetrics.fearGreed.value}%` }}
              />
            </div>
            <div className="mt-1 text-sm text-orange-400">{marketMetrics.fearGreed.label}</div>
          </div>
        </div>

        <div className="p-4 bg-white/5 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-white/60">Market Sentiment</span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold">{marketMetrics.marketSentiment.value}%</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400">{marketMetrics.marketSentiment.change}%</span>
            </div>
          </div>
          <div className="mt-1">
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full transition-all bg-purple-400"
                style={{ width: `${marketMetrics.marketSentiment.value}%` }}
              />
            </div>
            <div className="mt-1 text-sm text-purple-400">{marketMetrics.marketSentiment.label}</div>
          </div>
        </div>

        <div className="p-4 bg-white/5 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Hash className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-white/60">24h Volume</span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold">${marketMetrics.volume24h.value}{marketMetrics.volume24h.label}</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingDown className="w-4 h-4 text-red-400" />
              <span className="text-red-400">{Math.abs(marketMetrics.volume24h.change)}%</span>
            </div>
          </div>
          <div className="mt-1">
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full transition-all bg-blue-400"
                style={{ width: '65%' }}
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-white/5 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <BarChart2 className="w-4 h-4 text-green-400" />
            <span className="text-sm text-white/60">Market Cap</span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold">
              ${(marketMetrics.marketCap.value / 1e9).toFixed(2)}
              {marketMetrics.marketCap.label}</div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400">{marketMetrics.marketCap.change}%</span>
            </div>
          </div>
          <div className="mt-1">
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full transition-all bg-green-400"
                style={{ width: `${100 - (Number(marketMetrics.marketCap.change) || 0)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Social Sentiment */}
        <div className="p-4 bg-white/5 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-400" />
              <h3 className="font-medium">Social Sentiment</h3>
            </div>
            <div className="px-2 py-1 text-sm text-green-400 rounded-lg bg-green-500/20">
              5.2% ↑
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span className="text-white/60">Sentiment Distribution</span>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Positive</span>
                    <span className="text-green-400">{socialMetrics.sentiment.positive}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full transition-all bg-green-400"
                      style={{ width: `${socialMetrics.sentiment.positive}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Neutral</span>
                    <span className="text-blue-400">{socialMetrics.sentiment.neutral}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full transition-all bg-blue-400"
                      style={{ width: `${socialMetrics.sentiment.neutral}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Negative</span>
                    <span className="text-red-400">{socialMetrics.sentiment.negative}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full transition-all bg-red-400"
                      style={{ width: `${socialMetrics.sentiment.negative}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-3 text-sm">
                <span className="text-white/60">Social Activity</span>
                <span>{socialMetrics.activity.mentions} mentions in last {socialMetrics.activity.timeframe}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {socialMetrics.trendingTopics.map((topic) => (
                  <div
                    key={topic}
                    className="px-2 py-1 text-sm transition-colors rounded-lg cursor-pointer bg-white/10 hover:bg-white/20"
                  >
                    {topic}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Topic Heatmap */}
        <div className="p-4 bg-white/5 rounded-xl">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-yellow-400" />
            <h3 className="font-medium">Topic Heatmap</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {topicHeatmap.map((topic) => (
              <div
                key={topic.name}
                className="p-3 transition-all rounded-lg cursor-pointer bg-white/5 hover:bg-white/10"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{topic.name}</span>
                  <div className={`px-2 py-0.5 rounded-full text-xs ${topic.sentiment >= 70 ? 'bg-green-500/20 text-green-400' :
                    topic.sentiment >= 50 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                    {topic.sentiment}%
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Volume Score: {topic.score}</span>
                  <div className="flex items-center gap-1">
                    {topic.change >= 0 ? (
                      <TrendingUp className="w-3 h-3 text-green-400" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-400" />
                    )}
                    <span className={topic.change >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {Math.abs(topic.change)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};