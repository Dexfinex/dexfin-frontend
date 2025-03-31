import {useCallback, useEffect, useState} from 'react';
import {
    isSignInRedirect,
    getProviderFromUrl,
} from '@lit-protocol/lit-auth-client';
import {
    authenticateWithGoogle,
    authenticateWithDiscord,
    authenticateWithWebAuthn,
    authenticateWithStytch,
} from '../../utils/lit.util.ts';
import {Connector} from 'wagmi';
import {ExAuthType} from "../../types/auth.type.ts";

export default function useAuthenticate(redirectUri?: string) {
    const [authMethod, setAuthMethod] = useState<ExAuthType>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error>();

    /**
     * Handle redirect from Google OAuth
     */
    const authWithGoogle = useCallback(async (): Promise<void> => {
        setLoading(true);
        setError(undefined);
        setAuthMethod(undefined);

        try {
            const result: ExAuthType | undefined = await authenticateWithGoogle(redirectUri ?? '');
            setAuthMethod(result);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [redirectUri]);

    /**
     * Handle redirect from Discord OAuth
     */
    const authWithDiscord = useCallback(async (): Promise<void> => {
        setLoading(true);
        setError(undefined);
        setAuthMethod(undefined);

        try {
            const result: ExAuthType | undefined = await authenticateWithDiscord(redirectUri ?? '')
            setAuthMethod(result);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [redirectUri]);

    /**
     * Authenticate with Ethereum wallet
     */
    const authWithEthWallet = useCallback(
        async (connector: Connector): Promise<void> => {
            setLoading(true);
            setError(undefined);
            setAuthMethod(undefined);

            try {
                await connector.connect()
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    /**
     * Authenticate with WebAuthn credential
     */
    const authWithWebAuthn = useCallback(
        async (): Promise<void> => {
            setLoading(true);
            setError(undefined);
            setAuthMethod(undefined);

            try {
                const result: ExAuthType | undefined = await authenticateWithWebAuthn();
                setAuthMethod(result);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    /**
     * Authenticate with Stytch
     */
    const authWithStytch = useCallback(
        async (accessToken: string, userId?: string, method?: string): Promise<void> => {
            setLoading(true);
            setError(undefined);
            setAuthMethod(undefined);

            try {
                const result: ExAuthType | undefined = await authenticateWithStytch(
                    accessToken,
                    userId,
                    method
                );
                result.userId = userId
                setAuthMethod(result);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    useEffect(() => {
        // Check if user is redirected from social login
        if (redirectUri && isSignInRedirect(redirectUri)) {
            // If redirected, authenticate with social provider
            const providerName = getProviderFromUrl();
            if (providerName === 'google') {
                authWithGoogle();
            } else if (providerName === 'discord') {
                authWithDiscord();
            }
        }
    }, [redirectUri, authWithGoogle, authWithDiscord]);

    return {
        authWithEthWallet,
        authWithWebAuthn,
        authWithStytch,
        authMethod,
        setAuthMethod,
        loading,
        error,
        setError,
    };
}
