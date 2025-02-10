import {createContext, useEffect, useState} from "react";
import {
    getSolanaWrappedKeyMetaDataByPkpEthAddress,
    getWrappedKeyMetaDatas,
    initProviderByMethod,
    litNodeClient,
    ORIGIN,
    signInWithDiscord,
    signInWithGoogle
} from "../utils/lit";
import useAuthenticate from "../hooks/auth/useAuthenticate";
import useAccounts from "../hooks/auth/useAccounts";
import useSession from "../hooks/auth/useSession";
import {AuthMethod, ILitNodeClient, IRelayPKP, SessionSigs} from "@lit-protocol/types";
import {PKPEthersWallet} from "@lit-protocol/pkp-ethers";
import {ExternalProvider, JsonRpcSigner, Web3Provider} from "@ethersproject/providers";
import {Connector, useAccount, useSwitchChain} from "wagmi";
import useLocalStorage from "../hooks/useLocalStorage";
import {
    LOCAL_STORAGE_AUTH_REDIRECT_TYPE,
    LOCAL_STORAGE_WALLET_INFO,
    mapBundlerUrls,
    mapPaymasterUrls,
    mapRpcUrls,
} from "../constants";
import {SavedWalletInfo, type SolanaWalletInfoType} from "../types/auth";
import {generatePrivateKey, signTransactionWithEncryptedKey} from "@lit-protocol/wrapped-keys/src/lib/api";
import {Transaction} from "@solana/web3.js";
import {SerializedTransaction} from "@lit-protocol/wrapped-keys";
import {createPublicClient, createWalletClient, custom, publicActions, type WalletClient} from "viem";
import {http} from "@wagmi/core";
import {signerToEcdsaValidator} from "@zerodev/ecdsa-validator";
import {getEntryPoint, KERNEL_V3_1} from "@zerodev/sdk/constants";
import {
    createKernelAccount,
    createKernelAccountClient,
    createZeroDevPaymasterClient,
    getUserOperationGasPrice,
    KernelEIP1193Provider
} from "@zerodev/sdk";
import { ETHRequestSigningPayload } from "@lit-protocol/pkp-ethers/src/lib/pkp-ethers-types";
import { ethers } from "ethers";
import { mapChainId2ViemChain } from "../config/networks.ts";
import { useStore } from "../store/useStore.ts";
import { useEvmWalletBalance } from "../hooks/useBalance.tsx";
import { useEvmWalletTransfer } from "../hooks/useTransfer.tsx";

interface Web3AuthContextType {
    login: () => void;
    logout: () => void;
    switchChain: (chainId: number) => Promise<void>;
    chainId: number | undefined;
    isChainSwitching: boolean;
    authMethod: AuthMethod | undefined;
    setAuthMethod: React.Dispatch<React.SetStateAction<AuthMethod | undefined>>;
    authWithEthWallet: (connector: Connector) => Promise<void>;
    authWithWebAuthn: () => Promise<void>;
    authWithStytch: (session_jwt: string, user_id: string, method: string) => Promise<void>;
    authLoading: boolean;
    authError: Error | undefined;
    fetchAccounts: (authMethod: AuthMethod) => Promise<void>;
    setCurrentAccount: React.Dispatch<React.SetStateAction<IRelayPKP | undefined>>;
    currentAccount: IRelayPKP | undefined;
    accounts: IRelayPKP[];
    accountsLoading: boolean;
    accountsError: Error | undefined;
    initSession: (authMethod: AuthMethod, pkp: IRelayPKP) => Promise<void>;
    sessionSigs: SessionSigs | undefined;
    sessionLoading: boolean;
    sessionError: Error | undefined;
    handleGoogleLogin: (isSignIn: boolean) => Promise<void>;
    handleDiscordLogin: () => Promise<void>;
    createAccount: (authMethod: AuthMethod) => Promise<void>;
    isConnected: boolean,
    provider: Web3Provider | undefined,
    signer: JsonRpcSigner | undefined,
    address: string,
    walletClient: WalletClient | undefined,
    setWalletClient: React.Dispatch<React.SetStateAction<WalletClient | undefined>>,
    isLoadingStoredWallet: boolean,
    solanaWalletInfo: SolanaWalletInfoType | undefined,
    signSolanaTransaction: (solanaTransaction: Transaction) => Promise<string | null>
}


