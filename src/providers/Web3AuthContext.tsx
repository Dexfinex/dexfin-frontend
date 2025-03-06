import { createContext, useEffect, useState } from "react";
import {
    getSolanaWrappedKeyMetaDataByPkpEthAddress,
    getWrappedKeyMetaDatas,
    litNodeClient,
    ORIGIN,
    signInWithDiscord,
    signInWithGoogle
} from "../utils/lit";
import useAuthenticate from "../hooks/auth/useAuthenticate";
import useAccounts from "../hooks/auth/useAccounts";
import useSession from "../hooks/auth/useSession";
import { AuthMethod, ILitNodeClient, IRelayPKP, SessionSigs } from "@lit-protocol/types";
import { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import { ExternalProvider, JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import { Connector, useAccount, useSwitchChain } from "wagmi";
import useLocalStorage from "../hooks/useLocalStorage";
import {
    LOCAL_STORAGE_AUTH_REDIRECT_TYPE,
    LOCAL_STORAGE_WALLET_INFO,
    mapBundlerUrls,
    mapPaymasterUrls,
    mapRpcUrls,
} from "../constants";
import { SavedWalletInfo, type SolanaWalletInfoType } from "../types/auth";
import { exportPrivateKey, generatePrivateKey } from "@lit-protocol/wrapped-keys/src/lib/api";
import { Keypair, VersionedTransaction, Connection, PublicKey, Transaction, sendAndConfirmTransaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, createTransferInstruction } from '@solana/spl-token';
import {
    createPublicClient,
    createWalletClient,
    custom,
    publicActions,
    SendTransactionParameters,
    type WalletClient
} from "viem";
import { http } from "@wagmi/core";
import { signerToEcdsaValidator } from "@zerodev/ecdsa-validator";
import { getEntryPoint, KERNEL_V3_1 } from "@zerodev/sdk/constants";
import {
    type CreateKernelAccountReturnType,
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
import { connection as SolanaConnection } from "../config/solana.ts";
import axios from "axios";

export type WalletType = 'EOA' | 'EMBEDDED' | 'UNKNOWN';

interface UserData {
    accessToken: string;
    userId?: string;
    walletType?: WalletType;
}

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
    initializeErrors: () => void;
    isConnected: boolean,
    provider: Web3Provider | undefined,
    signer: JsonRpcSigner | undefined,
    address: string,
    walletClient: WalletClient | undefined,
    setWalletClient: React.Dispatch<React.SetStateAction<WalletClient | undefined>>,
    isLoadingStoredWallet: boolean,
    solanaWalletInfo: SolanaWalletInfoType | undefined,
    signSolanaTransaction: (solanaTransaction: VersionedTransaction) => Promise<VersionedTransaction | null>,
    transferSolToken: (recipientAddress: string, tokenMintAddress: string, amount: number, decimals: number) => Promise<string>,

    userData: UserData | null,
    fetchUserData: () => Promise<void>,
    getWalletType: () => WalletType,
    walletType: WalletType

    checkWalletAndUsername: () => Promise<{ exists: boolean, message?: string }>;
}


// Provide default values for all fields in the context
const defaultWeb3AuthContextValue: Web3AuthContextType = {
    login: () => {
    },
    logout: () => {
    },
    initializeErrors: () => {
    },
    switchChain: async () => {
    },
    chainId: undefined,
    authMethod: undefined,
    isChainSwitching: false,
    setAuthMethod: () => {
    },
    walletClient: undefined,
    setWalletClient: () => {
    },
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
        return null
    },
    transferSolToken: async () => {
        return ""
    },
    userData: null,
    fetchUserData: async () => {
    },
    getWalletType: () => 'UNKNOWN',
    walletType: 'UNKNOWN',

    checkWalletAndUsername: async () => {
        return { exists: false };
    }

};

export const Web3AuthContext = createContext<Web3AuthContextType>(defaultWeb3AuthContextValue);
const entryPoint = getEntryPoint("0.7");
const kernelVersion = KERNEL_V3_1;

import { getLoginUserId } from "../components/market/Calendar/api/Calendar-api.ts";
import { usernameService } from "../services/username.service.ts";

const Web3AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const redirectUri = ORIGIN;
    const [isConnected, setIsConnected] = useState(false);
    const [isChainSwitching, setIsChainSwitching] = useState(false);
    const [chainId, setChainId] = useState<number | undefined>(56);
    const [walletClient, setWalletClient] = useState<WalletClient | undefined>(undefined);
    const [provider, setProvider] = useState<Web3Provider | undefined>(undefined);
    const [signer, setSigner] = useState<JsonRpcSigner | undefined>(undefined);
    const [address, setAddress] = useState<string>('');
    const [storedWalletInfo, setStoredWalletInfo] = useLocalStorage<SavedWalletInfo | null>(LOCAL_STORAGE_WALLET_INFO, null)
    const [isLoadingStoredWallet, setIsLoadingStoredWallet] = useState<boolean>(false)
    const [solanaWalletInfo, setSolanaWalletInfo] = useState<SolanaWalletInfoType | undefined>()
    const [kernelAccount, setKernelAccount] = useState<CreateKernelAccountReturnType | null>(null)

    const [userData, setUserData] = useState<UserData | null>(null);
    const [userDataLoading, setUserDataLoading] = useState<boolean>(false);
    const [walletType, setWalletType] = useState<WalletType>('UNKNOWN');

    // const [chain, setChain] = useState(null);

    // console.log("provider", provider, address, chainId, solanaWalletInfo)

    // console.log("provider", provider)

    const {
        isConnected: isWagmiWalletConnected,
        address: connectedWalletAddress,
        connector,
        chainId: wagmiChainId,
    } = useAccount()

    const { switchChain: switchChainWagmi } = useSwitchChain()

    const {
        authMethod,
        authWithEthWallet,
        authWithWebAuthn,
        authWithStytch,
        loading: authLoading,
        error: authError,
        setError: setAuthError,
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
        setError: setAccountsError,
    } = useAccounts();
    // console.log("currentAccount", accounts,
    // )
    const {
        initSession,
        initSessionUnSafe,
        sessionSigs,
        loading: sessionLoading,
        error: sessionError,
        setError: setSessionError,
    } = useSession();

    // console.log("authMethod", authMethod)
    const detectWalletType = (): WalletType => {
        if (isWagmiWalletConnected) {
            return 'EOA';
        }
        if (isConnected && !isWagmiWalletConnected) {
            return 'EMBEDDED';
        }
        return 'UNKNOWN';
    }
    const getWalletType = (): WalletType => {
        return detectWalletType();
    }

    const fetchUserData = async () => {
        try {
            setUserDataLoading(true);
            const currentAddress = address;
            if (!currentAddress) {
                console.error("No wallet address available to fetch user data");
                setUserDataLoading(false);
                return;
            }

            const currentWalletType = detectWalletType();
            setWalletType(currentWalletType);

            const response = await getLoginUserId(currentAddress);


            setUserData({
                ...response,
                walletType: currentWalletType
            });

            if (response && response.accessToken) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.accessToken}`;
            }

            setUserDataLoading(false);
        } catch (err) {
            console.error("Error fetching user data:", err);
            setUserDataLoading(false);
        }
    };
    const checkWalletAndUsername = async (): Promise<{ exists: boolean, message?: string }> => {
        try {
            if (!address) {
                return {
                    exists: false,
                    message: "No wallet is connected. Please connect a wallet first."
                };
            }

            if (!userData?.accessToken) {
                console.log("No access token available, fetching user data first");
                if (!userData?.accessToken) {
                    return {
                        exists: false,
                        message: "Could not retrieve authentication token. Please try again."
                    };
                }
            }
            // Get username data from backend
            const response = await usernameService.checkUsername(userData.accessToken);

            if (!response || !response.username || response.username.trim() === "") {
                // Open the username registration modal
                useStore.getState().setIsUsernameModalOpen(true);

                return {
                    exists: false,
                    message: "No username found for this wallet. Please register a username."
                };
            }

            return {
                exists: true,
                message: `Username exists for this wallet: ${response.username}`
            };


        } catch (error) {
            console.error("Error checking wallet and username:", error);
            useStore.getState().setIsUsernameModalOpen(true);
            return {
                exists: false,
                message: "An error occurred while checking wallet and username"
            };
        }
    };

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
            setKernelAccount(account)
            setAddress(account.address)


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
                        return zerodevPaymaster.sponsorUserOperation({ userOperation })
                    }
                },
                userOperation: {
                    estimateFeesPerGas: async ({ bundlerClient }) => {
                        return getUserOperationGasPrice(bundlerClient)
                    }
                }
            })

            const kernelProvider = new KernelEIP1193Provider(kernelClient);
            const provider = new Web3Provider(kernelProvider);
            setProvider(provider)
            setSigner(provider.getSigner())
            setChainId(chainId)


            const walletClient = createWalletClient({
                // Use your own RPC provider (e.g. Infura/Alchemy).
                account: connectedWalletAddress,
                transport: http(mapRpcUrls[currentChainId]),
                chain: mapChainId2ViemChain[currentChainId],
            }).extend(publicActions) // extend wallet client with publicActions for public client
            setWalletClient(walletClient)


            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const _savedHandleEthSendTransaction = kernelProvider.handleEthSendTransaction.bind(kernelProvider)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            kernelProvider.handleEthSendTransaction = async (params: any) => {
                const [tx] = params as [SendTransactionParameters]
                return await _savedHandleEthSendTransaction([tx?.value ? {
                    ...tx,
                    value: BigInt(tx?.value)
                } : tx])
            }

            // ------ end code for zeroDev -----------


            /*
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        const provider = new Web3Provider(pkpWallet);
            */
        } catch (err) {
            console.error(err);
        }
        setIsChainSwitching(false)
    }
useEffect(() => {
    // Only proceed when we have a valid address
    if (address && address !== '') {
        console.log("Address detected, fetching user data:", address);
        fetchUserData();
    }
}, [address]);
    useEffect(() => {
        const currentWalletType = detectWalletType();
        setWalletType(currentWalletType);
    }, [isWagmiWalletConnected, isConnected]);
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

                console.log("rawProvider", rawProvider)

                const walletClient = createWalletClient({
                    account: connectedWalletAddress,
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    transport: custom(rawProvider), // Use rawProvider (window.ethereum)
                    chain: mapChainId2ViemChain[wagmiChainId as number],
                }).extend(publicActions); // Extend with public actions
                setWalletClient(walletClient)

                fetchUserData().then(() => {
                    checkWalletAndUsername();
                });
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
            // initProviderByMethod(storedWalletInfo.authMethod)
            setAuthMethod(storedWalletInfo.authMethod)
            setCurrentAccount(storedWalletInfo.currentAccount)
            setChainId(storedWalletInfo.chainId ?? 1)
            initSessionUnSafe(storedWalletInfo.authMethod, storedWalletInfo.currentAccount).then(() => {
                setIsLoadingStoredWallet(false)
            }).catch(() => {
                initializeAllVariables()
            })
        }
    }, [currentAccount, initSessionUnSafe, sessionSigs, setAuthMethod, setCurrentAccount, storedWalletInfo])


    useEffect(() => {
        if (currentAccount && sessionSigs && !solanaWalletInfo) {
            setProviderByPKPWallet(chainId ?? 1)
            setIsConnected(true)
            // store variables to localstorage
            setStoredWalletInfo({
                authMethod: authMethod!,
                currentAccount,
                chainId: chainId ?? 1,
            })

                ; (async () => {
                    let solanaWalletData: SolanaWalletInfoType | undefined = undefined
                    try {
                        const wrappedKeyMetaDataList = await getWrappedKeyMetaDatas(sessionSigs)
                        const targetMetaData = getSolanaWrappedKeyMetaDataByPkpEthAddress(wrappedKeyMetaDataList, currentAccount.ethAddress)
                        if (!targetMetaData) {
                            const { id, pkpAddress, generatedPublicKey } = await generatePrivateKey({
                                pkpSessionSigs: sessionSigs,
                                network: 'solana',
                                memo: "solana address",
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
                        fetchUserData();
                    } catch (err) {
                        console.log("error during initialize solana address", err)
                    }
                })()

        }
    }, [authMethod, chainId, currentAccount, sessionSigs, setProviderByPKPWallet, setStoredWalletInfo, solanaWalletInfo])


    const initializeAllVariables = () => {
        setStoredWalletInfo(null)
        setSolanaWalletInfo(undefined)
        setCurrentAccount(undefined)
        setAuthMethod(undefined)
        setIsConnected(false)
        setChainId(undefined)
        setWalletClient(undefined)
        setIsLoadingStoredWallet(false)

        setUserData(null)
        setWalletType('UNKNOWN')
        delete axios.defaults.headers.common['Authorization'];
    }

    const initializeErrors = () => {
        setAuthError(undefined)
        setAccountsError(undefined)
        setSessionError(undefined)
    }

    async function handleGoogleLogin(isSignIn: boolean) {
        localStorage.setItem(LOCAL_STORAGE_AUTH_REDIRECT_TYPE, isSignIn ? 'sign-in' : 'sign-up')
        await signInWithGoogle(redirectUri);
    }

    async function handleDiscordLogin() {
        await signInWithDiscord(redirectUri);
    }

    const signSolanaTransaction = async (solanaTransaction: VersionedTransaction): Promise<VersionedTransaction | null> => {
        if (solanaWalletInfo && sessionSigs) {
            const privateKey = await exportPrivateKey({
                pkpSessionSigs: sessionSigs!,
                litNodeClient,
                network: "solana",
                id: solanaWalletInfo.wrappedKeyId,
            });

            /*
                        const serializedTransaction = solanaTransaction
                            .serialize({
                                requireAllSignatures: false, // should be false as the transaction is not yet being signed
                                verifySignatures: false, // should be false as the transaction is not yet being signed
                            })
                            .toString('base64');
            */
            const keypair = Keypair.fromSecretKey(Buffer.from(privateKey.decryptedPrivateKey, "hex"));
            solanaTransaction.sign([keypair])
            // const signedBytes = solanaTransaction.serialize();
            // return Buffer.from(signedBytes).toString("base64")
            return solanaTransaction
            /*
                        const unsignedTransaction: SerializedTransaction = {
                            serializedTransaction,
                            chain: 'mainnet-beta',
                        };
            */

            // console.log("solanaWalletInfo.wrappedKeyId", solanaWalletInfo)
            /*
                        return await signTransactionWithEncryptedKey({
                            pkpSessionSigs: sessionSigs!,
                            network: 'solana',
                            id: solanaWalletInfo.wrappedKeyId,
                            unsignedTransaction,
                            broadcast: true,
                            litNodeClient: litNodeClient as ILitNodeClient,
                        })
            */
        }

        return null
    }

    const transferSolToken = async (recipientAddress: string, tokenMintAddress: string, amount: number, decimals: number) => {
        if (solanaWalletInfo && sessionSigs) {
            try {
                const privateKey = await exportPrivateKey({
                    pkpSessionSigs: sessionSigs!,
                    litNodeClient,
                    network: "solana",
                    id: solanaWalletInfo.wrappedKeyId,
                });

                const keypair = Keypair.fromSecretKey(Buffer.from(privateKey.decryptedPrivateKey, "hex"));

                if (tokenMintAddress === "So11111111111111111111111111111111111111112") {
                    console.log('transfer native sol')
                    const transaction = new Transaction().add(
                        SystemProgram.transfer({
                            fromPubkey: keypair.publicKey,
                            toPubkey: new PublicKey(recipientAddress),
                            lamports: amount * LAMPORTS_PER_SOL,
                        })
                    );
                    console.log('transaction = ', transaction);

                    const signature = await sendAndConfirmTransaction(SolanaConnection, transaction, [keypair]);
                    console.log("Transaction Signature:", signature);
                    return signature;
                } else {
                    console.log(`1 - Getting Source Token Account`);
                    let sourceAccount = await getOrCreateAssociatedTokenAccount(
                        SolanaConnection,
                        keypair,
                        new PublicKey(tokenMintAddress),
                        keypair.publicKey
                    );
                    console.log(`    Source Account: ${sourceAccount.address.toString()}`);

                    console.log(`2 - Getting Destination Token Account`);
                    let destinationAccount = await getOrCreateAssociatedTokenAccount(
                        SolanaConnection,
                        keypair,
                        new PublicKey(tokenMintAddress),
                        new PublicKey(recipientAddress)
                    );
                    console.log(`    Destination Account: ${destinationAccount.address.toString()}`);

                    const tx = new Transaction();
                    tx.add(createTransferInstruction(
                        sourceAccount.address,
                        destinationAccount.address,
                        keypair.publicKey,
                        amount * Math.pow(10, decimals)
                    ))

                    const latestBlockHash = await SolanaConnection.getLatestBlockhash('confirmed');
                    tx.recentBlockhash = await latestBlockHash.blockhash;
                    const signature = await sendAndConfirmTransaction(SolanaConnection, tx, [keypair]);
                    console.log(
                        '\x1b[32m', //Green Text
                        `   Transaction Success!🎉`,
                        `\n    https://explorer.solana.com/tx/${signature}`
                    );

                    return signature;
                }
            } catch (err) {
                console.log('transfer sol token err: ', err)
            }
        }

        return "";
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
                await switchChainWagmi({ chainId })
                const walletClient = createWalletClient({
                    account: connectedWalletAddress,
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
        initializeErrors,

        isConnected,
        provider,
        signer,
        address,
        isLoadingStoredWallet,

        solanaWalletInfo,
        signSolanaTransaction,
        transferSolToken,

        walletClient,
        setWalletClient,

        userData,
        fetchUserData,
        getWalletType,
        walletType,
        checkWalletAndUsername
    }

    return (
        <Web3AuthContext.Provider value={value}>
            {children}
        </Web3AuthContext.Provider>
    )
}


export default Web3AuthProvider