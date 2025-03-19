import axios from 'axios';

import { RewardsApi } from './api.service';

// Types for rewards data
export interface Badge {
    id: string;
    name: string;
    description: string;
    image: string;
    icon: string | { icon: string; color: string };
    xpAmount: number;
    earnedDate?: string;
    isFlashBadge?: boolean;
}

export interface Challenge {
    id: string;
    title: string;
    description: string;
    xpReward: number;
    progress: number;
    total: number;
    endsIn: string;
}

export interface Perk {
    id: string;
    name: string;
    description: string;
    tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
    isActive: boolean;
}

export interface RewardsData {
    currentTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
    xp: number;
    xpToNextLevel: number;
    weeklyXP: number[];
    badges: Badge[];
    perks: Perk[];
    activeChallenges: Challenge[];
    nextXpUpdate: {
        hours: number;
        minutes: number;
        seconds: number;
        xpAmount: number;
    };
}

// Rewards API service
export const rewardsService = {
    // Get user's rewards data
    getUserRewards: async (): Promise<RewardsData> => {
        try {
            const response = await RewardsApi.get('/api/user/rewards');
            // console.log(response)
            return response.data;
        } catch (error) {
            console.error('Error fetching user rewards:', error);
            throw error;
        }
    },

    // Get user XP data
    getUserXp: async () => {
        try {
            const response = await RewardsApi.get('/api/user/xp');
            return response.data;
        } catch (error) {
            console.error('Error fetching user XP:', error);
            throw error;
        }
    },

    // Get user perks
    getUserPerks: async () => {
        try {
            const response = await RewardsApi.get('/api/user/perks');
            return response.data;
        } catch (error) {
            console.error('Error fetching user perks:', error);
            throw error;
        }
    },

    // Get XP update timer
    getXpUpdate: async () => {
        try {
            const response = await RewardsApi.get('/api/user/xp-update');
            return response.data;
        } catch (error) {
            console.error('Error fetching XP update:', error);
            throw error;
        }
    },

    // Get weekly XP history
    getXpHistory: async () => {
        try {
            const response = await RewardsApi.get('/api/user/xp-history');
            return response.data;
        } catch (error) {
            console.error('Error fetching XP history:', error);
            throw error;
        }
    },

    // Get user badges
    getUserBadges: async () => {
        try {
            const response = await RewardsApi.get('/api/user/badges');
            return response.data;
        } catch (error) {
            console.error('Error fetching user badges:', error);
            throw error;
        }
    },

    // Update challenge progress
    updateChallengeProgress: async (challengeId: string, progress: number) => {
        try {
            const response = await RewardsApi.post(`/api/user/rewards/challenge/${challengeId}/progress`, { progress });
            return response.data;
        } catch (error) {
            console.error('Error updating challenge progress:', error);
            throw error;
        }
    },

    // Add XP manually
    addXp: async (amount: number) => {
        try {
            const response = await RewardsApi.post('/api/user/rewards/xp', { amount });
            return response.data;
        } catch (error) {
            console.error('Error adding XP:', error);
            throw error;
        }
    },

    // Complete a badge
    completeBadge: async (badgeId: string) => {
        try {
            const response = await RewardsApi.post(`/api/user/rewards/badge/${badgeId}/complete`);
            return response.data;
        } catch (error) {
            console.error('Error completing badge:', error);
            throw error;
        }
    },

    // Track a transaction
    trackTransaction: async (transactionId: string) => {
        try {
            const response = await RewardsApi.post(`/api/user/rewards/track-transaction/${transactionId}`);
            return response.data;
        } catch (error) {
            console.error('Error tracking transaction:', error);
            throw error;
        }
    }
};