// import { TokenPool } from "../types/index.ts";
import { DayEvent } from "../components/market/Calendar/MarketCalendar.tsx";
import { calendarApi, userAuthApi } from "./api.service.ts";

// const LOGIN_MUTATION = `
//   mutation User($data: LoginInput!) {
//     login(data: $data) {
//       accessToken
//       refreshToken
//       user {
//         id
//         email
//       }
//     }
//   }
// `;
const REGISTER_MUTATION = `
  mutation register($data: AuthInput!) {
    register(data: $data) {
      accessToken
      refreshToken
    }
  }
`;
const ADD_EVENT_MUTATION = `
  mutation AddEvent($input: EventInput!) {
    addEvent(input: $input) {
      title
      description
      date
      type
      project
      location
    }
  }
`;

export const calendarService = {
    // loginUserId: async (email: string, password: string) => {
    //     try {
    //         const variables = {
    //             data: {
    //                 email,
    //                 password
    //             }
    //         };
    //         const { data } = await userAuthApi.post('', {
    //             query: LOGIN_MUTATION,
    //             variables
    //         });
    //         console.log(data)
    //         // Check for errors in the GraphQL response
    //         if (data.errors) {
    //             throw new Error(data.errors[0].message);
    //         }

    //         // Return the login response data
    //         return data.data.login;
    //     } catch (error) {
    //         console.error('Error during login:', {
    //             error: error instanceof Error ? {
    //                 name: error.name,
    //                 message: error.message,
    //                 stack: error.stack
    //             } : error
    //         });
    //         throw error;
    //     }
    // },
    loginUserId: async (walletAddress: string, username: string) => {
        try {
            const variables = {
                data: {
                    walletAddress,
                    username
                }
            };
            const { data } = await userAuthApi.post('', {
                query: REGISTER_MUTATION,
                variables
            });
            if (data.errors) {
                throw new Error(data.errors[0].message);
            }
            return data.data.register;
        } catch (error) {
            console.error('Error during registration:', {
                error: error instanceof Error ? {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                } : error
            });
            throw error;
        }
    },
    addEvent: async (accessToken: string, Data: DayEvent) => {
        try {
            const variables = {
                input: {
                    title: Data.title,
                    description: Data.description,
                    date: Data.date,
                    type: Data.type,
                    project: Data.project,
                    location: Data.location
                }
            };

            const { data } = await calendarApi.post('', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    query: ADD_EVENT_MUTATION,
                    variables
                }
            })
            if (data.errors) {
                throw new Error(data.errors[0].message);
            }
            return data.data.addEvent
        } catch (error) {
            console.error('Error adding event', {
                error: error instanceof Error ? {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                } : error
            });
            throw error;
        }
    },

    loadEvents: async (accessToken: string) => {
        calendarApi.interceptors.request.use(
            (config) => {
                // Get the current token from wherever you store it
                if (config.headers?.Authorization) {
                    return config;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
        try {
            const { data } = await calendarApi.get("", {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                }
            });
            console.log(data)
            return data;
        } catch (error) {
            console.error('Error fetching calendar events:', {
                error: error instanceof Error ? {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                } : error
            });
            throw error;
        }
    }
}
