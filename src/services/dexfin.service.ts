import { dexfinv3Api } from "./api.service.ts";
import {
  EvmWalletBalanceRequestType,
  EvmWalletBalanceResponseType,
} from "../types/dexfinv3.type.ts";

export const dexfinv3Service = {
  getEvmWalletBalance: async ({
    chainId,
    address,
  }: EvmWalletBalanceRequestType): Promise<EvmWalletBalanceResponseType[]> => {
    try {
      const { data } = await dexfinv3Api.get<EvmWalletBalanceResponseType[]>(
        "/evm/wallet/",
        {
          params: {
            chainId,
            address,
          },
        }
      );
      return data;
    } catch (error) {
      console.log("Failed to fetch evm wallet balance:", error);
    }

    return [];
  },
};
