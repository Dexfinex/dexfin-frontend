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
    <div className="space-y-6">
      {/* Referral Link */}
      <div className="bg-white/5 rounded-xl p-6">
        <h3 className="text-lg font-medium mb-4">Your Referral Link</h3>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-mono text-sm">
            {referralLink}
          </div>
          <button
            onClick={handleCopy}
            className="p-3 hover:bg-white/10 rounded-lg transition-colors"
          >
            {copied ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </button>
          <button className="p-3 hover:bg-white/10 rounded-lg transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/5 rounded-xl p-4">
          <div className="text-sm text-white/60 mb-1">Total Referrals</div>
          <div className="text-2xl font-bold">{mockReferralStats.totalReferrals}</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4">
          <div className="text-sm text-white/60 mb-1">Active Referrals</div>
          <div className="text-2xl font-bold text-green-400">
            {mockReferralStats.activeReferrals}
          </div>
        </div>
        <div className="bg-white/5 rounded-xl p-4">
          <div className="text-sm text-white/60 mb-1">Pending Referrals</div>
          <div className="text-2xl font-bold text-yellow-400">
            {mockReferralStats.pendingReferrals}
          </div>
        </div>
        <div className="bg-white/5 rounded-xl p-4">
          <div className="text-sm text-white/60 mb-1">Total Tokens Earned</div>
          <div className="flex items-center gap-2">
            <Coins className="w-6 h-6 text-blue-400" />
            <span className="text-2xl font-bold text-blue-400">
              {mockReferralStats.totalTokens}
            </span>
          </div>
        </div>
      </div>

      {/* Rewards Info */}
      <div className="bg-white/5 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Gift className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-medium">Rewards Structure</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="text-sm text-white/60 mb-1">You Earn</div>
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-green-400" />
              <span className="text-2xl font-bold text-green-400">
                {mockReferralStats.rewardsRate.referrer}
              </span>
              <span className="text-sm text-white/60">tokens</span>
            </div>
            <div className="text-sm text-white/60 mt-1">
              per successful referral
            </div>
          </div>
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="text-sm text-white/60 mb-1">They Earn</div>
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-blue-400" />
              <span className="text-2xl font-bold text-blue-400">
                {mockReferralStats.rewardsRate.referee}
              </span>
              <span className="text-sm text-white/60">tokens</span>
            </div>
            <div className="text-sm text-white/60 mt-1">
              welcome bonus
            </div>
          </div>
        </div>
      </div>

      {/* Recent Referrals */}
      <div className="bg-white/5 rounded-xl p-6">
        <h3 className="text-lg font-medium mb-4">Recent Referrals</h3>
        <div className="space-y-3">
          {mockReferralStats.recentReferrals.map((referral) => (
            <div
              key={referral.id}
              className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <img
                  src={referral.avatar}
                  alt={referral.username}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="font-medium">{referral.username}</div>
                  <div className="text-sm text-white/60">
                    Joined {new Date(referral.joinedDate).toLocaleDateString()}
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
                <div className={`px-2 py-1 rounded-full text-xs ${referral.status === 'active'
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
        <div className="mt-6 p-4 bg-white/5 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <ExternalLink className="w-4 h-4 text-white/60" />
            <span className="text-sm font-medium">Program Terms</span>
          </div>
          <ul className="space-y-2 text-sm text-white/60">
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