import React, { forwardRef, useImperativeHandle } from 'react';
import { AlertCircle } from 'lucide-react';
import { useGetFearGreed } from '../../hooks/useFearGreed';
import { formatTimeAgo } from '../../utils/formatter.util';
import { useStore } from '../../store/useStore';
import { RefreshableWidget } from '../ResizableWidget';

export const FearGreedWidget = forwardRef<RefreshableWidget, {}>((props, ref) => {
  const { isLoading, error, refetch, data } = useGetFearGreed();
  const { theme } = useStore();

  // Expose the handleRefresh method to the parent
  const handleRefresh = async () => {
    await refetch();
  };

  // Expose the refresh method through the ref
  useImperativeHandle(ref, () => ({
    handleRefresh
  }));

  const getColor = (value: number) => {
    if (value <= 25) return '#EF4444'; // Extreme Fear (Red)
    if (value <= 45) return '#FB923C'; // Fear (Orange)
    if (value <= 55) return '#FBBF24'; // Neutral (Yellow)
    if (value <= 75) return '#34D399'; // Greed (Green)
    return '#10B981'; // Extreme Greed (Emerald)
  };

  if (error) {
    return (
      <div className="p-4 h-full flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-8 h-8 text-red-400 mb-2" />
        <p className="text-white/60 mb-4">{error.message}</p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const fearGreedValue = data?.value || 0;
  const change = data?.dailyChange || 0;
  const color = getColor(fearGreedValue);
  // Format timestamp as "X min ago" or "X h ago"
  const timeAgo = data?.timestamp ? formatTimeAgo(data.timestamp) : '';

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex-1 flex items-center justify-center -mt-2">
        <div className="flex items-center gap-8">
          <div className="relative">
            <svg className="w-32 h-32 -rotate-90 ">
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke={theme === 'dark' ? "rgba(255, 255, 255, 0.1)" : "rgb(204 204 204)"}
                strokeWidth="12"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke={color}
                strokeWidth="12"
                strokeDasharray={`${(fearGreedValue / 100) * 352} 352`}
                className={`transition-all duration-1000 ease-out ${isLoading ? 'opacity-50' : ''}`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">
                {isLoading ? '...' : fearGreedValue}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-start gap-2">
            <div className="text-lg font-medium" style={{ color }}>
              {isLoading ? 'Loading...' : data?.valueClassification}
            </div>

            {data && (
              <div className="text-xs text-white/40">
                Updated: {timeAgo}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

FearGreedWidget.displayName = 'FearGreedWidget';