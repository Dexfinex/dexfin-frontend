import { ReferralApi } from './api.service';

interface RecentReferral {
    id: string;
    username: string;
    status: string;
    tokensEarned: number;
    date: string;
}

export interface ReferralStats {
    referralCode: string;
    referralLink: string;
    totalReferrals: number;
    activeReferrals: number;
    pendingReferrals: number;
    totalTokensEarned: number;
    currentTokenBalance: number;
    recentReferrals: RecentReferral[];
    wasReferred: {
        referralId: string;
        isActive: boolean;
        referredAt: string;
        activatedAt: string | null;
        referrer: {
            id: string;
            username: string;
        };
        tokensReceived: number;
    } | null;
}

// Rewards API service
export const referralService = {
    // Get user's rewards data
    getReferralStates: async (): Promise<ReferralStats> => {
        try {
            const response = await ReferralApi.get('/referral-stats');
            
            return response.data;
        } catch (error) {
            console.error('Error fetching user rewards:', error);
            throw error;
        }
    },
};