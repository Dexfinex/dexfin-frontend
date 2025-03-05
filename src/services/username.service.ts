import { userAuthApi, usernameAuthApi } from "./api.service.ts";

export const usernameService = {
    checkUsername: async (accessToken: any) => {
        console.log(accessToken)
        try {
            const query = `
                query Me {
                    me {
                        id
                        username
                        createdAt
                        updatedAt
                    }
                }
            `;

            const { data } = await userAuthApi.post('', 
                {query},
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
        
        );

            console.log(data);

            if (data.errors) {
                throw new Error(data.errors[0].message);
            }
            return data.data.me;

            // Return appropriate structure even if backend response is different
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
    },
    registerUsername: async (accessToken: string, username: string) => {
        try {
            console.log(accessToken,username)
            const { data } = await usernameAuthApi.post(`/registerUserName/`,{username}, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            if (data.errors) {
                throw new Error(data.errors[0].message);
            }
            console.log(data)

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
