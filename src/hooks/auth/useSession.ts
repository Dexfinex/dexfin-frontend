import {useCallback, useState} from 'react';
// import { LitAbility, LitActionResource } from '@lit-protocol/auth-helpers';
import {IRelayPKP, SessionSigs} from '@lit-protocol/types';
import {getSessionSigs} from '../../utils/lit.util.ts';
import {ExAuthType} from "../../types/auth.type.ts";

export default function useSession() {
    const [sessionSigs, setSessionSigs] = useState<SessionSigs>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error>();


    /**
     * Generate session sigs and store new session data
     */
    const initSession = useCallback(
        async (authMethod: ExAuthType, pkp: IRelayPKP): Promise<void> => {
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

    const initSessionRepeatedly = useCallback(
        async (authMethod: ExAuthType, pkp: IRelayPKP): Promise<void> => {
            const sessionSigs = await getSessionSigs({
                pkpPublicKey: pkp.publicKey,
                authMethod,
            });
            setSessionSigs(sessionSigs);
        },
        []
    );

    /**
     * Generate session sigs and store new session data
     */
    const initSessionUnSafe = useCallback(
        async (authMethod: ExAuthType, pkp: IRelayPKP): Promise<void> => {
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
        initSessionRepeatedly,
        initSessionUnSafe,
        sessionSigs,
        loading,
        error,
        setError,
    };
}
