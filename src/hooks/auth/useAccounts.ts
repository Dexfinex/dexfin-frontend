import {useCallback, useState} from 'react';
import {AuthMethod} from '@lit-protocol/types';
import {getPKPs, mintPKP} from '../../utils/lit.util.ts';
import {IRelayPKP} from '@lit-protocol/types';

export default function useAccounts() {
    const [accounts, setAccounts] = useState<IRelayPKP[]>([]);
    const [currentAccount, setCurrentAccount] = useState<IRelayPKP>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error>();

    /**
     * Fetch PKPs tied to given auth method
     */
    const fetchAccounts = useCallback(
        async (authMethod: AuthMethod): Promise<void> => {
            setLoading(true);
            setError(undefined);
            try {
                // Fetch PKPs tied to given auth method
                const myPKPs = await getPKPs(authMethod);
                // console.log('fetchAccounts pkps: ', myPKPs);
                setAccounts(myPKPs);
                // If only one PKP, set as current account
                if (myPKPs.length > 0) {
                    setCurrentAccount(myPKPs[0]);
                }
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    /**
     * Mint a new PKP for current auth method
     */
    const createAccount = useCallback(
        async (authMethod: AuthMethod): Promise<void> => {
            setLoading(true);
            setError(undefined);
            // alert("createdAccount")

            try {
                // Fetch PKPs tied to given auth method
                const myPKPs = await getPKPs(authMethod);
                // If only one PKP, set as current account
                if (myPKPs.length > 0) {
                    setCurrentAccount(myPKPs[0]);
                    setAccounts(myPKPs);
                    setLoading(false)
                    return
                }
            } catch (err) {
                console.log("error fetching existing accounts", err)
            }

            try {
                const newPKP = await mintPKP(authMethod);
                // console.log('createAccount pkp: ', newPKP);
                setAccounts(prev => [...prev, newPKP]);
                setCurrentAccount(newPKP);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return {
        fetchAccounts,
        createAccount,
        setCurrentAccount,
        accounts,
        currentAccount,
        loading,
        error,
        setError
    };
}
