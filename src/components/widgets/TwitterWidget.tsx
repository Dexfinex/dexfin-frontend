
import React, { useEffect, useState } from 'react';
import { AlertCircle, ChevronLeft, ChevronRight, Heart, MessageSquare, RefreshCw, Repeat2, Share2 } from 'lucide-react';
import { useGetTwitterInfo } from '../../hooks/useGetTwitterInfo';

interface Tweet {
  id: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
    verified: boolean;
  };
  content: string;
  timestamp: string;
  stats: {
    replies: number;
    retweets: number;
    likes: number;
  };
}

export const TwitterWidget: React.FC = () => {
  // Get data from the hook
  const { data: apiTweets, loading, error: apiError } = useGetTwitterInfo();

  // State for the processed tweets
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const tweetsPerPage = 3;

  useEffect(() => {

    if (apiTweets && Array.isArray(apiTweets) && apiTweets.length > 0) {
      // Convert API data to Tweet format
      const convertedTweets = apiTweets.map((item: any, index) => {
        // Extract data from the API response
        const userData = item.data || {};
        const legacyData = userData.legacy || {};
        const last_seenData = userData.last_seen || {};
        return {
          id: String(index + 1),
          author: {
            name: (legacyData.name || item.username || '').toString(),
            handle: item.username || '',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${(item.username || '').toLowerCase()}`,
            verified: userData.is_blue_verified === true
          },
          content: legacyData.description || 'No content available',
          timestamp: last_seenData.timestamp ? new Date(last_seenData.timestamp).toLocaleDateString() : 'recent',
          stats: {
            replies: legacyData.friends_count || 0,
            retweets: legacyData.favourites_count || 0,
            likes: legacyData.followers_count || 0
          }
        };
      });

      // Update tweets state with the converted data
      setTweets(convertedTweets);
    }
  }, [apiTweets]);

  useEffect(() => {
    if (apiError) {
      setError('Failed to load tweets from API');
      console.error('API Error:', apiError);
    } else {
      setError(null);
    }
  }, [apiError]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setError(null);
    } catch (error) {
      setError('Failed to refresh tweets');
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Show loading state when no data is available yet
  if (loading && !tweets.length) {
    return (
      <div className="p-4 h-full flex flex-col items-center justify-center text-center">
        <RefreshCw className="w-8 h-8 text-blue-400 mb-2 animate-spin" />
        <p className="text-white/60 mb-4">Loading tweets...</p>
      </div>
    );
  }

  // Show error state when there's an error and no data
  if (error && !tweets.length) {
    return (
      <div className="p-4 h-full flex flex-col items-center justify-center text-center">
        <AlertCircle className="w-8 h-8 text-red-400 mb-2" />
        <p className="text-white/60 mb-4">{error}</p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Calculate pagination info
  const totalPages = Math.max(1, Math.ceil(tweets.length / tweetsPerPage));
  const displayedTweets = tweets.length > 0
    ? tweets.slice(page * tweetsPerPage, (page + 1) * tweetsPerPage)
    : [];

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs text-white/60">
          Latest tweets from crypto influencers
          {loading && <span className="ml-2">(Refreshing...)</span>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0 || tweets.length === 0}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-white/60">
            {tweets.length > 0 ? `${page + 1} / ${totalPages}` : '-'}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1 || tweets.length === 0}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className={`p-1 rounded-lg hover:bg-white/10 transition-colors ${(refreshing || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Refresh tweets"
          >
            <RefreshCw className={`w-4 h-4 ${(refreshing || loading) ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {tweets.length > 0 ? (
        <div className="flex-1 space-y-3 overflow-y-auto ai-chat-scrollbar">
          {displayedTweets.map((tweet) => (
            <div
              key={tweet.id}
              className="p-3 rounded-lg bg-black/20 hover:bg-black/30 transition-colors"
            >
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-xs font-medium">{tweet.author.name}</span>
                    {tweet.author.verified && (
                      <div className="w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      </div>
                    )}
                    <span className="text-[11px] text-white/60">@{tweet.author.handle}</span>
                    <span className="text-[11px] text-white/40">·</span>
                    <span className="text-[11px] text-white/60">{tweet.timestamp}</span>
                  </div>
                  <p className="text-xs text-white/90 mb-2">{tweet.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white/60">No tweets available</p>
        </div>
      )}
    </div>
  );
};