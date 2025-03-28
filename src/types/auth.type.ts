import {AuthMethod, IRelayPKP} from "@lit-protocol/types";

export interface SavedWalletInfo {
  authMethod: AuthMethod
  currentAccount: IRelayPKP
  chainId?: number
}

export interface ExtendedError extends Error {
  details?: string[]
}

export interface ExAuthType extends AuthMethod {
  userId?: string
}

export interface SolanaWalletInfoType {
  publicKey: string;
  pkpAddress: string;
  wrappedKeyId: string;
}