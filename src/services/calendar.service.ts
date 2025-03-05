import { DayEvent } from "../components/market/Calendar/MarketCalendar.tsx";
import { calendarApi, userAuthApi } from "./api.service.ts";

const LOGIN_MUTATION = `
  mutation login($data: LoginInput!) {
    login(data: $data) {
      accessToken
    }
  }
`;

export const calendarService = {
    loginUserId: async (walletAddress: string) => {
        try {
            const variables = {
                data: {
                    walletAddress,
                }
            };
            const { data } = await userAuthApi.post('', {
                query: LOGIN_MUTATION,
                variables
            });
            if (data.errors) {
                throw new Error(data.errors[0].message);
            }
            return data.data.login;
        } catch (error) {
            console.error('Error during login:', {
                error: error instanceof Error ? {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                } : error
            });
            throw error;
        }
    },

    deleteEvent: async (userId: string, eventId: any) => {
        try {
            const { data } = await calendarApi.delete(`/${eventId}`, {
                headers: {
                    'Authorization': `Bearer ${userId}`,
                    'Content-Type': 'application/json'
                }
            });
            if (data.errors) {
                throw new Error(data.errors[0].message);
            }
            return data.data
        }
        catch (error) {
            console.error('Error delete calendar events:', {
                error: error instanceof Error ? {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                } : error
            });
            throw error;
        }
    },
    editEvent: async (userId: string, event: DayEvent) => {
        try {
            console.log("ok")
            console.log(event)
            const { data } = await calendarApi.put(`/${event.id}`, {
                title: event.title,
                description: event.description,
                date: event.date,
                type: event.type,
                project: event.project,
                location: event.location
            }, {
                headers: {
                    'Authorization': `Bearer ${userId}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log("no")

            if (data.errors) {
                throw new Error(data.errors[0].message)
            }
            return data

        } catch (error) {
            console.error('Error edit calendar events:', {
                error: error instanceof Error ? {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                } : error
            });
            throw error;
        }
    },

    addEvent: async (userId: string, Data: DayEvent) => {
        try {
            const { data } = await calendarApi.post('', Data, {
                headers: {
                    'Authorization': `Bearer ${userId}`,
                    'Content-Type': 'application/json'
                }
            })

            return data.data
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

    loadEvents: async (userId: string) => {
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
            const { data } = await calendarApi.get(``, {
                headers: {
                    'Authorization': `Bearer ${userId}`,
                    'Content-Type': 'application/json',
                }
            });
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
