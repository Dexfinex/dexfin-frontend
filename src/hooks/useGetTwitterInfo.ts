import { useState, useEffect } from 'react';
import { technicalanalysisService } from "../services/technicalanalysis.service";
import { TwitterInfo } from "../types/twitterinfo";

export const useGetTwitterInfo = () => {
    const [data, setData] = useState<TwitterInfo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("getting twitter info.....");
                setLoading(true);
                const result = await technicalanalysisService.getTwitterInfo();
                console.log("hook twitter data : ", result);
                setData(result);
            } catch (err) {
                console.error("Error in useGetTwitterInfo:", err);
                setError(err instanceof Error ? err : new Error('Unknown error'));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
};