import { technicalanalysisApi } from "./api.service";
import { TwitterInfo } from "../types/twitterinfo";
import { SignificantTransactions } from "../types/signitransactions";

export const technicalanalysisService = {
    getTwitterInfo: async (): Promise<TwitterInfo[]> => {
        try {
            console.log("getting twitter data service...");
            const data = await technicalanalysisApi.get<TwitterInfo[]>('/twitter-info');
            console.log("service twitter data : ", data.data);
            return data.data;
        } catch (error) {
            console.error('Error fetching Twitter info:', error);
            throw error;
        }
    },
    getSignificantTransactions: async (coin: string): Promise<SignificantTransactions> => {
        try {
            console.log("getting significant transactions...");
            const data = await technicalanalysisApi.get<SignificantTransactions>(`/transactions?blockchain=${coin}`);
            console.log("service significant transactions data : ", data.data);
            return data.data;
        } catch (error) {
            console.error('Error fetching significant transactions:', error);
            throw error;
        }
    }
};
