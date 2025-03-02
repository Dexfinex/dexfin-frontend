
import React, { useEffect, useState, useMemo } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useGetTwitterInfo } from '../../hooks/useGetTwitterInfo';
import { getRelativeTime } from "../../utils/getRelativeTime"
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

  console.log("latest tweets : ", apiTweets);
  // State for the processed tweets
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Use useMemo to convert API tweets to the Tweet format
  const convertedTweets = useMemo(() => {
    if (apiTweets && Array.isArray(apiTweets) && apiTweets.length > 0) {
      return apiTweets.map((item: any, index) => {
        // Extract data from the API response
        const userData = item.data.user || {};
        const latestTweetsData = item.data.tweets || {};
        console.log("userdata : ------", userData);
        console.log("tweets : ----- ", latestTweetsData[0])

        // Get the tweet timestamp and format as relative time
        const tweetTimestamp = latestTweetsData[0].created_at || '';
        const relativeTime = tweetTimestamp ? getRelativeTime(tweetTimestamp) : 'recent';

        return {
          id: String(index + 1),
          author: {
            name: (userData.name || latestTweetsData[0].user.username || '').toString(),
            handle: item.username || '',
            avatar: userData.profile_image_url,
            verified: userData.verified
          },
          content: latestTweetsData[0].text || 'No content available',
          timestamp: relativeTime,
          stats: {
            replies: latestTweetsData[0].reply_count || 0,
            retweets: latestTweetsData[0].retweet_count || 0,
            likes: latestTweetsData[0].favorite_count || 0
          }
        };
      });
    }
    return [];
  }, [apiTweets]);

  // Update tweets state when convertedTweets changes
  useEffect(() => {
    setTweets(convertedTweets);
  }, [convertedTweets]);

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

  const displayedTweets = tweets;

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">

        <div className="flex items-center gap-2">
          <span className="text-xs text-white/60">
            {tweets.length > 0 ? `${tweets.length} tweets` : '-'}
          </span>
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
        <div className="flex-1 space-y-3 overflow-y-auto ai-chat-scrollbar max-h-96">
          {displayedTweets.map((tweet) => (
            <div
              key={tweet.id}
              className="p-3 rounded-lg bg-black/20 hover:bg-black/30 transition-colors"
            >
              <div className="flex items-start gap-2">
                <img
                  src={tweet.author.avatar}
                  alt={tweet.author.name}
                  className="w-8 h-8 rounded-full"
                />
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