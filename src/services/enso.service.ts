import { enSoApi } from "./api.service.ts";

export interface EnSoResponse {
    createdAt: number;
    tx: {
        data: string;
        to: string;
        from: string;
        value: string;
        operationType: number;
    }
    gas: string;
    bundle: any[]
}

export const enSoService = {
    sendBundle: async ({ fromAddress, chainId, routingStrategy = "delegate", actions }: { fromAddress: string, chainId: number, routingStrategy: string, actions: any[] }) => {
        try {
            const { data } = await enSoApi.post<EnSoResponse>(`/bundle?chainId=${chainId}&fromAddress=${fromAddress}&routingStrategy=${routingStrategy}`,
                actions
            );
            return data;
        } catch (error) {
            console.error('Failed to fetch news:', error);
            throw error;
        }
    },
}