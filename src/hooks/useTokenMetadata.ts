import { useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { dexfinv3Service } from "../services/dexfin.service.ts";
import { TokenMetadata } from "../types/wallet.type.ts";
import useTokenStore from "../store/useTokenStore.ts";

export const useEvmTokenMetadata = ({
  chainId,
  tokenAddress,
}: {
  chainId: number;
  tokenAddress: string;
}) => {
  const enabled = !!chainId && !!tokenAddress;
  const fetchMetadata = useCallback(async () => {
    if (!chainId || !tokenAddress) {
      return null;
    }

    const data = await dexfinv3Service.getEvmTokenMetadata({
      chainId: chainId,
      tokenAddress: tokenAddress,
    });

    if (data) {
      return data;
    }

    return null;
  }, [chainId, tokenAddress]);

  const { isLoading, refetch, data } = useQuery<TokenMetadata | null>({
    queryKey: ["metadata", tokenAddress, chainId],
    queryFn: fetchMetadata,
    refetchInterval: 10_000,
    enabled,
  });

  useEffect(() => {
    if (data) {
      useTokenStore.getState().setTokenMetadata(data, chainId);
    }
  }, [data]);

  return {
    isLoading,
    refetch,
    data,
  };
};