// Provide default values for all fields in the context
const defaultWeb3AuthContextValue: Web3AuthContextType = {
    login: () => {
    },
    logout: () => {
    },
    switchChain: async () => {
    },
    chainId: undefined,
    authMethod: undefined,
    isChainSwitching: false,
    setAuthMethod: () => {
    },
    walletClient: undefined,
    setWalletClient: () => {},
    authWithEthWallet: async () => {
    },
    authWithWebAuthn: async () => {
    },
    authWithStytch: async () => {
    },
    authLoading: false,
    authError: undefined,
    fetchAccounts: async () => {
    },
    setCurrentAccount: () => {
    },
    currentAccount: undefined,
    accounts: [],
    accountsLoading: false,
    accountsError: undefined,
    initSession: async () => {
    },
    sessionSigs: undefined,
    sessionLoading: false,
    sessionError: undefined,
    handleGoogleLogin: async () => {
    },
    handleDiscordLogin: async () => {
    },
    createAccount: async () => {
    },
    isConnected: false,
    provider: undefined,
    signer: undefined,
    isLoadingStoredWallet: false,
    address: '',
    solanaWalletInfo: undefined,
    signSolanaTransaction: async () => {
        return ""
    },

};

export const Web3AuthContext = createContext<Web3AuthContextType>(defaultWeb3AuthContextValue);
const entryPoint = getEntryPoint("0.7");
const kernelVersion = KERNEL_V3_1;

