import { userAuthApi } from "./api.service.ts";

// Custom error interface to allow the 'original' property
interface EnhancedError extends Error {
    original?: any;
}

export const authService = {
    login: async (walletAddress: string) => {
        try {
            if (!walletAddress) {
                throw new Error('Wallet address is required');
            }

            const response = await userAuthApi.post('/login', {
                walletAddress
            });

            return response.data;
        } catch (error: any) {
            console.error('Error login wallet:', error);
            
            // Format error message for UI
            const errorMessage = error.response?.data?.message || 
                                'Failed to login with wallet';
            
            const enhancedError = new Error(errorMessage) as EnhancedError;
            enhancedError.original = error;
            throw enhancedError;
        }
    },

    register: async (walletType: string, evmAddress?: string, solAddress?: string, btcAddress?: string) => {
        try {
            if (!walletType) {
                throw new Error('Wallet type is required');
            }
            
            if (!evmAddress && !solAddress && !btcAddress) {
                throw new Error('At least one wallet address is required');
            }

            // Validate EVM address format
            if (evmAddress && !evmAddress.startsWith('0x')) {
                throw new Error('EVM address must start with 0x');
            }

            const response = await userAuthApi.post('/register', {
                evmAddress,
                solAddress,
                btcAddress,
                walletType,
            });

            return response.data;
        } catch (error: any) {
            console.error('Error registering wallet:', error);
            
            // Format error message for UI
            const errorMessage = error.response?.data?.message || 
                                error.message || 
                                'Failed to register wallet';
            
            const enhancedError = new Error(errorMessage) as EnhancedError;
            enhancedError.original = error;
            throw enhancedError;
        }
    },

    registerUsername: async (username: string, referralCode?: string) => {
        try {
            if (!username || username.trim() === '') {
                throw new Error('Username is required');
            }

            // Validate username format (letters, numbers, underscores, hyphens only)
            const usernameRegex = /^[A-Za-z0-9_-]+$/;
            if (!usernameRegex.test(username)) {
                throw new Error('Username can only contain letters, numbers, underscores and hyphens');
            }

            const payload = {
                username,
                referralCode: referralCode || ''
            };

            const { data } = await userAuthApi.post('/registerUserName', payload);

            if (data.errors) {
                throw new Error(data.errors[0].message);
            }

            return data;
        } catch (error: any) {
            console.error('Error registering username:', {
                error: error instanceof Error ? {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                } : error
            });
            
            // Properly extract error message from response if available
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            
            throw error;
        }
    }
}