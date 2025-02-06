import {
  BaseProvider,
  DiscordProvider,
  EthWalletProvider,
  GoogleProvider,
  LitAuthClient,
  WebAuthnProvider,
} from '@lit-protocol/lit-auth-client';
import {LitNodeClient} from '@lit-protocol/lit-node-client';
import {AuthMethodScope, AuthMethodType, LIT_NETWORK, ProviderType,} from '@lit-protocol/constants';
import {
  AuthMethod,
  GetSessionSigsProps,
  ILitNodeClient,
  IRelayPKP,
  LIT_NETWORKS_KEYS,
  LitAbility,
  SessionSigs,
} from '@lit-protocol/types';
import {LitActionResource, LitPKPResource} from '@lit-protocol/auth-helpers';
import {StoredKeyMetadata} from "@lit-protocol/wrapped-keys";
import {listEncryptedKeyMetadata} from "@lit-protocol/wrapped-keys/src/lib/api";

export const DOMAIN = import.meta.env.VITE_PUBLIC_DOMAIN || 'localhost';
export const ORIGIN =
  import.meta.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
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

export const litAuthClient: LitAuthClient = new LitAuthClient({
  litRelayConfig: {
    relayApiKey: 'test-api-key',
  },
  litNodeClient,
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
  const googleProvider = litAuthClient.initProvider<GoogleProvider>(
    ProviderType.Google,
    { redirectUri }
  );
  await googleProvider.signIn();
}

/**
 * Get auth method object from redirect
 */
export async function authenticateWithGoogle(
  redirectUri: string
): Promise<AuthMethod | undefined> {
  const googleProvider = litAuthClient.initProvider<GoogleProvider>(
    ProviderType.Google,
    { redirectUri }
  );
  const authMethod = await googleProvider.authenticate();
  return authMethod;
}

/**
 * Redirect to Lit login
 */
export async function signInWithDiscord(redirectUri: string): Promise<void> {
  const discordProvider = litAuthClient.initProvider<DiscordProvider>(
    ProviderType.Discord,
    { redirectUri }
  );
  await discordProvider.signIn();
}

/**
 * Get auth method object from redirect
 */
export async function authenticateWithDiscord(
  redirectUri: string
): Promise<AuthMethod | undefined> {
  const discordProvider = litAuthClient.initProvider<DiscordProvider>(
    ProviderType.Discord,
    { redirectUri }
  );
  const authMethod = await discordProvider.authenticate();
  return authMethod;
}

/**
 * Get auth method object by signing a message with an Ethereum wallet
 */
export async function authenticateWithEthWallet(
  address?: string,
  signMessage?: (message: string) => Promise<string>
): Promise<AuthMethod | undefined> {
  const ethWalletProvider = litAuthClient.initProvider<EthWalletProvider>(
    ProviderType.EthWallet,
    {
      domain: DOMAIN,
      origin: ORIGIN,
    }
  );
  const authMethod = await ethWalletProvider.authenticate({
    address,
    signMessage,
  });
  return authMethod;
}

/**
 * Register new WebAuthn credential
 */
export async function registerWebAuthn(): Promise<IRelayPKP> {
  const provider = litAuthClient.initProvider<WebAuthnProvider>(
    ProviderType.WebAuthn
  );
  // Register new WebAuthn credential
   
  const options = await provider.register();

  // Verify registration and mint PKP through relay server
  const txHash = await provider.verifyAndMintPKPThroughRelayer(options);
  const response = await provider.relay.pollRequestUntilTerminalState(txHash);
  if (response.status !== 'Succeeded') {
    throw new Error('Minting failed');
  }
  const newPKP: IRelayPKP = {
    tokenId: response.pkpTokenId!,
    publicKey: response.pkpPublicKey!,
    ethAddress: response.pkpEthAddress!,
  };
  return newPKP;
}

/**
 * Get auth method object by authenticating with a WebAuthn credential
 */
export async function authenticateWithWebAuthn(): Promise<
  AuthMethod | undefined
> {
  let provider = litAuthClient.getProvider(ProviderType.WebAuthn);
  if (!provider) {
    provider = litAuthClient.initProvider<WebAuthnProvider>(
      ProviderType.WebAuthn
    );
  }
  const authMethod = await provider.authenticate();
  return authMethod;
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
    provider = litAuthClient.initProvider(ProviderType.StytchEmailFactorOtp, {
      appId: import.meta.env.VITE_STYTCH_PROJECT_ID,
    });
  } else {
    provider = litAuthClient.initProvider(ProviderType.StytchSmsFactorOtp, {
      appId: import.meta.env.VITE_STYTCH_PROJECT_ID,
    });
  }

  const authMethod = await provider?.authenticate({ accessToken, userId });
  return authMethod;
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
  const provider = getProviderByAuthMethod(authMethod);
  if (provider) {
    await litNodeClient.connect();
    const sessionSigs = await litNodeClient.getPkpSessionSigs({
      pkpPublicKey,
      authMethods: [authMethod],
      expiration: new Date(Date.now() + 1000 * 600).toISOString(), // added for Wrapped Keys
      resourceAbilityRequests: [
        {
          resource: new LitPKPResource('*'),
          ability: LitAbility.PKPSigning,
        },
        {
          resource: new LitActionResource("*"),
          ability: LitAbility.LitActionExecution,
        },
      ],
    });

    return sessionSigs;
  } else {
    throw new Error(
      `Provider not found for auth method type ${authMethod.authMethodType}`
    );
  }
}

