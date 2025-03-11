import { useState, useEffect, useCallback } from 'react';
import { TechnicalAnalysisService } from "../services/technicalanalysis.service";
import { TwitterInfo } from "../types/twitterinfo";

export const useGetTwitterInfo = (refreshTrigger = 0) => {
    const [data, setData] = useState<TwitterInfo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        try {
            console.log("getting twitter info.....");
            setLoading(true);
            const result = await TechnicalAnalysisService.getTwitterInfo();
            console.log("hook twitter data : ", result);
            setData(result);
            setError(null);
        } catch (err) {
            console.error("Error in useGetTwitterInfo:", err);
            setError(err instanceof Error ? err : new Error('Unknown error'));
        } finally {
            setLoading(false);
        }
    }, []);

    // Refetch function that can be called from components
    const refetch = useCallback(() => {
        return fetchData();
    }, [fetchData]);

    // Effect to fetch data initially and when refreshTrigger changes
    useEffect(() => {
        fetchData();
    }, [fetchData, refreshTrigger]);

    return { data, loading, error, refetch };
};