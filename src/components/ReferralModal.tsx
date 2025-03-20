import React, { useState } from 'react';
import { 
  Copy, 
  CheckCircle, 
  Share2, 
  ExternalLink, 
  Coins, 
  Gift 
} from 'lucide-react';

interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  pendingReferrals: number;
  totalTokens: number;
  rewardsRate: {
    referrer: number;
    referee: number;
  };
  recentReferrals: {
    id: string;
    username: string;
    avatar: string;
    status: 'active' | 'pending';
    joinedDate: string;
    tokensEarned: number;
  }[];
}

// Mock data for referral stats
const mockReferralStats: ReferralStats = {
  totalReferrals: 12,
  activeReferrals: 8,
  pendingReferrals: 4,
  totalTokens: 2500,
  rewardsRate: {
    referrer: 10,
    referee: 5
  },
  recentReferrals: [
    {
      id: '1',
      username: 'cryptotrader',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cryptotrader',
      status: 'active',
      joinedDate: '2024-03-15',
      tokensEarned: 850
    },
    {
      id: '2',
      username: 'defi_master',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=defi_master',
      status: 'active',
      joinedDate: '2024-03-14',
      tokensEarned: 650
    },
    {
      id: '3',
      username: 'nft_collector',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nft_collector',
      status: 'pending',
      joinedDate: '2024-03-19',
      tokensEarned: 0
    }
  ]
};

export const ReferralSettings: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const referralLink = 'https://dexfin.com/ref/u123456789';

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-h-screen overflow-y-auto px-2 py-4 md:px-4 md:py-6 space-y-4">
      {/* Referral Link */}
      <div className="bg-white/5 rounded-xl p-4">
        <h3 className="text-lg font-medium mb-3">Your Referral Link</h3>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 font-mono text-xs md:text-sm truncate">
            {referralLink}
          </div>
          <div className="flex mt-2 sm:mt-0">
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Copy referral link"
            >
              {copied ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
            <button 
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Share referral link"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        <div className="bg-white/5 rounded-xl p-3 md:p-4">
          <div className="text-xs md:text-sm text-white/60 mb-1">Total Referrals</div>
          <div className="text-xl md:text-2xl font-bold">{mockReferralStats.totalReferrals}</div>
        </div>
        <div className="bg-white/5 rounded-xl p-3 md:p-4">
          <div className="text-xs md:text-sm text-white/60 mb-1">Active Referrals</div>
          <div className="text-xl md:text-2xl font-bold text-green-400">
            {mockReferralStats.activeReferrals}
          </div>
        </div>
        <div className="bg-white/5 rounded-xl p-3 md:p-4">
          <div className="text-xs md:text-sm text-white/60 mb-1">Pending Referrals</div>
          <div className="text-xl md:text-2xl font-bold text-yellow-400">
            {mockReferralStats.pendingReferrals}
          </div>
        </div>
        <div className="bg-white/5 rounded-xl p-3 md:p-4">
          <div className="text-xs md:text-sm text-white/60 mb-1">Total Tokens Earned</div>
          <div className="flex items-center gap-1">
            <Coins className="w-5 h-5 text-blue-400" />
            <span className="text-xl md:text-2xl font-bold text-blue-400">
              {mockReferralStats.totalTokens}
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
              <Coins className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
              <span className="text-xl md:text-2xl font-bold text-green-400">
                {mockReferralStats.rewardsRate.referrer}
              </span>
              <span className="text-xs md:text-sm text-white/60">tokens</span>
            </div>
            <div className="text-xs md:text-sm text-white/60 mt-1">
              per successful referral
            </div>
          </div>
          <div className="p-3 bg-white/5 rounded-lg">
            <div className="text-xs md:text-sm text-white/60 mb-1">They Earn</div>
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
              <span className="text-xl md:text-2xl font-bold text-blue-400">
                {mockReferralStats.rewardsRate.referee}
              </span>
              <span className="text-xs md:text-sm text-white/60">tokens</span>
            </div>
            <div className="text-xs md:text-sm text-white/60 mt-1">
              welcome bonus
            </div>
          </div>
        </div>
      </div>

      {/* Recent Referrals */}
      <div className="bg-white/5 rounded-xl p-4">
        <h3 className="text-base md:text-lg font-medium mb-3">Recent Referrals</h3>
        <div className="space-y-3">
          {mockReferralStats.recentReferrals.map((referral) => (
            <div
              key={referral.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-white/5 rounded-lg"
            >
              <div className="flex items-center gap-2 mb-2 sm:mb-0">
                <img
                  src={referral.avatar}
                  alt={referral.username}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full"
                />
                <div>
                  <div className="font-medium text-sm md:text-base">{referral.username}</div>
                  <div className="text-xs text-white/60">
                    Joined {new Date(referral.joinedDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end sm:gap-4">
                <div className="text-left sm:text-right">
                  <div className="flex items-center gap-1">
                    <Coins className="w-3 h-3 md:w-4 md:h-4 text-blue-400" />
                    <span className="font-medium text-sm">{referral.tokensEarned}</span>
                  </div>
                  <div className="text-xs text-white/60">Tokens Earned</div>
                </div>
                <div className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  referral.status === 'active'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {referral.status.toUpperCase()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Terms */}
        <div className="mt-4 p-3 bg-white/5 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <ExternalLink className="w-3 h-3 md:w-4 md:h-4 text-white/60" />
            <span className="text-xs md:text-sm font-medium">Program Terms</span>
          </div>
          <ul className="space-y-1 text-xs md:text-sm text-white/60">
            <li>• Referral rewards are paid in platform tokens</li>
            <li>• Minimum trading volume of $100 required for activation</li>
            <li>• Rewards are distributed on a weekly basis</li>
            <li>• Maximum of 100 active referrals per user</li>
          </ul>
        </div>
      </div>
    </div>
  );
};