export async function updateSessionSigs(
  params: GetSessionSigsProps
): Promise<SessionSigs> {
  const sessionSigs = await litNodeClient.getSessionSigs(params);
  return sessionSigs;
}

/**
 * Fetch PKPs associated with given auth method
 */
export async function getPKPs(authMethod: AuthMethod): Promise<IRelayPKP[]> {
  const provider = getProviderByAuthMethod(authMethod);
  if (provider) {
    const allPKPs = await provider.fetchPKPsThroughRelayer(authMethod);
    return allPKPs;
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
    permittedAuthMethodScopes: [[AuthMethodScope.SignAnything]],
  };

  let txHash: string;

  if (authMethod.authMethodType === AuthMethodType.WebAuthn) {
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

  const newPKP: IRelayPKP = {
    tokenId: response.pkpTokenId!,
    publicKey: response.pkpPublicKey!,
    ethAddress: response.pkpEthAddress!,
  };

  return newPKP;
}

/**
 * Get provider for given auth method
 */
function getProviderByAuthMethod(authMethod: AuthMethod) {
  switch (authMethod.authMethodType) {
    case AuthMethodType.GoogleJwt:
      return litAuthClient.getProvider(ProviderType.Google);
    case AuthMethodType.Discord:
      return litAuthClient.getProvider(ProviderType.Discord);
    case AuthMethodType.EthWallet:
      return litAuthClient.getProvider(ProviderType.EthWallet);
    case AuthMethodType.WebAuthn:
      return litAuthClient.getProvider(ProviderType.WebAuthn);
    case AuthMethodType.StytchEmailFactorOtp:
      return litAuthClient.getProvider(ProviderType.StytchEmailFactorOtp);
    case AuthMethodType.StytchSmsFactorOtp:
      return litAuthClient.getProvider(ProviderType.StytchSmsFactorOtp);
    default:
      return;
  }
}

export function initProviderByMethod(authMethod: AuthMethod) {
  switch (authMethod.authMethodType) {
    case AuthMethodType.GoogleJwt:
      litAuthClient.initProvider<GoogleProvider>(
          ProviderType.Google,
          { redirectUri: ORIGIN }
      );
      break;
    case AuthMethodType.Discord:
      litAuthClient.initProvider<DiscordProvider>(
          ProviderType.Discord,
          { redirectUri: ORIGIN }
      );
      break;
    case AuthMethodType.WebAuthn:
      litAuthClient.initProvider<WebAuthnProvider>(
          ProviderType.WebAuthn
      )
      break;
    case AuthMethodType.StytchEmailFactorOtp:
      litAuthClient.initProvider(ProviderType.StytchEmailFactorOtp, {
        appId: import.meta.env.VITE_STYTCH_PROJECT_ID,
      })
      break;
    case AuthMethodType.StytchSmsFactorOtp:
      litAuthClient.initProvider(ProviderType.StytchSmsFactorOtp, {
        appId: import.meta.env.VITE_STYTCH_PROJECT_ID,
      })
      break;
    default:
      break;
  }
}


export const getWrappedKeyMetaDatas = async (sessionSigs: SessionSigs): Promise<StoredKeyMetadata[]> => {
  try {
    const wrappedKeyMetadatas = await listEncryptedKeyMetadata({
      pkpSessionSigs: sessionSigs,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      litNodeClient: litNodeClient as ILitNodeClient,
    });

    return wrappedKeyMetadatas

  } catch(err) {
    console.log("getWrappedKeyMetaDatas error", err)
    return []
  }
}

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
