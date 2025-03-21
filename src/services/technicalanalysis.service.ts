import { TechnicalAnalysisApi } from "./api.service";
import {SignificantTransactions, TwitterInfo} from "../types";

export const TechnicalAnalysisService = {
    getTwitterInfo: async (): Promise<TwitterInfo[]> => {
        try {
            console.log("getting twitter data service...");
            const data = await TechnicalAnalysisApi.get<TwitterInfo[]>('/twitter-info');
            // console.log("service twitter data : ", data.data);
            return data.data;
        } catch (error) {
            console.error('Error fetching Twitter info:', error);
            throw error;
        }
    },
    getSignificantTransactions: async (coin: string): Promise<SignificantTransactions> => {
        try {
            console.log("getting significant transactions...");
            const data = await TechnicalAnalysisApi.get<SignificantTransactions>(`/transactions?blockchain=${coin}`);
            // console.log("service significant transactions data : ", data.data);
            return data.data;
        } catch (error) {
            console.error('Error fetching significant transactions:', error);
            throw error;
        }
    }
};
