import {
    BaseProvider,
    DiscordProvider,
    EthWalletProvider,
    GoogleProvider,
    LitRelay,
    StytchOtpProvider,
    WebAuthnProvider,
} from '@lit-protocol/lit-auth-client';
import {LitNodeClient} from '@lit-protocol/lit-node-client';
import {AUTH_METHOD_SCOPE, AUTH_METHOD_TYPE, LIT_ABILITY, LIT_NETWORK, PROVIDER_TYPE} from '@lit-protocol/constants';
import {
    AuthMethod,
    GetSessionSigsProps,
    ILitNodeClient,
    IRelayPKP,
    LIT_NETWORKS_KEYS,
    SessionSigs,
} from '@lit-protocol/types';
import {LitActionResource, LitPKPResource} from '@lit-protocol/auth-helpers';
import {StoredKeyMetadata} from "@lit-protocol/wrapped-keys";
import {listEncryptedKeyMetadata} from "@lit-protocol/wrapped-keys/src/lib/api";

export const DOMAIN = import.meta.env.VITE_PUBLIC_DOMAIN || 'localhost';
export const ORIGIN =
    import.meta.env.VITE_ENV_MODE === 'production'
        ? `https://${DOMAIN}`
        : `http://${DOMAIN}:5173`;

export const SELECTED_LIT_NETWORK = ((import.meta.env
        .NEXT_PUBLIC_LIT_NETWORK as string) ||
    LIT_NETWORK.DatilDev) as LIT_NETWORKS_KEYS;

export const litNodeClient: LitNodeClient = new LitNodeClient({
    alertWhenUnauthorized: false,
    litNetwork: SELECTED_LIT_NETWORK,
    debug: true,
});

litNodeClient.connect();

const litRelay = new LitRelay({
    relayUrl: LitRelay.getRelayUrl(LIT_NETWORK.DatilDev),
    relayApiKey: 'test-api-key',
});

/**
 * Validate provider
 */
export function isSocialLoginSupported(provider: string): boolean {
    return ['google', 'discord'].includes(provider);
}

/**
 * Redirect to Lit login
 */
export async function signInWithGoogle(redirectUri: string): Promise<void> {
    const googleProvider = new GoogleProvider({relay: litRelay, litNodeClient, redirectUri});
    /*
      const googleProvider = litAuthClient.initProvider<GoogleProvider>(
        PROVIDER_TYPE.Google,
        { redirectUri }
      );
    */
    await googleProvider.signIn((loginUrl) => {
        window.location.href = loginUrl.replace('https://login.litgateway.com', 'https://defi-os-lit-login-server-production.up.railway.app');
    });
}

/**
 * Get auth method object from redirect
 */
export async function authenticateWithGoogle(
    redirectUri: string
): Promise<AuthMethod | undefined> {
    const googleProvider = new GoogleProvider({relay: litRelay, litNodeClient, redirectUri});
    /*
      const googleProvider = litAuthClient.initProvider<GoogleProvider>(
        PROVIDER_TYPE.Google,
        { redirectUri }
      );
    */
    return await googleProvider.authenticate();
}

/**
 * Redirect to Lit login
 */
export async function signInWithDiscord(redirectUri: string): Promise<void> {
    const discordProvider = new DiscordProvider({relay: litRelay, litNodeClient, redirectUri});
    await discordProvider.signIn((loginUrl) => {
        window.location.href = loginUrl.replace('https://login.litgateway.com', 'https://defi-os-lit-login-server-production.up.railway.app');
    });
}

/**
 * Get auth method object from redirect
 */
export async function authenticateWithDiscord(
    redirectUri: string
): Promise<AuthMethod | undefined> {
    const discordProvider = new DiscordProvider({relay: litRelay, litNodeClient, redirectUri});
    /*
      const discordProvider = litAuthClient.initProvider<DiscordProvider>(
        PROVIDER_TYPE.Discord,
        { redirectUri }
      );
    */
    return await discordProvider.authenticate();
}

/**
 * Get auth method object by signing a message with an Ethereum wallet
 */
export async function authenticateWithEthWallet(
    address?: string,
    signMessage?: (message: string) => Promise<string>
): Promise<AuthMethod | undefined> {
    const ethWalletProvider = new EthWalletProvider({
        relay: litRelay, litNodeClient, domain: DOMAIN, origin: ORIGIN,
    });
    /*
        const ethWalletProvider = litAuthClient.initProvider<EthWalletProvider>(
            PROVIDER_TYPE.EthWallet,
            {
                domain: DOMAIN,
                origin: ORIGIN,
            }
        );
    */
    return await ethWalletProvider.authenticate({
        address,
        signMessage,
    });
}

/**
 * Register new WebAuthn credential
 */
