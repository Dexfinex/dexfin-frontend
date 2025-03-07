import { userAuthApi } from "./api.service.ts";

export const authService = {
    
    login: async (walletAddress: string) => {
        try {

            const response = await userAuthApi.post('/login', {
                walletAddress
            });

            return response.data;
            
        } catch (error) {
            console.error('Error login wallet:', error);
            throw error;
        }
    },

    register: async (walletType: string, evmAddress?: string, solAddress?: string, btcAddress?: string) => {
        try {

            const response = await userAuthApi.post('/register', {
                evmAddress,
                solAddress,
                btcAddress,
                walletType,
            });

            return response.data;
            
        } catch (error) {
            console.error('Error registering wallet:', error);
            throw error;
        }
    },

    registerUsername: async (username: string) => {
        try {
            
            const { data } = await userAuthApi.post(`/registerUserName/`,{username}, {});

            if (data.errors) {
                throw new Error(data.errors[0].message);
            }

            return data;
        } catch (error) {
            console.error('Error getting username:', {
                error: error instanceof Error ? {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                } : error
            });
            // Return a structured response even on error
            return {
                exists: false,
                username: "",
                message: "Failed to retrieve username"
            };
        }
    }

}
