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
    sendBundle: async ({ fromAddress, chainId, routingStrategy = "router", actions }: { fromAddress: string, chainId: number, routingStrategy: string, actions: any[] }) => {
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
    getRouter: async ({ fromAddress, chainId, receiver, tokenIn, amountIn, tokenOut }: { fromAddress: string, chainId: number, receiver: string, tokenIn: string[], amountIn: string[], tokenOut: string[] }) => {
        try {
            const _tokenIn = tokenIn.length === 1 ? tokenIn[0] : tokenIn.toString();
            const _amountIn = amountIn.length === 1 ? amountIn[0] : amountIn.toString();
            const _tokenOut = tokenOut.length === 1 ? tokenOut[0] : tokenOut.toString();

            const { data } = await enSoApi.get<EnSoResponse>(`/route?chainId=${chainId}&fromAddress=${fromAddress}&receiver=${receiver}&tokenIn=${_tokenIn}&amountIn=${_amountIn}&tokenOut=${_tokenOut}`);
            return data;
        } catch (error) {
            console.error('Failed to fetch news:', error);
            throw error;
        }
    },
}