const Web3AuthProvider = ({children}: { children: React.ReactNode }) => {

    const redirectUri = ORIGIN;
    const [isConnected, setIsConnected] = useState(false);
    const [isChainSwitching, setIsChainSwitching] = useState(false);
    const [chainId, setChainId] = useState<number | undefined>(undefined);
    const [walletClient, setWalletClient] = useState<WalletClient | undefined>(undefined);
    const [provider, setProvider] = useState<Web3Provider | undefined>(undefined);
    const [signer, setSigner] = useState<JsonRpcSigner | undefined>(undefined);
    const [address, setAddress] = useState<string>('');
    const [storedWalletInfo, setStoredWalletInfo] = useLocalStorage<SavedWalletInfo | null>(LOCAL_STORAGE_WALLET_INFO, null)
    const [isLoadingStoredWallet, setIsLoadingStoredWallet] = useState<boolean>(false)
    const [solanaWalletInfo, setSolanaWalletInfo] = useState<SolanaWalletInfoType | undefined>()

    // const [chain, setChain] = useState(null);

    // console.log("provider", provider, address, chainId, solanaWalletInfo)

    const {
        isConnected: isWagmiWalletConnected,
        address: connectedWalletAddress,
        connector,
        chainId: wagmiChainId,
    } = useAccount()

    const {switchChain: switchChainWagmi} = useSwitchChain()

    const {
        authMethod,
        authWithEthWallet,
        authWithWebAuthn,
        authWithStytch,
        loading: authLoading,
        error: authError,
        setAuthMethod,
    } = useAuthenticate(redirectUri);
    const {
        fetchAccounts,
        setCurrentAccount,
        currentAccount,
        createAccount,
        accounts,
        loading: accountsLoading,
        error: accountsError,
    } = useAccounts();
    // console.log("currentAccount", accounts, currentAccount)
    const {
        initSession,
        initSessionUnSafe,
        sessionSigs,
        loading: sessionLoading,
        error: sessionError,
    } = useSession();

    // console.log("authMethod", authMethod)

    async function setProviderByPKPWallet(chainId: number) {
        try {
            setIsChainSwitching(true)
            await litNodeClient.connect();

            const pkpWallet = new PKPEthersWallet({
                controllerSessionSigs: sessionSigs,
                pkpPubKey: currentAccount!.publicKey,
                litNodeClient: litNodeClient,
            });
            await pkpWallet.init();


            // --- begin of some tricky action ---
            const _savedRequestFunc = pkpWallet.request
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            pkpWallet.request = async (payload: any) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                if (payload?.method === 'eth_accounts') {
                    return [pkpWallet.address]
                } else {
                    return await _savedRequestFunc(payload as ETHRequestSigningPayload)
                }
            }

            const _savedSignMessage = pkpWallet.signMessage.bind(pkpWallet);
            pkpWallet.signMessage = async (message: string | Uint8Array) => {
                const messageStr = message.toString();
                const isHash = messageStr.startsWith('0x') && messageStr.length === 66;
                if (isHash) {
                    const sigResponse = await litNodeClient.pkpSign({
                        pubKey: currentAccount!.publicKey,
                        toSign: ethers.utils.arrayify(messageStr),
                        sessionSigs: sessionSigs!
                    });
                    return sigResponse.signature;
                }
                return _savedSignMessage(message);
            };
            // --- end of some tricky action ---

            const currentChainId = chainId ?? 1
            pkpWallet.setChainId(currentChainId)
            if (mapRpcUrls[currentChainId])
                pkpWallet.setRpc(mapRpcUrls[currentChainId])

            // console.log("pkpWallet", pkpWallet)

            // ------ begin code for zeroDev -----------

            const publicClient = createPublicClient({
                // Use your own RPC provider (e.g. Infura/Alchemy).
                transport: http(mapRpcUrls[currentChainId]),
                chain: mapChainId2ViemChain[currentChainId],
            })

            // Pass `pkpWallet` to the validator
            const ecdsaValidator = await signerToEcdsaValidator(publicClient, {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                signer: pkpWallet,
                entryPoint,
                kernelVersion,
            })

            const account = await createKernelAccount(publicClient, {
                plugins: {
                    sudo: ecdsaValidator,
                },
                kernelVersion,
                entryPoint,
            })

            const zerodevPaymaster = createZeroDevPaymasterClient({
                chain: mapChainId2ViemChain[currentChainId],
                transport: http(mapPaymasterUrls[currentChainId]),
            })

            const kernelClient = createKernelAccountClient({
                account,
                chain: mapChainId2ViemChain[currentChainId],
                bundlerTransport: http(mapBundlerUrls[currentChainId]),
                client: publicClient,
                paymaster: {
                    getPaymasterData(userOperation) {
                        return zerodevPaymaster.sponsorUserOperation({userOperation})
                    }
                },
                userOperation: {
                    estimateFeesPerGas: async ({bundlerClient}) => {
                        return getUserOperationGasPrice(bundlerClient)
                    }
                }
            })

            const kernelProvider = new KernelEIP1193Provider(kernelClient);
            const provider = new Web3Provider(kernelProvider);
            setProvider(provider)
            setSigner(provider.getSigner())


            const walletClient = createWalletClient({
                // Use your own RPC provider (e.g. Infura/Alchemy).
                transport: http(mapRpcUrls[currentChainId]),
                chain: mapChainId2ViemChain[currentChainId],
            }).extend(publicActions) // extend wallet client with publicActions for public client
            setWalletClient(walletClient)


            /*
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        const _savedHandleEthSendTransaction = kernelProvider.handleEthSendTransaction
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        kernelProvider.handleEthSendTransaction = (params: any) => {
                            const [tx] = params as [SendTransactionParameters]
                            if (tx?.value)
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-expect-error
                                tx?.value = BigInt(tx?.value)
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
                            _savedHandleEthSendTransaction([...params, tx])
                        }
            */

            // ------ end code for zeroDev -----------


            /*
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        const provider = new Web3Provider(pkpWallet);
            */

            // ---- test code -------
/*
                        try {
                            const txnHash = await kernelClient.sendTransaction({
                                to: '0x87590744785D6CffCE10688331BA669ac5f69b39',  // recipient's address
                                value: BigInt(1000000000000000),  // 0.1 Sepolia ETH in wei (1 ETH = 10^18 wei)
                            });
                            console.log(`Transaction sent with hash: ${txnHash}`);

/!*
                            const tx = {
                                to: '0x2c7711f2282cA337f0efcB1B0D5E9A1eB56c3084',
                                value: BigInt(1000000000000000),
                            };

                            // Send the transaction
                            const transactionResponse = await provider.getSigner().sendTransaction(tx);

                            console.log(`Transaction sent with hash: ${transactionResponse.hash}`);

                            // Wait for transaction to be mined
                            await transactionResponse.wait();

                            console.log('Transaction confirmed');
*!/
                        } catch (error) {
                            console.error('Error sending transaction:', error);
                        }
*/

        } catch (err) {
            console.error(err);
        }
        setIsChainSwitching(false)
    }

    // wagmi walet
    useEffect(() => {
        if (isWagmiWalletConnected) {
            setIsConnected(isWagmiWalletConnected)
            setAddress(connectedWalletAddress as string)
            setChainId(wagmiChainId)
            connector!.getProvider().then((rawProvider) => {
                const provider = new Web3Provider(rawProvider as ExternalProvider);
                setProvider(provider)
                setSigner(provider.getSigner())

                const walletClient = createWalletClient({
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    transport: custom(rawProvider), // Use rawProvider (window.ethereum)
                    chain: mapChainId2ViemChain[wagmiChainId as number],
                }).extend(publicActions); // Extend with public actions
                setWalletClient(walletClient)
            })
        } else {
            setIsConnected(isWagmiWalletConnected)
        }
    }, [
        isWagmiWalletConnected,
        connectedWalletAddress,
        connector,
        wagmiChainId,
    ])

    useEffect(() => {
        if (storedWalletInfo && !currentAccount && !sessionSigs) {
            setIsLoadingStoredWallet(true)
            initProviderByMethod(storedWalletInfo.authMethod)
            setAuthMethod(storedWalletInfo.authMethod)
            setCurrentAccount(storedWalletInfo.currentAccount)
            setChainId(storedWalletInfo.chainId ?? 1)
            initSessionUnSafe(storedWalletInfo.authMethod, storedWalletInfo.currentAccount).then(() => {
                setIsLoadingStoredWallet(false)
            }).catch(() => {
                initializeAllVariables()
            })
        }
    }, [storedWalletInfo])


    useEffect(() => {
        if (currentAccount && sessionSigs && !solanaWalletInfo) {
            setProviderByPKPWallet(chainId ?? 1)
            setIsConnected(true)
            setAddress(currentAccount!.ethAddress)
            // store variables to localstorage
            setStoredWalletInfo({
                authMethod: authMethod!,
                currentAccount,
                chainId: chainId ?? 1,
            })

            ;(async () => {
                let solanaWalletData: SolanaWalletInfoType | undefined = undefined
                try {
                    const wrappedKeyMetaDataList = await getWrappedKeyMetaDatas(sessionSigs)
                    const targetMetaData = getSolanaWrappedKeyMetaDataByPkpEthAddress(wrappedKeyMetaDataList, currentAccount.ethAddress)
                    if (!targetMetaData) {
                        const {id, pkpAddress, generatedPublicKey} = await generatePrivateKey({
                            pkpSessionSigs: sessionSigs,
                            network: 'solana',
                            memo: "solana address",
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-expect-error
                            litNodeClient: litNodeClient as ILitNodeClient,
                        });
                        // console.log("generated", pkpAddress, generatedPublicKey)
                        solanaWalletData = {
                            publicKey: generatedPublicKey,
                            pkpAddress: pkpAddress,
                            wrappedKeyId: id,
                        }
                    } else {
                        solanaWalletData = {
                            publicKey: targetMetaData.publicKey,
                            pkpAddress: targetMetaData.pkpAddress,
                            wrappedKeyId: targetMetaData.id,
                        }
                    }

                    setSolanaWalletInfo(solanaWalletData)
                } catch (err) {
                    console.log("error during initialize solana address", err)
                }
            })()

        }
    }, [currentAccount, sessionSigs, solanaWalletInfo])


    const initializeAllVariables = () => {
        setStoredWalletInfo(null)
        setSolanaWalletInfo(undefined)
        setCurrentAccount(undefined)
        setAuthMethod(undefined)
        setIsConnected(false)
        setChainId(undefined)
        setWalletClient(undefined)
        setIsLoadingStoredWallet(false)
    }

    async function handleGoogleLogin(isSignIn: boolean) {
        localStorage.setItem(LOCAL_STORAGE_AUTH_REDIRECT_TYPE, isSignIn ? 'sign-in' : 'sign-up')
        await signInWithGoogle(redirectUri);
    }

    async function handleDiscordLogin() {
        await signInWithDiscord(redirectUri);
    }

    const signSolanaTransaction = async (solanaTransaction: Transaction): Promise<string | null> => {
        if (solanaWalletInfo) {
            const serializedTransaction = solanaTransaction
                .serialize({
                    requireAllSignatures: false, // should be false as the transaction is not yet being signed
                    verifySignatures: false, // should be false as the transaction is not yet being signed
                })
                .toString('base64');

            const unsignedTransaction: SerializedTransaction = {
                serializedTransaction,
                chain: 'mainnet',
            };

            const transactionSignature = await signTransactionWithEncryptedKey({
                pkpSessionSigs: sessionSigs!,
                network: 'solana',
                id: solanaWalletInfo.wrappedKeyId,
                unsignedTransaction,
                broadcast: true,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                litNodeClient: litNodeClient as ILitNodeClient,
            });

            return transactionSignature
        }

        return null
    }

    const login = () => {
        useStore.getState().setIsSigninModalOpen(true)
    }

    const logout = async () => {
        if (connector) { // disconnect connector
            await connector.disconnect()
        } else if (isConnected) {
            initializeAllVariables()
        }
    }

    const switchChain = async (chainId: number) => {
        try {

            if (isWagmiWalletConnected) {
                await switchChainWagmi({chainId})
                const walletClient = createWalletClient({
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    transport: custom(provider!.provider), // Use rawProvider (window.ethereum)
                    chain: mapChainId2ViemChain[wagmiChainId as number],
                }).extend(publicActions); // Extend with public actions
                setWalletClient(walletClient)
            } else {
                await setProviderByPKPWallet(chainId)
            }

        } catch (err) {
            console.error("switchChain error", err)
        }
    }

    // console.log("switchChain", switchChain)

    const value = {
        login,
        logout,
        switchChain,
        chainId,
        isChainSwitching,

        authMethod,
        setAuthMethod,
        authWithEthWallet,
        authWithWebAuthn,
        authWithStytch,
        authLoading,
        authError,

        fetchAccounts,
        setCurrentAccount,
        currentAccount,
        createAccount,
        accounts,
        accountsLoading,
        accountsError,

        initSession,
        sessionSigs,
        sessionLoading,
        sessionError,

        handleGoogleLogin,
        handleDiscordLogin,


        isConnected,
        provider,
        signer,
        address,
        isLoadingStoredWallet,

        solanaWalletInfo,
        signSolanaTransaction,

        walletClient,
        setWalletClient,
    }

    return (
        <Web3AuthContext.Provider value={value}>
            {children}
        </Web3AuthContext.Provider>
    )
}


export default Web3AuthProvider
