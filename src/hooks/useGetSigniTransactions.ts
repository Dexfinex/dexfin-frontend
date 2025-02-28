import { useState, useEffect } from 'react';
import { technicalanalysisService } from "../services/technicalanalysis.service";
import { SignificantTransactions } from '../types/signitransactions';

export const useGetSignificantTransactions = () => {
    const [ethData, setEthData] = useState<SignificantTransactions[]>([]);
    const [btcData, setBtcData] = useState<SignificantTransactions[]>([]);
    const [topEthData, setTopEthData] = useState<SignificantTransactions | null>(null);
    const [topBtcData, setTopBtcData] = useState<SignificantTransactions | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const processTransactions = (result: any): [SignificantTransactions[], SignificantTransactions | null] => {
        let transactions = [];

        if (Array.isArray(result)) {
            // If result is already an array
            transactions = result;
        } else if (result && typeof result === 'object') {
            if (result.data && Array.isArray(result.data)) {
                transactions = result.data;
            } else {
                transactions = [result];
            }
        }

        // Find transaction with highest amount
        let topTransaction = null;
        if (transactions.length > 0) {
            let highestAmountTx = transactions[0];
            let highestAmount = 0;

            for (const tx of transactions) {
                const amount = typeof tx.amount === 'string'
                    ? parseFloat(tx.amount)
                    : typeof tx.amount === 'number'
                        ? tx.amount
                        : 0;

                const amountUsd = typeof tx.amount_usd === 'string'
                    ? parseFloat(tx.amount_usd)
                    : typeof tx.amount_usd === 'number'
                        ? tx.amount_usd
                        : 0;

                const currentAmount = amountUsd > 0 ? amountUsd : amount;

                if (currentAmount > highestAmount) {
                    highestAmount = currentAmount;
                    highestAmountTx = tx;
                }
            }

            topTransaction = highestAmountTx;
        }

        return [transactions, topTransaction];
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch Ethereum transactions
                console.log("Getting ETH significant transactions...");
                const ethResult = await technicalanalysisService.getSignificantTransactions('ethereum');
                console.log("ETH transactions data:", ethResult);

                const [ethTransactions, highestEthTx] = processTransactions(ethResult);
                setEthData(ethTransactions);
                setTopEthData(highestEthTx);

                // Fetch Bitcoin transactions
                console.log("Getting BTC significant transactions...");
                const btcResult = await technicalanalysisService.getSignificantTransactions('bitcoin');
                console.log("BTC transactions data:", btcResult);

                const [btcTransactions, highestBtcTx] = processTransactions(btcResult);
                setBtcData(btcTransactions);
                setTopBtcData(highestBtcTx);

            } catch (err) {
                console.error("Error in useGetSignificantTransactions:", err);
                setError(err instanceof Error ? err : new Error('Unknown error'));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Return all data, top transactions, loading and error
    return {
        ethData,
        btcData,
        topEthData,
        topBtcData,
        loading,
        error
    };
}