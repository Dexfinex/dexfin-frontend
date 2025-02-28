import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { cryptoNewsService } from "../services/cryptonews.service";
import useCryptoNewsStore from "../store/useCryptoNewsStore";
import { NewsItem } from "../types";

export const useGetLatestCryptoNews = () => {
    const fetchLatestNews = useCallback(async () => {
        const data = await cryptoNewsService.getLatestNews();

        return data;
    }, []);

    const { isLoading, refetch, data, error } = useQuery<NewsItem[]>({
        queryKey: ["get-latest-crypto-news"],
        queryFn: fetchLatestNews,
        refetchInterval: 5 * 60_000,
    });

    useEffect(() => {
        if (data) {
            useCryptoNewsStore.getState().setLatestCryptoNews(data);
        }
    }, [data])

    return {
        isLoading,
        refetch,
        data,
        error
    };
};

export const useGetCryptoNews = (page: number = 1) => {
    const fetchLatestNews = useCallback(async () => {
        const data = await cryptoNewsService.getLatestNews(page);

        return data;
    }, []);

    const { isLoading, refetch, data, error } = useQuery<NewsItem[]>({
        queryKey: [`get-latest-crypto-news-${page}`],
        queryFn: fetchLatestNews,
        refetchInterval: 5 * 60_000,
    });

    return {
        isLoading,
        refetch,
        data,
        error
    };
};
