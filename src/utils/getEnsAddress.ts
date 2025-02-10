import { createPublicClient, http } from "viem";
import { normalize } from "viem/ens";

import { mapChainId2ViemChain } from "../config/networks.ts";
import { mapRpcUrls } from "../constants/index.ts";

export const getEnsAddress = async ({
  chainId,
  value,
}: {
  chainId: number;
  value: string;
}): Promise<string | null> => {
  try {
    const publicClient = createPublicClient({
      transport: http(mapRpcUrls[chainId]),
      chain: mapChainId2ViemChain[chainId],
    });
    const ensAddress = await publicClient.getEnsAddress({
      name: normalize(value),
    });

    return ensAddress || null;
  } catch (e) {
    return null;
  }
};
