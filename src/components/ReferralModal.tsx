import React, { useState, useEffect } from 'react';
import {
  Copy,
  CheckCircle,
  Share2,
  ExternalLink,
  Coins,
  Gift,
  Loader
} from 'lucide-react';
import { useUserData } from '../providers/UserProvider';
import { referralService, ReferralStats } from '../services/referral.service';

export const ReferralSettings: React.FC = () => {
  const { userData } = useUserData()
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ReferralStats | null>(null);

  // Constants for rewards - matching the backend service constants
  const REFERRER_REWARD = 10;
  const REFEREE_REWARD = 5;

  const fetchReferralStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await referralService.getReferralStates() ;
      
      setStats(data);
    } catch (err) {
      console.error('Error fetching referral stats:', err);
      setError('Failed to load referral information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData?.accessToken) {
      fetchReferralStats();
    }
  }, [userData]);

  const handleCopy = () => {
    if (stats?.referralLink) {
      navigator.clipboard.writeText(stats.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = (platform: string) => {
    if (!stats?.referralLink) return;

    const text = encodeURIComponent('Join me on DexFin and we both earn rewards!');
    const url = encodeURIComponent(stats.referralLink);

    let shareUrl = '';

    switch (platform) {
      case 'x':
        shareUrl = `https://x.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 text-red-400 p-4 rounded-lg">
        <p>{error}</p>
        <button
          onClick={fetchReferralStats}
          className="mt-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  // Get total earnings from your referrals
  const totalEarningsFromReferrals = stats.totalTokensEarned || 0;

  // Get tokens received from being referred
  const tokensReceivedFromReferrer = stats.wasReferred?.tokensReceived || 0;
  
  return (
    <div className="max-h-screen overflow-y-auto px-2 py-4 md:px-4 md:py-6 space-y-4">
      {/* Referral Link */}
      <div className="bg-white/5 rounded-xl p-6">
        <h3 className="text-lg font-medium mb-4">Your Referral Link</h3>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-mono text-sm overflow-x-auto">
            {stats.referralLink}
          </div>
          <button
            onClick={handleCopy}
            className="p-3 hover:bg-white/10 rounded-lg transition-colors"
            title="Copy to clipboard"
          >
            {copied ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </button>
          <div className="relative">
            <button
              className="p-3 hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => document.getElementById('share-dropdown')?.classList.toggle('hidden')}
              title="Share"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <div id="share-dropdown" className="hidden absolute right-0 mt-2 w-40 bg-white/10 backdrop-blur-md rounded-lg shadow-lg overflow-hidden z-10">
              <button
                onClick={() => handleShare('x')}
                className="w-full text-left px-4 py-2 hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5 text-black dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                X
              </button>
              <button
                onClick={() => handleShare('facebook')}
                className="w-full text-left px-4 py-2 hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5 text-[#4267B2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
              <button
                onClick={() => handleShare('telegram')}
                className="w-full text-left px-4 py-2 hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5 text-[#0088cc]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                Telegram
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/5 rounded-xl p-4">
          <div className="text-sm text-white/60 mb-1">Total Referrals</div>
          <div className="text-2xl font-bold">{stats.totalReferrals}</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4">
          <div className="text-sm text-white/60 mb-1">Active Referrals</div>
          <div className="text-2xl font-bold text-green-400">
            {stats.activeReferrals}
          </div>
        </div>
        <div className="bg-white/5 rounded-xl p-4">
          <div className="text-sm text-white/60 mb-1">Pending Referrals</div>
          <div className="text-2xl font-bold text-yellow-400">
            {stats.pendingReferrals}
          </div>
        </div>
        <div className="bg-white/5 rounded-xl p-4">
          <div className="text-sm text-white/60 mb-1">Total Tokens Earned</div>
          <div className="flex items-center gap-2">
            <Coins className="w-6 h-6 text-blue-400" />
            <span className="text-2xl font-bold text-blue-400">
              {stats.currentTokenBalance}
            </span>
          </div>
        </div>
      </div>

      {/* Rewards Info */}
      <div className="bg-white/5 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Gift className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
          <h3 className="text-base md:text-lg font-medium">Rewards Structure</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 bg-white/5 rounded-lg">
            <div className="text-xs md:text-sm text-white/60 mb-1">You Earn</div>
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-green-400" />
              <span className="text-2xl font-bold text-green-400">
                {REFERRER_REWARD}
              </span>
              <span className="text-xs md:text-sm text-white/60">tokens</span>
            </div>
            <div className="text-xs md:text-sm text-white/60 mt-1">
              per successful referral
            </div>
            <div className="mt-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="text-sm text-white/60">Total earned from referrals:</div>
                <div className="font-medium text-green-400">{totalEarningsFromReferrals} tokens</div>
              </div>
            </div>
          </div>
          <div className="p-3 bg-white/5 rounded-lg">
            <div className="text-xs md:text-sm text-white/60 mb-1">They Earn</div>
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-blue-400" />
              <span className="text-2xl font-bold text-blue-400">
                {REFEREE_REWARD}
              </span>
              <span className="text-xs md:text-sm text-white/60">tokens</span>
            </div>
            <div className="text-xs md:text-sm text-white/60 mt-1">
              welcome bonus
            </div>
            {stats.wasReferred ? (
              <div className="mt-2 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-white/60">You received as referral:</div>
                  <div className="font-medium text-blue-400">{tokensReceivedFromReferrer} tokens</div>
                </div>
              </div>
            ) : (
              <div className="mt-2 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-white/60">You received as referral:</div>
                  <div className="font-medium text-blue-400">{0} tokens</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* If the user was referred by someone */}
      {stats.wasReferred && (
        <div className="bg-white/5 rounded-xl p-6">
          <h3 className="text-lg font-medium mb-4">You Were Referred By</h3>
          <div className="p-4 bg-white/5 rounded-lg flex items-center justify-between">
            <div>
              <div className="font-medium">{stats.wasReferred.referrer.username}</div>
              <div className="text-sm text-white/60">
                Joined {new Date(stats.wasReferred.referredAt).toLocaleDateString()}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end">
                <Coins className="w-4 h-4 text-blue-400" />
                <span className="font-medium">{stats.wasReferred.tokensReceived}</span>
              </div>
              <div className="text-sm text-white/60">Tokens Received</div>
            </div>
          </div>
          {!stats.wasReferred.isActive && (
            <div className="mt-4 p-3 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm">
              <p>Make a deposit of at least $50 to activate your referral bonus!</p>
            </div>
          )}
        </div>
      )}

      {/* Recent Referrals */}
      <div className="bg-white/5 rounded-xl p-6">
        <h3 className="text-lg font-medium mb-4">Recent Referrals</h3>
        {stats.recentReferrals && stats.recentReferrals.length > 0 ? (
          <div className="space-y-3">
            {stats.recentReferrals.map((referral) => (
              <div
                key={referral.id}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${referral.username}`}
                    alt={referral.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="font-medium">{referral.username}</div>
                    <div className="text-sm text-white/60">
                      Joined {new Date(referral.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4 text-blue-400" />
                      <span className="font-medium">{referral.tokensEarned}</span>
                    </div>
                    <div className="text-sm text-white/60">Tokens Earned</div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${referral.status === 'Active'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                    {referral.status.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-white/5 rounded-lg text-center text-white/60">
            You haven't referred anyone yet. Share your referral link to get started!
          </div>
        )}

        {/* Terms */}
        <div className="mt-4 p-3 bg-white/5 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <ExternalLink className="w-3 h-3 md:w-4 md:h-4 text-white/60" />
            <span className="text-xs md:text-sm font-medium">Program Terms</span>
          </div>
          <ul className="space-y-1 text-xs md:text-sm text-white/60">
            <li>• Referral rewards are paid in platform tokens</li>
            <li>• Minimum deposit amount of $50 required for activation</li>
            <li>• Rewards are distributed on a weekly basis</li>
          </ul>
        </div>
      </div>
    </div>
  );
};