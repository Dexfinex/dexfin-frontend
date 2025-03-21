import {useCallback, useState} from 'react';
// import { LitAbility, LitActionResource } from '@lit-protocol/auth-helpers';
import {AuthMethod, IRelayPKP, SessionSigs} from '@lit-protocol/types';
import {getSessionSigs} from '../../utils/lit.util.ts';

export default function useSession() {
    const [sessionSigs, setSessionSigs] = useState<SessionSigs>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error>();


    /**
     * Generate session sigs and store new session data
     */
    const initSession = useCallback(
        async (authMethod: AuthMethod, pkp: IRelayPKP): Promise<void> => {
            setLoading(true);
            setError(undefined);
            try {
                // Generate session sigs
                const sessionSigs = await getSessionSigs({
                    pkpPublicKey: pkp.publicKey,
                    authMethod,
                });

                setSessionSigs(sessionSigs);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    /**
     * Generate session sigs and store new session data
     */
    const initSessionUnSafe = useCallback(
        async (authMethod: AuthMethod, pkp: IRelayPKP): Promise<void> => {
            setLoading(true);
            let error = undefined
            try {
                // Generate session sigs
                const sessionSigs = await getSessionSigs({
                    pkpPublicKey: pkp.publicKey,
                    authMethod,
                });

                setSessionSigs(sessionSigs);
            } catch (err) {
                error = err as Error;
            } finally {
                setLoading(false);
            }

            setError(error)
            if (error)
                throw error;
        },
        []
    );

    return {
        initSession,
        initSessionUnSafe,
        sessionSigs,
        loading,
        error,
        setError,
    };
}