export async function registerWebAuthn(): Promise<IRelayPKP> {
    const provider = new WebAuthnProvider({relay: litRelay, litNodeClient});
    /*
        const provider = litAuthClient.initProvider<WebAuthnProvider>(
            PROVIDER_TYPE.WebAuthn
        );
    */
    // Register new WebAuthn credential

    const options = await provider.register();

    // Verify registration and mint PKP through relay server
    const txHash = await provider.verifyAndMintPKPThroughRelayer(options);
    const response = await provider.relay.pollRequestUntilTerminalState(txHash);
    if (response.status !== 'Succeeded') {
        throw new Error('Minting failed');
    }
    return {
        tokenId: response.pkpTokenId!,
        publicKey: response.pkpPublicKey!,
        ethAddress: response.pkpEthAddress!,
    };
}

/**
 * Get auth method object by authenticating with a WebAuthn credential
 */
export async function authenticateWithWebAuthn(): Promise<
    AuthMethod | undefined
> {
    const provider = new WebAuthnProvider({relay: litRelay, litNodeClient});
    /*
        let provider = litAuthClient.getProvider(PROVIDER_TYPE.WebAuthn);
        if (!provider) {
            provider = litAuthClient.initProvider<WebAuthnProvider>(
                PROVIDER_TYPE.WebAuthn
            );
        }
    */
    return await provider.authenticate();
}

/**
 * Get auth method object by validating Stytch JWT
 */
export async function authenticateWithStytch(
    accessToken: string,
    userId?: string,
    method?: string
) {
    let provider: BaseProvider;
    if (method === 'email') {
        provider = new StytchOtpProvider({relay: litRelay, litNodeClient,}, {
            appId: import.meta.env.VITE_STYTCH_PROJECT_ID,
            userId: PROVIDER_TYPE.StytchEmailFactorOtp
        })
        /*
                provider = litAuthClient.initProvider(PROVIDER_TYPE.StytchEmailFactorOtp, {
                    appId: import.meta.env.VITE_STYTCH_PROJECT_ID,
                });
        */
    } else {
        provider = new StytchOtpProvider({relay: litRelay, litNodeClient,}, {
            appId: import.meta.env.VITE_STYTCH_PROJECT_ID,
            userId: PROVIDER_TYPE.StytchSmsFactorOtp
        })
        /*
                provider = litAuthClient.initProvider(PROVIDER_TYPE.StytchSmsFactorOtp, {
                    appId: import.meta.env.VITE_STYTCH_PROJECT_ID,
                });
        */
    }

    return await provider?.authenticate({accessToken, userId});
}

/**
 * Generate session sigs for given params
 */
export async function getSessionSigs({
                                         pkpPublicKey,
                                         authMethod,
                                         // sessionSigsParams,
                                     }: {
    pkpPublicKey: string;
    authMethod: AuthMethod;
    // sessionSigsParams: GetSessionSigsProps;
}): Promise<SessionSigs> {
    // const provider = getProviderByAuthMethod(authMethod);
    // if (provider) {
    await litNodeClient.connect();
    return await litNodeClient.getPkpSessionSigs({
        pkpPublicKey,
        authMethods: [authMethod],
        expiration: new Date(Date.now() + 1000 * 600).toISOString(), // added for Wrapped Keys
        resourceAbilityRequests: [
            {
                resource: new LitPKPResource('*'),
                ability: LIT_ABILITY.PKPSigning,
            },
            {
                resource: new LitActionResource("*"),
                ability: LIT_ABILITY.LitActionExecution,
            },
        ],
    });
    /*
        } else {
            throw new Error(
                `Provider not found for auth method type ${authMethod.authMethodType}`
            );
        }
    */
}

export async function updateSessionSigs(
    params: GetSessionSigsProps
): Promise<SessionSigs> {
    return await litNodeClient.getSessionSigs(params);
}

/**
 * Fetch PKPs associated with given auth method
 */
export async function getPKPs(authMethod: AuthMethod): Promise<IRelayPKP[]> {
    const provider = getProviderByAuthMethod(authMethod);
    if (provider) {
        return await provider.fetchPKPsThroughRelayer(authMethod);
    }

    return []
}

/**
 * Mint a new PKP for current auth method
 */
