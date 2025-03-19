import { useState, useEffect, useCallback } from 'react';
import { rewardsService, RewardsData, Badge } from '../services/rewards.service';
import { useStore } from '../store/useStore';
import { useUserData } from '../providers/UserProvider';

/**
 * Format icon data from string to object
 */
const formatIconData = (iconData: any): { icon: string; color: string } => {
    if (typeof iconData === 'string') {
        try {
            return JSON.parse(iconData);
        } catch (e) {
            console.error('Error parsing icon data:', e);
            return { icon: 'Award', color: 'text-blue-500' };
        }
    }
    return iconData || { icon: 'Award', color: 'text-blue-500' };
};

/**
 * Format badge data
 */
const formatBadge = (badge: Badge): any => ({
    ...badge,
    icon: formatIconData(badge.icon)
});

/**
 * Default rewards data
 */
const defaultRewardsData: any = {
    currentTier: 'Bronze',
    xp: 0,
    xpToNextLevel: 5000,
    weeklyXP: [0, 0, 0, 0, 0, 0, 0],
    badges: [],
    perks: [],
    activeChallenges: [],
    nextXpUpdate: {
        hours: 19,
        minutes: 45,
        seconds: 30,
        xpAmount: 150
    }
};

/**
 * Map API data to store format
 */
const mapToRewardsState = (data: any): any => {
    if (!data) return defaultRewardsData;

    return {
        ...data,
        badges: (data.badges || []).map(formatBadge),
        nextXpUpdate: data.nextXpUpdate || defaultRewardsData.nextXpUpdate
    };
};

export const useRewards = () => {
    const { userData } = useUserData();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { rewards } = useStore();

    const fetchRewards = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await rewardsService.getUserRewards();
            const stateData = mapToRewardsState(data);
            console.log(data)
            useStore.setState({ rewards: stateData });
        } catch (err: any) {
            console.error('Error fetching rewards:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const addXp = useCallback(async (amount: number) => {
        try {
            // Update state immediately for better UX
            useStore.setState((state: any) => ({
                rewards: {
                    ...state.rewards,
                    xp: state.rewards.xp + amount,
                    weeklyXP: [
                        ...state.rewards.weeklyXP.slice(1),
                        state.rewards.weeklyXP[state.rewards.weeklyXP.length - 1] + amount
                    ]
                }
            }));

            // Call API
            await rewardsService.addXp(amount);

            // Refresh data to ensure consistency
            fetchRewards();
        } catch (err: any) {
            console.error('Error adding XP:', err);
        }
    }, [fetchRewards]);

    const completeBadge = useCallback(async (badgeId: string) => {
        try {
            // Update state immediately for better UX
            useStore.setState((state: any) => ({
                rewards: {
                    ...state.rewards,
                    badges: state.rewards.badges.map((badge: any) =>
                        badge.id === badgeId
                            ? { ...badge, earnedDate: new Date().toISOString().split('T')[0] }
                            : badge
                    )
                }
            }));

            // Call API
            await rewardsService.completeBadge(badgeId);

            // Refresh data to ensure consistency
            fetchRewards();
        } catch (err: any) {
            console.error('Error completing badge:', err);
        }
    }, [fetchRewards]);

    const updateChallengeProgress = useCallback(async (challengeId: string, progress: number) => {
        try {
            // Update state immediately for better UX
            useStore.setState((state: any) => ({
                rewards: {
                    ...state.rewards,
                    activeChallenges: state.rewards.activeChallenges.map((challenge: any) =>
                        challenge.id === challengeId
                            ? { ...challenge, progress: Math.min(progress, challenge.total) }
                            : challenge
                    )
                }
            }));

            // Call API
            await rewardsService.updateChallengeProgress(challengeId, progress);

            // Refresh data to ensure consistency
            fetchRewards();
        } catch (err: any) {
            console.error('Error updating challenge progress:', err);
        }
    }, [fetchRewards]);

    const trackTransaction = useCallback(async (transactionId: string) => {
        try {
            await rewardsService.trackTransaction(transactionId);
            // Refresh rewards data after tracking transaction
            fetchRewards();
        } catch (err: any) {
            console.error('Error tracking transaction:', err);
        }
    }, [fetchRewards]);

    useEffect(() => {
        if (userData?.accessToken) {
            fetchRewards();
        }
    }, [fetchRewards, userData]);

    return {
        rewards,
        loading,
        error,
        fetchRewards,
        addXp,
        completeBadge,
        updateChallengeProgress,
        trackTransaction
    };
};