import { useEffect, useState, useMemo, forwardRef, useImperativeHandle } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useGetTwitterInfo } from '../../hooks/useGetTwitterInfo';
import { getRelativeTime } from "../../utils/twitter-widget.util";
import { RefreshableWidget } from '../ResizableWidget';

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
  createdAt: string;
  stats: {
    replies: number;
    retweets: number;
    likes: number;
  };
}

// Add a utility function to parse URLs in tweet content
const parseLinks = (text: string) => {
  // Regular expression to match t.co URLs (Twitter's URL shortener)
  const urlRegex = /(https?:\/\/t\.co\/[a-zA-Z0-9]+)/g;

  // Create array to hold resulting React elements
  const result = [];

  // Track the last index we've processed
  let lastIndex = 0;

  // Find all URLs in the content
  let match;
  let i = 0;

  while ((match = urlRegex.exec(text)) !== null) {
    // Add text before the URL
    if (match.index > lastIndex) {
      result.push(
        <span key={`text-${i}`}>
          {text.substring(lastIndex, match.index)}
        </span>
      );
    }

    // Add the URL as a link
    result.push(
      <a
        key={`link-${i}`}
        href={match[0]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:underline"
      >
        {match[0]}
      </a>
    );

    // Update the lastIndex to after this URL
    lastIndex = match.index + match[0].length;
    i++;
  }

  // Add any remaining text after the last URL
  if (lastIndex < text.length) {
    result.push(
      <span key={`text-${i}`}>
        {text.substring(lastIndex)}
      </span>
    );
  }

  return result;
};

export const TwitterWidget = forwardRef<RefreshableWidget, {}>((props, ref) => {
  // Get data from the hook with a refresh trigger
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { data: apiTweets, loading, error: apiError, refetch } = useGetTwitterInfo(refreshTrigger);

  // State for the processed tweets
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Use useMemo to convert API tweets to the Tweet format
  const convertedTweets = useMemo(() => {
    const result: Tweet[] = [];

    if (!apiTweets || !Array.isArray(apiTweets) || apiTweets.length === 0) {
      return result;
    }

    apiTweets.forEach((item: any, index) => {
      // Skip invalid items
      if (!item || !item.data) {
        return;
      }

      try {
        // Extract username - this appears to be available at the top level
        const username = item.username || 'unknown';

        // Handle the case where user data might be missing
        const userData = item.data && item.data.user ? item.data.user : null;

        // Check if tweets array exists and has at least one item
        const tweetsArray = item.data && item.data.tweets && Array.isArray(item.data.tweets)
          ? item.data.tweets
          : [];

        if (tweetsArray.length === 0) {
          // Create a placeholder tweet if no tweets are available
          result.push({
            id: String(index + 1),
            author: {
              name: userData?.name || username || 'Unknown User',
              handle: username,
              avatar: userData?.profile_image_url || '/default-avatar.png',
              verified: !!userData?.verified
            },
            content: 'Tweet data unavailable',
            timestamp: 'unknown',
            createdAt: new Date().toISOString(),
            stats: { replies: 0, retweets: 0, likes: 0 }
          });
          return;
        }

        // Process each available tweet
        const tweet = tweetsArray[0];

        // Skip this tweet if it's completely empty
        if (!tweet) {
          return;
        }

        // Get the timestamp safely
        let tweetTimestamp = '';
        let relativeTime = 'recent';

        if (tweet.created_at) {
          tweetTimestamp = tweet.created_at;
          try {
            relativeTime = getRelativeTime(tweetTimestamp);
          } catch (e) {
            console.error('Error parsing date:', e);
            relativeTime = 'recent';
          }
        }

        // Get user details from the tweet if not available in userData
        const tweetUser = tweet.user || {};

        result.push({
          id: String(index + 1),
          author: {
            name: userData?.name || tweetUser.username || username || 'Unknown User',
            handle: username,
            avatar: userData?.profile_image_url || '/default-avatar.png',
            verified: !!userData?.verified
          },
          content: tweet.text || 'No content available',
          timestamp: relativeTime,
          createdAt: tweetTimestamp || new Date().toISOString(),
          stats: {
            replies: tweet.reply_count || 0,
            retweets: tweet.retweet_count || 0,
            likes: tweet.favorite_count || 0
          }
        });
      } catch (err) {
        console.error('Error processing tweet:', err);
        // Don't add the tweet if processing failed
      }
    });

    return result;
  }, [apiTweets]);

  // Update tweets state when convertedTweets changes
  useEffect(() => {
    if (convertedTweets.length > 0) {
      try {
        // Sort tweets from newest to oldest
        const sortedTweets = [...convertedTweets].sort((a, b) => {
          if (!a.createdAt) return 1;
          if (!b.createdAt) return -1;

          try {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          } catch (err) {
            return 0;
          }
        });

        setTweets(sortedTweets);
      } catch (err) {
        console.error('Error sorting tweets:', err);
        setTweets(convertedTweets);
      }
    } else {
      setTweets([]);
    }
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
      if (refetch) {
        await refetch();
      } else {
        // Fallback if refetch function is not available
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (error) {
      setError('Failed to refresh tweets');
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Expose the refresh method and tweet count through the ref
  useImperativeHandle(ref, () => ({
    handleRefresh,
    getTweetCount: () => tweets.length
  }), [tweets.length]);

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

  return (
    <div className="p-4 h-full flex flex-col">
      {tweets.length > 0 ? (
        <div className="flex-1 space-y-3 overflow-y-auto ai-chat-scrollbar max-h-96">
          {tweets.map((tweet) => (
            <div
              key={tweet.id}
              className="p-3 rounded-lg bg-black/20 hover:bg-black/30 transition-colors"
            >
              <div className="flex items-start gap-2">
                <img
                  src={tweet.author.avatar}
                  alt={tweet.author.name}
                  className="w-8 h-8 rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/default-avatar.png';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-xs font-medium">{tweet.author.name}</span>
                    {tweet.author.verified && (
                      <div className="w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      </div>
                    )}
                    <span className="text-[13px] text-white/60">
                      <a
                        href={`https://x.com/@${tweet.author.handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >@{tweet.author.handle}</a>
                    </span>
                    <span className="text-[13px] text-white/40">·</span>
                    <span className="text-[13px] text-white/60">{tweet.timestamp}</span>
                  </div>
                  <div className="text-sm text-white/90 mb-2">
                    {parseLinks(tweet.content)}
                  </div>
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
});

TwitterWidget.displayName = 'TwitterWidget';