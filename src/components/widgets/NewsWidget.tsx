import React from 'react';
import { AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { useGetLatestCryptoNews } from '../../hooks/useCryptoNews';


export const NewsWidget: React.FC = () => {
  const { data: latestCryptoNews, refetch: refetchCryptoNews, isLoading: isLoadingLatestCryptoNews, error: errorLatestCryptoNews } = useGetLatestCryptoNews();

  const handleRefresh = () => {
    refetchCryptoNews()
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'HIGH':
        return 'text-red-400';
      case 'MEDIUM':
        return 'text-yellow-400';
      default:
        return 'text-green-400';
    }
  };

  if (isLoadingLatestCryptoNews) {
    return (
      <div className="p-4 h-full">
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/5 rounded-lg p-4">
              <div className="h-5 bg-white/10 rounded w-3/4 mb-2" />
              <div className="h-4 bg-white/10 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (errorLatestCryptoNews) {
    return (
      <div className="p-4 h-full flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-8 h-8 text-red-400 mb-2" />
        <p className="text-white/60 mb-4">{errorLatestCryptoNews.message}</p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleRefresh}
          disabled={isLoadingLatestCryptoNews}
          className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${isLoadingLatestCryptoNews ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          title="Refresh news"
        >
          <RefreshCw className={`w-4 h-4 ${isLoadingLatestCryptoNews ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-3">
        {(latestCryptoNews || []).map((item, index) => (
          <a
            key={index}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 rounded-lg bg-black/20 hover:bg-black/30 transition-colors group relative"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white/90 truncate pr-6 group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-sm">
                  <span className="text-white/60">{item.source}</span>
                  <span className="text-white/40">•</span>
                  <span className="text-white/60">{item.time}</span>
                  <span className="text-white/40">•</span>
                  <span className={getImpactColor(item.impact)}>
                    {item.impact} IMPACT
                  </span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-blue-400 transition-colors" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};