export async function mintPKP(authMethod: AuthMethod): Promise<IRelayPKP> {
    const provider = getProviderByAuthMethod(authMethod);

    if (!provider)
        throw new Error('provider is null');

    // Set scope of signing any data
    const options = {
        permittedAuthMethodScopes: [[AUTH_METHOD_SCOPE.SignAnything]],
    };

    let txHash: string;

    if (authMethod.authMethodType === AUTH_METHOD_TYPE.WebAuthn) {
        // Register new WebAuthn credential

        const webAuthnInfo = await (provider as WebAuthnProvider).register();

        // Verify registration and mint PKP through relay server
        txHash = await (
            provider as WebAuthnProvider
        ).verifyAndMintPKPThroughRelayer(webAuthnInfo, options);
    } else {
        // Mint PKP through relay server
        txHash = await provider.mintPKPThroughRelayer(authMethod, options);
    }

    let attempts = 3;
    let response = null;

    while (attempts > 0) {
        try {
            response = await provider.relay.pollRequestUntilTerminalState(txHash);
            break;
        } catch (err) {
            console.warn('Minting failed, retrying...', err);

            // give it a second before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
            attempts--;
        }
    }

    if (!response || response.status !== 'Succeeded') {
        throw new Error('Minting failed');
    }

    return {
        tokenId: response.pkpTokenId!,
        publicKey: response.pkpPublicKey!,
        ethAddress: response.pkpEthAddress!,
    };
}

/**
 * Get provider for given auth method
 */
function getProviderByAuthMethod(authMethod: AuthMethod) {
    switch (authMethod.authMethodType) {
        case AUTH_METHOD_TYPE.GoogleJwt:
            return new GoogleProvider({relay: litRelay, litNodeClient});
        case AUTH_METHOD_TYPE.Discord:
            return new DiscordProvider({relay: litRelay, litNodeClient});
        case AUTH_METHOD_TYPE.EthWallet:
            return new EthWalletProvider({relay: litRelay, litNodeClient});
        case AUTH_METHOD_TYPE.WebAuthn:
            return new WebAuthnProvider({relay: litRelay, litNodeClient});
        case AUTH_METHOD_TYPE.StytchEmailFactorOtp:
            return new StytchOtpProvider({relay: litRelay, litNodeClient,}, {
                appId: import.meta.env.VITE_STYTCH_PROJECT_ID,
                userId: PROVIDER_TYPE.StytchEmailFactorOtp
            })
        case AUTH_METHOD_TYPE.StytchSmsFactorOtp:
            return new StytchOtpProvider({relay: litRelay, litNodeClient,}, {
                appId: import.meta.env.VITE_STYTCH_PROJECT_ID,
                userId: PROVIDER_TYPE.StytchSmsFactorOtp
            })
        default:
            return;
    }
}

/*
export function initProviderByMethod(authMethod: AuthMethod) {
    switch (authMethod.authMethodType) {
        case AUTH_METHOD_TYPE.GoogleJwt:
            litAuthClient.initProvider<GoogleProvider>(
                PROVIDER_TYPE.Google,
                {redirectUri: ORIGIN}
            );
            break;
        case AUTH_METHOD_TYPE.Discord:
            litAuthClient.initProvider<DiscordProvider>(
                PROVIDER_TYPE.Discord,
                {redirectUri: ORIGIN}
            );
            break;
        case AUTH_METHOD_TYPE.WebAuthn:
            litAuthClient.initProvider<WebAuthnProvider>(
                PROVIDER_TYPE.WebAuthn
            )
            break;
        case AUTH_METHOD_TYPE.StytchEmailFactorOtp:
            litAuthClient.initProvider(PROVIDER_TYPE.StytchEmailFactorOtp, {
                appId: import.meta.env.VITE_STYTCH_PROJECT_ID,
            })
            break;
        case AUTH_METHOD_TYPE.StytchSmsFactorOtp:
            litAuthClient.initProvider(PROVIDER_TYPE.StytchSmsFactorOtp, {
                appId: import.meta.env.VITE_STYTCH_PROJECT_ID,
            })
            break;
        default:
            break;
    }
}
*/


export const getWrappedKeyMetaDataList = async (sessionSigs: SessionSigs): Promise<StoredKeyMetadata[] | null> => {
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    for (let attempt = 1; attempt <= 10; attempt++) {
        try {
            return await listEncryptedKeyMetadata({
                pkpSessionSigs: sessionSigs,
                litNodeClient: litNodeClient as ILitNodeClient,
            });
        } catch (err) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            if (err?.message?.toLowerCase().indexOf('no keys exist') >= 0) {
                return []
            }
            console.log(`Attempt ${attempt} failed:`, err);
            if (attempt < 3) await sleep(300); // Wait before retrying
        }
    }

    console.log("getWrappedKeyMetaDataList failed after 3 attempts");
    return null
};
export const getSolanaWrappedKeyMetaDataByPkpEthAddress = (wrappedKeyMetaDatas: StoredKeyMetadata[], pkpEthAddress: string): StoredKeyMetadata | null => {
    let result = null
    for (const wrappedKeyMetaData of wrappedKeyMetaDatas) {
        if (wrappedKeyMetaData.pkpAddress === pkpEthAddress) {
            result = wrappedKeyMetaData
            break;
        }
    }
    return result
}
